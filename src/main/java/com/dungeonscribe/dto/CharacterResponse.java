package com.dungeonscribe.dto;

import lombok.Data;

@Data
public class CharacterResponse {
    private Long id;
    private String name;
    private String characterClass;
    private String race;
    private Integer level;
    private String backstory;
    private String ownerUsername;
}