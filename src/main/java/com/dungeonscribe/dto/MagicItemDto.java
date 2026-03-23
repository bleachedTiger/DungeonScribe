package com.dungeonscribe.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MagicItemDto {
    private String name;
    private String desc;
    private String type;
    private String rarity;

    @JsonAlias("document__title")
    private String documentTitle;

    @JsonAlias("document__url")
    private String documentUrl;
}