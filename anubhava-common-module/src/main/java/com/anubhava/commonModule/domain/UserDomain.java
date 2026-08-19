package com.anubhava.commonModule.domain;

import java.time.LocalDateTime;

import lombok.Data;

/**
 * The Class UserDomain.
 */
@Data
public class UserDomain {

	/** The user id. */
	private Long userId;

	/** The first name. */
	private String firstName;

	/** The last name. */
	private String lastName;

	/** The email. */
	private String email;

	/** The phone number. */
	private String phoneNumber;

	/** The addresses. */
	private AddressDomain address;

	/** The created at. */
	private LocalDateTime createdAt;

	/** The updated at. */
	private LocalDateTime updatedAt;

	/** The active. */
	private boolean active;
}
