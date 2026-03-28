package com.dungeonscribe.controller;

import com.dungeonscribe.dto.SessionNoteRequest;
import com.dungeonscribe.dto.SessionNoteResponse;
import com.dungeonscribe.service.SessionNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/campaigns/{campaignId}/sessions")
@RequiredArgsConstructor
public class SessionNoteController {

    private final SessionNoteService sessionNoteService;

    @GetMapping
    public ResponseEntity<List<SessionNoteResponse>> getSessions(
            @PathVariable Long campaignId) {
        return ResponseEntity.ok(sessionNoteService.getSessions(campaignId));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<SessionNoteResponse> getSession(
            @PathVariable Long campaignId,
            @PathVariable Long sessionId) {
        return ResponseEntity.ok(sessionNoteService.getSession(campaignId, sessionId));
    }

    @PostMapping
    public ResponseEntity<SessionNoteResponse> createSession(
            @PathVariable Long campaignId,
            @RequestBody SessionNoteRequest request) {
        return ResponseEntity.ok(sessionNoteService.createSession(campaignId, request));
    }

    @PutMapping("/{sessionId}")
    public ResponseEntity<SessionNoteResponse> updateSession(
            @PathVariable Long campaignId,
            @PathVariable Long sessionId,
            @RequestBody SessionNoteRequest request) {
        return ResponseEntity.ok(
                sessionNoteService.updateSession(campaignId, sessionId, request));
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteSession(
            @PathVariable Long campaignId,
            @PathVariable Long sessionId) {
        sessionNoteService.deleteSession(campaignId, sessionId);
        return ResponseEntity.noContent().build();
    }
}