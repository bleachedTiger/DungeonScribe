package com.dungeonscribe.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Open5eResponse<T> {
    private int count;
    private String next;
    private String previous;
    private List<T> results;
}
