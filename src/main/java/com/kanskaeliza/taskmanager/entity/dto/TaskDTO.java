package com.kanskaeliza.taskmanager.entity.dto;

import com.kanskaeliza.taskmanager.entity.enums.TaskStatus;
import com.kanskaeliza.taskmanager.entity.enums.TaskType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "tasks", schema = "taskmanager")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;
  private String description;

  @Enumerated(EnumType.STRING)
  private TaskType type;
  @Enumerated(EnumType.STRING)
  private TaskStatus status;

  @Column(name = "created_on")
  private Date createdOn;
}
