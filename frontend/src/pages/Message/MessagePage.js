import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './MessagePage.css';

const MessagePage = () => {
  const [messages, setMessages] = useState([
    { id: 1, senderName: '사용자 A', content: '어울림 최고', createdAt: '2024.12.11' },
    { id: 2, senderName: '사용자 B', content: '어울림 최고', createdAt: '2024.12.11' },
    { id: 3, senderName: '사용자 C', content: '어울림 최고', createdAt: '2024.12.11' },
    { id: 4, senderName: '사용자 D', content: '어울림 최고', createdAt: '2024.12.11' },
    { id: 5, senderName: '사용자 E', content: '어울림 최고', createdAt: '2024.12.11' },
  ]);

  const [showDeleteOption, setShowDeleteOption] = useState(null);

  const handleMenuClick = (id) => {
    setShowDeleteOption(showDeleteOption === id ? null : id);
  };

  const handleDelete = (id) => {
    setMessages(messages.filter(message => message.id !== id));
    setShowDeleteOption(null);
  };

  return (
    <div className="main-container">
      <header className="main-header">
        <div className="header-left">
          <Link to="/main" className="main-title" style={{ textDecoration: 'none', color: 'black', fontWeight: 'normal', fontSize: '16px' }}>어울림</Link>
          <Link to="/message" className="main-title" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>쪽지함</Link>
        </div>
        <Link to="/profile" className="profile-link">
          <button className="icon-button" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>👤</button>
        </Link>
      </header>

      <div className="messages-list">
        {messages.map(message => (
          <div key={message.id} className="message-item">
            <img src="default-profile-pic.png" alt="Profile" className="profile-pic" />
            <div className="message-info">
              <h3 className="message-title">{message.senderName}</h3>
              <p className="message-content">{message.content}</p>
            </div>
            <span className="date">{message.createdAt}</span>
            <button className="action-button" onClick={() => handleMenuClick(message.id)}>⋮</button>
            {showDeleteOption === message.id && (
              <div className="delete-option">
                <button onClick={() => handleDelete(message.id)}>🗑️ 삭제</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagePage;