package com.dungeonscribe.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CampaignResponse {
    private Long id;
    private String name;
    private String description;
    private String setting;
    private LocalDateTime createdAt;
    private String ownerUsername;
}