import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (localError) setLocalError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setLocalError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    if (formData.password.length < 6) {
      setLocalError('비밀번호는 6자 이상이어야 합니다.');
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        username: formData.username
      };
      
      await signup(userData);
      
      // 회원가입 성공 시 메인 페이지로 이동
      navigate('/main');
      alert('회원가입이 완료되었습니다!');
    } catch (err) {
      console.error('회원가입 실패:', err.message);
    }
  };

  const displayError = localError || error;

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>회원가입</h2>
        
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="username">사용자명</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="사용자명을 입력하세요"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호를 입력하세요 (6자 이상)"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {displayError && (
            <div className="error-message">
              {displayError}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading || !formData.email || !formData.password || !formData.username}
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="auth-links">
          <p>이미 계정이 있으신가요? <a href="/login">로그인</a></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;