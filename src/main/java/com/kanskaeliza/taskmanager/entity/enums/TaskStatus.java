package com.kanskaeliza.taskmanager.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public enum TaskStatus {
  Open("Open", "OPEN"),
  Completed("Completed", "COMPLETED"),
  WIP("WIP", "WIP"),
  Custom("Custom", "CUSTOM");

  private static final Map<String, TaskStatus> LABEL_MAP = new HashMap<>();
  private static final Map<String, TaskStatus> VALUE_MAP = new HashMap<>();

  private final String label;
  private final String value;

  static {
    for (TaskStatus status : values()) {
      LABEL_MAP.put(status.label.toLowerCase(), status);
      VALUE_MAP.put(status.value.toUpperCase(), status);
    }
  }

  TaskStatus(String label, String value) {
    this.label = label;
    this.value = value;
  }

  @JsonCreator
  public static TaskStatus fromString(String input) {
    if (input == null) {
      return Custom;
    }
    TaskStatus status = LABEL_MAP.get(input.toLowerCase());
    if (status == null) {
      status = VALUE_MAP.get(input.toUpperCase());
    }
    return status != null ? status : Custom;
  }

  @JsonValue
  public String toValue() {
    return this.value;
  }
}
