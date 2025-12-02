import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { messageAPI, authAPI } from '../../services/api';
import './MessageWrite.css';

const MessageWrite = () => {
    const [recipientEmail, setRecipientEmail] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentUser.id) {
            setError('로그인이 필요합니다');
            return;
        }

        if (!recipientEmail.trim() || !content.trim()) {
            setError('받는 사람 이메일과 내용을 모두 입력해주세요');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            // 이메일로 수신자 조회 → id로 전송
            const prof = await authAPI.getByEmail(recipientEmail.trim());
            const recipient = prof?.data;
            if (!recipient?.id) {
                setError('해당 이메일의 사용자를 찾을 수 없습니다');
                setLoading(false);
                return;
            }

            await messageAPI.send(currentUser.id, recipient.id, content);
            
            alert('메시지가 전송되었습니다');
            navigate('/messages');
        } catch (err) {
            console.error('메시지 전송 오류:', err);
            const msg = err?.response?.data?.error || '메시지 전송에 실패했습니다';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser.id) {
        return (
            <div className="write-container">
                <div className="write-card">
                    <h1>로그인이 필요합니다</h1>
                    <p>쪽지를 보내려면 로그인해주세요.</p>
                    <Link to="/login" className="auth-button">로그인하기</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="write-container">
            <div className="write-card">
                {/* 헤더 */}
                <div className="write-header">
                    <button onClick={() => navigate('/messages')} className="back-button">
                        ← 뒤로
                    </button>
                    <h1>쪽지 보내기</h1>
                    <div></div>
                </div>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="write-form">
                    <div className="form-group">
                        <label>받는 사람</label>
                        <input
                            type="email"
                            placeholder="받는 사람 이메일"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>내용</label>
                        <textarea
                            placeholder="메시지 내용을 입력하세요"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={loading}
                            rows="6"
                            required
                        />
                    </div>

                    <div className="form-buttons">
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={loading || !recipientEmail.trim() || !content.trim()}
                        >
                            {loading ? '전송중...' : '메시지 보내기'}
                        </button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate('/messages')}
                        >
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MessageWrite;