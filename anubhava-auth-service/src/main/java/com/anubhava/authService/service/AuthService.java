package com.anubhava.authService.service;


import com.anubhava.commonModule.auth.ForgotPasswordRequest;
import com.anubhava.commonModule.auth.LoginRequest;
import com.anubhava.commonModule.auth.LogoutRequest;
import com.anubhava.commonModule.auth.SignupRequest;
import com.anubhava.commonModule.common.ApiResponse;

public interface AuthService {

	ApiResponse login(LoginRequest request);

	ApiResponse logout(LogoutRequest request);

	ApiResponse signup(SignupRequest request);

	ApiResponse requestPasswordReset(ForgotPasswordRequest request);
}
