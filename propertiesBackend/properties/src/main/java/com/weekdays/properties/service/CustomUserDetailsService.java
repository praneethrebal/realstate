package com.weekdays.properties.service;


import com.weekdays.properties.entity.User;
import com.weekdays.properties.principal.Principal;
import com.weekdays.properties.repository.UserRepository;

import lombok.RequiredArgsConstructor;


import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {


    private final UserRepository userRepo;

  
    @Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
	 User user = userRepo.findByUsernameOrEmail(username, username)
             .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

	    if (user == null) {
	    	  
	        throw new RuntimeException("User not found with username: " + username);
	    }
	    return new Principal(user);
	}

//    @Override
//    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
//        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + usernameOrEmail));
//
//        logger.debug("Loaded user: {}", user.getUsername());
//        logger.debug("Role from DB: {}", user.getRole());
//
//        // Single role
//        Set<SimpleGrantedAuthority> authorities = Set.of(
//                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
//        );
//
//        return new org.springframework.security.core.userdetails.User(
//                user.getUsername(),
//                user.getPassword(),
//                authorities
//        );
//    }

}