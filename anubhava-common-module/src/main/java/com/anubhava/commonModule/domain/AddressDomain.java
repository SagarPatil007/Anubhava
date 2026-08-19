package com.anubhava.commonModule.domain;

import lombok.Data;

@Data
public class AddressDomain {

	/** The address line. */
	private String addressLine;

	/** The city. */
	private String city;

	/** The state. */
	private String state;

	/** The country. */
	private String country;

	/** The zip code. */
	private String zipCode;
}
