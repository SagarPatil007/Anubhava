package com.anubhava.authService.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anubhava.authService.service.AuthService;
import com.anubhava.commonModule.auth.ForgotPasswordRequest;
import com.anubhava.commonModule.auth.LoginRequest;
import com.anubhava.commonModule.auth.LogoutRequest;
import com.anubhava.commonModule.auth.SignupRequest;
import com.anubhava.commonModule.common.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * The Class AuthController.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

	/** The auth service. */
	private final AuthService authService;

	/**
	 * Login.
	 *
	 * @param request the request
	 * @return the response entity
	 */
	@PostMapping("/login")
	public ResponseEntity<ApiResponse> login(@RequestBody @Valid LoginRequest request) {
		return ResponseEntity.ok(authService.login(request));
	}

	@PostMapping("/logout")
	public ResponseEntity<ApiResponse> logout(@RequestBody @Valid LogoutRequest request) {
		return ResponseEntity.ok(authService.logout(request));
	}

	/**
	 * Signup.
	 *
	 * @param request the request
	 * @return the response entity
	 */
	@PostMapping("/signup")
	public ResponseEntity<ApiResponse> signup(@RequestBody @Valid SignupRequest request) {
		return ResponseEntity.ok(authService.signup(request));
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<ApiResponse> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
		return ResponseEntity.ok(authService.requestPasswordReset(request));
	}

	@GetMapping("/hello")
	public ResponseEntity<String> refreshToken() {
		return ResponseEntity.ok("Hello from auth controller");
	}
}
