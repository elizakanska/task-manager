package com.kanskaeliza.taskmanager.entity;

import com.kanskaeliza.taskmanager.entity.enums.TaskStatus;
import com.kanskaeliza.taskmanager.entity.enums.TaskType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
  private Long id;
  private String title;
  private String description;
  private TaskType type;
  private TaskStatus status;
  private Date created_on;
}
