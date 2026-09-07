package com.anubhava.eventService.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.anubhava.commonModule.common.ApiResponse;
import com.anubhava.commonModule.common.Error;
import com.anubhava.commonModule.domain.EventDomain;
import com.anubhava.eventService.entity.EventEntity;
import com.anubhava.eventService.repository.EventRepository;
import com.anubhava.eventService.service.EventService;

import lombok.NonNull;

@Service
public class EventServiceImpl implements EventService {

	private final EventRepository eventRepository;
	private final ModelMapper modelMapper;

	public EventServiceImpl(EventRepository eventRepository, ModelMapper modelMapper) {
		this.eventRepository = eventRepository;
		this.modelMapper = modelMapper;
	}

	@SuppressWarnings("null")
	@Override
	public ApiResponse createEvent(EventDomain eventDomain) {
		final EventEntity savedEvent = eventRepository.save(toEntity(eventDomain));
		return successResponse("Event created successfully", toDomain(savedEvent));
	}

	@Override
	public ApiResponse updateEvent(@NonNull Long eventId, EventDomain eventDomain) {
		final Optional<EventEntity> existingEvent = eventRepository.findById(eventId);
		if (existingEvent.isEmpty()) {
			return failureResponse("Event not found", "eventId");
		}

		final EventEntity event = existingEvent.get();
		updateEntity(event, eventDomain);
		event.setUpdatedAt(LocalDateTime.now());
		return successResponse("Event updated successfully", toDomain(eventRepository.save(event)));
	}

	@Override
	public ApiResponse deleteEvent(@NonNull Long eventId) {
		if (!eventRepository.existsById(eventId)) {
			return failureResponse("Event not found", "eventId");
		}

		eventRepository.deleteById(eventId);
		return successResponse("Event deleted successfully", null);
	}

	@Override
	public ApiResponse getEvent(@NonNull Long eventId) {
		final Optional<EventEntity> event = eventRepository.findById(eventId);
		if (event.isEmpty()) {
			return failureResponse("Event not found", "eventId");
		}
		return successResponse("Event retrieved successfully", toDomain(event.get()));
	}

	@Override
	public ApiResponse listEvents(LocalDate startDate, LocalDate endDate, String eventType, String city, Boolean paid) {
		return successResponse("Events retrieved successfully", eventRepository
				.findEvents(startDate, endDate, eventType, city, paid).stream().map(this::toDomain).toList());
	}

	private EventEntity toEntity(@NonNull EventDomain domain) {
		return modelMapper.map(domain, EventEntity.class);
	}

	private void updateEntity(EventEntity entity, EventDomain domain) {
		modelMapper.map(domain, entity);
	}

	private EventDomain toDomain(EventEntity entity) {
		return modelMapper.map(entity, EventDomain.class);
	}

	private ApiResponse successResponse(String message, Object data) {
		return new ApiResponse(true, message, data, LocalDate.now(), null);
	}

	private ApiResponse failureResponse(String message, String field) {
		final Error error = Error.builder().field(field).message(message).build();
		return new ApiResponse(false, message, null, LocalDate.now(), List.of(error));
	}
}
