package com.anubhava.eventService.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.anubhava.eventService.entity.EventEntity;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Long> {

	@Query("""
			SELECT event FROM EventEntity event
			WHERE (:startDate IS NULL OR event.endDate >= :startDate)
			AND (:endDate IS NULL OR event.startDate <= :endDate)
			AND (:eventType IS NULL OR LOWER(event.eventType) = LOWER(:eventType))
			AND (:city IS NULL OR LOWER(event.city) = LOWER(:city))
			AND (:paid IS NULL OR event.paid = :paid)
			ORDER BY event.startDate ASC, event.startTime ASC
			""")
	List<EventEntity> findEvents(@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate,
			@Param("eventType") String eventType,
			@Param("city") String city,
			@Param("paid") Boolean paid);
}
