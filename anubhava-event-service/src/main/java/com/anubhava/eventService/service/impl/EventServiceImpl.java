package com.anubhava.eventService.service.impl;

import org.springframework.stereotype.Service;

import com.anubhava.commonModule.common.ApiResponse;
import com.anubhava.commonModule.domain.EventDomain;
import com.anubhava.eventService.service.EventService;

@Service
public class EventServiceImpl implements EventService{

	@Override
	public ApiResponse createEvent(EventDomain eventDomain) {
		return null;
	}

}
