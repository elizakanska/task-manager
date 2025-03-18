package com.kanskaeliza.taskmanager.controller;

import com.kanskaeliza.taskmanager.entity.User;
import com.kanskaeliza.taskmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api")
@RequiredArgsConstructor
@RestController
public class UserController {
  private final UserService service;

  @GetMapping("/users")
  public ResponseEntity<List<User>> getAllUsers() {
    return ResponseEntity.ok(service.getAllUsers());
  }

  @GetMapping("/users/{id}")
  public ResponseEntity<User> getUserById(@PathVariable Long id) {
    return service.getUserById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/users")
  public ResponseEntity<User> createUser(@RequestBody User user) {
    if (user == null) {
      return ResponseEntity.badRequest().build();
    }
    User savedUser = service.saveUser(user);
    return ResponseEntity.status(201).body(savedUser);
  }

  @PutMapping("/users/{id}")
  public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
    if (user == null) {
      return ResponseEntity.badRequest().build();
    }
    return service.editUserById(id, user)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/users/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    if (service.getUserById(id).isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    service.deleteUserById(id);
    return ResponseEntity.noContent().build();
  }
}
