package com.codelabx.evaluation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VivaMarkRepository extends JpaRepository<VivaMark, Long> {
    List<VivaMark> findByEvaluationId(Long evaluationId);
    Optional<VivaMark> findByEvaluationIdAndVivaQuestionId(Long evaluationId, Long vivaQuestionId);
}
