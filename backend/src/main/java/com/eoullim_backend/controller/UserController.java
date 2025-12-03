package com.eoullim_backend.controller;

import com.eoullim_backend.dto.UserDTO;
import com.eoullim_backend.dto.UserRequestDTO;
import com.eoullim_backend.dto.LoginRequestDTO;
import com.eoullim_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3001") // React 개발 서버 3001만 사용
public class UserController {
    
    private final UserService userService;
    
    // 회원가입: POST /api/users/signup (구체적인 경로를 먼저)
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserRequestDTO requestDTO) {
        try {
            UserDTO user = userService.signup(requestDTO);
            return ResponseEntity.status(201).body(user);
        } catch (RuntimeException e) {
            String message = e.getMessage() != null ? e.getMessage() : "회원가입 요청이 올바르지 않습니다.";
            // 이메일 중복은 409로 구분 응답
            if (message.contains("이미 존재하는 이메일")) {
                return ResponseEntity.status(409).body(new ErrorResponse(message));
            }
            return ResponseEntity.badRequest().body(new ErrorResponse(message));
        }
    }
    
    // 로그인: POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            UserDTO user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            // 에러 메시지를 JSON으로 반환
            return ResponseEntity.status(401)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    // 에러 응답용 클래스
    public static class ErrorResponse {
        private String error;
        
        public ErrorResponse(String error) {
            this.error = error;
        }
        
        public String getError() {
            return error;
        }
        
        public void setError(String error) {
            this.error = error;
        }
    }
    
    // 사용자 조회: GET /api/users/{id} (PathVariable 매핑을 마지막에)
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        try {
            UserDTO user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 이메일로 사용자 존재 확인: GET /api/users/email/{email}
    @GetMapping("/email/{email}")
    public ResponseEntity<?> checkEmail(@PathVariable String email) {
        try {
            Optional<UserDTO> userOpt = userService.findByEmail(email);
            if (userOpt.isPresent()) {
                return ResponseEntity.ok(userOpt.get());
            }
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    // 사용자 정보 수정: PUT /api/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @RequestBody UserRequestDTO requestDTO) {
        try {
            UserDTO user = userService.updateUser(id, requestDTO);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 사용자 삭제: DELETE /api/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}