package com.eoullim_backend.service;

import com.eoullim_backend.dto.UserDTO;
import com.eoullim_backend.dto.UserRequestDTO;
import com.eoullim_backend.entity.User;
import com.eoullim_backend.entity.Post;
import com.eoullim_backend.repository.PostRepository;
import com.eoullim_backend.repository.MessageRepository;
import com.eoullim_backend.repository.CommentRepository;
import org.springframework.transaction.annotation.Transactional;
import com.eoullim_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final MessageRepository messageRepository;
    
    // 회원가입
    public UserDTO signup(UserRequestDTO requestDTO) {
        if (userRepository.existsByEmail(requestDTO.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        
        User user = User.builder()
                .email(requestDTO.getEmail())
                .password(requestDTO.getPassword()) // 실제로는 암호화 필요
                .username(requestDTO.getUsername())
                .profileImage(requestDTO.getProfileImage())
                .bio(requestDTO.getBio())
                .build();
        
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }
    
    // 로그인
    public UserDTO login(String email, String password) {
        System.out.println("🔍 로그인 시도 - Email: " + email + ", Password: " + password);
        
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            System.out.println("❌ 사용자를 찾을 수 없음: " + email);
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }
        
        System.out.println("✅ 사용자 찾음 - DB Password: " + user.get().getPassword());
        
        if (!user.get().getPassword().equals(password)) { // 실제로는 암호화 비교 필요
            System.out.println("❌ 비밀번호 불일치 - 입력: " + password + ", DB: " + user.get().getPassword());
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        
        System.out.println("🎉 로그인 성공!");
        return convertToDTO(user.get());
    }
    
    // 사용자 조회
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return convertToDTO(user);
    }
    
    public Optional<UserDTO> findByEmail(String email) {
        return userRepository.findByEmail(email).map(this::convertToDTO);
    }
    
    // 사용자 정보 수정
    public UserDTO updateUser(Long id, UserRequestDTO requestDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        if (requestDTO.getUsername() != null) {
            user.setUsername(requestDTO.getUsername());
        }
        if (requestDTO.getProfileImage() != null) {
            user.setProfileImage(requestDTO.getProfileImage());
        }
        if (requestDTO.getBio() != null) {
            user.setBio(requestDTO.getBio());
        }
        
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }
    
    // 사용자 삭제
    @Transactional
    public void deleteUser(Long id) {
        // 사용자가 주고받은 쪽지 선삭제
        messageRepository.deleteBySenderIdOrRecipientId(id, id);
        // 사용자가 작성한 댓글 선삭제
        commentRepository.findByUserId(id).forEach(c -> commentRepository.deleteById(c.getId()));

        // 사용자가 작성한 게시글의 댓글 선삭제 후 게시글 삭제
        for (Post p : postRepository.findByUserId(id)) {
            commentRepository.deleteByPostId(p.getId());
            postRepository.deleteById(p.getId());
        }

        // 마지막으로 사용자 삭제
        userRepository.deleteById(id);
    }
    
    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .profileImage(user.getProfileImage())
                .bio(user.getBio())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}