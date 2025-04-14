// UserController.java
package com.kanskaeliza.taskmanager.controller;

import com.kanskaeliza.taskmanager.entity.dto.UserDTO;
import com.kanskaeliza.taskmanager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
  private final UserService service;

  @GetMapping
  public ResponseEntity<List<UserDTO>> getAllUsers(@RequestParam(required = false) String searchQuery) {
    return ResponseEntity.ok(service.getAllUsers(searchQuery));
  }

  @GetMapping("/{id}")
  public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
    return service.getUserById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<List<UserDTO>> createUser(@RequestBody UserDTO userDTO) {
    List<UserDTO> updatedUsers = service.createUser(userDTO);
    return ResponseEntity.ok(updatedUsers);
  }

  @PutMapping("/{id}")
  public ResponseEntity<List<UserDTO>> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
    return ResponseEntity.ok(service.updateUser(id, userDTO));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<List<UserDTO>> deleteUser(@PathVariable Long id) {
    return ResponseEntity.ok(service.deleteUser(id));
  }
}
