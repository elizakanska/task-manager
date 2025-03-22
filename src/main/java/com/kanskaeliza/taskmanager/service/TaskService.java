package com.kanskaeliza.taskmanager.service;

import com.kanskaeliza.taskmanager.entity.TaskStatus;
import com.kanskaeliza.taskmanager.entity.TaskType;
import com.kanskaeliza.taskmanager.entity.dto.TaskDTO;

import java.util.List;
import java.util.Optional;

public interface TaskService {
  List<TaskDTO> getAllTasks();

  Optional<TaskDTO> getTaskById(Long id);

  TaskDTO saveTask(TaskDTO taskdto);

  Optional<TaskDTO> editTaskById(Long id, TaskDTO taskdto);

  void deleteTaskById(Long id);

  List<TaskType> getTaskTypes();

  List<TaskStatus> getTaskStatuses();

  void addTaskType(TaskType taskType);

  void addTaskStatus(TaskStatus taskStatus);
}
