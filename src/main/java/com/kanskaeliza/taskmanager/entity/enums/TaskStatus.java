package com.kanskaeliza.taskmanager.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public enum TaskStatus {
  Open("Open"), Completed("Completed"), WIP("WIP"), Custom("Custom");

  private static final Map<String, TaskStatus> LABEL_MAP = new HashMap<>();
  private final String label;

  static {
    for (TaskStatus status : values()) {
      LABEL_MAP.put(status.label.toLowerCase(), status);
    }
  }

  TaskStatus(String label) {
    this.label = label;
  }

  @JsonCreator
  public static TaskStatus fromString(String value) {
    return LABEL_MAP.getOrDefault(value.toLowerCase(), Custom);
  }

  @JsonValue
  public String toValue() {
    return this.label;
  }

}
