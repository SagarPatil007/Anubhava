package com.anubhava.bookingService.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "anb_bookings")
public class BookingEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long bookingId;

	private Long eventId;
	private String name;
	private String email;
	private String phone;
	private Integer quantity;

	@Column(length = 2000)
	private String note;

	private String status = "CONFIRMED";
	private LocalDateTime createdAt = LocalDateTime.now();
}