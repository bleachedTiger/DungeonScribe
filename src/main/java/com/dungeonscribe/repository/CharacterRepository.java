package com.dungeonscribe.repository;

import com.dungeonscribe.entity.Campaign;
import com.dungeonscribe.entity.PlayerCharacter;
import com.dungeonscribe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CharacterRepository extends JpaRepository<PlayerCharacter, Long> {
    // Get all characters owned by a user
    List<PlayerCharacter> findByOwner(User owner);

    // Get a specific character owned by a user
    Optional<PlayerCharacter> findByIdAndOwner(Long id, User owner);
}
