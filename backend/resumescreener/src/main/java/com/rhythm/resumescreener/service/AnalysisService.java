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

import lombok.extern.slf4j.Slf4j;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service 
@RequiredArgsConstructor 
public class AnalysisService {
    private static final int DAILY_LIMIT = 5;

    private final AnalysisRepository analysisRepository;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final GroqClient groqClient;
    private final ObjectMapper objectMapper;
    private final AnalysisCacheService cacheService;

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

        // 1. Check Redis cache first using SHA-256 content hash
        String contentHash = cacheService.computeContentHash(resumeText, jobDescription);
        Optional<AnalysisResult> cachedResult = cacheService.getCached(contentHash);

        AnalysisResult result;
        if (cachedResult.isPresent()) {
            result = cachedResult.get();
        } else {
            // 2. Cache MISS: invoke Groq LLM through CircuitBreaker/TimeLimiter/Retry wrapper
            try {
                result = groqClient.analyzeAsync(resumeText, jobDescription).get();
            } catch (Exception e) {
                log.error("Error executing Groq LLM call via circuit breaker: {}", e.getMessage());
                result = new AnalysisResult();
                result.setStatus("DEGRADED");
                result.setMessage("AI analysis temporarily unavailable due to provider latency. Retry in 30 seconds.");
            }

            // Only cache successful OK results
            if (!"DEGRADED".equals(result.getStatus())) {
                cacheService.saveToCache(contentHash, result);
            }
        }

        // 3. If degraded response, do not persist to database or increment daily quota!
        if ("DEGRADED".equals(result.getStatus())) {
            log.warn("Returning degraded response for user {}. Daily quota preserved.", userId);
            Analysis degradedAnalysis = new Analysis();
            degradedAnalysis.setUserId(userId);
            degradedAnalysis.setResumeId(resumeId);
            degradedAnalysis.setJobDescription(jobDescription);
            degradedAnalysis.setStatus("DEGRADED");
            degradedAnalysis.setMessage(result.getMessage());
            return degradedAnalysis;
        }

        Analysis analysis = new Analysis();
        analysis.setUserId(userId);
        analysis.setResumeId(resumeId);
        analysis.setJobDescription(jobDescription);
        analysis.setStatus("OK");
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
