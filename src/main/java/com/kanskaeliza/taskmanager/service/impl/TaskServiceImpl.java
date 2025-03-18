package com.kanskaeliza.taskmanager.service.impl;

import com.kanskaeliza.taskmanager.entity.dto.TaskDTO;
import com.kanskaeliza.taskmanager.entity.Task;
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
  public List<TaskDTO> getAllTasks() {
    List<Task> tasks = repository.findAll();
    return tasks.stream().map(mapper::fromTask).collect(Collectors.toList());
  }

  @Override
  public Optional<TaskDTO> getTaskById(Long id) {
    log.info("Looking for task with id {}.", id);
    return repository.findById(id).map(mapper::fromTask);
  }

  @Override
  public TaskDTO saveTask(TaskDTO taskdto) {
    if (taskdto == null || taskdto.getTitle().isBlank() || taskdto.getDescription().isBlank() || taskdto.getCreatedOn() == null) {
      throw new IllegalArgumentException("Invalid task data");
    }

    Task task = mapper.fromDto(taskdto);
    task = repository.save(task);

    return mapper.fromTask(task);
  }

  @Override
  public Optional<TaskDTO> editTaskById(Long id, TaskDTO taskdto) {
    return repository.findById(id).map(existingTask -> {
      existingTask.setTitle(taskdto.getTitle());
      existingTask.setDescription(taskdto.getDescription());
      existingTask.setCreatedOn(taskdto.getCreatedOn());
      existingTask.setType(taskdto.getType());
      existingTask.setStatus(taskdto.getStatus());
      Task updatedTask = repository.save(existingTask);
      return mapper.fromTask(updatedTask);
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
  public Optional<TaskDTO> changeStatus(Long id, String status) {
    return repository.findById(id).map(existingTask -> {
      existingTask.setStatus(String.valueOf(status));
      Task updatedTask = repository.save(existingTask);
      return mapper.fromTask(updatedTask);
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
