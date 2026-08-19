package com.anubhava.commonModule.common;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Error {
	private String field;
	private String message;
}
