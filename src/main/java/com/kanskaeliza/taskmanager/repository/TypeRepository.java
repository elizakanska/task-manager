package com.kanskaeliza.taskmanager.repository;

import com.kanskaeliza.taskmanager.entity.TaskType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeRepository extends JpaRepository<TaskType, Long> {
  boolean existsByNameIgnoreCase(String name);
}
