import { db } from '../../firebase';
import React, { useState } from 'react';
import PostList from './PostList';
import PostForm from './PostForm';

const BoardList = () => {
    const [currentPost, setCurrentPost] = useState(null);

    return (
        <div>
            <h2>게시판</h2>
            <PostForm currentPost={currentPost} setCurrentPost={setCurrentPost} />
            <PostList onEdit={setCurrentPost} />
        </div>
    );
};

export default BoardList;