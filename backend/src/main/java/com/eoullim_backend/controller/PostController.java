package com.eoullim_backend.controller;

import com.eoullim_backend.dto.PostDTO;
import com.eoullim_backend.dto.PostRequestDTO;
import com.eoullim_backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {
    
    private final PostService postService;
    
    // 게시글 생성: POST /api/posts
    @PostMapping
    public ResponseEntity<PostDTO> createPost(
            @RequestParam Long userId,
            @RequestBody PostRequestDTO requestDTO) {
        try {
            PostDTO post = postService.createPost(userId, requestDTO);
            return ResponseEntity.ok(post);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 모든 게시글 조회: GET /api/posts
    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        List<PostDTO> posts = postService.getAllPosts();
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
            @RequestParam Long userId,
            @RequestBody PostRequestDTO requestDTO) {
        try {
            PostDTO post = postService.updatePost(id, userId, requestDTO);
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
}