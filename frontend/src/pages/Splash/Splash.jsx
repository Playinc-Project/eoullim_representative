import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Splash.css';
import splashIcon from '../../assets/images/splash-icon.png';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 2초 후에 메인 페이지로 자동 이동
    const timer = setTimeout(() => {
      navigate('/main');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <img 
          src={splashIcon} 
          alt="환영합니다" 
          className="splash-icon"
        />
      </div>
    </div>
  );
};

export default Splash;