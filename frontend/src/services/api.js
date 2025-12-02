import axios from 'axios';

// API 기본 URL (환경에 따라 수정)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

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
  create: (userId, title, content) =>
    api.post('/posts', { userId, title, content }),
  
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
  create: (postId, userId, content) =>
    api.post('/comments', { content }, { params: { postId, userId } }),
  
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