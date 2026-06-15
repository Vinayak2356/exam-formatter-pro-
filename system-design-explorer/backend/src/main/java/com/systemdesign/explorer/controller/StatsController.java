package com.systemdesign.explorer.controller;

import com.systemdesign.explorer.repository.DesignPatternRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final DesignPatternRepository patternRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalPatterns = patternRepository.count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatterns", totalPatterns);
        stats.put("categories", 10); // Simulated count
        stats.put("activeUsers", 1);
        stats.put("exportsGenerated", 42);

        return ResponseEntity.ok(stats);
    }
}
