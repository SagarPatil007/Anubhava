package com.anubhava.bookingService.service.impl;

import java.time.LocalDate;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.anubhava.bookingService.entity.BookingEntity;
import com.anubhava.bookingService.repository.BookingRepository;
import com.anubhava.bookingService.service.BookingService;
import com.anubhava.commonModule.common.ApiResponse;
import com.anubhava.commonModule.domain.BookingDomain;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

	private final BookingRepository bookingRepository;
	private final ModelMapper modelMapper;

	@Override
	public ApiResponse createBooking(BookingDomain bookingDomain) {
		final BookingEntity entity = modelMapper.map(bookingDomain, BookingEntity.class);
		entity.setStatus("CONFIRMED");
		if (entity.getCreatedAt() == null) {
			entity.setCreatedAt(java.time.LocalDateTime.now());
		}
		return success("Booking created successfully", modelMapper.map(bookingRepository.save(entity), BookingDomain.class));
	}

	@Override
	public ApiResponse getBookingsByEmail(String email) {
		return success("Bookings retrieved successfully", bookingRepository.findByEmailOrderByCreatedAtDesc(email).stream().map(entity -> modelMapper.map(entity, BookingDomain.class)).toList());
	}

	private ApiResponse success(String message, Object data) {
		return new ApiResponse(true, message, data, LocalDate.now(), null);
	}

}
