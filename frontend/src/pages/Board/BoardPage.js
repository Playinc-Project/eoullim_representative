import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BoardPage.css';

const BoardPage = () => {
  const navigate = useNavigate();
  const samplePosts = Array(5).fill({
    author: '익명',
    date: '12/04',
    title: '어울림 짱짱굿!',
    content: '솔까 어울림 최고지 않남?',
    category: '자유게시판',
    likes: 100,
    comments: 100
  }).map((post, index) => ({ ...post, id: index + 1 }));

  return (
    <div className="main-container">
      <header className="board-header">
        <button onClick={() => navigate('/main')} className="back-button">
          ←
        </button>
        <h1 className="board-title">자유게시판</h1>
      </header>

      <div className="posts-list">
        {samplePosts.map(post => (
          <div 
            key={post.id} 
            className="post-card" 
            onClick={() => navigate(`/post/${post.id}`, { state: { from: 'board' } })}
            style={{ cursor: 'pointer' }}
          >
            <div className="post-header">
              <span className="post-category">{post.category}</span>
            </div>
            <div className="post-main">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-content" style={{ textAlign: 'left' }}>{post.content}</p>
            </div>
            <div className="post-footer">
              <div className="footer-left">
                <span className="post-author">{post.author}</span>
                <span className="post-date">{post.date}</span>
              </div>
              <div className="post-stats">
                <span className="likes">👍 {post.likes}</span>
                <span className="comments">💬 {post.comments}</span>
                <button className="action-button" onClick={() => navigate('/messages/write')}>⋮</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        textDecoration: 'none',
        zIndex: 1000,
        maxWidth: '430px',
        width: '100%',
      }}>
        <Link to="/board/write" className="add-button-link">
          <button className="add-button" style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: 'none',
            background: '#6C63FF',
            color: 'white',
            fontSize: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            float: 'right'
          }}>+</button>
        </Link>
      </div>
    </div>
  );
};

export default BoardPage;