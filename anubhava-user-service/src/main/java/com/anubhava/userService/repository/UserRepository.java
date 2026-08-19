package com.anubhava.userService.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.anubhava.userService.entity.UserEntity;

/**
 * The Interface UserRepository.
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

	/**
	 * Find by email.
	 *
	 * @param email the email
	 * @return the optional
	 */
	Optional<UserEntity> findByEmail(String email);

	/**
	 * Exists by email.
	 *
	 * @param email the email
	 * @return true, if successful
	 */
	boolean existsByEmail(String email);
}
