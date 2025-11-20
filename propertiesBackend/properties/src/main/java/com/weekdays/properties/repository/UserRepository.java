package com.weekdays.properties.repository;

import com.weekdays.properties.entity.AddPropertyModel;
import com.weekdays.properties.entity.User;
import com.weekdays.properties.enums.PlanType;
import com.weekdays.properties.enums.Role;
import com.weekdays.properties.enums.marketingSubscripationType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
	
	@Query("SELECT u FROM User u WHERE u.username = :username")
   Optional<User> findByUsername(String username);
	@Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(String email);
	@Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.username = :username")
    boolean existsByUsername(String username);
	@Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.email = :email")
    boolean existsByEmail(String email);
	@Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.phone = :phone")
    boolean existsByPhone(String phone);

    // Allow login by username or email
	@Query("SELECT u FROM User u WHERE u.username = :username OR u.email = :email")
    Optional<User> findByUsernameOrEmail(String username, String email);

    // Find all users with a specific role (single role field, not Set)
	@Query("SELECT u FROM User u WHERE u.role = :role")
    List<User> findAllByRole(Role role);
	@Query("select u from User u where u.planType=:export")
	List<User> findAllUsersByPlanType(PlanType export);
	
	@Query("select u from User u where u.referralCode=:myReferalCode")
	List<User> findMyReferals(String myReferalCode);
	
	@Query("select u from User u where u.role=:franchise")
	List<User> getAllFranchiseOwners(Role franchise);
	
	

}
