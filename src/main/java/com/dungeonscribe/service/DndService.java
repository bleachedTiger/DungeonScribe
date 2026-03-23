package com.dungeonscribe.service;

import com.dungeonscribe.dto.MagicItemDto;
import com.dungeonscribe.dto.MonsterDto;
import com.dungeonscribe.dto.Open5eResponse;
import com.dungeonscribe.dto.SpellDto;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class DndService {

    private final RestClient open5eClient;

    public Open5eResponse<SpellDto> searchSpells(String search){
        return open5eClient.get()
                .uri("/spells/?search={search}", search)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }

    public Open5eResponse<MonsterDto> searchMonsters(String search){
        return open5eClient.get()
                .uri("/monsters/?search={search}", search)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }

    public Open5eResponse<MagicItemDto> searchMagicItems(String search){
        return open5eClient.get()
                .uri("/magicitems/?search={search}", search)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }
}
