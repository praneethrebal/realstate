package com.weekdays.properties.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.weekdays.properties.entity.Lottery;
import com.weekdays.properties.entity.LotteryForm;

public interface LotteryRepo extends JpaRepository<Lottery,Long> {

	Optional<Lottery> findByTicketNo(String ticketNo);

	 @Query("SELECT l FROM Lottery l WHERE l.winner = :winner")
	    Optional<Lottery> findByWinner(@Param("winner") String winner);
	

}
