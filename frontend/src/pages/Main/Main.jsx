import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postAPI } from '../../services/api';
import './Main.css';

function Main() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // 게시글 목록 불러오기
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postAPI.getAll();
      
      // localStorage에서 저장된 좋아요수와 조회수를 반영
      const postsWithLocalData = response.data.map(post => {
        const likeKey = `post_${post.id}_likes`;
        const viewKey = `post_${post.id}_viewCount`;
        
        const savedLikes = localStorage.getItem(likeKey);
        const savedViews = localStorage.getItem(viewKey);
        
        return {
          ...post,
          likeCount: savedLikes ? parseInt(savedLikes) : post.likeCount,
          viewCount: savedViews ? parseInt(savedViews) : post.viewCount
        };
      });
      
      // 최신 글부터 표시
      const sortedPosts = postsWithLocalData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setPosts(sortedPosts);
      setError('');
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('게시글을 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser.id) {
    return (
      <div className="main-container">
        <p>로그인이 필요합니다</p>
      </div>
    );
  }

  return (
    <div className="main-container">
      {/* 헤더 */}
      <header className="main-header">
        <div className="header-logo">어울림</div>
        <div className="header-nav">
          <Link to="/main" className="nav-link active">공지</Link>
          <Link to="/messages" className="nav-link">쪽지</Link>
          <Link to="/profile" className="nav-link">프로필</Link>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="main-content">
        {/* 타이틀 */}
        <h1 className="content-title">공지사항</h1>

        {/* 에러 메시지 */}
        {error && <div className="error-message">{error}</div>}

        {/* 로딩 상태 */}
        {loading ? (
          <div className="loading">로딩 중...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>게시글이 없습니다</p>
            <p>첫 번째 게시글을 작성해보세요!</p>
          </div>
        ) : (
          <div className="posts-list">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="post-card"
              >
                <div className="post-header">
                  <h3 className="post-title">{post.title}</h3>
                  <span className="post-views">조회 {post.viewCount}</span>
                </div>
                <p className="post-content">
                  {post.content.substring(0, 100)}
                  {post.content.length > 100 ? '...' : ''}
                </p>
                <div className="post-footer">
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
                  <div className="post-stats">
                    <span>♥ {post.likeCount}</span>
                    <span>💬 {post.commentCount || 0}</span>
                    <button
                      className="post-more-button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const recipientEmail = post.userEmail || post.authorEmail;
                        if (recipientEmail && recipientEmail.includes('@')) {
                          navigate('/messages/write', { state: { recipientEmail } });
                        } else if (post.userId) {
                          navigate(`/messages/write?toUserId=${post.userId}`);
                        } else {
                          navigate('/messages/write');
                        }
                      }}
                      title="쪽지 보내기"
                    >
                      ⋮
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {/* + 버튼: main-content 기준 오른쪽 끝 */}
        <button
          className="fab-button"
          onClick={() => navigate('/board/write')}
          title="새 글 작성"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Main;