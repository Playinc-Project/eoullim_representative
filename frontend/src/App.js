import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
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
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route path="/" element={<Splash />} />
            <Route path="/main" element={<Main />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/withdraw" element={<WithdrawPage />} />
            <Route path="/messages" element={<MessagePage />} />
            <Route path="/messages/write" element={<MessageWrite />} />
            <Route path="/board/write" element={<WritePage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;