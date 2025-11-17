import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear local storage and redirect to login
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User API
export const userAPI = {
  signup: (userData) => api.post('/users/signup', userData),
  login: (email, password) => api.post('/users/login', { email, password }),
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (userId, userData) => api.put(`/users/${userId}`, userData),
  deleteProfile: (userId) => api.delete(`/users/${userId}`),
};

// Post API
export const postAPI = {
  create: (userId, postData) => api.post('/posts', postData, { params: { userId } }),
  getAll: () => api.get('/posts'),
  getOne: (postId) => api.get(`/posts/${postId}`),
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
  update: (postId, userId, postData) => api.put(`/posts/${postId}`, postData, { params: { userId } }),
  delete: (postId, userId) => api.delete(`/posts/${postId}`, { params: { userId } }),
};

// Comment API
export const commentAPI = {
  create: (postId, userId, content) => api.post('/comments', { content }, { params: { postId, userId } }),
  getByPost: (postId) => api.get(`/comments/post/${postId}`),
  update: (commentId, userId, content) => api.put(`/comments/${commentId}`, { content }, { params: { userId } }),
  delete: (commentId, userId) => api.delete(`/comments/${commentId}`, { params: { userId } }),
};

export default api;