import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI } from '../../services/api';
import './WritePage.css';

function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('제목을 입력하세요');
      return;
    }
    if (!content.trim()) {
      setError('내용을 입력하세요');
      return;
    }

    console.log('=== 게시글 작성 요청 ===');
    console.log('Current User:', currentUser);
    console.log('User ID:', currentUser.id);
    console.log('Title:', title);
    console.log('Content length:', content.length);

    if (!currentUser.id) {
      setError('로그인이 필요합니다');
      return;
    }

    setLoading(true);
    try {
      const response = await postAPI.create(currentUser.id, title, content);
      console.log('✅ 게시글 생성 성공:', response.data);
      navigate(`/post/${response.data.id}`);
    } catch (err) {
      console.error('❌ 게시글 생성 실패:', err);
      if (err.response?.data) {
        setError(`오류: ${err.response.data}`);
      } else {
        setError('게시글 작성에 실패했습니다');
      }
        }
        finally {
      setLoading(false);
    }
  };

  if (!currentUser.id) {
    return (
      <div className="write-container">
        <p>로그인이 필요합니다</p>
      </div>
    );
  }

  return (
    <div className="write-container">
      <div className="write-card">
        <h1>게시글 작성</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="write-form">
          {/* 제목 입력 */}
          <div className="form-group">
            <label>제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength="100"
            />
          </div>

          {/* 내용 입력 */}
          <div className="form-group">
            <label>내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              rows="10"
            ></textarea>
          </div>

          {/* 버튼 그룹 */}
          <div className="form-buttons">
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? '작성 중...' : '게시'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/main')}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WritePage;