package com.kanskaeliza.taskmanager.service.impl;

import com.kanskaeliza.taskmanager.entity.dto.TaskDTO;
import com.kanskaeliza.taskmanager.entity.Task;
import com.kanskaeliza.taskmanager.entity.TaskType;
import com.kanskaeliza.taskmanager.entity.TaskStatus;
import com.kanskaeliza.taskmanager.mapper.TaskMapper;
import com.kanskaeliza.taskmanager.repository.StatusRepository;
import com.kanskaeliza.taskmanager.repository.TaskRepository;
import com.kanskaeliza.taskmanager.repository.TypeRepository;
import com.kanskaeliza.taskmanager.repository.UserRepository;
import com.kanskaeliza.taskmanager.service.TaskService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class TaskServiceImpl implements TaskService {
  private final TaskRepository repository;
  private final TaskMapper mapper;
  private final StatusRepository statusRepository;
  private final TypeRepository typeRepository;
  private final UserRepository userRepository;

  public TaskServiceImpl(TaskRepository repository, @Qualifier("taskMapperImpl") TaskMapper mapper,
                         StatusRepository statusRepository, TypeRepository typeRepository, UserRepository userRepository) {
    this.repository = repository;
    this.mapper = mapper;
    this.statusRepository = statusRepository;
    this.typeRepository = typeRepository;
    this.userRepository = userRepository;
  }

  @Override
  public List<TaskDTO> getAllTasks() {
    return repository.findAll().stream()
      .map(mapper::fromTask)
      .toList();
  }

  @Override
  public Optional<TaskDTO> getTaskById(Long id) {
    log.info("Looking for task with id {}.", id);
    return repository.findById(id).map(mapper::fromTask);
  }

  @Override
  public List<TaskDTO> saveTask(TaskDTO taskdto) {
    validateTask(taskdto);

    Task task = mapper.fromDto(taskdto);
    return getTaskDTOS(taskdto, task);
  }

  private void validateTask(TaskDTO task) {
    if (task == null || task.getTitle().isBlank() || task.getDescription().isBlank() || task.getCreatedOn() == null) {
      throw new IllegalArgumentException("Invalid task data");
    }
  }

  @Override
  public List<TaskDTO> editTaskById(Long id, TaskDTO taskdto) {
    Task existingTask = repository.findById(id)
      .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));

    existingTask.setTitle(taskdto.getTitle());
    existingTask.setDescription(taskdto.getDescription());
    existingTask.setCreatedOn(taskdto.getCreatedOn());
    return getTaskDTOS(taskdto, existingTask);
  }

  private List<TaskDTO> getTaskDTOS(TaskDTO taskdto, Task existingTask) {
    existingTask.setType(typeRepository.findById(taskdto.getTypeId()).orElseThrow(() -> new IllegalArgumentException("Invalid Type ID")));
    existingTask.setStatus(statusRepository.findById(taskdto.getStatusId()).orElseThrow(() -> new IllegalArgumentException("Invalid Status ID")));
    existingTask.setAssignedTo(userRepository.findById(taskdto.getAssignedTo()).orElseThrow(() -> new IllegalArgumentException("Invalid Assigned To")));

    repository.save(existingTask);
    return getAllTasks();
  }

  @Override
  public List<TaskDTO> deleteTaskById(Long id) {
    if (!repository.existsById(id)) {
      throw new EntityNotFoundException("Task not found with id: " + id);
    }
    repository.deleteById(id);
    log.info("Task with id {} deleted.", id);
    return getAllTasks();
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
