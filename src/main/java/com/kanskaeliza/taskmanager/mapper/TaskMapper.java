package com.kanskaeliza.taskmanager.mapper;

import com.kanskaeliza.taskmanager.entity.dto.TaskDTO;
import com.kanskaeliza.taskmanager.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskMapper {
  @Mapping(source = "type.id", target = "typeId")
  @Mapping(source = "status.id", target = "statusId")
  TaskDTO fromTask(Task task);

  @Mapping(source = "typeId", target = "type.id")
  @Mapping(source = "statusId", target = "status.id")
  Task fromDto(TaskDTO taskDTO);
}
