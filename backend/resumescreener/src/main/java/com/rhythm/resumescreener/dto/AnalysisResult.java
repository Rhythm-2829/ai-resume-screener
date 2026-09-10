package com.rhythm.resumescreener.dto;

import lombok.Data;
import java.util.List;

@Data 
public class AnalysisResult {
    private int matchScore;
    private List<String> strengths;
    private List<String> skillGaps;
    private List<Suggestion> suggestions;
    private String summary;

    @Data 
    public static class Suggestion{
        private String original;
        private String improved;
    }

}
