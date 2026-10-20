package com.anubhava.authService.service.impl;

import java.util.List;
import java.util.Map;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import com.anubhava.authService.service.KeycloakService;
import com.anubhava.authService.service.KeycloakServiceException;
import com.anubhava.commonModule.auth.LoginRequest;
import com.anubhava.commonModule.auth.SignupRequest;

import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KeycloakServiceImpl implements KeycloakService {

	private final RestClient restClient;
	private final Keycloak keycloakAdminClient;

	@Value("${keycloak.server-url}")
	private String keycloakServerUrl;

	@Value("${keycloak.realm}")
	private String realm;

	@Value("${keycloak.client-id:anubhava-web}")
	private String clientId;

	@Value("${keycloak.client-secret:}")
	private String clientSecret;

	@SuppressWarnings("null")
	@Override
	public Map<?, ?> login(LoginRequest request) {
		final MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
		form.add("grant_type", "password");
		form.add("client_id", clientId);
		form.add("username", request.getEmail());
		form.add("password", request.getPassword());
		if (!clientSecret.isBlank()) {
			form.add("client_secret", clientSecret);
		}

		return restClient.post().uri(tokenUri()).contentType(MediaType.APPLICATION_FORM_URLENCODED).body(form).retrieve().body(Map.class);
	}

	@SuppressWarnings("null")
	@Override
	public void logout(String refreshToken) {
		final MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
		form.add("client_id", clientId);
		form.add("refresh_token", refreshToken);
		if (!clientSecret.isBlank()) {
			form.add("client_secret", clientSecret);
		}

		restClient.post()
		.uri(logoutUri())
		.contentType(MediaType.APPLICATION_FORM_URLENCODED)
		.body(form)
		.retrieve()
		.toBodilessEntity();
	}

	@Override
	public void createUser(SignupRequest request) {
		final UserRepresentation keycloakUser = new UserRepresentation();
		keycloakUser.setUsername(request.getEmail());
		keycloakUser.setEmail(request.getEmail());
		keycloakUser.setFirstName(request.getFirstName());
		keycloakUser.setLastName(request.getLastName());
		keycloakUser.setEnabled(true);

		final CredentialRepresentation password = new CredentialRepresentation();
		password.setType(CredentialRepresentation.PASSWORD);
		password.setValue(request.getPassword());
		password.setTemporary(false);
		keycloakUser.setCredentials(List.of(password));

		try (Response response = keycloakAdminClient.realm(realm).users().create(keycloakUser)) {
			if (response.getStatusInfo().getFamily() != Response.Status.Family.SUCCESSFUL) {
				throw new KeycloakServiceException(
						"Keycloak user creation failed with HTTP status " + response.getStatus(),
						response.getStatus());
			}
		}
	}

	private String tokenUri() {
		return keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";
	}

	private String logoutUri() {
		return keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/logout";
	}

}