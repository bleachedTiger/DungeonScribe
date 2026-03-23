package com.dungeonscribe.repository;

import com.dungeonscribe.entity.Campaign;
import com.dungeonscribe.entity.PlayerCharacter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CharacterRepository extends JpaRepository<PlayerCharacter, Long> {


    List<PlayerCharacter> findByCampaign(Campaign campaign);
    Optional<PlayerCharacter> findByIdAndCampaign(Long id, Campaign campaign);
}
