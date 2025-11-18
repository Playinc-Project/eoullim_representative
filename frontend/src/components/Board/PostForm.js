import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { postAPI } from '../../services/api';

const PostForm = ({ currentPost, setCurrentPost, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (currentPost) {
      setTitle(currentPost.title || '');
      setContent(currentPost.content || '');
    } else {
      setTitle('');
      setContent('');
    }
    setError('');
  }, [currentPost]);

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
      const postData = {
        title: title.trim(),
        content: content.trim()
      };

      if (currentPost) {
        // 게시글 수정
        await postAPI.update(currentPost.id, user.id, postData);
        alert('게시글이 수정되었습니다.');
      } else {
        // 새 게시글 작성
        await postAPI.create(user.id, postData);
        alert('게시글이 작성되었습니다.');
      }
      
      // 폼 초기화
      setTitle('');
      setContent('');
      setCurrentPost(null);
      
      // 성공 콜백 호출 (게시글 목록 새로고침 등)
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (err) {
      console.error('게시글 처리 오류:', err);
      const errorMessage = err.response?.data?.error || 
                          (currentPost ? '게시글 수정에 실패했습니다.' : '게시글 작성에 실패했습니다.');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setCurrentPost(null);
    setError('');
  };

  if (!user) {
    return (
      <div className="post-form-error">
        로그인 후 게시글을 작성할 수 있습니다.
      </div>
    );
  }

  return (
    <div className="post-form-container">
      <h3>{currentPost ? '게시글 수정' : '새 게시글 작성'}</h3>
      
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            maxLength="100"
            required
          />
        </div>
        
        <div className="form-group">
          <textarea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            rows="8"
            maxLength="2000"
            required
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading || !title.trim() || !content.trim()}
            className="submit-btn"
          >
            {loading ? '처리중...' : (currentPost ? '수정하기' : '게시하기')}
          </button>
          
          <button 
            type="button" 
            onClick={handleCancel}
            disabled={loading}
            className="cancel-btn"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;