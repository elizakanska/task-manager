package com.kanskaeliza.taskmanager.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public enum TaskType {
  Bug("Bug", "BUG"),
  Feature("Feature", "FEATURE"),
  Improvement("Improvement", "IMPROVEMENT"),
  Maintenance("Maintenance", "MAINTENANCE"),
  Custom("Custom", "CUSTOM");

  private static final Map<String, TaskType> LABEL_MAP = new HashMap<>();
  private static final Map<String, TaskType> VALUE_MAP = new HashMap<>();

  private final String label;
  private final String value;

  static {
    for (TaskType type : values()) {
      LABEL_MAP.put(type.label.toLowerCase(), type);
      VALUE_MAP.put(type.value.toUpperCase(), type);
    }
  }

  TaskType(String label, String value) {
    this.label = label;
    this.value = value;
  }

  @JsonCreator
  public static TaskType fromString(String input) {
    if (input == null) {
      return Custom;
    }
    TaskType type = LABEL_MAP.get(input.toLowerCase());
    if (type == null) {
      type = VALUE_MAP.get(input.toUpperCase());
    }
    return type != null ? type : Custom;
  }

  @JsonValue
  public String toValue() {
    return this.value;
  }
}
