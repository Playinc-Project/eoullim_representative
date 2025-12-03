package com.eoullim_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Entity
@Table(name = "posts", indexes = {
    @Index(name = "idx_post_user_id", columnList = "user_id"),
    @Index(name = "idx_post_created_at", columnList = "created_at"),
    @Index(name = "idx_post_view_count", columnList = "view_count"),
    @Index(name = "idx_post_like_count", columnList = "like_count")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer viewCount = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer likeCount = 0;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    public void prePersist() {
        ZonedDateTime kst = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
        this.createdAt = kst.toLocalDateTime();
        this.updatedAt = kst.toLocalDateTime();
    }
    
    @PreUpdate
    public void preUpdate() {
        ZonedDateTime kst = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
        this.updatedAt = kst.toLocalDateTime();
    }
}