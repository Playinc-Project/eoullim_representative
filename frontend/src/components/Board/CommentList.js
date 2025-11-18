import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { commentAPI } from '../../services/api';
import './CommentList.css';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      setError('');
      const response = await commentAPI.getByPost(postId);
      setComments(response.data);
    } catch (err) {
      console.error('댓글 조회 오류:', err);
      setError('댓글을 불러오는데 실패했습니다.');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await commentAPI.create(postId, user.id, newComment.trim());
      setNewComment('');
      await fetchComments();
    } catch (err) {
      console.error('댓글 작성 오류:', err);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await commentAPI.update(commentId, user.id, editContent.trim());
      setEditingComment(null);
      setEditContent('');
      await fetchComments();
    } catch (err) {
      console.error('댓글 수정 오류:', err);
      alert('댓글 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) {
      return;
    }

    setLoading(true);
    try {
      await commentAPI.delete(commentId, user.id);
      await fetchComments();
    } catch (err) {
      console.error('댓글 삭제 오류:', err);
      alert('댓글 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('ko-KR');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="comment-section">
      <h3 className="comment-title">댓글 ({comments.length})</h3>
      
      {error && (
        <div className="comment-error">{error}</div>
      )}

      {/* 댓글 작성 폼 */}
      {user && (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <div className="comment-input-group">
            <textarea
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={loading}
              rows="3"
              maxLength="500"
            />
            <button 
              type="submit" 
              disabled={loading || !newComment.trim()}
              className="comment-submit-btn"
            >
              {loading ? '작성중...' : '댓글 작성'}
            </button>
          </div>
        </form>
      )}

      {/* 댓글 목록 */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">첫 댓글을 작성해보세요!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">
                  {comment.author?.username || '익명'}
                </span>
                <span className="comment-date">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              
              <div className="comment-content">
                {editingComment === comment.id ? (
                  <div className="comment-edit-form">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      disabled={loading}
                      rows="2"
                      maxLength="500"
                    />
                    <div className="comment-edit-actions">
                      <button 
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={loading || !editContent.trim()}
                        className="comment-save-btn"
                      >
                        저장
                      </button>
                      <button 
                        onClick={() => {
                          setEditingComment(null);
                          setEditContent('');
                        }}
                        disabled={loading}
                        className="comment-cancel-btn"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>{comment.content}</p>
                )}
              </div>

              {user && user.id === comment.author?.id && editingComment !== comment.id && (
                <div className="comment-actions">
                  <button 
                    onClick={() => handleEditComment(comment)}
                    disabled={loading}
                    className="comment-edit-btn"
                  >
                    수정
                  </button>
                  <button 
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={loading}
                    className="comment-delete-btn"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentList;