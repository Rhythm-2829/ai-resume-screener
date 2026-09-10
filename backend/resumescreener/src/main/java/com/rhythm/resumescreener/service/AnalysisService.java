package com.rhythm.resumescreener.service;

import org.springframework.stereotype.Service;
import com.rhythm.resumescreener.repository.AnalysisRepository;
import com.rhythm.resumescreener.repository.ResumeRepository;
import com.rhythm.resumescreener.util.GroqClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

import com.rhythm.resumescreener.dto.AnalysisResult;
import com.rhythm.resumescreener.model.Analysis;
import java.util.List;

@Service 
@RequiredArgsConstructor 
public class AnalysisService {
    private final AnalysisRepository analysisRepository;
    private final ResumeRepository resumeRepository;
    private final GroqClient groqClient;
    private final ObjectMapper objectMapper;

    public Analysis runAnalysis(Long resumeId, String jobDescription, Long userId) throws Exception{
        String resumeText = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found for ID: " + resumeId))
                .getExtractedText();
        AnalysisResult result = groqClient.analyze(resumeText, jobDescription);

        Analysis analysis = new Analysis();
        analysis.setUserId(userId);
        analysis.setResumeId(resumeId);
        analysis.setJobDescription(jobDescription);
        analysis.setMatchScore(result.getMatchScore());
        analysis.setStrengths(objectMapper.writeValueAsString(result.getStrengths()));
        analysis.setSkillGaps(objectMapper.writeValueAsString(result.getSkillGaps()));
        analysis.setSuggestions(objectMapper.writeValueAsString(result.getSuggestions()));
        analysis.setSummary(result.getSummary());

        return analysisRepository.save(analysis);
       }
    public List<Analysis> getHistory(Long userId){
        return analysisRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    public Analysis getById(Long id){
        return analysisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Analysis not found for ID: " + id));
    }

}
