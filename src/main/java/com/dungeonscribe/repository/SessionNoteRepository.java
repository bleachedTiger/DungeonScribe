package com.dungeonscribe.repository;

import com.dungeonscribe.entity.Campaign;
import com.dungeonscribe.entity.SessionNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionNoteRepository extends JpaRepository<SessionNote, Long>  {

    List<SessionNote> findByCampaignOrderBySessionNumberAsc(Campaign campaign);

    Optional<SessionNote> findByIdAndCampaign(Long id, Campaign campaign);

    Integer countByCampaign(Campaign campaign);
}
