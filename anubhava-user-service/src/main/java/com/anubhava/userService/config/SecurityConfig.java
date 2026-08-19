package com.anubhava.userService.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	@Bean
	ModelMapper modelMapper() {
		return new ModelMapper();
	}

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) {
		return http.csrf(csrf -> csrf.disable())
				.cors(cors -> cors.disable())
				.authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
				.build();
	}
}
