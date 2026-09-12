package com.rhythm.resumescreener.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm.resumescreener.dto.AnalysisResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalysisCacheService {

    private static final String CACHE_PREFIX = "analysis:cache:";
    private static final Duration CACHE_TTL = Duration.ofDays(7);

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Computes a deterministic SHA-256 hash of the resume text and job description.
     */
    public String computeContentHash(String resumeText, String jobDescription) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String combined = resumeText.trim() + "||" + jobDescription.trim();
            byte[] hashBytes = digest.digest(combined.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }

    /**
     * Looks up cached AnalysisResult in Redis.
     * Returns Optional.empty() if not found or if Redis is unreachable.
     */
    public Optional<AnalysisResult> getCached(String contentHash) {
        String key = CACHE_PREFIX + contentHash;
        try {
            String cachedJson = redisTemplate.opsForValue().get(key);
            if (cachedJson != null && !cachedJson.isBlank()) {
                log.info("[Redis Cache HIT] Serving analysis from cache for key: {}", key);
                AnalysisResult result = objectMapper.readValue(cachedJson, AnalysisResult.class);
                return Optional.of(result);
            }
            log.info("[Redis Cache MISS] No cached result found for key: {}", key);
        } catch (Exception e) {
            log.warn("[Redis Cache WARN] Redis read failed ({}), falling back to direct LLM call.", e.getMessage());
        }
        return Optional.empty();
    }

    /**
     * Caches the AnalysisResult in Redis with a 7-day TTL.
     */
    public void saveToCache(String contentHash, AnalysisResult result) {
        String key = CACHE_PREFIX + contentHash;
        try {
            String json = objectMapper.writeValueAsString(result);
            redisTemplate.opsForValue().set(key, json, CACHE_TTL);
            log.info("[Redis Cache SAVED] Cached analysis result with 7-day TTL for key: {}", key);
        } catch (Exception e) {
            log.warn("[Redis Cache WARN] Failed to save result to Redis: {}", e.getMessage());
        }
    }
}
