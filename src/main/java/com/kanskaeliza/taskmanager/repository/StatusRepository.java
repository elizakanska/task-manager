package com.kanskaeliza.taskmanager.repository;

import com.kanskaeliza.taskmanager.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatusRepository extends JpaRepository<TaskStatus, Long> {
  boolean existsByNameIgnoreCase(String name);
}
