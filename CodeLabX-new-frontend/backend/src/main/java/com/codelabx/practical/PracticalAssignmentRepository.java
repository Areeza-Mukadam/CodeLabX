package com.codelabx.practical;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PracticalAssignmentRepository extends JpaRepository<PracticalAssignment, Long> {
    List<PracticalAssignment> findByStudentId(Long studentId);
    List<PracticalAssignment> findByClassSection(String classSection);
    Optional<PracticalAssignment> findByPracticalIdAndClassSection(Long practicalId, String classSection);
    Optional<PracticalAssignment> findByPracticalIdAndClassSectionAndClassDepartment(Long practicalId, String classSection, String classDepartment);
    List<PracticalAssignment> findByPracticalId(Long practicalId);
    Optional<PracticalAssignment> findByPracticalIdAndStudentId(Long practicalId, Long studentId);
    long countByPracticalId(Long practicalId);
    boolean existsByPracticalIdAndStudentId(Long practicalId, Long studentId);
}
