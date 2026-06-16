package com.systemdesign.explorer.controller;

import com.systemdesign.explorer.entity.DesignPattern;
import com.systemdesign.explorer.service.PatternService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patterns")
@RequiredArgsConstructor
public class PatternController {

    private final PatternService patternService;

    @GetMapping
    public ResponseEntity<List<DesignPattern>> getAllPatterns() {
        return ResponseEntity.ok(patternService.getAllPatterns());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DesignPattern> getPatternById(@PathVariable Long id) {
        return ResponseEntity.ok(patternService.getPatternById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DesignPattern> createPattern(@RequestBody DesignPattern pattern) {
        return ResponseEntity.ok(patternService.createPattern(pattern));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DesignPattern> updatePattern(@PathVariable Long id, @RequestBody DesignPattern pattern) {
        return ResponseEntity.ok(patternService.updatePattern(id, pattern));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePattern(@PathVariable Long id) {
        patternService.deletePattern(id);
        return ResponseEntity.ok().build();
    }
}
