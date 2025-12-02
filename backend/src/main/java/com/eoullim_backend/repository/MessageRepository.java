package com.eoullim_backend.repository;

import com.eoullim_backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRecipientId(Long recipientId);
    List<Message> findBySenderId(Long senderId);
    void deleteBySenderIdOrRecipientId(Long senderId, Long recipientId);
}
