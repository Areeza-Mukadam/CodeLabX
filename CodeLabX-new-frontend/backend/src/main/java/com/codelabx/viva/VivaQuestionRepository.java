package com.codelabx.viva;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VivaQuestionRepository extends JpaRepository<VivaQuestion, Long> {
    List<VivaQuestion> findByPracticalIdOrderBySortOrderAsc(Long practicalId);
    void deleteByPracticalId(Long practicalId);
}
