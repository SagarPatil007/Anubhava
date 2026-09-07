package com.anubhava.authService.service.impl;

import java.time.LocalDate;
import java.util.HashMap;
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
import org.springframework.web.client.RestClientResponseException;

import jakarta.ws.rs.core.Response;

import com.anubhava.authService.service.AuthService;
import com.anubhava.commonModule.auth.LoginRequest;
import com.anubhava.commonModule.auth.SignupRequest;
import com.anubhava.commonModule.common.ApiResponse;
import com.anubhava.commonModule.common.Error;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

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

	@Value("${user-service.url:http://localhost:8081}")
	private String userServiceUrl;

	@Override
	public ApiResponse login(LoginRequest request) {
		try {
			final MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
			form.add("grant_type", "password");
			form.add("client_id", clientId);
			form.add("username", request.getEmail());
			form.add("password", request.getPassword());
			if (!clientSecret.isBlank()) {
				form.add("client_secret", clientSecret);
			}

			final Map<?, ?> token = restClient.post()
					.uri(tokenUri(realm))
					.contentType(MediaType.APPLICATION_FORM_URLENCODED)
					.body(form)
					.retrieve()
					.body(Map.class);
			return success("Login successful", token);
		} catch (final RestClientResponseException exception) {
			return failure("Invalid email or password", "credentials");
		}
	}

	@Override
	public ApiResponse signup(SignupRequest request) {
		try {
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
					return failure("Keycloak user creation failed", "signup");
				}
			}

			final Map<String, Object> userProfile = new HashMap<>();
			userProfile.put("firstName", request.getFirstName());
			userProfile.put("lastName", request.getLastName());
			userProfile.put("email", request.getEmail());
			userProfile.put("phoneNumber", request.getPhoneNumber());
			final ApiResponse userResponse = restClient.post()
					.uri(userServiceUrl + "/api/v1/users")
					.contentType(MediaType.APPLICATION_JSON)
					.body(userProfile)
					.retrieve()
					.body(ApiResponse.class);
			return success("Signup successful", userResponse);
		} catch (final RestClientResponseException exception) {
			return failure("Signup failed", "signup");
		}
	}

	private String tokenUri(String tokenRealm) {
		return keycloakServerUrl + "/realms/" + tokenRealm + "/protocol/openid-connect/token";
	}

	private ApiResponse success(String message, Object data) {
		return new ApiResponse(true, message, data, LocalDate.now(), null);
	}

	private ApiResponse failure(String message, String field) {
		return new ApiResponse(false, message, null, LocalDate.now(),
				List.of(Error.builder().field(field).message(message).build()));
	}
}
