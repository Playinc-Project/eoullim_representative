import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc, orderBy, query, limit } from 'firebase/firestore';
import './PostList.css';

const PostList = ({ onEdit, limit: postLimit }) => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      postLimit ? limit(postLimit) : limit(100)
    );
    
    const querySnapshot = await getDocs(postsQuery);
    const postsData = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toLocaleString() 
    }));
    setPosts(postsData);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        await fetchPosts(); // 삭제 후 목록 새로고침
      } catch (error) {
        console.error('게시글 삭제 중 오류 발생:', error);
        alert('게시글 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [postLimit]);

  return (
    <div className="posts-container">
      {posts.map(post => (
        <div key={post.id} className="post-item">
          <div className="post-header">
            <h3 className="post-title">{post.title}</h3>
            <span className="post-date">{post.createdAt}</span>
          </div>
          <p className="post-content">{post.content}</p>
          <div className="post-actions">
            <button className="edit-btn" onClick={() => onEdit(post)}>수정</button>
            <button className="delete-btn" onClick={() => handleDelete(post.id)}>삭제</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
