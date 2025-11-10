// src/components/Message/MessageList.js
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const MessageList = () => {
    const [messages, setMessages] = useState([]);

    const fetchMessages = async () => {
        const querySnapshot = await getDocs(collection(db, 'messages'));
        const messagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(messagesData);
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <div>
            <h2>쪽지 목록</h2>
            <ul>
                {messages.map(message => (
                    <li key={message.id}>
                        <p>{message.content}</p>
                        {/* 쪽지 관련 추가 정보 */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessageList;