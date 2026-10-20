package com.anubhava.authService.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.anubhava.authService.service.AuthService;
import com.anubhava.commonModule.common.ApiResponse;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private AuthService authService;

	@Test
	void forgotPasswordShouldReturnSuccessResponse() throws Exception {
		when(authService.requestPasswordReset(any())).thenReturn(
				new ApiResponse(true, "If an account exists, a reset email has been sent.", null, LocalDate.now(), null)
				);

		mockMvc.perform(post("/api/v1/auth/forgot-password")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{
						  "email": "test@example.com"
						}
						"""))
		.andExpect(status().isOk())
		.andExpect(jsonPath("$.success").value(true))
		.andExpect(jsonPath("$.message").value("If an account exists, a reset email has been sent."));
	}

	@Test
	void signupShouldReturnFieldValidationErrorsForInvalidInput() throws Exception {
		mockMvc.perform(post("/api/v1/auth/signup")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{
						  "firstName": "Luffy",
						  "lastName": "Monkey D",
						  "email": "luffymonkey.com",
						  "phoneNumber": "9662216451",
						  "password": "1234"
						}
						"""))
		.andExpect(status().isBadRequest())
		.andExpect(jsonPath("$.success").value(false))
		.andExpect(jsonPath("$.message").value("Request validation failed"))
		.andExpect(jsonPath("$.errors.length()").value(3));

		verifyNoInteractions(authService);
	}
}
