package com.kanskaeliza.taskmanager.entity;

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
  private String type;
  private String status;
  private Date createdOn;
}
