package com.codelabx.practical;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PracticalRepository extends JpaRepository<Practical, Long> {
    List<Practical> findByStatusOrderByCreatedAtDesc(PracticalStatus status);
    List<Practical> findAllByOrderByUpdatedAtDesc();
    java.util.Optional<Practical> findByTitleIgnoreCase(String title);
}
