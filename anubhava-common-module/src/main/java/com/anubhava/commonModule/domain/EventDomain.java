package com.anubhava.commonModule.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EventDomain {

	private Long eventId;

	@NotBlank(message = "Event name is mandatory")
	@Size(min = 3, max = 120, message = "Event name must be between 3 and 120 characters")
	private String eventName;

	@NotBlank(message = "Event type is mandatory")
	@Pattern(regexp = "Community|Talks|Wellbeing|Workshop|Gathering", message = "Choose a valid event category")
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
	@Digits(integer = 8, fraction = 2, message = "Price can have up to 8 whole digits and 2 decimal places")
	private BigDecimal price;

	@NotBlank(message = "A cover image is required")
	@Size(max = 7_000_000, message = "Cover image must be 5 MB or smaller")
	private String thumbnailUrl;

	@Size(max = 6, message = "You can add up to 6 gallery images")
	private List<@NotBlank @Size(max = 7_000_000, message = "Each gallery image must be 5 MB or smaller") String> imageUrls;

	@NotBlank(message = "Event description is required")
	@Size(max = 4000, message = "Event description cannot exceed 4000 characters")
	private String description;

	@NotBlank(message = "Venue is required")
	@Size(max = 255, message = "Venue cannot exceed 255 characters")
	private String venue;

	@NotBlank(message = "City is required")
	@Size(max = 100, message = "City cannot exceed 100 characters")
	private String city;

	@NotNull(message = "Organizer is required")
	@Positive(message = "Organizer id must be positive")
	private Long organizerId;

	@NotNull(message = "Capacity is required")
	@Positive(message = "Capacity must be greater than zero")
	@jakarta.validation.constraints.Max(value = 100000, message = "Capacity cannot exceed 100,000")
	private Integer capacity;

	private String status;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	@AssertTrue(message = "End date must be on or after start date")
	@JsonIgnore
	public boolean isDateRangeValid() {
		return startDate == null || endDate == null || !endDate.isBefore(startDate);
	}

	@AssertTrue(message = "End time must be after start time when the event is on one day")
	@JsonIgnore
	public boolean isTimeRangeValid() {
		return startDate == null || endDate == null || !startDate.equals(endDate)
				|| startTime == null || endTime == null || endTime.isAfter(startTime);
	}

	@AssertTrue(message = "Paid events must have a price greater than zero")
	@JsonIgnore
	public boolean isPaidPriceValid() {
		return !paid || (price != null && price.signum() > 0);
	}
}
