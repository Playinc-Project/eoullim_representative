// src/components/Message/MessageList.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MessageList = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // 샘플 데이터 (실제로는 API에서 가져올 예정)
    const sampleMessages = [
        { id: 1, content: '안녕하세요! 어울림에 오신 것을 환영합니다.', sender: '관리자', createdAt: new Date().toISOString() },
        { id: 2, content: '첫 메시지를 작성해보세요!', sender: '시스템', createdAt: new Date().toISOString() },
    ];

    const fetchMessages = async () => {
        try {
            setLoading(true);
            // TODO: 실제 메시지 API 연결 (백엔드 개발 후)
            setTimeout(() => {
                setMessages(sampleMessages);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('메시지 조회 오류:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMessages();
        }
    }, [user]);

    if (!user) {
        return (
            <div>
                <h2>쪽지 목록</h2>
                <p>로그인이 필요합니다.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>쪽지 목록</h2>
            {loading ? (
                <p>메시지를 불러오는 중...</p>
            ) : (
                <ul>
                    {messages.map(message => (
                        <li key={message.id}>
                            <div>
                                <strong>{message.sender}</strong>
                                <span style={{ marginLeft: '10px', fontSize: '0.8em', color: '#666' }}>
                                    {new Date(message.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <p>{message.content}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
};

export default MessageList;