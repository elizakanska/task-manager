package com.kanskaeliza.taskmanager.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
  private Long id;
  private String title;
  private String description;
  private String type;
  private String status;
  private Date createdOn;
}
