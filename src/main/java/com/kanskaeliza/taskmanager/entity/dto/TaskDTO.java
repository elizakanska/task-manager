package com.kanskaeliza.taskmanager.entity.dto;

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

  private String type;
  private String status;

  @Column(name = "created_on")
  private Date createdOn;
}
