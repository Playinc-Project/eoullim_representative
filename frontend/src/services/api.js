import axios from 'axios';

// API 기본 URL (환경에 따라 수정)
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://YOUR_EC2_PUBLIC_IP:8081/api'
  : process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰이 있으면 자동으로 헤더에 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// NestJS 응답 구조 통일 처리
api.interceptors.response.use(
  (response) => {
    // NestJS에서 {success: true, data: ...} 형태로 응답하는 경우 data 부분만 추출
    if (response.data && response.data.success && response.data.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Accepts either an object {email, password, username, ...}
  // or positional args (email, password, username)
  signup: (emailOrData, password, username) => {
    const payload = typeof emailOrData === 'object'
      ? emailOrData
      : { email: emailOrData, password, username };
    return api.post('/users/signup', payload);
  },
  
  login: (email, password) =>
    api.post('/users/login', { email, password }),
  
  getProfile: (userId) =>
    api.get(`/users/${userId}`),
  
  updateProfile: (userId, data) =>
    api.put(`/users/${userId}`, data),

  deleteUser: (userId) =>
    api.delete(`/users/${userId}`),

  getByEmail: (email) =>
    api.get(`/users/email/${encodeURIComponent(email)}`),
};

// Post API
export const postAPI = {
  // Create post: backend expects userId inside request body (PostRequestDTO)
  create: (userId, title, content) => {
    console.log('=== API 요청 데이터 ===');
    console.log('userId:', userId, 'type:', typeof userId);
    console.log('title:', title, 'type:', typeof title);
    console.log('content:', content, 'type:', typeof content);
    
    // userId를 숫자로 변환 (DTO @IsNumber() 검증 통과를 위해)
    const requestData = { 
      userId: parseInt(userId), 
      title: String(title), 
      content: String(content) 
    };
    console.log('전송할 데이터:', requestData);
    
    return api.post('/posts', requestData);
  },
  
  toggleLike: (postId, userId) =>
  api.post(`/posts/${postId}/like`, {}, { params: { userId } }),

  getAll: () =>
    api.get('/posts'),
  
  getOne: (postId) =>
    api.get(`/posts/${postId}`),
  
  getUserPosts: (userId) =>
    api.get(`/posts/user/${userId}`),
  
  update: (postId, userId, title, content) =>
    api.put(`/posts/${postId}`, { userId, title, content }),
  
  delete: (postId, userId) =>
    api.delete(`/posts/${postId}`, { params: { userId } }),
};

// Comment API
export const commentAPI = {
  create: (postId, userId, content) => {
    // 백엔드가 body에서 {postId, userId, content}를 받으므로 모두 body에 전송
    const requestData = {
      postId: parseInt(postId),
      userId: parseInt(userId),
      content: String(content)
    };
    console.log('댓글 생성 요청 데이터:', requestData);
    return api.post('/comments', requestData);
  },
  
  getByPost: (postId) =>
    api.get(`/comments/post/${postId}`),
  
  update: (commentId, userId, content) =>
    api.put(`/comments/${commentId}`, { content }, { params: { userId } }),
  
  delete: (commentId, userId) =>
    api.delete(`/comments/${commentId}`, { params: { userId } }),
};

// Message API
export const messageAPI = {
  send: (senderId, recipientId, content) =>
    api.post('/messages', { content }, { params: { senderId, recipientId } }),
  
  getReceived: (userId) =>
    api.get(`/messages/received/${userId}`),
  
  getSent: (userId) =>
    api.get(`/messages/sent/${userId}`),
  
  delete: (messageId, userId) =>
    api.delete(`/messages/${messageId}`, { params: { userId } }),
};

export default api;