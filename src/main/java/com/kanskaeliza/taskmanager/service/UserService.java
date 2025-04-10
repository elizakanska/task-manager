package com.kanskaeliza.taskmanager.service;

import com.kanskaeliza.taskmanager.entity.dto.UserDTO;

import java.util.List;
import java.util.Optional;

public interface UserService {

  List<UserDTO> getAllUsers(String searchQuery);

  Optional<UserDTO> getUserById(Long id);

  UserDTO createUser(UserDTO userDTO);

  UserDTO updateUser(Long id, UserDTO userDTO);

  void deleteUser(Long id);
}
