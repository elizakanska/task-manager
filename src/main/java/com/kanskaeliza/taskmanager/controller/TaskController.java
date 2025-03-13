package com.kanskaeliza.taskmanager.controller;

import com.kanskaeliza.taskmanager.entity.Task;
import com.kanskaeliza.taskmanager.entity.enums.TaskStatus;
import com.kanskaeliza.taskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class TaskController {
  private final TaskService service;

  @GetMapping("/tasks")
  public ResponseEntity<List<Task>> getAllTasks() {
    return ResponseEntity.ok(service.getAllTasks());
  }

  @GetMapping("/tasks/{id}")
  public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
    return service.getTaskById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/tasks")
  public ResponseEntity<Task> createTask(@RequestBody Task task) {
    if (task == null) {
      return ResponseEntity.badRequest().build();
    }
    Task savedTask = service.saveTask(task);
    return ResponseEntity.status(201).body(savedTask);
  }

  @PutMapping("/tasks/{id}")
  public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
    if (task == null) {
      return ResponseEntity.badRequest().build();
    }
    return service.editTaskById(id, task)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/tasks/{id}")
  public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
    if (service.getTaskById(id).isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    service.deleteTaskById(id);
    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/tasks/{id}/status")
  public ResponseEntity<Task> updateTaskStatus(@PathVariable Long id, @RequestBody Map<String, String> task) {
    String statusValue = task.get("status");
    if (statusValue == null) {
      return ResponseEntity.badRequest().build();
    }
    TaskStatus status;
    try {
      status = TaskStatus.valueOf(statusValue.toUpperCase());
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().build();
    }
    return service.changeStatus(id, status)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }
}
