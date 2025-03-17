package com.kanskaeliza.taskmanager.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public enum TaskType {
  Bug("Bug"), Feature("Feature"), Improvement("Improvement"), Maintenance("Maintenance"), Custom("Custom");

  private static final Map<String, TaskType> LABEL_MAP = new HashMap<>();
  private final String label;

  static {
    for (TaskType type : values()) {
      LABEL_MAP.put(type.label.toLowerCase(), type);
    }
  }

  TaskType(String label) {
    this.label = label;
  }

  @JsonCreator
  public static TaskType fromString(String value) {
    return LABEL_MAP.getOrDefault(value.toLowerCase(), Custom);
  }

  @JsonValue
  public String toValue() {
    return this.label;
  }

}

