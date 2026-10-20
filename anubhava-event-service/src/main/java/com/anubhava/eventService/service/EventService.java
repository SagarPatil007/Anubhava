package com.anubhava.eventService.service;

import java.time.LocalDate;

import com.anubhava.commonModule.common.ApiResponse;
import com.anubhava.commonModule.domain.EventDomain;

public interface EventService {

	ApiResponse createEvent(EventDomain eventDomain);

	ApiResponse updateEvent(Long eventId, EventDomain eventDomain);

	ApiResponse deleteEvent(Long eventId);

	ApiResponse getEvent(Long eventId);

	ApiResponse listEvents(LocalDate startDate, LocalDate endDate, String eventType, String city, Boolean paid);

	ApiResponse listEventsByOrganizer(Long organizerId);

}
