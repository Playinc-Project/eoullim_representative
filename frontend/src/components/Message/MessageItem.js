import React from 'react';
import './MessageItem.css';

const MessageItem = ({ message, onReply, onDelete }) => {
  return (
    <div className="message-item">
      <div className="message-header">
        <span className="sender">{message.senderName}</span>
        <span className="date">{message.createdAt}</span>
      </div>
      <p className="message-content">{message.content}</p>
      <div className="message-actions">
        <button onClick={() => onReply(message.senderId)}>답장</button>
        <button onClick={() => onDelete(message.id)}>삭제</button>
      </div>
    </div>
  );
};

export default MessageItem;