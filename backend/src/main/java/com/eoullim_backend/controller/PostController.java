package com.eoullim_backend.controller;

import com.eoullim_backend.dto.CommentDTO;
import com.eoullim_backend.dto.PostDTO;
import com.eoullim_backend.dto.PostRequestDTO;
import com.eoullim_backend.entity.Post;
import com.eoullim_backend.service.CommentService;
import com.eoullim_backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3001")
public class PostController {
    
    private final PostService postService;
    private final CommentService commentService;
    
    // 게시글 생성: POST /api/posts
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody PostRequestDTO requestDTO) {
        try {
            System.out.println("Request DTO: " + requestDTO); // 디버그 로그
            if (requestDTO.getUserId() == null) {
                return ResponseEntity.badRequest().body("UserId is required");
            }
            if (requestDTO.getTitle() == null || requestDTO.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Title is required");
            }
            if (requestDTO.getContent() == null || requestDTO.getContent().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Content is required");
            }
            
            PostDTO post = postService.createPost(requestDTO.getUserId(), requestDTO);
            return ResponseEntity.ok(post);
        } catch (RuntimeException e) {
            System.out.println("Error: " + e.getMessage()); // 디버그 로그
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // 모든 게시글 조회: GET /api/posts
    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        List<PostDTO> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }
    
    // 페이지네이션으로 게시글 조회: GET /api/posts/page
    @GetMapping("/page")
    public ResponseEntity<Page<PostDTO>> getPostsWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PostDTO> posts = postService.getPostsWithPagination(page, size);
        return ResponseEntity.ok(posts);
    }
    
    // 게시글 단일 조회: GET /api/posts/{id}
    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPost(@PathVariable Long id) {
        try {
            PostDTO post = postService.getPost(id);
            return ResponseEntity.ok(post);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // 사용자별 게시글 조회: GET /api/posts/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDTO>> getUserPosts(@PathVariable Long userId) {
        List<PostDTO> posts = postService.getUserPosts(userId);
        return ResponseEntity.ok(posts);
    }
    
    // 게시글 수정: PUT /api/posts/{id}
    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePost(
            @PathVariable Long id,
            @RequestBody PostRequestDTO requestDTO) {
        try {
            PostDTO post = postService.updatePost(id, requestDTO.getUserId(), requestDTO);
            return ResponseEntity.ok(post);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 게시글 삭제: DELETE /api/posts/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @RequestParam Long userId) {
        try {
            postService.deletePost(id, userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 게시글의 댓글 조회: GET /api/posts/{postId}/comments
    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentDTO>> getCommentsByPost(@PathVariable Long postId) {
        try {
            List<CommentDTO> comments = commentService.getCommentsByPost(postId);
            return ResponseEntity.ok(comments);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 게시글에 댓글 작성: POST /api/posts/{postId}/comments
    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentDTO> createComment(
            @PathVariable Long postId,
            @RequestBody CommentDTO commentDTO) {
        try {
            CommentDTO comment = commentService.createComment(postId, commentDTO.getUserId(), commentDTO.getContent());
            return ResponseEntity.status(201).body(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id, @RequestParam Long userId) {
        try {
            Post post = postService.toggleLike(id, userId);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("좋아요 처리에 실패했습니다");
        }
    }
}