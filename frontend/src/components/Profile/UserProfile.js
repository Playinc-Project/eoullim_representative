// src/components/Profile/UserProfile.js
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserProfile = () => {
    const { user } = useAuth();
    
    return (
        <div>
            <h2>내 프로필</h2>
            <p>이메일: {user?.email || '로그인이 필요합니다'}</p>
            <p>사용자명: {user?.username || '-'}</p>
            {user?.bio && <p>소개: {user.bio}</p>}
            {/* 추가적인 사용자 정보 표시 */
        </div>
    );
};

export default UserProfile;