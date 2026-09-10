package com.rhythm.resumescreener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data 
public class AnalysisRequest {
    @NotNull(message = "Resume ID cannot be null")
    private Long resumeId;
    @NotBlank(message = "Job description cannot be blank")
    @Size(max = 1000, message = "Job description cannot exceed 1000 characters")
    private String jobDescription;
    
}
