import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WithdrawPage.css';

const WithdrawPage = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleWithdraw = (e) => {
    e.preventDefault();
    // 회원탈퇴 로직 구현
    navigate('/signup');
  };

  return (
    <div className="main-container">
      <header className="withdraw-header">
        <h1>회원탈퇴</h1>
      </header>

      <div className="withdraw-content">
        <form onSubmit={handleWithdraw} className="withdraw-form">
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          <button type="submit" className="withdraw-button">
            회원탈퇴
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawPage;