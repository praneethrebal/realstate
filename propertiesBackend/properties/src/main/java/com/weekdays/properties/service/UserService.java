package com.weekdays.properties.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.weekdays.properties.Excepations.EmptyListExcepation;
import com.weekdays.properties.Excepations.ImageNotFoundException;
import com.weekdays.properties.entity.ProjectEntity;
import com.weekdays.properties.entity.User;
import com.weekdays.properties.enums.PlanType;
import com.weekdays.properties.enums.Role;
import com.weekdays.properties.repository.ProjectRepo;
import com.weekdays.properties.repository.UserRepository;
import com.weekdays.properties.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	
	private final UserRepository userRepo;
	private final AuthenticationManager authManager;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtservice;
	private final ProjectRepo projectRepository;
	
	   @Value("${file.upload-dir}")
	    private String uploadDir;
	
	public Map<String, String> verify(String password, String username) {
		User user=userRepo.findByUsernameOrEmail(username, username).orElseThrow(()->new RuntimeException("InValid Details"));
		Authentication auth=authManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
		
		if(auth != null)
		{
			HashMap<String, String> map=new HashMap<String, String>();
			String token=jwtservice.generateToken(user);
			String role=user.getRole().name();
			map.put("token", token);
			map.put("role", role);
			return map;
		}
		return null;
	}


	public User registerUser(User user, MultipartFile profileImage,
            MultipartFile companyLogo, MultipartFile companyWallpaper) throws Exception {
		
		user.setCreatedAt(LocalDateTime.now());
		user.setUpdatedAt(LocalDateTime.now());
		User savedUser = userRepo.save(user);
		
		if (profileImage != null && !profileImage.isEmpty()) {
		uploadUserImage(profileImage, user, "profile");
		}
		
		if (companyLogo != null && !companyLogo.isEmpty()) {
			uploadUserImage(companyLogo, user, "logo");
		}
		
		if (companyWallpaper != null && !companyWallpaper.isEmpty()) {
			uploadUserImage(companyWallpaper, user, "wallpaper");
		}
		if(user.getRole() == Role.MARKETER)
		{
		user.setMarketerSubscriptionStartDate(LocalDate.now());
		user.setMarketerSubscriptionEndDate(LocalDate.now().plusMonths(user.getSelectedDuration()));
		}
		if(user.getRole() == Role.COMPANY)
		{
		user.setCompanySubscriptionStartDate(LocalDate.now());
		
		user.setCompanySubscriptionEndDate(LocalDate.now().plusMonths(user.getSelectedDuration()));
		}
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		
		return userRepo.save(user);
	}

private void uploadUserImage(MultipartFile file, User user, String folder) throws IOException {
		Path uploadPath = Paths.get(uploadDir, folder);
		if (!Files.exists(uploadPath)) {
		Files.createDirectories(uploadPath);
		}
		Long id=user.getId();
		
		String fileName = file.getOriginalFilename();
		
		
		if (fileName != null) {
		    fileName = fileName.replaceAll(" ", "_") + id.toString(); // append user ID
		}

		
		
		
		
		Path imagePath = uploadPath.resolve(fileName);
		String imageType = file.getContentType();
		
		Files.copy(file.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
		
		switch (folder) {
		case "profile" -> {
		user.setProfileImageName(fileName);
		user.setProfileImagePath(imagePath.toString());
		user.setProfileImageType(imageType);
		}
		case "logo" -> {
		user.setCompanyLogoName(fileName);
		user.setCompanyLogoPath(imagePath.toString());
		user.setCompanyLogoType(imageType);
		}
		case "wallpaper" -> {
		user.setCompanyWallpaperName(fileName);
		user.setCompanyWallpaperPath(imagePath.toString());
		user.setCompanyWallpaperType(imageType);
		}
	 }
}
	public User getDetailsByUsername() {
		String username=SecurityContextHolder.getContext().getAuthentication().getName();
		
				User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

      
        return user;
    }


	public List<User> findAllExports(PlanType export) {
	    List<User> users = userRepo.findAllUsersByPlanType(export);

	    if (users.isEmpty()) {
	        throw new EmptyListExcepation(export + " are empty");
	    }
	    List<User> allowed = users.stream()
	    	    .filter(u -> u.getMarketerSubscriptionEndDate() == null 
	    	             || !u.getMarketerSubscriptionEndDate().isBefore(LocalDate.now()))
	    	    .toList();
	    
	    if(allowed.isEmpty())
	    {
	    	throw new EmptyListExcepation(export+" are Empty");
	    }
	    return allowed;

	}


	public Map<String, Object> getProfileImg(Long id) throws Exception {
		User user=userRepo.findById(id).orElseThrow();
		if(user.getProfileImagePath()==null)
		{
	  
	    		throw new ImageNotFoundException("Image not there");
	    	
		}
		Path profilePath=Paths.get(user.getProfileImagePath());
		Resource resource= new UrlResource(profilePath.toUri());
		if (!resource.exists() || !resource.isReadable()) {
	        throw new ImageNotFoundException("Profile Was not There");
	    }
		HashMap<String , Object> map=new HashMap<String, Object>();
		map.put("resource", resource);
		 map.put("type", user.getProfileImageType());
		return map;
	}
	public Map<String, Object> getLogoImg(Long id) throws Exception {
		User user=userRepo.findById(id).orElseThrow();
		if(user.getCompanyLogoPath()==null)
		{
	  
	    		throw new ImageNotFoundException("Image not there");
	    	
		}
		Path profilePath=Paths.get(user.getCompanyLogoPath());
		Resource resource= new UrlResource(profilePath.toUri());
		if (!resource.exists() || !resource.isReadable()) {
	        throw new ImageNotFoundException("Profile Was not There");
	    }
		HashMap<String , Object> map=new HashMap<String, Object>();
		map.put("resource", resource);
		 map.put("type", user.getCompanyLogoType());
		return map;
	}
	
	public Map<String, Object> getWallPaperImg(Long id) throws Exception {
		User user=userRepo.findById(id).orElseThrow();
		if(user.getCompanyWallpaperPath()==null)
		{
	  
	    		throw new ImageNotFoundException("Image not there");
	    	
		}
		Path profilePath=Paths.get(user.getCompanyWallpaperPath());
		Resource resource= new UrlResource(profilePath.toUri());
		if (!resource.exists() || !resource.isReadable()) {
	        throw new ImageNotFoundException("Profile Was not There");
	    }
		HashMap<String , Object> map=new HashMap<String, Object>();
		map.put("resource", resource);
		 map.put("type", user.getCompanyWallpaperType());
		return map;
	}


	public List<ProjectEntity> getProjectsByPlanType(PlanType planType) {
		 return projectRepository.findByUser_PlanType(planType);
	}

	public User getDetailsByUserId(Long userid) {
		User user = userRepo.findById(userid).orElseThrow(() -> new RuntimeException("User not found: " + userid));
		return user;

	}


	public void deleteUser(Long userId) {
		userRepo.deleteById(userId);
		
	}


	public List<User> myReferals() {
		String username=SecurityContextHolder.getContext().getAuthentication().getName();
		User user=userRepo.findByUsername(username).orElseThrow();
		String myReferalCode=user.getMy_referralCode();
		List<User> myReferals=userRepo.findMyReferals(myReferalCode);
		return myReferals;
	}


	public List<User> getAllFranchiseOwners() {
		
		return userRepo.getAllFranchiseOwners(Role.FRANCHISE);
	}
	
	public Optional<User> updateCompanyProfile(Long id, User updatedUser) {
        Optional<User> existingOpt = userRepo.findById(id);
        if (existingOpt.isEmpty()) {
            return Optional.empty();
        }

        User existing = existingOpt.get();

        // 🔹 Update only editable (non-null) fields
       
        if (updatedUser.getEmail() != null) existing.setEmail(updatedUser.getEmail());
        if (updatedUser.getPhone() != null) existing.setPhone(updatedUser.getPhone());
        if (updatedUser.getDescription() != null) existing.setDescription(updatedUser.getDescription());
        if (updatedUser.getLocation() != null) existing.setLocation(updatedUser.getLocation());
        if (updatedUser.getExperience() != null) existing.setExperience(updatedUser.getExperience());
        if (updatedUser.getReferralCode() != null) existing.setReferralCode(updatedUser.getReferralCode());
        if (updatedUser.getDeals() != null) existing.setDeals(updatedUser.getDeals());
        if (updatedUser.getCategory() != null) existing.setCategory(updatedUser.getCategory());
        if (updatedUser.getCompanyName() != null) existing.setCompanyName(updatedUser.getCompanyName());
        if (updatedUser.getAddress() != null) existing.setAddress(updatedUser.getAddress());
        if (updatedUser.getContactNumber() != null) existing.setContactNumber(updatedUser.getContactNumber());
        if (updatedUser.getTotalProjects() != null) existing.setTotalProjects(updatedUser.getTotalProjects());
        if (updatedUser.getOngoingProjects() != null) existing.setOngoingProjects(updatedUser.getOngoingProjects());
        if (updatedUser.getCompletedProjects() != null) existing.setCompletedProjects(updatedUser.getCompletedProjects());
       
        if (updatedUser.getPlanType() != null) existing.setPlanType(updatedUser.getPlanType());

        // ✅ Optional image/logo fields
        if (updatedUser.getCompanyLogoName() != null) existing.setCompanyLogoName(updatedUser.getCompanyLogoName());
        if (updatedUser.getCompanyWallpaperName() != null) existing.setCompanyWallpaperName(updatedUser.getCompanyWallpaperName());
        if (updatedUser.getProfileImageName() != null) existing.setProfileImageName(updatedUser.getProfileImageName());

        existing.setUpdatedAt(LocalDateTime.now());

        userRepo.save(existing);
        return Optional.of(existing);
    }

	public User getViews(Long userId) {
		User user= userRepo.findById(userId).orElseThrow(()-> new RuntimeException("user not found"));
		user.setClick(user.getClick()+1);
		return userRepo.save(user);
	}
	
	public Long getCount(Long userId) {
		User user= userRepo.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
		return user.getClick();
	}
	
	public User getLead(Long userId) {
		User user= userRepo.findById(userId).orElseThrow(()-> new RuntimeException("user not found"));
		user.setLeads(user.getLeads()+1);
		return userRepo.save(user);	
		}
	
	public Long getLeadCount(Long userId) {
		User user= userRepo.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
		return user.getLeads();
	}
	
	public User updateUserDetails(User updatedUser) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User existingUser = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        existingUser.setCategory(updatedUser.getCategory());
        existingUser.setExperience(updatedUser.getExperience());
        existingUser.setLocation(updatedUser.getLocation());
        existingUser.setDescription(updatedUser.getDescription());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setDeals(updatedUser.getDeals());
//        existingUser.setUsername(updatedUser.getUsername());

        return userRepo.save(existingUser);
    }


    public User updateCompanyProfileById(Long id, User updatedUser) {
        User existingUser = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        existingUser.setCompanyName(updatedUser.getCompanyName());
        existingUser.setLocation(updatedUser.getLocation());
        existingUser.setDescription(updatedUser.getDescription());
        existingUser.setExperience(updatedUser.getExperience());
        existingUser.setContactNumber(updatedUser.getContactNumber());
        existingUser.setAddress(updatedUser.getAddress());
        existingUser.setCompanyLogoName(updatedUser.getCompanyLogoName());
        existingUser.setCompanyLogoPath(updatedUser.getCompanyLogoPath());
        existingUser.setCompanyWallpaperName(updatedUser.getCompanyWallpaperName());
        existingUser.setCompanyWallpaperPath(updatedUser.getCompanyWallpaperPath());
        existingUser.setSelectedDuration(updatedUser.getSelectedDuration());
        existingUser.setUpdatedAt(LocalDateTime.now());

        return userRepo.save(existingUser);
    }


    public User updateUserDetailsById(Long id, User updatedUser) {
	    User existingUser = userRepo.findById(id)
	            .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

	    // Update only allowed fields
	    
	    existingUser.setEmail(updatedUser.getEmail());
	    existingUser.setPhone(updatedUser.getPhone());
	    existingUser.setAddress(updatedUser.getAddress());
	    existingUser.setExperience(updatedUser.getExperience());
	    existingUser.setDescription(updatedUser.getDescription());
	    // ... add more fields as needed

	    return userRepo.save(existingUser);
	}
	



	




}
