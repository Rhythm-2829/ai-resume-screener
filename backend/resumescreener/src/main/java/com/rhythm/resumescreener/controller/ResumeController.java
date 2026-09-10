package com.rhythm.resumescreener.controller;

import com.rhythm.resumescreener.model.Resume;
import com.rhythm.resumescreener.repository.UserRepository;
import com.rhythm.resumescreener.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<Resume> upload(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal String email) throws IOException {

        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        Resume saved = resumeService.uploadResume(file, userId);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Resume>> getMyResumes(
            @AuthenticationPrincipal String email) {

        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        return ResponseEntity.ok(resumeService.getUserResumes(userId));
    }
}