package com.kanskaeliza.taskmanager.mapper;

import com.kanskaeliza.taskmanager.entity.User;
import com.kanskaeliza.taskmanager.entity.dto.UserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
  @Mapping(target = "id", source = "user.id")
  UserDTO toDto(User user);

  @Mapping(target = "id", source = "id")
  User toUser(UserDTO dto);
}
