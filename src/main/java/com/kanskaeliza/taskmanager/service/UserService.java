package com.kanskaeliza.taskmanager.service;

import com.kanskaeliza.taskmanager.entity.dto.UserDTO;

import java.util.List;
import java.util.Optional;

public interface UserService {
  List<UserDTO> getAllUsers();

  Optional<UserDTO> getUserById(Long id);

  UserDTO saveUser(UserDTO userDTO);

  Optional<UserDTO> editUserById(Long id, UserDTO userDTO);

  void deleteUserById(Long id);
}
