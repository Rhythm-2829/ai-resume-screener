package com.rhythm.resumescreener.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController 
public class HealthController {
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck(){
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
