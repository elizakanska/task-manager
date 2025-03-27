package com.kanskaeliza.taskmanager.service.impl;

import com.kanskaeliza.taskmanager.entity.dto.UserDTO;
import com.kanskaeliza.taskmanager.entity.User;
import com.kanskaeliza.taskmanager.mapper.UserMapper;
import com.kanskaeliza.taskmanager.repository.UserRepository;
import com.kanskaeliza.taskmanager.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UserServiceImpl implements UserService {
  private final UserRepository repository;
  private final UserMapper mapper;

  public UserServiceImpl(UserRepository repository, @Qualifier("userMapperImpl") UserMapper mapper) {
    this.repository = repository;
    this.mapper = mapper;
  }

  @Override
  public List<UserDTO> getAllUsers(String searchQuery) {
    List<User> users;
    if (searchQuery != null && !searchQuery.isEmpty()) {
      users = repository.findByUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
        searchQuery, searchQuery, searchQuery);
    } else {
      users = repository.findAll();
    }
    return users.stream().map(mapper::toUser).collect(Collectors.toList());
  }


  @Override
  public Optional<UserDTO> getUserById(Long id) {
    log.info("Looking for user with id {}.", id);
    return repository.findById(id).map(mapper::toUser);
  }

  @Override
  public UserDTO saveUser(UserDTO user) {
    if (user == null || user.getUsername().isBlank() || user.getFirstName().isBlank() || user.getLastName().isBlank()) {
      throw new IllegalArgumentException("Invalid user data");
    }

    User userDTO = mapper.toDto(user);
    userDTO = repository.save(userDTO);

    return mapper.toUser(userDTO);
  }

  @Override
  public Optional<UserDTO> editUserById(Long id, UserDTO userDTO) {
    return repository.findById(id).map(existingUser -> {
      existingUser.setUsername(userDTO.getUsername());
      existingUser.setPassword(userDTO.getPassword());
      existingUser.setFirstName(userDTO.getFirstName());
      existingUser.setLastName(userDTO.getLastName());
      User updatedUser = repository.save(existingUser);
      return mapper.toUser(updatedUser);
    });
  }

  @Override
  public void deleteUserById(Long id) {
    if (repository.existsById(id)) {
      repository.deleteById(id);
      log.info("User with id {} deleted.", id);
    } else {
      log.info("User with id {} not found.", id);
    }
  }
}
