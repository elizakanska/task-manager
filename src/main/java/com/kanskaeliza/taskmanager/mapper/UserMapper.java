package com.kanskaeliza.taskmanager.mapper;

import com.kanskaeliza.taskmanager.entity.dto.UserDTO;
import com.kanskaeliza.taskmanager.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
  //@Mapping(target = "id", source = "user.id")
  User toDto(UserDTO userDTO);

  //@Mapping(target = "id", source = "id")
  UserDTO toUser(User dto);
}
