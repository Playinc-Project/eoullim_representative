package com.eoullim_backend.service;

import com.eoullim_backend.dto.PostDTO;
import com.eoullim_backend.dto.PostRequestDTO;
import com.eoullim_backend.entity.Post;
import com.eoullim_backend.entity.User;
import com.eoullim_backend.repository.PostRepository;
import com.eoullim_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    
    // 게시글 생성
    public PostDTO createPost(Long userId, PostRequestDTO requestDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Post post = Post.builder()
                .user(user)
                .title(requestDTO.getTitle())
                .content(requestDTO.getContent())
                .viewCount(0)
                .likeCount(0)
                .build();
        
        Post savedPost = postRepository.save(post);
        return convertToDTO(savedPost);
    }
    
    // 게시글 조회 (단일)
    public PostDTO getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        // 조회수 증가
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
        
        return convertToDTO(post);
    }
    
    // 모든 게시글 조회
    public List<PostDTO> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // 사용자별 게시글 조회
    public List<PostDTO> getUserPosts(Long userId) {
        return postRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // 게시글 수정
    public PostDTO updatePost(Long id, Long userId, PostRequestDTO requestDTO) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("게시글 수정 권한이 없습니다.");
        }
        
        post.setTitle(requestDTO.getTitle());
        post.setContent(requestDTO.getContent());
        
        Post updatedPost = postRepository.save(post);
        return convertToDTO(updatedPost);
    }
    
    // 게시글 삭제
    public void deletePost(Long id, Long userId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("게시글 삭제 권한이 없습니다.");
        }
        
        postRepository.deleteById(id);
    }
    
    private PostDTO convertToDTO(Post post) {
        return PostDTO.builder()
                .id(post.getId())
                .userId(post.getUser().getId())
                .title(post.getTitle())
                .content(post.getContent())
                .viewCount(post.getViewCount())
                .likeCount(post.getLikeCount())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}