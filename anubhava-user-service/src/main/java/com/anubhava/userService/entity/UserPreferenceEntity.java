package com.anubhava.userService.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "anb_user_preference")
public class UserPreferenceEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long preferenceId;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private UserEntity user;

	private String email;

	private String addressLine;

	private String city;

	private String state;

	private String country;

	private String zipCode;

	private String hobbies;

	private String preferredHobbies;

	private String maritalStatus;

	private String alcoholPreference;

	private String foodPreference;

	private LocalDateTime createdAt = LocalDateTime.now();

	private LocalDateTime updatedAt;
}
