package com.kanskaeliza.taskmanager.entity;

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
public class Task {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;
  private String description;

  @ManyToOne
  @JoinColumn(name = "type_id")
  private TaskType type;

  @ManyToOne
  @JoinColumn(name = "status_id")
  private TaskStatus status;

  @ManyToOne
  @JoinColumn(name = "assignedto")
  private User assignedTo;

  @Column(name = "created_on")
  private Date createdOn;
}
