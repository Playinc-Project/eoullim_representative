// src/components/Signup.js

import React, { useState } from 'react';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); // 회원가입 요청 시작
    setError(''); // 이전 오류 메시지 초기화

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('회원가입 성공!');
      // 필요에 따라 리다이렉트 추가
    } catch (error) {
      setError(error.message); // 오류 메시지를 상태에 저장
    } finally {
      setLoading(false); // 요청 완료
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* 오류 메시지 표시 */}
      <form onSubmit={handleSignup}>
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
          {loading ? '로딩...' : '회원가입'}
        </button>
      </form>
    </div>
  );
};

export default Signup;