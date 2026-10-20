package com.anubhava.eventService.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "anb_events")
public class EventEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long eventId;
	@Column(nullable = false)
	private String eventName;
	@Column(nullable = false)
	private String eventType;
	@Column(nullable = false)
	private LocalDate startDate;
	@Column(nullable = false)
	private LocalDate endDate;
	@Column(nullable = false)
	private LocalTime startTime;
	@Column(nullable = false)
	private LocalTime endTime;
	private boolean paid;
	private BigDecimal price;
	@Column(name = "thumbnail_url", columnDefinition = "TEXT")
	private String thumbnailUrl;

	@ElementCollection
	@CollectionTable(name = "anb_event_images", joinColumns = @JoinColumn(name = "event_id"))
	@Column(name = "image_url", columnDefinition = "TEXT")
	private List<String> imageUrls = new ArrayList<>();

	@Column(length = 4000)
	private String description;
	private String venue;
	private String city;
	private Long organizerId;
	private Integer capacity;
	private String status = "DRAFT";
	private LocalDateTime createdAt = LocalDateTime.now();
	private LocalDateTime updatedAt;
}