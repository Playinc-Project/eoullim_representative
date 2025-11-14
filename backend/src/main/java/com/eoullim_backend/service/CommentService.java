package com.eoullim_backend.service;

import com.eoullim_backend.dto.CommentDTO;
import com.eoullim_backend.entity.Comment;
import com.eoullim_backend.entity.Post;
import com.eoullim_backend.entity.User;
import com.eoullim_backend.repository.CommentRepository;
import com.eoullim_backend.repository.PostRepository;
import com.eoullim_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    
    // 댓글 생성
    @Transactional
    public CommentDTO createComment(@NonNull Long postId, @NonNull Long userId, @NonNull String content) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Comment comment = Comment.builder()
                .post(post)
                .user(user)
                .content(content)
                .build();
        
        Comment savedComment = commentRepository.save(comment);
        return convertToDTO(savedComment);
    }
    
    // 게시글의 댓글 조회
    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByPost(@NonNull Long postId) {
        return commentRepository.findByPostId(postId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // 댓글 수정
    @Transactional
    public CommentDTO updateComment(@NonNull Long id, @NonNull Long userId, @NonNull String content) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
        
        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("댓글 수정 권한이 없습니다.");
        }
        
        comment.setContent(content);
        Comment updatedComment = commentRepository.save(comment);
        return convertToDTO(updatedComment);
    }
    
    // 댓글 삭제
    @Transactional
    public void deleteComment(@NonNull Long id, @NonNull Long userId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
        
        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("댓글 삭제 권한이 없습니다.");
        }
        
        commentRepository.deleteById(id);
    }
    
    private CommentDTO convertToDTO(@NonNull Comment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .userId(comment.getUser().getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}