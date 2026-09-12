package com.rhythm.resumescreener.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@Data 
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnalysisResult {
    private String status = "OK";
    private String message;
    private int matchScore;
    private List<String> strengths;
    private List<String> skillGaps;
    private List<Suggestion> suggestions;
    private String summary;

    @Data 
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Suggestion{
        private String original;
        private String improved;
    }
}
