package com.eoullim_backend.controller;

import com.eoullim_backend.dto.UserDTO;
import com.eoullim_backend.dto.UserRequestDTO;
import com.eoullim_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // React 개발 서버
public class UserController {
    
    private final UserService userService;
    
    // 회원가입: POST /api/users/signup
    @PostMapping("/signup")
    public ResponseEntity<UserDTO> signup(@RequestBody UserRequestDTO requestDTO) {
        try {
            UserDTO user = userService.signup(requestDTO);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 로그인: POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(
            @RequestParam String email,
            @RequestParam String password) {
        try {
            UserDTO user = userService.login(email, password);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 사용자 조회: GET /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        try {
            UserDTO user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
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