package com.kanskaeliza.taskmanager.mapper;

import com.kanskaeliza.taskmanager.entity.dto.UserDTO;
import com.kanskaeliza.taskmanager.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
  //@Mapping(target = "id", source = "user.id")
  User toUser(UserDTO userDTO);

  //@Mapping(target = "id", source = "id")
  UserDTO toDTO(User user);
}
