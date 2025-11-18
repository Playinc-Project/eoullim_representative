// Firebase 기능을 AWS로 대체 예정
// 현재는 localStorage 기반 인증 사용

// 로컬 스토리지 기반 인증 헬퍼 함수들
export const authHelper = {
  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },
  
  setCurrentUser: (userData) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
  },
  
  removeCurrentUser: () => {
    localStorage.removeItem('currentUser');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('currentUser');
  }
};

// AWS 연동을 위한 플레이스홀더
export const awsConfig = {
  // 나중에 AWS 설정 추가 예정
  region: 'ap-northeast-2',
  // cognito, s3 등 설정
};