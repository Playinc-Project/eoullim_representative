import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postAPI, commentAPI } from '../../services/api';
import './PostDetailPage.css';

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const hasLoadedPost = useRef(false);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiking, setIsLiking] = useState(false);

  // 게시글 & 댓글 로드 (조회수 증가는 한 번만)
  useEffect(() => {
    if (!hasLoadedPost.current) {
      hasLoadedPost.current = true;
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      
      // 게시글 조회 (조회수 증가)
      const postResponse = await postAPI.getOne(id);
      let postData = postResponse.data;
      
      // 조회수를 항상 1 증가시키고 localStorage에 저장
      const viewKey = `post_${id}_viewCount`;
      const currentViews = parseInt(localStorage.getItem(viewKey) || postData.viewCount || 0);
      const newViewCount = currentViews + 1;
      localStorage.setItem(viewKey, newViewCount.toString());
      postData.viewCount = newViewCount;
      
      // 저장된 좋아요 수가 있으면 사용
      const likeKey = `post_${id}_likes`;
      const savedLikes = localStorage.getItem(likeKey);
      if (savedLikes) {
        postData.likeCount = parseInt(savedLikes);
      }
      
      setPost(postData);
      setEditTitle(postData.title);
      setEditContent(postData.content);

      // 댓글 조회
      const commentsResponse = await commentAPI.getByPost(id);
      setComments(commentsResponse.data || []);
      
      setError('');
    } catch (err) {
      setError('게시글을 불러올 수 없습니다');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 게시글 수정
  const handleEditPost = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert('제목과 내용을 모두 입력하세요');
      return;
    }

    try {
      console.log('수정 요청:', { id, userId: currentUser.id, title: editTitle, content: editContent });
      
      const response = await postAPI.update(id, currentUser.id, editTitle, editContent);
      
      console.log('수정 응답:', response.data);
      
      setPost({
        ...post,
        title: editTitle,
        content: editContent
      });
      setIsEditing(false);
      alert('게시글이 수정되었습니다');
    } catch (err) {
      console.error('수정 에러 상세:', err);
      console.error('에러 응답:', err.response?.data);
      alert(`게시글 수정에 실패했습니다: ${err.response?.data?.message || err.message}`);
    }
  };


  // 게시글 삭제
  const handleDeletePost = async () => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;

    try {
      console.log('삭제 요청:', { id, userId: currentUser.id });
      console.log('Post userId:', post.userId);
      console.log('Current user:', currentUser);
      
      await postAPI.delete(id, currentUser.id);
      
      console.log('삭제 성공');
      alert('게시글이 삭제되었습니다');
      navigate('/main');
    } catch (err) {
      console.error('삭제 에러 상세:', err);
      console.error('에러 응답:', err.response?.data);
      alert(`게시글 삭제에 실패했습니다: ${err.response?.data || err.message}`);
    }
  };

  // 좋아요 토글 (localStorage 사용)
  const handleLikeToggle = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const likeKey = `post_${id}_likes`;
      const userLikesKey = `user_${currentUser.id}_likes`;
      
      // 현재 좋아요 수와 사용자 좋아요 상태 가져오기
      const savedLikes = parseInt(localStorage.getItem(likeKey) || post.likeCount);
      const userLikes = JSON.parse(localStorage.getItem(userLikesKey) || '[]');
      
      const hasLiked = userLikes.includes(parseInt(id));
      
      let newLikeCount;
      let newUserLikes;
      
      if (hasLiked) {
        // 좋아요 취소
        newLikeCount = savedLikes - 1;
        newUserLikes = userLikes.filter(postId => postId !== parseInt(id));
      } else {
        // 좋아요 추가
        newLikeCount = savedLikes + 1;
        newUserLikes = [...userLikes, parseInt(id)];
      }
      
      // localStorage에 저장
      localStorage.setItem(likeKey, newLikeCount.toString());
      localStorage.setItem(userLikesKey, JSON.stringify(newUserLikes));
      
      // 상태 업데이트
      setPost({
        ...post,
        likeCount: newLikeCount
      });
      
    } catch (err) {
      console.error('Like error:', err);
    } finally {
      setIsLiking(false);
    }
  };

  // 댓글 작성
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      alert('댓글 내용을 입력하세요');
      return;
    }

    try {
      await commentAPI.create(id, currentUser.id, commentContent);
      await loadPost(); // 댓글 목록 새로고침
      setCommentContent('');
    } catch (err) {
      alert('댓글 작성에 실패했습니다');
      console.error('Comment error:', err);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await commentAPI.delete(commentId, currentUser.id);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      alert('댓글 삭제에 실패했습니다');
      console.error('Delete comment error:', err);
    }
  };

  if (!currentUser.id) {
    return <div className="detail-container"><p>로그인이 필요합니다</p></div>;
  }

  if (loading) {
    return <div className="detail-container"><p>로딩 중...</p></div>;
  }

  if (!post) {
    return <div className="detail-container"><p>게시글을 찾을 수 없습니다</p></div>;
  }

  return (
    <div className="detail-container">
      {/* 헤더 */}
      <header className="detail-header">
        <button onClick={() => navigate('/main')} className="back-button">
          ← 뒤로
        </button>
        <h1>게시글</h1>
        
        {/* 작성자만 수정/삭제 버튼 표시 */}
        {post.userId === currentUser.id && (
          <div className="post-actions">
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="edit-button"
            >
              {isEditing ? '취소' : '수정'}
            </button>
            <button onClick={handleDeletePost} className="delete-button">
              삭제
            </button>
          </div>
        )}
      </header>

      {/* 게시글 */}
      <div className="post-detail">
        {isEditing ? (
          /* 수정 모드 */
          <div className="edit-mode">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="edit-title-input"
              placeholder="제목을 입력하세요"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="edit-content-textarea"
              rows="10"
              placeholder="내용을 입력하세요"
            />
            <div className="edit-buttons">
              <button onClick={handleEditPost} className="save-button">
                저장
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(post.title);
                  setEditContent(post.content);
                }} 
                className="cancel-button"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          /* 보기 모드 */
          <>
            <h2 className="post-detail-title">{post.title}</h2>
            <div className="post-detail-meta">
              <span className="post-time">
                {new Date(post.createdAt).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
              <span className="post-views">조회 {post.viewCount}</span>
            </div>

            <div className="post-detail-content">
              {post.content}
            </div>

            <div className="post-detail-stats">
              <button 
                onClick={handleLikeToggle} 
                className={`like-button ${isLiking ? 'liking' : ''}`}
                disabled={isLiking}
              >
                ♥ {post.likeCount} 좋아요
              </button>
              <span>💬 {comments.length} 댓글</span>
            </div>
          </>
        )}
      </div>

      {/* 댓글 섹션 */}
      <div className="comments-section">
        <h3>댓글 ({comments.length})</h3>

        {/* 댓글 작성 */}
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="댓글을 입력하세요"
            rows="3"
          ></textarea>
          <button type="submit" className="comment-submit">
            댓글 작성
          </button>
        </form>

        {/* 댓글 목록 */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">댓글이 없습니다</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-time">
                    {new Date(comment.createdAt).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                  {comment.userId === currentUser.id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="comment-delete"
                    >
                      삭제
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const recipientEmail = comment.userEmail || comment.email;
                      if (recipientEmail && recipientEmail.includes('@')) {
                        navigate('/messages/write', { state: { recipientEmail } });
                      } else {
                        navigate(`/messages/write?toUserId=${comment.userId}`);
                      }
                    }}
                    className="comment-more"
                    title="쪽지 보내기"
                  >
                    ⋮
                  </button>
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;