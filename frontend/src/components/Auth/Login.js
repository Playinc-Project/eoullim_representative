// src/components/Login.js

import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // 로그인 요청 시작
    setError(''); // 이전 오류 메시지 초기화
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('로그인 성공!');
      navigate('/'); // 로그인 후 메인 페이지로 리다이렉트
    } catch (err) {
      setError(err.message); // 오류 메시지를 상태에 저장
    } finally {
      setLoading(false); // 로그인 요청 완료
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* 오류 메시지 표시 */}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}> {/* 로딩 중 버튼 비활성화 */}
          {loading ? '로딩...' : '로그인'}
        </button>
      </form>
    </div>
  );
};

export default Login;