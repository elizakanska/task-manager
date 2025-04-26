package com.kanskaeliza.taskmanager.repository;

import com.kanskaeliza.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
  List<Task> findByTitleContainingIgnoreCaseOrDescriptionIgnoringCase(
    String title, String description);
}
