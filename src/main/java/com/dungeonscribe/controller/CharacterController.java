package com.dungeonscribe.controller;

import com.dungeonscribe.dto.CharacterRequest;
import com.dungeonscribe.dto.CharacterResponse;
import com.dungeonscribe.service.CharacterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns/{campaignId}/characters")
@RequiredArgsConstructor
public class CharacterController {

    private final CharacterService characterService;

    @PostMapping
    public ResponseEntity<CharacterResponse> createCharacter(
            @PathVariable Long campaignId,
            @RequestBody CharacterRequest request) {
        return ResponseEntity.ok(
                characterService.createCharacter(campaignId, request));
    }

    @GetMapping
    public ResponseEntity<List<CharacterResponse>> getCharacters(
            @PathVariable Long campaignId){
      return ResponseEntity.ok(
              characterService.getCharacters(campaignId));
    };

    @GetMapping("/{characterId}")
    public ResponseEntity<CharacterResponse> getCharacter(
            @PathVariable Long campaignId,
            @PathVariable Long characterId) {
        return ResponseEntity.ok(
                characterService.getCharacter(campaignId, characterId));
    }

    @PutMapping("/{characterId}")
    public ResponseEntity<CharacterResponse> updateCharacter(
            @PathVariable Long campaignId,
            @PathVariable Long characterId,
            @RequestBody CharacterRequest request) {
        return ResponseEntity.ok(
                characterService.updateCharacter(campaignId,characterId, request));
    }

    @DeleteMapping("/{characterId}")
    public ResponseEntity<CharacterResponse> deleteCharacter(
            @PathVariable Long campaignId,
            @PathVariable Long characterId) {
        characterService.deleteCharacter(campaignId, characterId);
        return ResponseEntity.noContent().build();
    }
}
