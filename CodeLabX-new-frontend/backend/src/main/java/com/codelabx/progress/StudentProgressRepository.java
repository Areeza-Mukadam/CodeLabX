package com.codelabx.progress;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentProgressRepository extends JpaRepository<StudentProgress, Long> {
    Optional<StudentProgress> findByStudentIdAndPracticalId(Long studentId, Long practicalId);
    List<StudentProgress> findByStudentId(Long studentId);
    List<StudentProgress> findByPracticalId(Long practicalId);
    long countByPracticalIdAndStatus(Long practicalId, ProgressStatus status);
}
