// src/components/Board/BoardDetail.js
import React from 'react';

const BoardDetail = ({ post }) => {
    return (
        <div>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            {/* 추가적인 게시글 정보 */}
        </div>
    );
};

export default BoardDetail;