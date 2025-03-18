package com.kanskaeliza.taskmanager.service;

import com.kanskaeliza.taskmanager.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
  List<User> getAllUsers();

  Optional<User> getUserById(Long id);

  User saveUser(User user);

  Optional<User> editUserById(Long id, User user);

  void deleteUserById(Long id);
}
