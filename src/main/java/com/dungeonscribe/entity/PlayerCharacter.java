package com.dungeonscribe.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="characters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerCharacter {

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false, foreignKey = @ForeignKey(foreignKeyDefinition = "FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE"))
    private Campaign campaign;
}
