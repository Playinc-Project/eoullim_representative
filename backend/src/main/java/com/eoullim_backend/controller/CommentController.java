package com.eoullim_backend.controller;

import com.eoullim_backend.dto.CommentDTO;
import com.eoullim_backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3001")
public class CommentController {
    
    private final CommentService commentService;
    
    // 댓글 생성: POST /api/comments
    @PostMapping
    public ResponseEntity<CommentDTO> createComment(
            @RequestParam Long postId,
            @RequestParam Long userId,
            @RequestBody CommentDTO commentDTO) {
        try {
            CommentDTO comment = commentService.createComment(postId, userId, commentDTO.getContent());
            return ResponseEntity.ok(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 게시글의 댓글 조회: GET /api/comments/post/{postId}
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByPost(@PathVariable Long postId) {
        List<CommentDTO> comments = commentService.getCommentsByPost(postId);
        return ResponseEntity.ok(comments);
    }
    
    // 댓글 수정: PUT /api/comments/{id}
    @PutMapping("/{id}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestBody CommentDTO commentDTO) {
        try {
            CommentDTO comment = commentService.updateComment(id, userId, commentDTO.getContent());
            return ResponseEntity.ok(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 댓글 삭제: DELETE /api/comments/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @RequestParam Long userId) {
        try {
            commentService.deleteComment(id, userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}