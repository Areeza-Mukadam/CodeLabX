package com.codelabx.integrity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IntegrityEventRepository extends JpaRepository<IntegrityEvent, Long> {
    List<IntegrityEvent> findByStudentIdAndPracticalIdOrderByTimestampDesc(Long studentId, Long practicalId);
    List<IntegrityEvent> findByPracticalIdOrderByTimestampDesc(Long practicalId);
}
