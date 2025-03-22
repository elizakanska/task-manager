package com.kanskaeliza.taskmanager.controller;

import com.kanskaeliza.taskmanager.entity.dto.UserDTO;
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
  public ResponseEntity<List<UserDTO>> getAllUsers() {
    return ResponseEntity.ok(service.getAllUsers());
  }

  @GetMapping("/users/{id}")
  public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
    return service.getUserById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/users")
  public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
    if (userDTO == null) {
      return ResponseEntity.badRequest().build();
    }
    UserDTO savedUserDTO = service.saveUser(userDTO);
    return ResponseEntity.status(201).body(savedUserDTO);
  }

  @PutMapping("/users/{id}")
  public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
    if (userDTO == null) {
      return ResponseEntity.badRequest().build();
    }
    return service.editUserById(id, userDTO)
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
