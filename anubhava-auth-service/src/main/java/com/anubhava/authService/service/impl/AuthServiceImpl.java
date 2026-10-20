package com.anubhava.authService.service.impl;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import com.anubhava.authService.service.AuthService;
import com.anubhava.authService.service.KeycloakService;
import com.anubhava.authService.service.KeycloakServiceException;
import com.anubhava.commonModule.auth.ForgotPasswordRequest;
import com.anubhava.commonModule.auth.LoginRequest;
import com.anubhava.commonModule.auth.LogoutRequest;
import com.anubhava.commonModule.auth.SignupRequest;
import com.anubhava.commonModule.common.ApiResponse;
import com.anubhava.commonModule.common.Error;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

	private final RestClient restClient;
	private final KeycloakService keycloakService;
	private final JavaMailSender mailSender;

	@Value("${user-service.url:http://localhost:8081}")
	private String userServiceUrl;

	@Value("${app.frontend.url:http://localhost:3001}")
	private String frontendUrl;

	@Override
	public ApiResponse login(LoginRequest request) {
		try {
			final Map<?, ?> token = keycloakService.login(request);
			return success("Login successful", token);
		} catch (final RestClientResponseException exception) {
			return failure("Invalid email or password", "credentials");
		}
	}

	@Override
	public ApiResponse logout(LogoutRequest request) {
		try {
			keycloakService.logout(request.getRefreshToken());
			return success("Logout successful", null);
		} catch (final RestClientResponseException exception) {
			// An expired or already-invalid refresh token means the Keycloak session is no longer active.
			return success("Logout completed", null);
		}
	}

	@Override
	public ApiResponse signup(SignupRequest request) {
		try {
			keycloakService.createUser(request);

			final Map<String, Object> userProfile = new HashMap<>();
			userProfile.put("firstName", request.getFirstName());
			userProfile.put("lastName", request.getLastName());
			userProfile.put("email", request.getEmail());
			userProfile.put("phoneNumber", request.getPhoneNumber());
			final ApiResponse userResponse = restClient.post().uri(userServiceUrl + "/api/v1/users").contentType(MediaType.APPLICATION_JSON).body(userProfile).retrieve().body(ApiResponse.class);
			return success("Signup successful", userResponse);
		} catch (final KeycloakServiceException exception) {
			logger.warn("Keycloak rejected signup with HTTP status {}", exception.getStatus());
			if (exception.getStatus() == 409) {
				return failure("An account with this email already exists", "email");
			}
			return failure("Identity provider rejected signup (HTTP " + exception.getStatus() + ")", "signup");
		} catch (final RestClientResponseException exception) {
			logger.warn("User service rejected signup with HTTP status {}", exception.getStatusCode().value());
			return failure("User profile creation failed (HTTP " + exception.getStatusCode().value() + ")", "signup");
		}
	}

	@Override
	public ApiResponse requestPasswordReset(ForgotPasswordRequest request) {
		final String email = request.getEmail();
		if (email == null || email.isBlank()) {
			return failure("Email is required", "email");
		}

		try {
			final ApiResponse userResponse = restClient.get()
					.uri(userServiceUrl + "/api/v1/users/email?email={email}", email)
					.retrieve()
					.body(ApiResponse.class);

			if (userResponse != null && userResponse.isSuccess()) {
				sendPasswordResetEmail(email);
			}
		} catch (final RestClientResponseException exception) {
			return success("If an account exists, a reset email has been sent.", null);
		}

		return success("If an account exists, a reset email has been sent.", null);
	}

	@SuppressWarnings("null")
	private void sendPasswordResetEmail(String email) {
		final String resetLink = frontendUrl + "/reset-password?email=" + URLEncoder.encode(email, StandardCharsets.UTF_8);
		final SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(email);
		message.setSubject("Reset your Anubhava password");
		message.setText("Hi,\n\nWe received a request to reset your Anubhava password.\n\nClick the link below to continue:\n" + resetLink + "\n\nIf you did not request this, you can safely ignore this email.\n\nThanks,\nAnubhava Team");
		mailSender.send(message);
	}

	private ApiResponse success(String message, Object data) {
		return new ApiResponse(true, message, data, LocalDate.now(), null);
	}

	private ApiResponse failure(String message, String field) {
		return new ApiResponse(false, message, null, LocalDate.now(),
				List.of(Error.builder().field(field).message(message).build()));
	}
}
