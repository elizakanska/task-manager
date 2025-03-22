package com.kanskaeliza.taskmanager.service.impl;

import com.kanskaeliza.taskmanager.entity.dto.TaskDTO;
import com.kanskaeliza.taskmanager.entity.Task;
import com.kanskaeliza.taskmanager.entity.TaskType;
import com.kanskaeliza.taskmanager.entity.TaskStatus;
import com.kanskaeliza.taskmanager.mapper.TaskMapper;
import com.kanskaeliza.taskmanager.repository.StatusRepository;
import com.kanskaeliza.taskmanager.repository.TaskRepository;
import com.kanskaeliza.taskmanager.repository.TypeRepository;
import com.kanskaeliza.taskmanager.service.TaskService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TaskServiceImpl implements TaskService {
  private final TaskRepository repository;
  private final TaskMapper mapper;
  private final StatusRepository statusRepository;
  private final TypeRepository typeRepository;

  public TaskServiceImpl(TaskRepository repository, @Qualifier("taskMapperImpl") TaskMapper mapper,
                         StatusRepository statusRepository, TypeRepository typeRepository) {
    this.repository = repository;
    this.mapper = mapper;
    this.statusRepository = statusRepository;
    this.typeRepository = typeRepository;
  }

  @Override
  public List<TaskDTO> getAllTasks() {
    return repository.findAll().stream()
      .map(mapper::fromTask)
      .collect(Collectors.toList());
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
    task.setType(typeRepository.findById(taskdto.getTypeId()).orElseThrow(() -> new IllegalArgumentException("Invalid Type ID")));
    task.setStatus(statusRepository.findById(taskdto.getStatusId()).orElseThrow(() -> new IllegalArgumentException("Invalid Status ID")));

    task = repository.save(task);
    return mapper.fromTask(task);
  }

  @Override
  public Optional<TaskDTO> editTaskById(Long id, TaskDTO taskdto) {
    return repository.findById(id).map(existingTask -> {
      existingTask.setTitle(taskdto.getTitle());
      existingTask.setDescription(taskdto.getDescription());
      existingTask.setCreatedOn(taskdto.getCreatedOn());
      existingTask.setType(typeRepository.findById(taskdto.getTypeId()).orElseThrow(() -> new IllegalArgumentException("Invalid Type ID")));
      existingTask.setStatus(statusRepository.findById(taskdto.getStatusId()).orElseThrow(() -> new IllegalArgumentException("Invalid Status ID")));

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
  public List<TaskType> getTaskTypes() {
    return typeRepository.findAll();
  }

  @Override
  public List<TaskStatus> getTaskStatuses() {
    return statusRepository.findAll();
  }

  @Override
  public void addTaskType(TaskType taskType) {
    if (taskType == null || taskType.getName().isBlank()) {
      throw new IllegalArgumentException("Type name cannot be empty");
    }

    if (!typeRepository.existsByNameIgnoreCase(taskType.getName())) {
      typeRepository.save(taskType);
      log.info("Added new task type: {}", taskType.getName());
    }
  }

  @Override
  public void addTaskStatus(TaskStatus taskStatus) {
    if (taskStatus == null || taskStatus.getName().isBlank()) {
      throw new IllegalArgumentException("Status name cannot be empty");
    }

    if (!statusRepository.existsByNameIgnoreCase(taskStatus.getName())) {
      statusRepository.save(taskStatus);
      log.info("Added new task status: {}", taskStatus.getName());
    }
  }
}
