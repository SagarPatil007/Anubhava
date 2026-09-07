package com.anubhava.authService.service;


import com.anubhava.commonModule.auth.LoginRequest;
import com.anubhava.commonModule.auth.SignupRequest;
import com.anubhava.commonModule.common.ApiResponse;

public interface AuthService {

	ApiResponse login(LoginRequest request);

	ApiResponse signup(SignupRequest request);
}
