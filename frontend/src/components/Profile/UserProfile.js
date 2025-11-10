// src/components/Profile/UserProfile.js
import React from 'react';
import { auth } from '../../firebase';

const UserProfile = () => {
    return (
        <div>
            <h2>내 프로필</h2>
            <p>이메일: {auth.currentUser?.email}</p>
            {/* 추가적인 사용자 정보 표시 */}
        </div>
    );
};

export default UserProfile;