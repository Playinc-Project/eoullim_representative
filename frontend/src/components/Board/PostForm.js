import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const PostForm = ({ currentPost, setCurrentPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (currentPost) {
      setTitle(currentPost.title);
      setContent(currentPost.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [currentPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentPost) {
      // Update post
      const postRef = doc(db, 'posts', currentPost.id);
      await updateDoc(postRef, { title, content });
    } else {
      // Create new post
      await addDoc(collection(db, 'posts'), { title, content, timestamp: new Date() });
    }
    setCurrentPost(null); // Reset form
  };

  return (
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
      <button type="submit">{currentPost ? '수정하기' : '게시하기'}</button>
      <button type="button" onClick={() => setCurrentPost(null)}>취소</button>
    </form>
  );
};

export default PostForm;