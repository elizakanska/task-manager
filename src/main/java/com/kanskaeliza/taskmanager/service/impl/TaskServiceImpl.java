package com.kanskaeliza.taskmanager.service.impl;

import com.kanskaeliza.taskmanager.entity.Task;
import com.kanskaeliza.taskmanager.entity.dto.TaskDTO;
import com.kanskaeliza.taskmanager.entity.enums.TaskStatus;
import com.kanskaeliza.taskmanager.repository.TaskRepository;
import com.kanskaeliza.taskmanager.service.TaskService;
import com.kanskaeliza.taskmanager.mapper.TaskMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
  private final TaskRepository repository;
  private final TaskMapper mapper;

  @Override
  public List<Task> getAllTasks() {
    List<TaskDTO> taskDTOs = repository.findAll();
    return taskDTOs.stream().map(mapper::toTask).collect(Collectors.toList());
  }

  @Override
  public Optional<Task> getTaskById(Long id) {
    log.info("Looking for task with id {}.", id);
    return repository.findById(id).map(mapper::toTask);
  }

  @Override
  public Task saveTask(Task task) {
    if (task == null || task.getTitle().isBlank() || task.getDescription().isBlank() || task.getCreated_on() == null) {
      throw new IllegalArgumentException("Invalid task data");
    }

    TaskDTO taskDTO = mapper.toDto(task);
    taskDTO = repository.save(taskDTO);

    return mapper.toTask(taskDTO);
  }

  @Override
  public Optional<Task> editTaskById(Long id, Task task) {
    return repository.findById(id).map(existingTask -> {
      existingTask.setTitle(task.getTitle());
      existingTask.setDescription(task.getDescription());
      existingTask.setCreated_on(task.getCreated_on());
      existingTask.setType(task.getType());
      existingTask.setStatus(task.getStatus());
      TaskDTO updatedTask = repository.save(existingTask);
      return mapper.toTask(updatedTask);
    });
  }

  @Override
  public void deleteTaskById(Long id) {
    if (repository.existsById(id)) {
      repository.deleteById(id);
      log.info("Task with id {} deleted.", id);
    } else {
      log.info("Task with id {} not found.", id);
    }
  }

  @Override
  public Optional<Task> changeStatus(Long id, TaskStatus status) {
    return repository.findById(id).map(existingTask -> {
      existingTask.setStatus(status);
      TaskDTO updatedTask = repository.save(existingTask);
      return mapper.toTask(updatedTask);
    });
  }
}
