package com.anubhava.commonModule.domain;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BookingDomain {

	private Long bookingId;

	@NotNull(message = "Event id is required")
	@Min(value = 1, message = "Event id must be positive")
	private Long eventId;

	@NotBlank(message = "Name is required")
	@Size(min = 2, max = 120, message = "Name must be between 2 and 120 characters")
	@Pattern(regexp = "^[\\p{L}][\\p{L} .'-]*$", message = "Name contains invalid characters")
	private String name;

	@NotBlank(message = "Email is required")
	@Email(message = "Enter a valid email address")
	@Size(max = 254, message = "Email cannot exceed 254 characters")
	private String email;

	@Pattern(regexp = "^(|(?=(?:\\D*\\d){7,15}\\D*$)\\+?[0-9() .-]+)$", message = "Enter a valid phone number with 7 to 15 digits")
	@Size(max = 24, message = "Phone number cannot exceed 24 characters")
	private String phone;

	@NotNull(message = "Number of places is required")
	@Min(value = 1, message = "At least one place is required")
	@Max(value = 100, message = "A booking cannot exceed 100 places")
	private Integer quantity;

	@Size(max = 2000, message = "Note cannot exceed 2000 characters")
	private String note;
	private String status;
	private LocalDateTime createdAt;
}