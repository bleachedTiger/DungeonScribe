package com.dungeonscribe.controller;

import com.dungeonscribe.dto.CharacterRequest;
import com.dungeonscribe.dto.CharacterResponse;
import com.dungeonscribe.service.CharacterService;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class CharacterController {

    private final CharacterService characterService;

    // Independent character endpoints
    @GetMapping("/api/characters")
    public ResponseEntity<List<CharacterResponse>> getMyCharacters() {
        return ResponseEntity.ok(characterService.getMyCharacters());
    }

    @PostMapping("/api/characters")
    public ResponseEntity<CharacterResponse> createCharacter(
            @RequestBody CharacterRequest request) {
        return ResponseEntity.ok(characterService.createCharacter(request));
    }

    @GetMapping("/api/characters/{id}")
    public ResponseEntity<CharacterResponse> getCharacter(@PathVariable Long id) {
        return ResponseEntity.ok(characterService.getCharacter(id));
    }

    @PutMapping("/api/characters/{id}")
    public ResponseEntity<CharacterResponse> updateCharacter(
            @PathVariable Long id,
            @RequestBody CharacterRequest request) {
        return ResponseEntity.ok(characterService.updateCharacter(id, request));
    }

    @DeleteMapping("/api/characters/{id}")
    public ResponseEntity<Void> deleteCharacter(@PathVariable Long id) {
        characterService.deleteCharacter(id);
        return ResponseEntity.noContent().build();
    }

    // Campaign-character relationship endpoints
    @GetMapping("/api/campaigns/{campaignId}/characters")
    public ResponseEntity<List<CharacterResponse>> getCampaignCharacters(
            @PathVariable Long campaignId) {
        return ResponseEntity.ok(characterService.getCampaignCharacters(campaignId));
    }

    @PostMapping("/api/campaigns/{campaignId}/characters/{characterId}")
    public ResponseEntity<Void> addCharacterToCampaign(
            @PathVariable Long campaignId,
            @PathVariable Long characterId) {
        characterService.addCharacterToCampaign(campaignId, characterId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/campaigns/{campaignId}/characters/{characterId}")
    public ResponseEntity<Void> removeCharacterFromCampaign(
            @PathVariable Long campaignId,
            @PathVariable Long characterId) {
        characterService.removeCharacterFromCampaign(campaignId, characterId);
        return ResponseEntity.noContent().build();
    }
}