package com.anubhava.commonModule.domain;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserPreferenceDomain {

	private Long preferenceId;

	@NotBlank(message = "Email is required")
	@Email(message = "Enter a valid email address")
	@Size(max = 254, message = "Email cannot exceed 254 characters")
	private String email;

	@Size(max = 255, message = "Address line cannot exceed 255 characters")
	private String addressLine;

	@Size(max = 100, message = "City cannot exceed 100 characters")
	private String city;

	@Size(max = 100, message = "State cannot exceed 100 characters")
	private String state;

	@Size(max = 100, message = "Country cannot exceed 100 characters")
	private String country;

	@Size(max = 12, message = "Postal code cannot exceed 12 characters")
	@Pattern(regexp = "^(|[A-Za-z0-9 -]{3,12})$", message = "Enter a valid postal code")
	private String zipCode;

	@Size(max = 512, message = "Hobbies cannot exceed 512 characters")
	private String hobbies;

	@Size(max = 512, message = "Preferred hobbies cannot exceed 512 characters")
	private String preferredHobbies;

	@Pattern(regexp = "^(|Married|Single|Prefer not to say)$", message = "Choose a valid marital status")
	private String maritalStatus;

	@Pattern(regexp = "^(|Alcoholic|Non-alcoholic)$", message = "Choose a valid alcohol preference")
	private String alcoholPreference;

	@Pattern(regexp = "^(|Veg|Non-veg)$", message = "Choose a valid food preference")
	private String foodPreference;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;
}
