package com.weekdays.properties.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.weekdays.properties.entity.LotteryForm;

public interface LotterFormRepo extends JpaRepository<LotteryForm, Long> {

}
