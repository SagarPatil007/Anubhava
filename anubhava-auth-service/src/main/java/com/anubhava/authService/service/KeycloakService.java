package com.anubhava.authService.service;

import java.util.Map;

import com.anubhava.commonModule.auth.LoginRequest;
import com.anubhava.commonModule.auth.SignupRequest;

public interface KeycloakService {

	Map<?, ?> login(LoginRequest request);

	void logout(String refreshToken);

	void createUser(SignupRequest request);
}