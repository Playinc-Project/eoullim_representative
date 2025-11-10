import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import PostList from './components/Board/PostList';
import PostForm from './components/Board/PostForm';
import MessageList from './components/Message/MessageList';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Splash from './pages/Splash/Splash';
import Main from './pages/Main/Main';
import MessagePage from './pages/Message/MessagePage';
import MessageWrite from './pages/Message/MessageWrite';
import ProfilePage from './pages/Profile/ProfilePage';
import WritePage from './pages/Board/WritePage';
import BoardPage from './pages/Board/BoardPage';
import PostDetailPage from './pages/Post/PostDetailPage';
import WithdrawPage from './pages/Withdraw/WithdrawPage'; 

function App() {
  const [currentPost, setCurrentPost] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    setError('');
    try {
      await signOut(auth);
    } catch (err) {
      setError('로그아웃 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/" element={<Splash />} />
          <Route 
            path="/main" 
            element={
              <Main 
                user={user}
                handleLogout={handleLogout}
                error={error}
                currentPost={currentPost}
                setCurrentPost={setCurrentPost}
              />
            } 
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route 
            path="/messages" 
            element={user ? <MessagePage /> : <Navigate to="/login" />}
          />
          <Route 
            path="/messages/write" 
            element={user ? <MessageWrite /> : <Navigate to="/login" />}
          />
          <Route path="/board/write" element={<WritePage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;