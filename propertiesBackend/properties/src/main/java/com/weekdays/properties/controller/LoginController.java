package com.weekdays.properties.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.weekdays.properties.dto.AdminRegisterRequest;

import com.weekdays.properties.dto.UserLoginRequest;

import com.weekdays.properties.entity.User;



import com.weekdays.properties.enums.Role;
import com.weekdays.properties.repository.UserRepository;
import com.weekdays.properties.service.AddPropertyService;

//import com.weekdays.properties.security.JwtService;
import com.weekdays.properties.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("login")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {
   
    private final UserService userService;
//    private final PaymentService paymentService;
    private final UserRepository userRepo;
    
    

	@GetMapping("hi")
	public String hi()
	{
		return "hi";
	}
	@PostMapping("/login")
	public ResponseEntity<Map<String, String>> login(@RequestBody UserLoginRequest login)
	{
		
		Map<String,String> token=userService.verify(login.getPassword(),login.getUsernameOrEmail());
		
		return ResponseEntity.ok(token);
	}

	 @PostMapping("/register")
	    public ResponseEntity<?> registerUser(
	            @Valid @ModelAttribute User user,
	            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
	            @RequestParam(value = "companyLogo", required = false) MultipartFile companyLogo,
	            @RequestParam(value = "companyWallpaper", required = false) MultipartFile companyWallpaper
	    ) throws Exception {

	        User savedUser = userService.registerUser(user, profileImage, companyLogo, companyWallpaper);
	        String referralCode = generateReferralCode(savedUser);
	        savedUser.setMy_referralCode(referralCode);
	        savedUser = userRepo.save(savedUser);

	        return ResponseEntity.ok(Map.of(
	                "message", "User registered successfully.",
	                "user", savedUser
	        ));
	    }

	private String generateReferralCode(User user) {
	    String idPart = String.valueOf(user.getId()); // e.g., 0007
	    String rolePart = user.getRole().name().substring(0, 2).toUpperCase(); // e.g., "AD" for ADMIN
	    String namePart = user.getUsername()
	                         .replaceAll("[^A-Za-z0-9]", "") // remove spaces/symbols
	                         .substring(0, Math.min(3, user.getUsername().length()))
	                         .toUpperCase(); // e.g., "JOH"
	    String randomPart = String.valueOf((int)(Math.random() * 9000) + 1000); // e.g., 4523

	    return rolePart+idPart  + namePart + randomPart; 
	}

    
//    @PostMapping("/verify-payment")
//    public ResponseEntity<?> verifyPayment(
//            @RequestParam String orderId,
//            @RequestParam String paymentId,
//            @RequestParam String signature,
//            @RequestParam Long userId) throws Exception {
//
////        boolean verified = paymentService.verifyPayment(orderId, paymentId, signature);
//
////        if (!verified) {
////            userService.deleteUser(userId);
////            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
////                    .body(Map.of("error", "Payment verification failed. User deleted."));
////        }
//
//        return ResponseEntity.ok(Map.of("message", "Payment verified. Registration complete."));
//    }


}
