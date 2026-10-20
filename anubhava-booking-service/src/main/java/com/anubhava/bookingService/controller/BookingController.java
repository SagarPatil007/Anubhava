package com.anubhava.bookingService.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
import com.anubhava.commonModule.common.ApiResponse;
import com.anubhava.commonModule.domain.BookingDomain;
import com.anubhava.bookingService.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/booking")
@RequiredArgsConstructor
public class BookingController {

	private final BookingService bookingService;

	@PostMapping
	public ResponseEntity<ApiResponse> createBooking(@RequestBody @Valid BookingDomain bookingDomain) {
		return ResponseEntity.ok(bookingService.createBooking(bookingDomain));
	}

	@GetMapping
	public ResponseEntity<ApiResponse> getBookings(@RequestParam String email) {
		return ResponseEntity.ok(bookingService.getBookingsByEmail(email));
	}

}
