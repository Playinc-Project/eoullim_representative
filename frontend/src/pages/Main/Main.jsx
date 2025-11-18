import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { postAPI } from '../../services/api';
import PostList from '../../components/Board/PostList';
import './Main.css';

const Main = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [hotPosts, setHotPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotPosts();
  }, []);

  const fetchHotPosts = async () => {
    try {
      setLoading(true);
      const response = await postAPI.getAll();
      // 최신 5개 게시글만 표시
      const posts = response.data.slice(0, 5);
      setHotPosts(posts);
    } catch (error) {
      console.error('인기 게시글 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃하시겠습니까?')) {
      logout();
      navigate('/');
    }
  };

  const handlePostClick = (post) => {
    navigate(`/post/${post.id}`, { state: { from: 'main' } });
  };

  if (!isAuthenticated) {
    return (
      <div className="main-container">
        <div className="auth-required">
          <h2>로그인이 필요합니다</h2>
          <p>어울림의 모든 기능을 사용하려면 로그인해주세요.</p>
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-primary">로그인</Link>
            <Link to="/signup" className="btn btn-secondary">회원가입</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <header className="main-header">
        <div className="header-left">
          <h1 className="main-title">어울림</h1>
          <Link to="/messages" className="message-link">쪽지함</Link>
        </div>
        <div className="header-right">
          <span className="user-welcome">안녕하세요, {user?.username}님!</span>
          <Link to="/profile" className="profile-link">
            <button className="icon-button">👤</button>
          </Link>
          <button onClick={handleLogout} className="logout-button">
            로그아웃
          </button>
        </div>
      </header>

      <div className="section-header">
        <h2 className="section-title">최신 게시글</h2>
        <Link to="/board" className="view-more">더보기 ›</Link>
      </div>

      <section className="hot-posts">
        {loading ? (
          <div className="posts-loading">게시글을 불러오는 중...</div>
        ) : (
          <div className="posts-list">
            {hotPosts.length > 0 ? (
              hotPosts.map(post => (
                <div 
                  key={post.id} 
                  className="post-card" 
                  onClick={() => handlePostClick(post)}
                >
                  <div className="post-header">
                    <span className="post-category">자유게시판</span>
                  </div>
                  <div className="post-main">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-content">{post.content}</p>
                  </div>
                  <div className="post-footer">
                    <div className="footer-left">
                      <span className="post-author">{post.author?.username || '익명'}</span>
                      <span className="post-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="post-stats">
                      <span className="views">👁 {post.views || 0}</span>
                      <span className="comments">💬 {post.commentCount || 0}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-posts">
                <p>아직 게시글이 없습니다.</p>
                <Link to="/board/write" className="btn btn-primary">
                  첫 게시글 작성하기
                </Link>
              </div>
            )}
          </div>
        )}
      </section>

      {isAuthenticated && (
        <div className="floating-actions">
          <Link to="/board/write" className="add-button-link">
            <button className="add-button">+</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Main;