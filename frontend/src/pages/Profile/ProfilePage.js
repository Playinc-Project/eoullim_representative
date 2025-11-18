import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoWarning, IoChevronForward } from 'react-icons/io5';
import { useAuth } from '../../contexts/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
 const navigate = useNavigate();
 const { user, logout } = useAuth();

 const handleLogout = () => {
   if (window.confirm('로그아웃하시겠습니까?')) {
     logout();
     navigate('/');
   }
 };

 return (
   <div className="main-container">
     <header className="profile-header">
       <div className="header-left">
         <Link to="/main" className="header-link">어울림</Link>
         <Link to="/messages" className="header-link">쪽지함</Link>
       </div>
       <div className="profile-icon">
         <Link to="/profile">
           <button className="icon-button" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>👤</button>
         </Link>
       </div>
     </header>

     <div className="profile-info-section">
       <img 
         src="/default-profile.jpg" 
         alt="프로필" 
         className="profile-image"
       />
       <div className="user-info">
         <div className="user-name">{user?.username || '사용자'}</div>
         <div className="user-details">{user?.email || ''}</div>
         {user?.bio && <div className="user-bio">{user.bio}</div>}
       </div>
     </div>

     <div className="menu-section">
       <Link to="/faq" className="menu-item">
         <IoWarning className="menu-icon" />
         <span>FAQ</span>
         <IoChevronForward className="arrow-icon" />
       </Link>
       <Link to="/support" className="menu-item">
         <IoWarning className="menu-icon" />
         <span>고객센터</span>
         <IoChevronForward className="arrow-icon" />
       </Link>
       <Link to="/terms" className="menu-item">
         <IoWarning className="menu-icon" />
         <span>이용약관</span>
         <IoChevronForward className="arrow-icon" />
       </Link>
       <Link to="/privacy" className="menu-item">
         <IoWarning className="menu-icon" />
         <span>개인정보처리방침</span>
         <IoChevronForward className="arrow-icon" />
       </Link>
     </div>

     <div className="divider"></div>

     <div className="action-buttons">
       <Link to="/withdraw" className="action-button">회원탈퇴</Link>
       <button onClick={handleLogout} className="action-button">로그아웃</button>
     </div>
   </div>
 );
};

export default ProfilePage;