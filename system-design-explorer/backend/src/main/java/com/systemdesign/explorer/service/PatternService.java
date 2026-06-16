package com.systemdesign.explorer.service;

import com.systemdesign.explorer.entity.DesignPattern;
import com.systemdesign.explorer.repository.DesignPatternRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatternService {

    private final DesignPatternRepository repository;

    public List<DesignPattern> getAllPatterns() {
        return repository.findAll();
    }

    public DesignPattern getPatternById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Pattern not found"));
    }

    public DesignPattern createPattern(DesignPattern pattern) {
        return repository.save(pattern);
    }

    public DesignPattern updatePattern(Long id, DesignPattern pattern) {
        DesignPattern existing = getPatternById(id);
        existing.setName(pattern.getName());
        existing.setPickItWhen(pattern.getPickItWhen());
        existing.setMainTradeOff(pattern.getMainTradeOff());
        existing.setCategory(pattern.getCategory());
        existing.setComplexityLevel(pattern.getComplexityLevel());
        existing.setRealWorldExamples(pattern.getRealWorldExamples());
        existing.setDetailDescription(pattern.getDetailDescription());
        return repository.save(existing);
    }

    public void deletePattern(Long id) {
        repository.deleteById(id);
    }
}
