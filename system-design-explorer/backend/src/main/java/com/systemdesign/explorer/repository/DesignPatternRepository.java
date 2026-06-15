package com.systemdesign.explorer.repository;

import com.systemdesign.explorer.entity.DesignPattern;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DesignPatternRepository extends JpaRepository<DesignPattern, Long> {
}
