package com.anubhava.commonModule.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class EventDomain {

	private Long eventId;

	@NotBlank(message = "Event name is mandatory")
	private String eventName;

	@NotBlank(message = "Event type is mandatory")
	private String eventType;

	@NotNull(message = "Start date is mandatory")
	private LocalDate startDate;

	@NotNull(message = "End date is mandatory")
	private LocalDate endDate;

	@NotNull(message = "Start time is mandatory")
	private LocalTime startTime;

	@NotNull(message = "End time is mandatory")
	private LocalTime endTime;

	private boolean paid;

	@DecimalMin(value = "0.0", inclusive = true, message = "Price cannot be negative")
	private BigDecimal price;

	private String thumbnailUrl;
	private List<String> imageUrls;
	private String description;
	private String venue;
	private String city;
	private Long organizerId;

	@PositiveOrZero(message = "Capacity cannot be negative")
	private Integer capacity;

	private String status;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
