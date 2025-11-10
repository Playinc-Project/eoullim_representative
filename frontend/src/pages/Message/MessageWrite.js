// src/pages/Message/MessageWrite.js
import React, { useState } from 'react';
import { db, storage } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './MessageWrite.css';

const MessageWrite = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('제목:', title); // 제목 출력
        console.log('내용:', content); // 내용 출력

        let fileURL = '';
        if (file) {
            const fileRef = ref(storage, `uploads/${file.name}`);
            await uploadBytes(fileRef, file);
            fileURL = await getDownloadURL(fileRef);
        }

        await addDoc(collection(db, 'messages'), { title, content, fileURL });
        setTitle(''); // Reset title
        setContent(''); // Reset content
        setFile(null); // Reset file
    };

    return (
        <div className="main-container">
            <h2>쪽지 보내기</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="내용"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <div className="file-upload">
                    <label htmlFor="file-input" className="upload-icon">📷</label>
                    <input 
                        type="file" 
                        id="file-input" 
                        style={{ display: 'none' }} 
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <button type="submit" className="send-button">전송</button>
                </div>
            </form>
        </div>
    );
};

export default MessageWrite;