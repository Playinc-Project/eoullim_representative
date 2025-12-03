package com.eoullim_backend.repository;

import com.eoullim_backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostId(Long postId);
    List<Comment> findByUserId(Long userId);
    void deleteByPostId(Long postId); // 게시글 삭제 시 댓글도 함께 삭제
    int countByPostId(Long postId); // 게시글별 댓글 수 조회
}