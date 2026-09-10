package com.rhythm.resumescreener.service;

import org.springframework.stereotype.Service;
import com.rhythm.resumescreener.repository.ResumeRepository;
import com.rhythm.resumescreener.util.PdfParser;
import com.rhythm.resumescreener.model.Resume;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResumeService {
    private final ResumeRepository resumeRepository;
    private final PdfParser pdfParser;
    public Resume uploadResume(MultipartFile file, Long userId) throws IOException {
        // Validate file type
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".pdf")) {
            throw new RuntimeException("Only PDF files are allowed");
        }
        // Validate file size (5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("File size must be less than 5MB");
        }
        // Extract text from PDF
        String extractedText = pdfParser.extractTextFromPdf(file);
        if (extractedText.isBlank()) {
            throw new RuntimeException("Could not extract text from PDF. Make sure it's not a scanned image.");
        }
        // Save to DB
        Resume resume = new Resume();
        resume.setUserId(userId);
        resume.setFileName(filename);
        resume.setExtractedText(extractedText);
        return resumeRepository.save(resume);
    }
    public List<Resume> getUserResumes(Long userId) {
        return resumeRepository.findByUserId(userId);
    }
}
