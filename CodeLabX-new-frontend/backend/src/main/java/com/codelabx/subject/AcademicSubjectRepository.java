package com.codelabx.subject;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AcademicSubjectRepository extends JpaRepository<AcademicSubject, Long> {
    List<AcademicSubject> findBySemesterOrderByNameAsc(Integer semester);
    Optional<AcademicSubject> findByCodeIgnoreCaseAndSemester(String code, Integer semester);
}
