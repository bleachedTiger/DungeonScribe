package com.dungeonscribe.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SessionNoteResponse {
    private Long id;
    private Integer sessionNumber;
    private String title;
    private LocalDateTime sessionDate;
    private String summary;
    private LocalDateTime createdAt;
    private Long campaignId;
}
