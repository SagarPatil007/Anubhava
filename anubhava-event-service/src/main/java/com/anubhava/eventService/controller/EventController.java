package com.anubhava.eventService.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anubhava.commonModule.common.ApiResponse;
import com.anubhava.commonModule.domain.EventDomain;
import com.anubhava.eventService.service.EventService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/event")
@RequiredArgsConstructor
public class EventController {

	private final EventService eventService;

	@PostMapping("/create")
	public ResponseEntity<ApiResponse> createEvent(@RequestBody EventDomain eventDomain){
		return ResponseEntity.ok(eventService.createEvent(eventDomain));
	}

}
