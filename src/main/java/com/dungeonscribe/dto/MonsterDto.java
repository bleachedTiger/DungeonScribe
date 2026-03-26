package com.dungeonscribe.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MonsterDto {
    private String name;
    private String size;
    private String type;
    private String subtype;
    private String alignment;
    private String senses;
    private String languages;
    private String desc;

    @JsonAlias("armor_class")
    private int armorClass;

    @JsonAlias("armor_desc")
    private String armorDesc;

    @JsonAlias("hit_points")
    private int hitPoints;

    @JsonAlias("hit_dice")
    private String hitDice;

    @JsonAlias("challenge_rating")
    private String challengeRating;

    // Ability scores
    private int strength;
    private int dexterity;
    private int constitution;
    private int intelligence;
    private int wisdom;
    private int charisma;

    // Saving throws
    @JsonAlias("strength_save")
    private Integer strengthSave;

    @JsonAlias("dexterity_save")
    private Integer dexteritySave;

    @JsonAlias("constitution_save")
    private Integer constitutionSave;

    @JsonAlias("intelligence_save")
    private Integer intelligenceSave;

    @JsonAlias("wisdom_save")
    private Integer wisdomSave;

    @JsonAlias("charisma_save")
    private Integer charismaSave;

    // Damage modifiers
    @JsonAlias("damage_vulnerabilities")
    private String damageVulnerabilities;

    @JsonAlias("damage_resistances")
    private String damageResistances;

    @JsonAlias("damage_immunities")
    private String damageImmunities;

    @JsonAlias("condition_immunities")
    private String conditionImmunities;

    // Speed is an object e.g. { "walk": 30, "fly": 60 }
    private Map<String, Object> speed;

    // Actions and abilities are arrays of objects
    private List<Map<String, String>> actions;

    @JsonAlias("special_abilities")
    private List<Map<String, String>> specialAbilities;

    @JsonAlias("legendary_actions")
    private List<Map<String, String>> legendaryActions;

    @JsonAlias("document__title")
    private String documentTitle;

    @JsonAlias("document__url")
    private String documentUrl;
}
