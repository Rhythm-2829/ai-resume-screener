package com.rhythm.resumescreener.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.rhythm.resumescreener.service.AnalysisService;
import com.rhythm.resumescreener.repository.UserRepository;
import com.rhythm.resumescreener.dto.AnalysisRequest;
import com.rhythm.resumescreener.model.Analysis;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import java.util.List;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/api/analysis")
@RequiredArgsConstructor 
public class AnalysisController {
    private final AnalysisService analysisService;
    private final UserRepository userRepository;

    @PostMapping("/run")
    public ResponseEntity<Analysis> run(@Valid 
        @RequestBody AnalysisRequest request,@AuthenticationPrincipal  String email) throws Exception {
            Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
            Analysis result = analysisService.runAnalysis(
                request.getResumeId(),
                request.getJobDescription(),
                userId
            );
            return ResponseEntity.ok(result);
    }
    @GetMapping("/history")
    public ResponseEntity<List<Analysis>> history(@AuthenticationPrincipal String email){
        Long userId = userRepository.findByEmail(email)
            .orElseThrow(()-> new RuntimeException("User not found"))
            .getId();
        return ResponseEntity.ok(analysisService.getHistory(userId));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Analysis> getById(@PathVariable Long id){
        return ResponseEntity.ok(analysisService.getById(id));
    }
}
