package com.rhythm.resumescreener.service;

import com.rhythm.resumescreener.model.User;
import org.springframework.stereotype.Service;
import com.rhythm.resumescreener.repository.AnalysisRepository;
import com.rhythm.resumescreener.repository.ResumeRepository;
import com.rhythm.resumescreener.util.GroqClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import com.rhythm.resumescreener.repository.UserRepository;
import com.rhythm.resumescreener.dto.AnalysisResult;
import com.rhythm.resumescreener.dto.QuotaResponse;
import com.rhythm.resumescreener.model.Analysis;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service 
@RequiredArgsConstructor 
public class AnalysisService {
    private static final int DAILY_LIMIT = 5;

    private final AnalysisRepository analysisRepository;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final GroqClient groqClient;
    private final ObjectMapper objectMapper;

    public Analysis runAnalysis(Long resumeId, String jobDescription, Long userId) throws Exception{
        User user = userRepository.findById(userId)
            .orElseThrow(()-> new RuntimeException("User not found for ID: " + userId));

        resetQuotaIfNewDay(user);

        if(user.getDailyAnalysisCount()>=DAILY_LIMIT){
            throw new RuntimeException("Daily quota of " + DAILY_LIMIT + " analyses reached. Your limit resets at midnight!");
        }


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

        Analysis savedAnalysis =  analysisRepository.save(analysis);

        user.setDailyAnalysisCount(user.getDailyAnalysisCount()+1);
        user.setLastAnalysisDate(LocalDateTime.now());
        userRepository.save(user);

        return savedAnalysis;
    }
    
    public QuotaResponse getUserQuota(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("User not found"));
        resetQuotaIfNewDay(user);
        userRepository.save(user);

        int used = user.getDailyAnalysisCount();
        int remaining = Math.max(0, DAILY_LIMIT-used);
        return new QuotaResponse(used, DAILY_LIMIT, remaining);
    }

    private void resetQuotaIfNewDay(User user){
        LocalDateTime lastdate = user.getLastAnalysisDate();
        if(lastdate == null || lastdate.toLocalDate().isBefore(LocalDate.now())){
            user.setDailyAnalysisCount(0);
        }
    }

    public List<Analysis> getHistory(Long userId){
        return analysisRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    public Analysis getById(Long id){
        return analysisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Analysis not found for ID: " + id));
    }

}
