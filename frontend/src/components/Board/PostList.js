import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { postAPI } from '../../services/api';
import './PostList.css';

const PostList = ({ onEdit, limit: postLimit, userId = null }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      if (userId) {
        // 특정 사용자의 게시글만 조회
        response = await postAPI.getUserPosts(userId);
      } else {
        // 모든 게시글 조회
        response = await postAPI.getAll();
      }
      
      let postsData = response.data;
      
      // 최신순 정렬
      postsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // 개수 제한
      if (postLimit) {
        postsData = postsData.slice(0, postLimit);
      }
      
      setPosts(postsData);
    } catch (err) {
      console.error('게시글 조회 오류:', err);
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await postAPI.delete(postId, user.id);
        await fetchPosts(); // 삭제 후 목록 새로고침
        alert('게시글이 삭제되었습니다.');
      } catch (error) {
        console.error('게시글 삭제 중 오류 발생:', error);
        const errorMessage = error.response?.data?.error || '게시글 삭제 중 오류가 발생했습니다.';
        alert(errorMessage);
      }
    }
  };

  const handleEdit = (post) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (user.id !== post.author?.id) {
      alert('자신이 작성한 게시글만 수정할 수 있습니다.');
      return;
    }

    if (onEdit) {
      onEdit(post);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('ko-KR');
    } catch (e) {
      return dateString;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [postLimit, userId]);

  if (loading) {
    return <div className="posts-loading">게시글을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="posts-error">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="posts-empty">게시글이 없습니다.</div>;
  }

  return (
    <div className="posts-container">
      {posts.map(post => (
        <div key={post.id} className="post-item">
          <div className="post-header">
            <h3 className="post-title">{post.title}</h3>
            <div className="post-meta">
              <span className="post-author">
                작성자: {post.author?.username || '익명'}
              </span>
              <span className="post-date">{formatDate(post.createdAt)}</span>
            </div>
          </div>
          <p className="post-content">{post.content}</p>
          <div className="post-stats">
            <span className="views">조회 {post.views || 0}</span>
            <span className="comments">댓글 {post.commentCount || 0}</span>
          </div>
          {user && user.id === post.author?.id && (
            <div className="post-actions">
              <button className="edit-btn" onClick={() => handleEdit(post)}>
                수정
              </button>
              <button className="delete-btn" onClick={() => handleDelete(post.id)}>
                삭제
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostList;
