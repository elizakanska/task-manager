package com.kanskaeliza.taskmanager.service.impl;

import com.kanskaeliza.taskmanager.entity.dto.UserDTO;
import com.kanskaeliza.taskmanager.entity.User;
import com.kanskaeliza.taskmanager.mapper.UserMapper;
import com.kanskaeliza.taskmanager.repository.UserRepository;
import com.kanskaeliza.taskmanager.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class UserServiceImpl implements UserService {
  private final UserRepository repository;
  private final UserMapper mapper;

  public UserServiceImpl(UserRepository repository, @Qualifier("userMapperImpl") UserMapper mapper) {
    this.repository = repository;
    this.mapper = mapper;
  }

  @Override
  public List<UserDTO> getAllUsers(String searchQuery) {
    List<User> users = searchQuery != null && !searchQuery.isEmpty()
      ? repository.findByUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
      searchQuery, searchQuery, searchQuery)
      : repository.findAll();
    return users.stream().map(mapper::toUser).toList();
  }

  @Override
  public Optional<UserDTO> getUserById(Long id) {
    return repository.findById(id).map(mapper::toUser);
  }

  @Override
  public UserDTO createUser(UserDTO userDTO) {
    validateUserDTO(userDTO);
    User newUser = mapper.toDto(userDTO);
    return mapper.toUser(repository.save(newUser));
  }

  @Override
  public UserDTO updateUser(Long id, UserDTO userDTO) {
    validateUserDTO(userDTO);
    User existingUser = repository.findById(id)
      .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

    existingUser.setUsername(userDTO.getUsername());
    existingUser.setPassword(userDTO.getPassword());
    existingUser.setFirstName(userDTO.getFirstName());
    existingUser.setLastName(userDTO.getLastName());

    return mapper.toUser(repository.save(existingUser));
  }

  @Override
  public void deleteUser(Long id) {
    if (!repository.existsById(id)) {
      throw new EntityNotFoundException("User not found with id: " + id);
    }
    repository.deleteById(id);
  }

  private void validateUserDTO(UserDTO userDTO) {
    if (userDTO == null ||
      userDTO.getUsername() == null || userDTO.getUsername().isBlank() ||
      userDTO.getFirstName() == null || userDTO.getFirstName().isBlank() ||
      userDTO.getLastName() == null || userDTO.getLastName().isBlank()) {
      throw new IllegalArgumentException("Invalid user data");
    }
  }
}
