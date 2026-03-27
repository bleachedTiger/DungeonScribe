package com.dungeonscribe.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="characters")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PlayerCharacter {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String characterClass;

    @Column(nullable = false)
    private String race;

    @Column
    private Integer level;

    @Column(length = 2000)
    private String backstory;

    // Owner relationship - character belongs to a user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    // ManyToMany with campaigns
    @ManyToMany(mappedBy = "characters")
    private Set<Campaign> campaigns = new HashSet<>();
}
