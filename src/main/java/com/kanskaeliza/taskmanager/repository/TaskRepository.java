package com.kanskaeliza.taskmanager.repository;

import com.kanskaeliza.taskmanager.entity.dto.TaskDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<TaskDTO, Long> {
}
