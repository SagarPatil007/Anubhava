package com.anubhava.authService.service.impl;

import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.Test;

import com.anubhava.commonModule.common.ApiResponse;

import tools.jackson.databind.ObjectMapper;

class ApiResponseDeserializationTest {

	@Test
	void shouldDeserializeErrorsFromApiResponse() throws Exception {
		final String json = """
				{
				  "success": false,
				  "message": "An account with this email already exists",
				  "errors": [
				    {
				      "field": "email",
				      "message": "An account with this email already exists"
				    }
				  ]
				}
				""";

		final ApiResponse response = new ObjectMapper().readValue(json, ApiResponse.class);

		assertFalse(response.isSuccess());
	}
}
