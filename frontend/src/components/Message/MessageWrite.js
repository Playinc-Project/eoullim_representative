// src/components/Message/MessageWrite.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MessageWrite = () => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (!content.trim()) {
            alert('메시지 내용을 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            // TODO: 실제 메시지 API 연결 백엔드 개발 후
            console.log('메시지 전송:', { content, sender: user.username });
            alert('메시지가 전송되었습니다.');
            setContent('');
        } catch (error) {
            console.error('메시지 전송 오류:', error);
            alert('메시지 전송에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                placeholder="쪽지 내용"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
                required
            />
            <button 
                type="submit" 
                disabled={loading || !content.trim()}
            >
                {loading ? '전송중...' : '전송'}
            </button>
        </form>
    );
};

export default MessageWrite;