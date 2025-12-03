package com.eoullim_backend.controller;

import com.eoullim_backend.dto.MessageDTO;
import com.eoullim_backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3001")
public class MessageController {

    private final MessageService messageService;

    // 메시지 보내기: POST /api/messages?senderId=&recipientId=
    @PostMapping
    public ResponseEntity<?> send(
            @RequestParam Long senderId,
            @RequestParam Long recipientId,
            @RequestBody(required = false) ContentRequest body) {
        try {
            String content = body != null ? body.content : null;
            MessageDTO dto = messageService.send(senderId, recipientId, content);
            return ResponseEntity.status(201).body(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // 받은 쪽지: GET /api/messages/received/{userId}
    @GetMapping("/received/{userId}")
    public ResponseEntity<List<MessageDTO>> received(@PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getReceived(userId));
    }

    // 보낸 쪽지: GET /api/messages/sent/{userId}
    @GetMapping("/sent/{userId}")
    public ResponseEntity<List<MessageDTO>> sent(@PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getSent(userId));
    }

    // 메시지 삭제: DELETE /api/messages/{id}?userId=
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestParam Long userId) {
        try {
            messageService.delete(id, userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // 간단한 요청/응답 보조 클래스들
    public record ContentRequest(String content) {}
    public record ErrorResponse(String error) {}
}
