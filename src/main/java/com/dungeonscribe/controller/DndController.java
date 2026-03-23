package com.dungeonscribe.controller;

import com.dungeonscribe.dto.MagicItemDto;
import com.dungeonscribe.dto.MonsterDto;
import com.dungeonscribe.dto.Open5eResponse;
import com.dungeonscribe.dto.SpellDto;
import com.dungeonscribe.service.DndService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dnd")
@RequiredArgsConstructor
public class DndController {

    private final DndService dndService;

    @GetMapping("/spells")
    public ResponseEntity<Open5eResponse<SpellDto>> searchSpells(
            @RequestParam(defaultValue = "") String search) {
        return ResponseEntity.ok(dndService.searchSpells(search));
    }

    @GetMapping("/monsters")
    public ResponseEntity<Open5eResponse<MonsterDto>> searchMonsters(
            @RequestParam(defaultValue = "") String search) {
        return ResponseEntity.ok(dndService.searchMonsters(search));
    }

    @GetMapping("/items")
    public ResponseEntity<Open5eResponse<MagicItemDto>> searchMagicItems(
            @RequestParam(defaultValue = "") String search) {
        return ResponseEntity.ok(dndService.searchMagicItems(search));
    }
}
