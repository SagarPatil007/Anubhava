package com.anubhava.bookingService.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.anubhava.bookingService.entity.BookingEntity;

@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, Long> {

	List<BookingEntity> findByEmailOrderByCreatedAtDesc(String email);

}
