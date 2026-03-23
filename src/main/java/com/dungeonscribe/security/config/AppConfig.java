package com.dungeonscribe.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class AppConfig {

    @Bean
    public RestClient open5eClient(){
        return RestClient.builder()
                .baseUrl("https://api.open5e.com/v1")
                .build();
    }
}
