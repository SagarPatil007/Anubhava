package com.anubhava.commonModule.domain;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AddressDomain {

	/** The address line. */
	@Size(max = 255, message = "Address line cannot exceed 255 characters")
	private String addressLine;

	/** The city. */
	@Size(max = 100, message = "City cannot exceed 100 characters")
	private String city;

	/** The state. */
	@Size(max = 100, message = "State cannot exceed 100 characters")
	private String state;

	/** The country. */
	@Size(max = 100, message = "Country cannot exceed 100 characters")
	private String country;

	/** The zip code. */
	@Pattern(regexp = "^$|^[A-Za-z0-9 -]{3,12}$", message = "Enter a valid postal code")
	private String zipCode;
}
