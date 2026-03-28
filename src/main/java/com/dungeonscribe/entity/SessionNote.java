package com.dungeonscribe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "session_notes")
@Getter
@Setter
@NoArgsConstructor
public class SessionNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private Integer sessionNumber;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDateTime sessionDate;

    @Column(length = 5000)
    private String summary;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @PrePersist
    protected void onCreate(){
        createdAt= LocalDateTime.now();
    }
}
