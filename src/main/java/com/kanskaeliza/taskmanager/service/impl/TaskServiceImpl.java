package com.kanskaeliza.taskmanager.service.impl;

import com.kanskaeliza.taskmanager.entity.Task;
import com.kanskaeliza.taskmanager.entity.dto.TaskDTO;
import com.kanskaeliza.taskmanager.repository.TaskRepository;
import com.kanskaeliza.taskmanager.service.TaskService;
import com.kanskaeliza.taskmanager.mapper.TaskMapper;
import com.kanskaeliza.taskmanager.entity.enums.TaskType;
import com.kanskaeliza.taskmanager.entity.enums.TaskStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
public class TaskServiceImpl implements TaskService {
  private final TaskRepository repository;
  private final TaskMapper mapper;

  public TaskServiceImpl(TaskRepository repository, @Qualifier("taskMapperImpl") TaskMapper mapper) {
    this.repository = repository;
    this.mapper = mapper;
  }

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
    if (task == null || task.getTitle().isBlank() || task.getDescription().isBlank() || task.getCreatedOn() == null) {
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
      existingTask.setCreatedOn(task.getCreatedOn());
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
  public Optional<Task> changeStatus(Long id, String status) {
    return repository.findById(id).map(existingTask -> {
      existingTask.setStatus(String.valueOf(status));
      TaskDTO updatedTask = repository.save(existingTask);
      return mapper.toTask(updatedTask);
    });
  }

  @Override
  public List<String> getTaskTypes() {
    return Stream.of(TaskType.values())
      .map(TaskType::getLabel)
      .collect(Collectors.toList());
  }

  @Override
  public List<String> getTaskStatuses() {
    return Stream.of(TaskStatus.values())
      .map(TaskStatus::getLabel)
      .collect(Collectors.toList());
  }
}
