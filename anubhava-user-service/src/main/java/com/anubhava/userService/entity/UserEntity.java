package com.anubhava.userService.entity;

import java.time.LocalDateTime;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@Entity
@Table(name = "anb_users")
public class UserEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userId;

	@NotBlank(message = "First name is mandatory")
	private String firstName;

	@NotBlank(message = "Last name is mandatory")
	private String lastName;

	@NotBlank(message = "Email is mandatory")
	@Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$", message = "Invalid email format")
	private String email;

	@NotBlank(message = "Phone number is mandatory")
	@Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number format")
	private String phoneNumber;

	@OneToOne(cascade = CascadeType.ALL,  fetch = FetchType.LAZY)
	@JoinColumn(name = "addressId", referencedColumnName = "addressId")
	private AddressEntity address;

	private LocalDateTime createdAt = LocalDateTime.now();

	private LocalDateTime updatedAt;

	private boolean isActive = true;
}
