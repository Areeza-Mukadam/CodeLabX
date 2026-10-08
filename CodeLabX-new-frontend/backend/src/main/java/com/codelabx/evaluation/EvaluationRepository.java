package com.codelabx.evaluation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    Optional<Evaluation> findBySubmissionId(Long submissionId);
    long countByCodeMarksIsNull();
}
