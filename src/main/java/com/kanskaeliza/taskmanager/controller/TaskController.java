package com.kanskaeliza.taskmanager.controller;

import com.kanskaeliza.taskmanager.entity.dto.TaskDTO;
import com.kanskaeliza.taskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("/api")
@RequiredArgsConstructor
@RestController
public class TaskController {
  private final TaskService service;

  @GetMapping("/tasks")
  public ResponseEntity<List<TaskDTO>> getAllTasks() {
    return ResponseEntity.ok(service.getAllTasks());
  }

  @GetMapping("/tasks/{id}")
  public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
    return service.getTaskById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/tasks")
  public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskdto) {
    if (taskdto == null) {
      return ResponseEntity.badRequest().build();
    }
    TaskDTO savedTaskDTO = service.saveTask(taskdto);
    return ResponseEntity.status(201).body(savedTaskDTO);
  }

  @PutMapping("/tasks/{id}")
  public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskdto) {
    if (taskdto == null) {
      return ResponseEntity.badRequest().build();
    }
    return service.editTaskById(id, taskdto)
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
  public ResponseEntity<TaskDTO> updateTaskStatus(@PathVariable Long id, @RequestBody Map<String, String> task) {
    String statusValue = task.get("status");
    if (statusValue == null) {
      return ResponseEntity.badRequest().build();
    }

    String status = statusValue.toUpperCase();

    return service.changeStatus(id, status)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/task-types")
  public ResponseEntity<List<String>> getTaskTypes() {
    List<String> types = service.getTaskTypes();
    return ResponseEntity.ok(types);
  }

  @GetMapping("/task-statuses")
  public ResponseEntity<List<String>> getTaskStatuses() {
    List<String> statuses = service.getTaskStatuses();
    return ResponseEntity.ok(statuses);
  }

}
