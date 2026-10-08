package com.codelabx.practical;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PracticeQuestionRepository extends JpaRepository<PracticeQuestion, Long> {
    List<PracticeQuestion> findByPracticalIdOrderBySortOrderAsc(Long practicalId);
    void deleteByPracticalId(Long practicalId);
}
