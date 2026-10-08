package com.codelabx.submission;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByStudentIdOrderBySubmittedAtDesc(Long studentId);
    List<Submission> findByPracticalIdOrderBySubmittedAtDesc(Long practicalId);
    Optional<Submission> findFirstByStudentIdAndPracticalIdOrderBySubmittedAtDesc(Long studentId, Long practicalId);
    List<Submission> findAllByOrderBySubmittedAtDesc();
}
