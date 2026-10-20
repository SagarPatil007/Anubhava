package com.anubhava.bookingService.service;

import com.anubhava.commonModule.common.ApiResponse;
import com.anubhava.commonModule.domain.BookingDomain;

public interface BookingService {

	ApiResponse createBooking(BookingDomain bookingDomain);

	ApiResponse getBookingsByEmail(String email);

}
