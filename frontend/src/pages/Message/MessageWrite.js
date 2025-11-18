// src/pages/Message/MessageWrite.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './MessageWrite.css';

const MessageWrite = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (!title.trim() || !content.trim()) {
            setError('제목과 내용을 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            // TODO: 실제 메시지 API 연결 (백엔드 개발 후)
            console.log('메시지 전송:', { title, content, fileURL: file?.name });
            
            alert('메시지가 전송되었습니다.');
            setTitle('');
            setContent('');
            setFile(null);
            navigate('/messages');
        } catch (err) {
            console.error('메시지 전송 오류:', err);
            setError('메시지 전송에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="main-container">
                <h2>로그인이 필요합니다</h2>
                <p>쪽지를 보내려면 로그인해주세요.</p>
            </div>
        );
    }

    return (
        <div className="main-container">
            <h2>쪽지 보내기</h2>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                    required
                />
                <textarea
                    placeholder="내용"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={loading}
                    required
                />
                <div className="file-upload">
                    <label htmlFor="file-input" className="upload-icon">📷</label>
                    <input 
                        type="file" 
                        id="file-input" 
                        style={{ display: 'none' }} 
                        onChange={(e) => setFile(e.target.files[0])}
                        disabled={loading}
                    />
                    {file && (
                        <span className="file-name">{file.name}</span>
                    )}
                    <button 
                        type="submit" 
                        className="send-button"
                        disabled={loading || !title.trim() || !content.trim()}
                    >
                        {loading ? '전송중...' : '전송'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MessageWrite;