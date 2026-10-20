package com.anubhava.commonModule.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {

	@NotBlank(message = "First name is required")
	@Size(min = 2, max = 80, message = "First name must be between 2 and 80 characters")
	@Pattern(regexp = "^[\\p{L}][\\p{L} .'-]*$", message = "First name contains invalid characters")
	private String firstName;

	@NotBlank(message = "Last name is required")
	@Size(min = 2, max = 80, message = "Last name must be between 2 and 80 characters")
	@Pattern(regexp = "^[\\p{L}][\\p{L} .'-]*$", message = "Last name contains invalid characters")
	private String lastName;

	@NotBlank(message = "Email is required")
	@Email(message = "Enter a valid email address")
	@Size(max = 254, message = "Email cannot exceed 254 characters")
	private String email;

	@NotBlank(message = "Phone number is required")
	@Pattern(regexp = "^(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9() .-]+$", message = "Enter a valid phone number with 7 to 15 digits")
	private String phoneNumber;

	@NotBlank(message = "Password is required")
	@Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters")
	@Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", message = "Password must contain at least one letter and one number")
	private String password;
}