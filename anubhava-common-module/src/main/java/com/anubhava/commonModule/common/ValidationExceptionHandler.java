package com.anubhava.commonModule.common;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class ValidationExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse> handleInvalidRequest(MethodArgumentNotValidException exception) {
		final List<Error> errors = exception.getBindingResult().getFieldErrors().stream()
				.map(error -> Error.builder().field(error.getField()).message(error.getDefaultMessage()).build())
				.toList();
		return badRequest(errors);
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ApiResponse> handleConstraintViolation(ConstraintViolationException exception) {
		final List<Error> errors = exception.getConstraintViolations().stream()
				.map(violation -> Error.builder()
						.field(violation.getPropertyPath().toString())
						.message(violation.getMessage())
						.build())
				.toList();
		return badRequest(errors);
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ApiResponse> handleUnreadableRequest() {
		return badRequest(List.of(Error.builder()
				.field("request")
				.message("Request body is malformed or contains an invalid value")
				.build()));
	}

	private ResponseEntity<ApiResponse> badRequest(List<Error> errors) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ApiResponse(false, "Request validation failed", null, LocalDate.now(), errors));
	}
}
