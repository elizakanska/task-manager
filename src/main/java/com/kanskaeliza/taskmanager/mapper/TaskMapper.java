package com.kanskaeliza.taskmanager.mapper;

import com.kanskaeliza.taskmanager.entity.Task;
import com.kanskaeliza.taskmanager.entity.dto.TaskDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    @Mapping(target = "id", source = "task.id")
    TaskDTO toDto(Task task);

    @Mapping(target = "id", source = "id")
    Task toTask(TaskDTO dto);
}
