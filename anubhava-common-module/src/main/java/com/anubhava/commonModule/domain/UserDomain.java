package com.anubhava.commonModule.domain;

import java.time.LocalDateTime;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * The Class UserDomain.
 */
@Data
public class UserDomain {

	/** The user id. */
	private Long userId;

	/** The first name. */
	@NotBlank(message = "First name is required")
	@Size(min = 2, max = 80, message = "First name must be between 2 and 80 characters")
	@Pattern(regexp = "^[\\p{L}][\\p{L} .'-]*$", message = "First name contains invalid characters")
	private String firstName;

	/** The last name. */
	@NotBlank(message = "Last name is required")
	@Size(min = 2, max = 80, message = "Last name must be between 2 and 80 characters")
	@Pattern(regexp = "^[\\p{L}][\\p{L} .'-]*$", message = "Last name contains invalid characters")
	private String lastName;

	/** The email. */
	@NotBlank(message = "Email is required")
	@Email(message = "Enter a valid email address")
	@Size(max = 254, message = "Email cannot exceed 254 characters")
	private String email;

	/** The phone number. */
	@NotBlank(message = "Phone number is required")
	@Pattern(regexp = "^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9() .-]+$", message = "Enter a valid phone number with 7 to 15 digits")
	private String phoneNumber;

	/** The addresses. */
	@Valid
	private AddressDomain address;

	/** The created at. */
	private LocalDateTime createdAt;

	/** The updated at. */
	private LocalDateTime updatedAt;

	/** The active. */
	private boolean active;
}
