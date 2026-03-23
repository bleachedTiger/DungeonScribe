package com.dungeonscribe.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("armor_class")
    private int armorClass;

    @JsonProperty("armor_desc")
    private String armorDesc;

    @JsonProperty("hit_points")
    private int hitPoints;

    @JsonProperty("hit_dice")
    private String hitDice;

    @JsonProperty("challenge_rating")
    private String challengeRating;

    // Ability scores
    private int strength;
    private int dexterity;
    private int constitution;
    private int intelligence;
    private int wisdom;
    private int charisma;

    // Saving throws
    @JsonProperty("strength_save")
    private Integer strengthSave;

    @JsonProperty("dexterity_save")
    private Integer dexteritySave;

    @JsonProperty("constitution_save")
    private Integer constitutionSave;

    @JsonProperty("intelligence_save")
    private Integer intelligenceSave;

    @JsonProperty("wisdom_save")
    private Integer wisdomSave;

    @JsonProperty("charisma_save")
    private Integer charismaSave;

    // Damage modifiers
    @JsonProperty("damage_vulnerabilities")
    private String damageVulnerabilities;

    @JsonProperty("damage_resistances")
    private String damageResistances;

    @JsonProperty("damage_immunities")
    private String damageImmunities;

    @JsonProperty("condition_immunities")
    private String conditionImmunities;

    // Speed is an object e.g. { "walk": 30, "fly": 60 }
    private Map<String, Object> speed;

    // Actions and abilities are arrays of objects
    private List<Map<String, String>> actions;

    @JsonProperty("special_abilities")
    private List<Map<String, String>> specialAbilities;

    @JsonProperty("legendary_actions")
    private List<Map<String, String>> legendaryActions;

    @JsonAlias("document__title")
    private String documentTitle;

    @JsonAlias("document__url")
    private String documentUrl;
}
