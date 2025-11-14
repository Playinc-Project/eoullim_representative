package com.eoullim_backend.service;

import com.eoullim_backend.dto.UserDTO;
import com.eoullim_backend.dto.UserRequestDTO;
import com.eoullim_backend.entity.User;
import com.eoullim_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
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
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }
        
        if (!user.get().getPassword().equals(password)) { // 실제로는 암호화 비교 필요
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        
        return convertToDTO(user.get());
    }
    
    // 사용자 조회
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return convertToDTO(user);
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
    public void deleteUser(Long id) {
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