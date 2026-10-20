package com.anubhava.commonModule;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import org.junit.jupiter.api.Test;

import com.anubhava.commonModule.auth.SignupRequest;
import com.anubhava.commonModule.domain.BookingDomain;
import com.anubhava.commonModule.domain.EventDomain;
import com.anubhava.commonModule.domain.UserPreferenceDomain;

import jakarta.validation.Validation;
import jakarta.validation.Validator;

class ValidationModelsTest {

	private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

	@Test
	void signupRejectsMalformedEmailAndWeakPassword() {
		final SignupRequest request = new SignupRequest();
		request.setFirstName("Luffy");
		request.setLastName("Monkey D");
		request.setEmail("luffymonkey.com");
		request.setPhoneNumber("9662216451");
		request.setPassword("1234");

		final var violations = validator.validate(request);

		assertTrue(violations.stream().anyMatch(violation -> violation.getPropertyPath().toString().equals("email")));
		assertTrue(violations.stream().anyMatch(violation -> violation.getPropertyPath().toString().equals("password")));
	}

	@Test
	void bookingRejectsInvalidContactAndQuantity() {
		final BookingDomain booking = new BookingDomain();
		booking.setEventId(1L);
		booking.setName("Luffy");
		booking.setEmail("invalid-email");
		booking.setPhone("123");
		booking.setQuantity(0);

		final var violations = validator.validate(booking);

		assertTrue(violations.stream().anyMatch(violation -> violation.getPropertyPath().toString().equals("email")));
		assertTrue(violations.stream().anyMatch(violation -> violation.getPropertyPath().toString().equals("phone")));
		assertTrue(violations.stream().anyMatch(violation -> violation.getPropertyPath().toString().equals("quantity")));
	}

	@Test
	void eventAcceptsValidFieldsAndRejectsInvalidDateRange() {
		final EventDomain event = new EventDomain();
		event.setEventName("Community gathering");
		event.setEventType("Gathering");
		event.setStartDate(LocalDate.of(2026, 10, 20));
		event.setEndDate(LocalDate.of(2026, 10, 20));
		event.setStartTime(LocalTime.of(10, 0));
		event.setEndTime(LocalTime.of(12, 0));
		event.setPaid(true);
		event.setPrice(new BigDecimal("10.00"));
		event.setThumbnailUrl("data:image/png;base64,image");
		event.setDescription("A community event");
		event.setVenue("Community Hall");
		event.setCity("Pune");
		event.setOrganizerId(1L);
		event.setCapacity(50);

		assertTrue(validator.validate(event).isEmpty());

		event.setEndDate(event.getStartDate().minusDays(1));
		assertFalse(validator.validate(event).isEmpty());
	}

	@Test
	void preferencesRejectInvalidChoiceAndAcceptBlankOptionalValues() {
		final UserPreferenceDomain preferences = new UserPreferenceDomain();
		preferences.setEmail("user@example.com");
		preferences.setMaritalStatus("unknown");
		assertFalse(validator.validate(preferences).isEmpty());

		preferences.setMaritalStatus("");
		assertTrue(validator.validate(preferences).isEmpty());
	}
}
