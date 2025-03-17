package com.kanskaeliza.taskmanager.service;

import com.kanskaeliza.taskmanager.entity.Task;

import java.util.List;
import java.util.Optional;

public interface TaskService {
  List<Task> getAllTasks();

  Optional<Task> getTaskById(Long id);

  Task saveTask(Task task);

  Optional<Task> editTaskById(Long id, Task task);

  void deleteTaskById(Long id);

  Optional<Task> changeStatus(Long id, String status);

  List<String> getTaskTypes();

  List<String> getTaskStatuses();
}
