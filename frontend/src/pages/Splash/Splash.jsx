import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Splash.css';

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    // 3초 후 로그인 페이지로 이동
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      {/* 메인 로고 */}
      <div className="splash-logo-wrapper">
        <div className="splash-logo">
          <span className="logo-text">어울림</span>
        </div>
        <div className="heart-icon">♥</div>
      </div>
      
      {/* 로딩 텍스트 */}
      <p className="splash-loading">함께 나누어요...</p>
    </div>
  );
}

export default Splash;