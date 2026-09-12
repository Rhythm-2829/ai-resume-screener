package com.rhythm.resumescreener.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm.resumescreener.dto.AnalysisResult;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Component 
public class GroqClient {
    @Value("${groq.api-key}")
    private String apiKey;
    @Value("${groq.model}")
    private String model;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @CircuitBreaker(name = "groqService", fallbackMethod = "groqFallback")
    @TimeLimiter(name = "groqService")
    @Retry(name = "groqService")
    public CompletableFuture<AnalysisResult> analyzeAsync(String resumeText, String jobDescription) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                return analyze(resumeText, jobDescription);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
    }

    public CompletableFuture<AnalysisResult> groqFallback(String resumeText, String jobDescription, Throwable t) {
        log.warn("Groq circuit breaker triggered fallback. Reason: {}", t.getMessage());
        AnalysisResult degraded = new AnalysisResult();
        degraded.setStatus("DEGRADED");
        degraded.setMessage("AI analysis temporarily unavailable due to provider latency. Retry in 30 seconds.");
        return CompletableFuture.completedFuture(degraded);
    }

    public AnalysisResult analyze(String resumeText, String jobDescription) throws Exception {
        String prompt = buildPrompt(resumeText, jobDescription);
        // Build request body
        Map<String, Object> body = Map.of(
            "model", model,
            "messages", List.of(Map.of("role", "user", "content", prompt)),
            "max_tokens", 1500,
            "temperature", 0.3
        );
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        ResponseEntity<String> response = restTemplate.postForEntity(
            "https://api.groq.com/openai/v1/chat/completions",
            new HttpEntity<>(body, headers),
            String.class
        );
        // Extract the text content from response
        JsonNode root = objectMapper.readTree(response.getBody());
        String jsonText = root.path("choices").get(0)
                              .path("message").path("content").asText();
        if (jsonText != null) {
            jsonText = jsonText.trim();
            if (jsonText.startsWith("```json")) {
                jsonText = jsonText.substring(7);
            } else if (jsonText.startsWith("```")) {
                jsonText = jsonText.substring(3);
            }
            if (jsonText.endsWith("```")) {
                jsonText = jsonText.substring(0, jsonText.length() - 3);
            }
            jsonText = jsonText.trim();
        }
        // Parse the JSON returned by Groq
        return objectMapper.readValue(jsonText, AnalysisResult.class);
    }
    private String buildPrompt(String resumeText, String jobDescription) {
        return """
            You are an expert resume reviewer and recruiter.
            
            Analyze the resume and job description below. Respond ONLY with valid JSON in this exact format:
            
            {
              "matchScore": <integer 0-100>,
              "strengths": ["strength 1", "strength 2"],
              "skillGaps": ["missing skill 1", "missing skill 2"],
              "suggestions": [
                { "original": "existing bullet", "improved": "suggested rewrite" }
              ],
              "summary": "2-3 sentence overall assessment"
            }
            
            RESUME:
            %s
            
            JOB DESCRIPTION:
            %s
            
            Respond with JSON only. No explanation, no markdown, no backticks.
            """.formatted(resumeText, jobDescription);
    }
}
