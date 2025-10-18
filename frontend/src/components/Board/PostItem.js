import React from 'react';
import './PostItem.css';

const PostItem = ({ post, onEdit, onDelete }) => {
  return (
    <div className="post-item">
      <div className="post-header">
        <h3 className="post-title">{post.title}</h3>
        <span className="post-author">{post.authorName}</span>
        <span className="post-date">{post.createdAt}</span>
      </div>
      <p className="post-content">{post.content}</p>
      <div className="post-footer">
        <div className="post-stats">
          <span>👍 {post.likes || 0}</span>
          <span>💬 {post.comments?.length || 0}</span>
        </div>
        <div className="post-actions">
          {onEdit && <button onClick={() => onEdit(post)}>수정</button>}
          {onDelete && <button onClick={() => onDelete(post.id)}>삭제</button>}
        </div>
      </div>
    </div>
  );
};

export default PostItem;