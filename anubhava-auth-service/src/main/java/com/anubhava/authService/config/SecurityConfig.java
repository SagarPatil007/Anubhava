package com.anubhava.authService.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.client.RestClient;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;

@Configuration
public class SecurityConfig {

	@Value("${keycloak.server-url}")
	private String keycloakServerUrl;

	@Value("${keycloak.admin-realm:master}")
	private String adminRealm;

	@Value("${keycloak.admin-username:admin}")
	private String adminUsername;

	@Value("${keycloak.admin-password:admin}")
	private String adminPassword;

	@Bean
	RestClient restClient(RestClient.Builder builder) {
		return builder.build();
	}

	@Bean
	Keycloak keycloakAdminClient() {
		return KeycloakBuilder.builder()
				.serverUrl(keycloakServerUrl)
				.realm(adminRealm)
				.grantType(OAuth2Constants.PASSWORD)
				.clientId("admin-cli")
				.username(adminUsername)
				.password(adminPassword)
				.build();
	}

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/api/v1/auth/**", "/actuator/health").permitAll()
						.anyRequest().authenticated())
				.build();
	}
}
