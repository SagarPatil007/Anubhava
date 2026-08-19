package com.anubhava.userService.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
@Table(name = "anb_user_addresses")
public class AddressEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long addressId;

	@NotBlank(message = "Address line is mandatory")
	private String addressLine;

	@NotBlank(message = "City is mandatory")
	private String city;

	@NotBlank(message = "State is mandatory")
	private String state;

	@NotBlank(message = "Country is mandatory")
	private String country;

	@NotBlank(message = "Zip code is mandatory")
	private String zipCode;
}
