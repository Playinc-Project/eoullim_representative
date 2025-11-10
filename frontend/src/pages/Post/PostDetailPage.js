// PostDetailPage.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PostDetailPage.css';

const PostDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromMainPage = location.state?.from === 'main';

  const handleBack = () => {
    if (fromMainPage) {
      navigate('/main');
    } else {
      navigate('/board');
    }
  };

  const handleMenuClick = () => {
    navigate('/messages/write');
  };

  const comments = [
    { id: 1, author: '익명', content: '어울림 최고', date: '12/04' },
    { id: 2, author: '익명', content: '어울림 최고', date: '12/04' },
    { id: 3, author: '익명', content: '어울림 최고', date: '12/04' },
  ];

  return (
    <div className="post-detail-container">
      <header className="post-detail-header">
        <button onClick={handleBack} className="back-button">
          ←
        </button>
        <h1 className="board-title">자유게시판</h1>
      </header>

      <div className="post-detail-content">
        <div className="post-author-info">
          <img src="/default-profile.png" alt="프로필" className="profile-image" />
          <div className="author-details">
            <span className="author-name">익명</span>
            <span className="post-date">12/04</span>
          </div>
        </div>

        <div className="post-main-content">
          <h2 className="post-title">어울림 짱짱굿!</h2>
          <p className="post-text">솔까 어울림 최고지 않남?</p>
        </div>

        <div className="post-stats">
          <span className="likes">👍 100</span>
          <span className="comments">💬 100</span>
          <span className="bookmarks">⭐ 100</span>
        </div>

        <div className="comments-section">
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-author-info">
                <img src="/default-profile.png" alt="프로필" className="comment-profile" />
                <div className="comment-details" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-content">{comment.content}</span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="comment-date">{comment.date}</span>
                    <button className="action-button" onClick={() => navigate('/messages/write')}>⋮</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;