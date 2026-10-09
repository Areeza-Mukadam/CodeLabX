package com.codelabx.execution;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProgrammingLanguageRepository extends JpaRepository<ProgrammingLanguage,Long> {
    List<ProgrammingLanguage> findAllByOrderByNameAsc();
    List<ProgrammingLanguage> findByEnabledTrueOrderByNameAsc();
    Optional<ProgrammingLanguage> findByCodeIgnoreCase(String code);
    boolean existsByNameIgnoreCase(String name);
    boolean existsByCodeIgnoreCase(String code);
}
