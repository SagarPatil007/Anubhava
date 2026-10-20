package com.anubhava.authService.service;

public class KeycloakServiceException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	private final int status;

	public KeycloakServiceException(String message, int status) {
		super(message);
		this.status = status;
	}

	public int getStatus() {
		return status;
	}
}