package com.kanskaeliza.taskmanager.service;

import com.kanskaeliza.taskmanager.entity.dto.UserDTO;

import java.util.List;
import java.util.Optional;

public interface UserService {

  List<UserDTO> getAllUsers(String searchQuery);

  Optional<UserDTO> getUserById(Long id);

  List<UserDTO> createUser(UserDTO userDTO);

  List<UserDTO> updateUser(Long id, UserDTO userDTO);

  List<UserDTO> deleteUser(Long id);
}
