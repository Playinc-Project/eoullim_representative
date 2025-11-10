// src/components/Message/MessageWrite.js
import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

const MessageWrite = () => {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addDoc(collection(db, 'messages'), { content });
        setContent(''); // Reset form
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                placeholder="쪽지 내용"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
            <button type="submit">전송</button>
        </form>
    );
};

export default MessageWrite;