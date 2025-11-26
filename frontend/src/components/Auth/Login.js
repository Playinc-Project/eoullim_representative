import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Spring Boot API 호출
      const response = await authAPI.login(email, password);
      
      // 응답 데이터 저장
      const { id, email: userEmail, username, token } = response.data;
      
      // 사용자 정보 + 토큰 저장
      localStorage.setItem('currentUser', JSON.stringify({
        id,
        email: userEmail,
        username,
      }));
      localStorage.setItem('token', token || 'dummy-token'); // 실제 토큰 저장
      
      // 메인 페이지로 이동
      navigate('/main');
    } catch (err) {
      setError(err.response?.data?.message || '로그인 실패했습니다');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* 로고 */}
        <div className="auth-logo">
          <span>어울림</span>
        </div>

        {/* 제목 */}
        <h1 className="auth-title">로그인</h1>

        {/* 에러 메시지 */}
        {error && <div className="auth-error">{error}</div>}

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 회원가입 링크 */}
        <p className="auth-switch">
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;