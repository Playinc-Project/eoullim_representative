package com.eoullim_backend.service;

import com.eoullim_backend.dto.PostDTO;
import com.eoullim_backend.dto.PostRequestDTO;
import com.eoullim_backend.entity.Post;
import com.eoullim_backend.entity.User;
import com.eoullim_backend.repository.PostRepository;
import com.eoullim_backend.repository.UserRepository;
import com.eoullim_backend.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository; // 댓글 리포지토리 추가
    
    // 게시글 생성 - 캐시 삭제
    @Transactional
    @CacheEvict(value = "posts", allEntries = true)
    public PostDTO createPost(Long userId, PostRequestDTO requestDTO) {
        System.out.println("=== PostService.createPost ===");
        System.out.println("요청된 userId: " + userId);
        System.out.println("전체 사용자 수: " + userRepository.count());
        System.out.println("사용자 존재 여부: " + userRepository.existsById(userId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    System.out.println("❌ 사용자 ID " + userId + " 를 찾을 수 없습니다");
                    // 디버그용: 전체 사용자 목록 출력
                    userRepository.findAll().forEach(u -> 
                        System.out.println("기존 사용자: ID=" + u.getId() + ", Email=" + u.getEmail())
                    );
                    return new RuntimeException("사용자를 찾을 수 없습니다.");
                });
        
        System.out.println("✅ 사용자 찾음: " + user.getEmail());
        
        Post post = Post.builder()
                .user(user)
                .title(requestDTO.getTitle())
                .content(requestDTO.getContent())
                .build();
        
        Post savedPost = postRepository.save(post);
        System.out.println("✅ 게시글 저장됨: ID=" + savedPost.getId());
        return convertToDTO(savedPost);
    }
    
    // 게시글 조회 (단일) - 캐시 적용
    @Cacheable(value = "posts", key = "#id")
    public PostDTO getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        // 조회수 증가
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
        
        return convertToDTO(post);
    }
    
    // 모든 게시글 조회 - 캐시 적용
    @Cacheable(value = "posts", key = "'all'")
    public List<PostDTO> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // 페이지네이션으로 게시글 조회
    public Page<PostDTO> getPostsWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return postRepository.findAll(pageable).map(this::convertToDTO);
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
    
    // 게시글 삭제 (댓글도 함께 삭제)
    @Transactional
    public void deletePost(Long id, Long userId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("게시글 삭제 권한이 없습니다.");
        }
        
        // 먼저 댓글들을 삭제
        commentRepository.deleteByPostId(id);
        
        // 그 다음 게시글 삭제
        postRepository.deleteById(id);
    }
    
    private PostDTO convertToDTO(Post post) {
        // 댓글 수 계산
        int commentCount = commentRepository.countByPostId(post.getId());
        
        return PostDTO.builder()
                .id(post.getId())
                .userId(post.getUser().getId())
                .title(post.getTitle())
                .content(post.getContent())
                .viewCount(post.getViewCount())
                .likeCount(post.getLikeCount())
                .commentCount(commentCount) // 댓글 수 추가
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    public Post toggleLike(Long id, Long userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'toggleLike'");
    }
}