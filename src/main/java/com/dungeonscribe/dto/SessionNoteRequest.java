package com.dungeonscribe.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SessionNoteRequest {
    private String title;
    private LocalDateTime sessionDate;
    private String summary;
}
