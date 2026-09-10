package com.rhythm.resumescreener.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm.resumescreener.dto.AnalysisResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Map;

@Component 
public class GroqClient {
        @Value("${groq.api-key}")
    private String apiKey;
    @Value("${groq.model}")
    private String model;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
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
