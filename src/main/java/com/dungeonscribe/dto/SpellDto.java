package com.dungeonscribe.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SpellDto {
    private String name;
    private String desc;
    private String level;
    private String school;
    private String range;
    private String duration;

    @JsonAlias("casting_time")
    private String castingTime;

    private String components;
    @JsonAlias("document__title")
    private String documentTitle;

    @JsonAlias("document__url")
    private String documentUrl;
}