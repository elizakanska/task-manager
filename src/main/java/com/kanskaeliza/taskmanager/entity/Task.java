package com.kanskaeliza.taskmanager.entity;

import com.kanskaeliza.taskmanager.entity.enums.TaskStatus;
import com.kanskaeliza.taskmanager.entity.enums.TaskType;

import java.util.Date;

public class Task {
  private Long id;
  private String title;
  private String description;
  private TaskType type;
  private TaskStatus status;
  private Date created_on;
}
