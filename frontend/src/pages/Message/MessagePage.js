import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { messageAPI } from '../../services/api';
import './MessagePage.css';

const MessagePage = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteOption, setShowDeleteOption] = useState(null);

  // 메시지 목록 불러오기
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    if (!currentUser.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await messageAPI.getReceived(currentUser.id);
      
      // 최신 메시지부터 표시
      const sortedMessages = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setMessages(sortedMessages);
      setError('');
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('메시지를 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (id) => {
    setShowDeleteOption(showDeleteOption === id ? null : id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('메시지를 삭제하시겠습니까?')) return;

    try {
      await messageAPI.delete(id, currentUser.id);
      setMessages(messages.filter(message => message.id !== id));
      setShowDeleteOption(null);
    } catch (err) {
      alert('메시지 삭제에 실패했습니다');
      console.error('Delete error:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    
    return date.toLocaleDateString();
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
          <Link to="/main" className="nav-link">공지</Link>
          <Link to="/messages" className="nav-link active">쪽지</Link>
          <Link to="/profile" className="nav-link">프로필</Link>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="main-content">
        {/* 타이틀 */}
        <h1 className="content-title">쪽지함</h1>

        {/* 에러 메시지 */}
        {error && <div className="error-message">{error}</div>}

        {/* 로딩 상태 */}
        {loading ? (
          <div className="loading">로딩 중...</div>
        ) : messages.length === 0 ? (
          <div className="empty-state">
            <p>받은 쪽지가 없습니다</p>
            <p>다른 사용자와 소통해보세요!</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div key={message.id} className="message-item">
                <div className="message-content">
                  <div className="message-header">
                    <h3 className="message-sender">{message.senderName || `사용자 ${message.senderId}`}</h3>
                    <span className="message-time">{formatDate(message.createdAt)}</span>
                  </div>
                  <p className="message-text">
                    {message.content.substring(0, 50)}
                    {message.content.length > 50 ? '...' : ''}
                  </p>
                </div>
                <div className="message-actions">
                  <button 
                    className="action-button" 
                    onClick={() => handleMenuClick(message.id)}
                  >
                    ⋮
                  </button>
                  {showDeleteOption === message.id && (
                    <div className="delete-option">
                      <button onClick={() => handleDelete(message.id)}>🗑️ 삭제</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* 쪽지 작성 버튼 (메인과 동일 정렬) */}
        <button
          className="fab-button"
          onClick={() => navigate('/messages/write')}
          title="새 쪽지 작성"
        >
          ✉️
        </button>
      </div>
    </div>
  );
};

export default MessagePage;