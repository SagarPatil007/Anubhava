package com.anubhava.userService.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.anubhava.commonModule.common.ApiResponse;
import com.anubhava.commonModule.common.Error;
import com.anubhava.commonModule.domain.UserDomain;
import com.anubhava.userService.entity.UserEntity;
import com.anubhava.userService.repository.UserRepository;
import com.anubhava.userService.service.UserService;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

/**
 * The Class UserServiceImpl.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	/** The user repository. */
	private final UserRepository userRepository;

	/** The model mapper. */
	private final ModelMapper modelMapper;

	/**
	 * Creates the user.
	 *
	 * @param userDomain the user domain
	 * @return the api response
	 */
	@Override
	public ApiResponse createUser(UserDomain userDomain) {
		if (userRepository.existsByEmail(userDomain.getEmail())) {
			return buildFailureResponse("User with this email already exists", "email");
		}
		final UserEntity userEntity = modelMapper.map(userDomain, UserEntity.class);
		if(null != userEntity) {
			final UserEntity savedUser = userRepository.save(userEntity);
			return new ApiResponse(true, "User created successfully", modelMapper.map(savedUser, UserDomain.class), LocalDate.now(), null);
		}
		return buildFailureResponse("Failed to create user", "userDomain");
	}

	/**
	 * Update user.
	 *
	 * @param userId the user id
	 * @param userDomain the user domain
	 * @return the api response
	 */
	@Override
	public ApiResponse updateUser(@NonNull Long userId, UserDomain userDomain) {
		final Optional<UserEntity> existingUser = userRepository.findById(userId);
		if (existingUser.isEmpty()) {
			return buildFailureResponse("User not found", "userId");
		}

		final UserEntity entity = existingUser.get();
		modelMapper.getConfiguration().setSkipNullEnabled(true);
		modelMapper.map(userDomain, entity);
		entity.setUpdatedAt(LocalDateTime.now());

		final UserEntity savedUser = userRepository.save(entity);
		return new ApiResponse(true, "User updated successfully", modelMapper.map(savedUser, UserDomain.class), LocalDate.now(), null);
	}

	/**
	 * Gets the user data.
	 *
	 * @param userId the user id
	 * @return the user data
	 */
	@Override
	public ApiResponse getUserData(@NonNull Long userId) {
		final Optional<UserEntity> userEntity = userRepository.findById(userId);
		if (userEntity.isEmpty()) {
			return buildFailureResponse("User not found", "userId");
		}

		return new ApiResponse(true, "User retrieved successfully", modelMapper.map(userEntity.get(), UserDomain.class), LocalDate.now(), null);
	}

	/**
	 * Builds the failure response.
	 *
	 * @param message the message
	 * @param field the field
	 * @return the api response
	 */
	private ApiResponse buildFailureResponse(String message, String field) {
		final Error error = Error.builder().field(field).message(message).build();
		return new ApiResponse(false, message, null, LocalDate.now(), List.of(error));
	}
}
