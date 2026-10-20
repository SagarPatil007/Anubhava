package com.anubhava.eventService.controller;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anubhava.commonModule.common.ApiResponse;
import com.anubhava.commonModule.domain.EventDomain;
import com.anubhava.eventService.service.EventService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/event")
@RequiredArgsConstructor
public class EventController {

	private final EventService eventService;

	@PostMapping("/create")
	public ResponseEntity<ApiResponse> createEvent(@RequestBody @Valid EventDomain eventDomain){
		return ResponseEntity.ok(eventService.createEvent(eventDomain));
	}

	@PutMapping("/{eventId}")
	public ResponseEntity<ApiResponse> updateEvent(@PathVariable @NotNull Long eventId,
			@RequestBody @Valid EventDomain eventDomain) {
		return ResponseEntity.ok(eventService.updateEvent(eventId, eventDomain));
	}

	@DeleteMapping("/{eventId}")
	public ResponseEntity<ApiResponse> deleteEvent(@PathVariable @NotNull Long eventId) {
		return ResponseEntity.ok(eventService.deleteEvent(eventId));
	}

	@GetMapping("/{eventId}")
	public ResponseEntity<ApiResponse> getEvent(@PathVariable @NotNull Long eventId) {
		return ResponseEntity.ok(eventService.getEvent(eventId));
	}

	@GetMapping
	public ResponseEntity<ApiResponse> listEvents(
			@RequestParam(required = false) Long organizerId,
			@RequestParam(required = false) LocalDate startDate,
			@RequestParam(required = false) LocalDate endDate,
			@RequestParam(required = false) String eventType,
			@RequestParam(required = false) String city,
			@RequestParam(required = false) Boolean paid) {
		if (organizerId != null) {
			return ResponseEntity.ok(eventService.listEventsByOrganizer(organizerId));
		}
		return ResponseEntity.ok(eventService.listEvents(startDate, endDate, eventType, city, paid));
	}

}
