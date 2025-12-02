import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoWarning, IoChevronForward } from 'react-icons/io5';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import './ProfilePage.css';

const ProfilePage = () => {
 const navigate = useNavigate();
 const { user, logout, updateUser } = useAuth();
 const [hydrating, setHydrating] = React.useState(false);

 // 최초 진입 시 사용자 표시가 비어있다면 서버 프로필로 보강
 React.useEffect(() => {
   const hydrate = async () => {
     if (!user?.id) return;
     const missing = !user?.username || !user?.email;
     if (!missing) return;
     try {
       setHydrating(true);
       const res = await authAPI.getProfile(user.id);
       if (res?.data) {
         updateUser(res.data);
       }
     } catch (_) {
       // 표시 보강 실패는 무시하고 기존 값 유지
     } finally {
       setHydrating(false);
     }
   };
   hydrate();
   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [user?.id]);

 const handleLogout = () => {
   if (window.confirm('로그아웃하시겠습니까?')) {
     logout();
     navigate('/');
   }
 };

 const handleWithdraw = async () => {
   if (!user?.id) {
     window.alert('로그인이 필요합니다.');
     return;
   }
   if (!window.confirm('정말로 회원탈퇴하시겠습니까? 작성한 게시글/댓글도 함께 삭제됩니다.')) {
     return;
   }
   try {
     await authAPI.deleteUser(user.id);
     // 탈퇴 후 로컬 상태 정리 및 홈 이동
     logout();
     window.alert('회원탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.');
     navigate('/');
   } catch (err) {
     console.error('회원탈퇴 실패:', err);
     const msg = err?.response?.data?.error || '회원탈퇴에 실패했습니다.';
     window.alert(msg);
   }
 };

 return (
   <div className="main-container">
     {/* 헤더 */}
     <header className="main-header">
       <div className="header-logo">어울림</div>
       <div className="header-nav">
         <Link to="/main" className="nav-link">공지</Link>
         <Link to="/messages" className="nav-link">쪽지</Link>
         <Link to="/profile" className="nav-link active">프로필</Link>
       </div>
     </header>

     {/* 메인 콘텐츠 */}
     <div className="main-content">
       {/* 타이틀 */}
       <h1 className="content-title">프로필</h1>

       {/* 프로필 정보 */}
       <div className="profile-card">
         <div className="profile-info-section">
           <div className="profile-avatar">
             <div className="avatar-circle">👤</div>
           </div>
           <div className="user-info">
             <div className="user-name">{hydrating ? '' : (user?.username || '사용자')}</div>
             <div className="user-email">{hydrating ? '' : (user?.email || '')}</div>
             {user?.bio && <div className="user-bio">{user.bio}</div>}
           </div>
         </div>
       </div>

       {/* 메뉴 섹션 */}
       <div className="menu-card">
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
       </div>

       {/* 액션 버튼들 */}
       <div className="action-card">
         <div className="action-buttons">
           <button onClick={handleWithdraw} className="action-button">회원탈퇴</button>
           <button onClick={handleLogout} className="action-button logout">로그아웃</button>
         </div>
       </div>
     </div>
   </div>
 );
};

export default ProfilePage;