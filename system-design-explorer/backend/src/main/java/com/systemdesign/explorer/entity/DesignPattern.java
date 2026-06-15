package com.systemdesign.explorer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "design_patterns")
public class DesignPattern {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, length = 1000)
    private String pickItWhen;

    @Column(nullable = false, length = 1000)
    private String mainTradeOff;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String complexityLevel; // Low, Medium, High

    @Column(nullable = false, length = 2000)
    private String realWorldExamples;

    @Column(length = 5000)
    private String detailDescription;
}
