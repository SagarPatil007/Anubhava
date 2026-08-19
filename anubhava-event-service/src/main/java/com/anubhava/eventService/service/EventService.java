package com.anubhava.eventService.service;

import com.anubhava.commonModule.common.ApiResponse;
import com.anubhava.commonModule.domain.EventDomain;

public interface EventService {

	ApiResponse createEvent(EventDomain eventDomain);

}
