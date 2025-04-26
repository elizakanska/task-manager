package com.kanskaeliza.taskmanager.controller;

import com.kanskaeliza.taskmanager.entity.dto.TaskDTO;
import com.kanskaeliza.taskmanager.entity.TaskType;
import com.kanskaeliza.taskmanager.entity.TaskStatus;
import com.kanskaeliza.taskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api")
@RequiredArgsConstructor
@RestController
public class TaskController {
  private final TaskService service;

  @GetMapping("/tasks")
  public ResponseEntity<List<TaskDTO>> getAllTasks(@RequestParam(required = false) String searchQuery) {
    return ResponseEntity.ok(service.getAllTasks(searchQuery));
  }

  @GetMapping("/tasks/{id}")
  public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
    return service.getTaskById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/tasks")
  public ResponseEntity<List<TaskDTO>> createTask(@RequestBody TaskDTO taskdto) {
    return ResponseEntity.ok(service.saveTask(taskdto));
  }

  @PutMapping("/tasks/{id}")
  public ResponseEntity<List<TaskDTO>> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskdto) {
    return ResponseEntity.ok(service.editTaskById(id, taskdto));
  }

  @DeleteMapping("/tasks/{id}")
  public ResponseEntity<List<TaskDTO>> deleteTask(@PathVariable Long id) {
    return ResponseEntity.ok(service.deleteTaskById(id));
  }

  @GetMapping("/task-types")
  public ResponseEntity<List<TaskType>> getTaskTypes() {
    return ResponseEntity.ok(service.getTaskTypes());
  }

  @PostMapping("/task-types")
  public ResponseEntity<List<TaskType>> addNewTaskType(@RequestBody TaskType taskType) {
    if (taskType == null || taskType.getName() == null || taskType.getName().isEmpty()) {
      return ResponseEntity.badRequest().build();
    }

    return ResponseEntity.ok(service.addTaskType(taskType));
  }

  @GetMapping("/task-statuses")
  public ResponseEntity<List<TaskStatus>> getTaskStatuses() {
    return ResponseEntity.ok(service.getTaskStatuses());
  }

  @PostMapping("/task-statuses")
  public ResponseEntity<List<TaskStatus>> addNewTaskStatus(@RequestBody TaskStatus taskStatus) {
    if (taskStatus == null || taskStatus.getName() == null || taskStatus.getName().isEmpty()) {
      return ResponseEntity.badRequest().build();
    }

        return ResponseEntity.ok(service.addTaskStatus(taskStatus));
  }
}
