package com.eoullim_backend.service;

import com.eoullim_backend.dto.MessageDTO;
import com.eoullim_backend.entity.Message;
import com.eoullim_backend.entity.User;
import com.eoullim_backend.repository.MessageRepository;
import com.eoullim_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageDTO send(Long senderId, Long recipientId, String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("메시지 내용을 입력해주세요.");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("발신자를 찾을 수 없습니다."));
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("수신자를 찾을 수 없습니다."));

        Message saved = messageRepository.save(Message.builder()
                .sender(sender)
                .recipient(recipient)
                .content(content)
                .build());
        return toDTO(saved);
    }

    public List<MessageDTO> getReceived(Long userId) {
        return messageRepository.findByRecipientId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<MessageDTO> getSent(Long userId) {
        return messageRepository.findBySenderId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public void delete(Long messageId, Long userId) {
        Message msg = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("메시지를 찾을 수 없습니다."));
        if (!msg.getSender().getId().equals(userId) && !msg.getRecipient().getId().equals(userId)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }
        messageRepository.deleteById(messageId);
    }

    private MessageDTO toDTO(Message m) {
        return MessageDTO.builder()
                .id(m.getId())
                .senderId(m.getSender().getId())
                .senderName(m.getSender().getUsername())
                .recipientId(m.getRecipient().getId())
                .recipientName(m.getRecipient().getUsername())
                .content(m.getContent())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
