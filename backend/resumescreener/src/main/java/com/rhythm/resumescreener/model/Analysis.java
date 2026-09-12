package com.rhythm.resumescreener.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

@Data 
@Entity 
@Table(name = "analyses")
public class Analysis {
    @Id 
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Long userId;
    @Column(nullable = false)
    private Long resumeId;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String jobDescription;
    @Column(nullable = false)
    private int matchScore;
    @Column (nullable = false, columnDefinition = "TEXT")
    private String strengths;
    @Column (nullable = false, columnDefinition = "TEXT")
    private String skillGaps;
    @Column (nullable = false, columnDefinition = "TEXT")
    private String suggestions;
    @Column (columnDefinition = "TEXT")
    private String summary;
    @Column
    private String status = "OK";
    @Column(columnDefinition = "TEXT")
    private String message;
    @CreationTimestamp 
    @Column(nullable = false,updatable = false)
    private LocalDateTime createdAt;
}
