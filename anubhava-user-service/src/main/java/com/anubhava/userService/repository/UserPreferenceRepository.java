package com.anubhava.userService.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.anubhava.userService.entity.UserEntity;
import com.anubhava.userService.entity.UserPreferenceEntity;

public interface UserPreferenceRepository extends JpaRepository<UserPreferenceEntity, Long> {

	Optional<UserPreferenceEntity> findByUser(UserEntity user);

	Optional<UserPreferenceEntity> findByEmail(String email);
}
