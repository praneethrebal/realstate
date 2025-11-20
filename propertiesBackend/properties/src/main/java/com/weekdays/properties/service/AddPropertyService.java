package com.weekdays.properties.service;



import java.io.File;
import java.io.IOException;
import java.net.http.HttpHeaders;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import com.weekdays.properties.dto.ProfileDto;
import com.weekdays.properties.entity.AddPropertyModel;
import com.weekdays.properties.entity.Lottery;
import com.weekdays.properties.entity.LotteryForm;
import com.weekdays.properties.entity.User;
import com.weekdays.properties.entity.VerifiedProperties;
import com.weekdays.properties.enums.SelectProperty;
import com.weekdays.properties.repository.AddPropertyRepo;
import com.weekdays.properties.repository.LotterFormRepo;
import com.weekdays.properties.repository.LotteryRepo;
import com.weekdays.properties.repository.UserRepository;
import com.weekdays.properties.repository.VerifyPropertyRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddPropertyService {
	private final AddPropertyRepo addPropertyRepo;
	private final UserRepository userRepo;
	private final LotteryRepo lotteryRepo;
	
	private final VerifyPropertyRepo verifyPropertyRepo;
	public void addnewProperty(AddPropertyModel addPropertyModel) {
		String userName=SecurityContextHolder.getContext().getAuthentication().getName();
		User user=userRepo.findByUsername(userName).orElseThrow(()->new RuntimeException("User was Empty"));
		addPropertyModel.setUser(user);
		addPropertyModel.set_notSold(true);
		addPropertyRepo.save(addPropertyModel);
		
		
	}


	public List<AddPropertyModel> findBySelectProperty(SelectProperty propName) {
		
		
		return addPropertyRepo.findBySelectProperty(propName);
	}


	public AddPropertyModel getSingleProperty(long propId) {
		
		return addPropertyRepo.findById(propId).orElseThrow(()-> new RuntimeException("Property not found"));
	}


	public ProfileDto getProfileDetails(Long user_id) {
		User user=userRepo.findById(user_id).orElseThrow();
		List<AddPropertyModel> properties = addPropertyRepo.findByUser(user);
		ProfileDto dto= new ProfileDto();
		dto.setSoldout(properties.size());
		long notSoldCount = properties.stream()
		            .filter(AddPropertyModel::is_notSold) // uses method reference
		            .count();
        dto.setPending(notSoldCount);
        dto.setSoldout(properties.size()-notSoldCount);
		dto.setUser(user);

		return dto;
	}


	 public List<AddPropertyModel> getPropertiesByUser(Long userId) {
	        return addPropertyRepo.findByUserId(userId);
	    }


	public List<AddPropertyModel> getAssignedPropertys() {
		String u=SecurityContextHolder.getContext().getAuthentication().getName();
		User user=userRepo.findByUsername(u).orElseThrow();
		String location=user.getLocation().toLowerCase();
		
		return addPropertyRepo.findAssignedProperty(location);
	}

	@Transactional
	public void makePropertyVerifyed(Long propId) {
		AddPropertyModel verify=addPropertyRepo.findById(propId).orElseThrow();
		verify.set_verifiedproperty(true);
		VerifiedProperties v=new VerifiedProperties();
		v.setVirifiedProperty(verify);
		String u=SecurityContextHolder.getContext().getAuthentication().getName();
		User user=userRepo.findByUsername(u).orElseThrow();

		v.setUser(user);
		verifyPropertyRepo.save(v);
		verify.setPropertyverifiedBy(v);
		addPropertyRepo.save(verify);
		
		
		
	}


	public List<VerifiedProperties> verifyPropertys() {
		String u=SecurityContextHolder.getContext().getAuthentication().getName();
		User user=userRepo.findByUsername(u).orElseThrow();
		List<VerifiedProperties> v=verifyPropertyRepo.getVerifiedPropertys(user);
	    return v;
		
	}


	public List<AddPropertyModel> pendingProperties() {
	    List<AddPropertyModel> assigned = getAssignedPropertys(); 
	    
	    List<VerifiedProperties> verified = verifyPropertys(); 
	    Set<Long> verifiedIds = verified.stream()
	                                    .map(v -> v.getVirifiedProperty().getId())
	                                    .collect(Collectors.toSet());

	    List<AddPropertyModel> pending = assigned.stream()
	                                             .filter(a -> !verifiedIds.contains(a.getId()))
	                                             .collect(Collectors.toList());
	    return pending;
	}

	
	 public boolean deleteProperty(Long userId, Long PropertyId) {
	    	Optional<AddPropertyModel> propertyOpt = addPropertyRepo.findById(PropertyId);
	    	if (propertyOpt.isPresent()) {
	    		AddPropertyModel property = propertyOpt.get();
	            if (property.getUser() != null && property.getUser().getId().equals(userId)) {
	            	addPropertyRepo.deleteById(PropertyId);
	                return true;
	            }
	        }
	        return false;
	    }







	

	 private final LotterFormRepo lRepo;
//	public void buyTicket(long id) {
//		var a=lRepo.findById(id).orElseThrow();
//		
//		Lottery l=new Lottery();
//		a.setTotalTickets(a.getTotalTickets()-1);
//		lRepo.save(a);
//		l.setAddPropertyModel(a);
//		l.setUser(a.getUser());
//		lotteryRepo.save(l);
//		}

	  @Value("${file.upload-dir}")
	    private String baseUploadDir;
	  private final String subFolder = "lotteryimages/";
	 
	    public void buyTicket(long id,
                MultipartFile screenShot,
                String name,
                String mobileNumber,
                String altNumber,
                String transcationId,
                String postalAddressCode,
                String state,
                String distict,
                String areaAndCity,
                String username,
                String toMail) throws Exception {

// 1️⃣ Fetch property (lottery form)
		LotteryForm property = lRepo.findById(id)
		      .orElseThrow(() -> new RuntimeException("Lottery not found with id: " + id));
		
		// 2️⃣ Fetch logged-in user
		User user = userRepo.findByUsername(username)
		      .orElseThrow(() -> new RuntimeException("User not found: " + username));
		
		// 3️⃣ Validate ticket availability
		if (property.getAvaliableTickets() <= 0) {
		  throw new RuntimeException("No tickets available for this lottery!");
		}
		
		// 4️⃣ Upload screenshot image
		Path uploadPath = Paths.get(baseUploadDir, subFolder);
		if (!Files.exists(uploadPath)) {
		  Files.createDirectories(uploadPath);
		}
		
		String fileName = System.currentTimeMillis() + "_" + screenShot.getOriginalFilename().replaceAll(" ", "_");
		Path filePath = uploadPath.resolve(fileName);
		Files.copy(screenShot.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
		
		// 5️⃣ Create Lottery purchase entry
		Lottery lottery = new Lottery();
		lottery.setLotteryForm(property);  // instead of setAddPropertyModel
		
		lottery.setUser(user);
		lottery.setScreenShotPath(filePath.toString());
		lottery.setName(name);
		lottery.setToMail(toMail);
		lottery.setMobileNumber(mobileNumber);
		lottery.setAltNumber(altNumber);
		lottery.setTranscation_id(transcationId);
		lottery.setPostalAddressCode(postalAddressCode);
		lottery.setState(state);
		lottery.setDistict(distict);
		lottery.setAreaAndCity(areaAndCity);
		lottery.setAmount((long) property.getTicketPrice());
		lottery.setDate(LocalDate.now());
		lottery.setTime(LocalTime.now());
		  String ticketNo = generateTicketNo(name, mobileNumber);
		    lottery.setTicketNo(ticketNo);
		
		// 6️⃣ Update ticket counts
		property.setAvaliableTickets(property.getAvaliableTickets() - 1);
		lRepo.save(property);
		lotteryRepo.save(lottery);
		
	}
	    private String generateTicketNo(String name, String mobileNumber) {
	        String namePart = name.length() >= 3 ? name.substring(0, 3).toUpperCase() : name.toUpperCase();
	        String mobilePart = mobileNumber.length() >= 2 
	                ? mobileNumber.substring(mobileNumber.length() - 2) 
	                : mobileNumber;
	        int randomPart = (int) (Math.random() * 900) + 100; // 3-digit random number (100–999)
	        return namePart + mobilePart + randomPart;
	    }
	  
	public void createLottry(LotteryForm lotteryForm, List<MultipartFile> images, String userId) throws Exception {
		String username=SecurityContextHolder.getContext().getAuthentication().getName();
		 User user = userRepo.findByUsername(username)
                 .orElseThrow();
		 lotteryForm.setAvaliableTickets(lotteryForm.getTotalTickets());
		 lotteryForm.setUser(user);
		 Path uploadPath = Paths.get(baseUploadDir, subFolder);
	        if (!Files.exists(uploadPath)) {
	            Files.createDirectories(uploadPath);
	        }
	        List<String> imagePaths = new ArrayList();
	        for (MultipartFile image : images) {
	            if (image.isEmpty()) continue;

	            // Clean file name
	            String imageName = image.getOriginalFilename();
	            if (imageName != null) imageName = imageName.replaceAll(" ", "_");

	            // Full storage path
	            Path imagePath = uploadPath.resolve(System.currentTimeMillis() + "_" + imageName);

	            // Save file safely
	            Files.copy(image.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

	            imagePaths.add(imagePath.toString());
	        }

	       
	        lotteryForm.setImagePaths(imagePaths);
	       var save= lRepo.save(lotteryForm);
	      
	        
		 
		
	}


	 public List<LotteryForm> getAllLotteries() {
        return lRepo.findAll();
    }
	 
	
	
	 public Map<String, Object> getLotteryImage(String filename) throws Exception {
		    Map<String, Object> map = new HashMap<>();

		    try {
		        // ✅ Path to your lottery images folder
		        Path imagePath = Paths.get("uploads/lotteryimages").resolve(filename).normalize();

		        // ✅ Validate file existence
		        if (!Files.exists(imagePath)) {
		            throw new RuntimeException("Image not found at: " + imagePath);
		        }

		        // ✅ Load file as a resource
		        Resource resource = new UrlResource(imagePath.toUri());
		        if (!resource.exists() || !resource.isReadable()) {
		            throw new RuntimeException("Image not readable: " + imagePath);
		        }

		        // ✅ Detect file content type
		        String contentType = Files.probeContentType(imagePath);
		        if (contentType == null) {
		            contentType = "image/jpeg"; // fallback
		        }

		        // ✅ Add data to map for controller
		        map.put("resource", resource);
		        map.put("type", contentType);

		        System.out.println("🖼️ Serving lottery image: " + imagePath + " (type: " + contentType + ")");
		        return map;

		    } catch (Exception e) {
		        e.printStackTrace();
		        throw new Exception("Failed to load image: " + filename + " → " + e.getMessage());
		    }
		}




	

}
