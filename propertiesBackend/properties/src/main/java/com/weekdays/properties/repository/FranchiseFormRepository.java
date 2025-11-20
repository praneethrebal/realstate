package com.weekdays.properties.repository;

import com.weekdays.properties.entity.FranchiseFormModel;
import com.weekdays.properties.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FranchiseFormRepository extends JpaRepository<FranchiseFormModel, Long> {

    @Query("select u.user from FranchiseFormModel u ")
    List<User> findAllUsers();

    @Query("SELECT DISTINCT f.user FROM FranchiseFormModel f")
    List<User> findAllUsersWhoSubmittedForms();

}