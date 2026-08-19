package com.anubhava.commonModule.common;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * The Class ApiResponse.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse {

	/** The success. */
	private boolean success;

	/** The message. */
	private String message;

	/** The data. */
	private Object data;

	/** The timestamp. */
	private LocalDate timestamp;

	/** The errors. */
	private List<Error> errors;
}
