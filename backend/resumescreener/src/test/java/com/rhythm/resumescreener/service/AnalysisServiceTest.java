package com.rhythm.resumescreener.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm.resumescreener.dto.AnalysisResult;
import com.rhythm.resumescreener.model.Analysis;
import com.rhythm.resumescreener.model.Resume;
import com.rhythm.resumescreener.model.User;
import com.rhythm.resumescreener.repository.AnalysisRepository;
import com.rhythm.resumescreener.repository.ResumeRepository;
import com.rhythm.resumescreener.repository.UserRepository;
import com.rhythm.resumescreener.util.GroqClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnalysisServiceTest {

    @Mock
    private AnalysisRepository analysisRepository;

    @Mock
    private ResumeRepository resumeRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private GroqClient groqClient;

    @Mock
    private AnalysisCacheService cacheService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private AnalysisService analysisService;

    private User testUser;
    private Resume testResume;

    @BeforeEach
    void setUp() {
        analysisService = new AnalysisService(
                analysisRepository,
                resumeRepository,
                userRepository,
                groqClient,
                objectMapper,
                cacheService
        );

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setDailyAnalysisCount(2);
        testUser.setLastAnalysisDate(LocalDateTime.now());

        testResume = new Resume();
        testResume.setId(10L);
        testResume.setExtractedText("Experienced Java developer with Spring Boot expertise.");
    }

    @Test
    void testRunAnalysis_WhenGroqReturnsDegraded_ShouldNotIncrementQuotaOrSave() throws Exception {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(resumeRepository.findById(10L)).thenReturn(Optional.of(testResume));
        when(cacheService.computeContentHash(any(), any())).thenReturn("mockHash123");
        when(cacheService.getCached("mockHash123")).thenReturn(Optional.empty());

        AnalysisResult degradedResult = new AnalysisResult();
        degradedResult.setStatus("DEGRADED");
        degradedResult.setMessage("AI analysis temporarily unavailable due to provider latency. Retry in 30 seconds.");
        when(groqClient.analyzeAsync(any(), any())).thenReturn(CompletableFuture.completedFuture(degradedResult));

        Analysis result = analysisService.runAnalysis(10L, "Looking for Java developer", 1L);

        assertNotNull(result);
        assertEquals("DEGRADED", result.getStatus());
        assertTrue(result.getMessage().contains("temporarily unavailable"));

        // Quota count must NOT be incremented
        assertEquals(2, testUser.getDailyAnalysisCount());
        verify(userRepository, never()).save(any(User.class));

        // Degraded result must NOT be persisted to database or cache
        verify(analysisRepository, never()).save(any(Analysis.class));
        verify(cacheService, never()).saveToCache(any(), any());
    }

    @Test
    void testRunAnalysis_WhenGroqReturnsOk_ShouldSaveAndIncrementQuota() throws Exception {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(resumeRepository.findById(10L)).thenReturn(Optional.of(testResume));
        when(cacheService.computeContentHash(any(), any())).thenReturn("mockHash123");
        when(cacheService.getCached("mockHash123")).thenReturn(Optional.empty());

        AnalysisResult okResult = new AnalysisResult();
        okResult.setStatus("OK");
        okResult.setMatchScore(88);
        okResult.setStrengths(List.of("Spring Boot", "Java"));
        okResult.setSkillGaps(List.of("Docker"));
        okResult.setSummary("Strong match.");

        when(groqClient.analyzeAsync(any(), any())).thenReturn(CompletableFuture.completedFuture(okResult));
        when(analysisRepository.save(any(Analysis.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Analysis result = analysisService.runAnalysis(10L, "Looking for Java developer", 1L);

        assertNotNull(result);
        assertEquals("OK", result.getStatus());
        assertEquals(88, result.getMatchScore());

        // Quota count MUST be incremented to 3 and user saved
        assertEquals(3, testUser.getDailyAnalysisCount());
        verify(userRepository, times(1)).save(testUser);

        // Analysis saved to DB and cached in Redis
        verify(analysisRepository, times(1)).save(any(Analysis.class));
        verify(cacheService, times(1)).saveToCache(eq("mockHash123"), eq(okResult));
    }

    @Test
    void testGroqFallbackDirectly() throws Exception {
        GroqClient client = new GroqClient();
        CompletableFuture<AnalysisResult> fallbackFuture = client.groqFallback(
                "resume text",
                "jd text",
                new RuntimeException("Groq API 503 Service Unavailable")
        );

        AnalysisResult result = fallbackFuture.get();
        assertNotNull(result);
        assertEquals("DEGRADED", result.getStatus());
        assertEquals("AI analysis temporarily unavailable due to provider latency. Retry in 30 seconds.", result.getMessage());
    }
}
