package com.anubhava.userService.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.anubhava.commonModule.common.ApiResponse;
import com.anubhava.commonModule.domain.UserDomain;
import com.anubhava.commonModule.domain.UserPreferenceDomain;
import com.anubhava.userService.service.UserService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

/**
 * The Class UserController.
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

	/** The user service. */
	private final UserService userService;

	/**
	 * Gets the user data.
	 *
	 * @param userId the user id
	 * @return the user data
	 */
	@GetMapping("/{userId}")
	public ResponseEntity<ApiResponse> getUserData(@PathVariable @NotNull Long userId){
		return ResponseEntity.ok(userService.getUserData(userId));
	}

	/**
	 * Creates the user.
	 *
	 * @param userDomain the user domain
	 * @return the response entity
	 */
	@PostMapping
	public ResponseEntity<ApiResponse> createUser(@RequestBody @Valid UserDomain userDomain){
		return ResponseEntity.ok(userService.createUser(userDomain));
	}

	@GetMapping("/email")
	public ResponseEntity<ApiResponse> getUserByEmail(@RequestParam String email) {
		return ResponseEntity.ok(userService.getUserByEmail(email));
	}

	@PostMapping("/preferences")
	public ResponseEntity<ApiResponse> saveUserPreference(@RequestBody @Valid UserPreferenceDomain preferenceDomain) {
		return ResponseEntity.ok(userService.saveUserPreference(preferenceDomain));
	}

	@PutMapping("/preferences")
	public ResponseEntity<ApiResponse> updateUserPreference(@RequestBody @Valid UserPreferenceDomain preferenceDomain) {
		return ResponseEntity.ok(userService.saveUserPreference(preferenceDomain));
	}

	@GetMapping("/preferences")
	public ResponseEntity<ApiResponse> getUserPreferenceByEmail(@RequestParam String email) {
		return ResponseEntity.ok(userService.getUserPreferenceByEmail(email));
	}

	/**
	 * Update user.
	 *
	 * @param userId the user id
	 * @param userDomain the user domain
	 * @return the response entity
	 */
	@PutMapping("/{userId}")
	public ResponseEntity<ApiResponse> updateUser(@PathVariable @NotNull Long userId, @RequestBody @Valid UserDomain userDomain){
		return ResponseEntity.ok(userService.updateUser(userId, userDomain));
	}
}
