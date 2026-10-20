package com.anubhava.userService.service;

import com.anubhava.commonModule.common.ApiResponse;
import com.anubhava.commonModule.domain.UserDomain;
import com.anubhava.commonModule.domain.UserPreferenceDomain;

/**
 * The Interface UserService.
 */
public interface UserService {

	/**
	 * Creates the user.
	 *
	 * @param userDomain the user domain
	 * @return the api response
	 */
	ApiResponse createUser(UserDomain userDomain);

	/**
	 * Update user.
	 *
	 * @param userId the user id
	 * @param userDomain the user domain
	 * @return the api response
	 */
	ApiResponse updateUser(Long userId, UserDomain userDomain);

	/**
	 * Gets the user data.
	 *
	 * @param userId the user id
	 * @return the user data
	 */
	ApiResponse getUserData(Long userId);

	ApiResponse getUserByEmail(String email);

	ApiResponse saveUserPreference(UserPreferenceDomain preferenceDomain);

	ApiResponse getUserPreferenceByEmail(String email);
}
