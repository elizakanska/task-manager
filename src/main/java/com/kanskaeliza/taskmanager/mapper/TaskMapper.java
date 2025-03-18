package com.kanskaeliza.taskmanager.mapper;

import com.kanskaeliza.taskmanager.entity.dto.TaskDTO;
import com.kanskaeliza.taskmanager.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    @Mapping(target = "id", source = "task.id")
    Task fromDto(TaskDTO taskdto);

    @Mapping(target = "id", source = "id")
    TaskDTO fromTask(Task task);
}
