import React, { useState } from 'react';
import PostList from './PostList';
import PostForm from './PostForm';

const BoardList = () => {
    const [currentPost, setCurrentPost] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleFormSuccess = () => {
        // 게시글 목록 새로고침
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div>
            <h2>게시판</h2>
            <PostForm 
                currentPost={currentPost} 
                setCurrentPost={setCurrentPost}
                onSuccess={handleFormSuccess}
            />
            <PostList 
                onEdit={setCurrentPost}
                key={refreshTrigger}
            />
        </div>
    );
};

export default BoardList;