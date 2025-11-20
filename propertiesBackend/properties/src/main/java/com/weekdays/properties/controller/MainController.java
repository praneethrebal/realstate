package com.weekdays.properties.controller;


import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.weekdays.properties.service.AddPropertyService;
import com.weekdays.properties.service.DocumentService;
import com.weekdays.properties.service.ImageService;
import com.weekdays.properties.service.ProjectEntityService;
import com.weekdays.properties.service.ReelService;
import com.weekdays.properties.service.SaveService;
import com.weekdays.properties.service.UserService;
import com.weekdays.properties.service.VideoService;

import io.jsonwebtoken.lang.Collections;

import com.weekdays.properties.dto.AddPropertyResDto;
import com.weekdays.properties.dto.ResponseDTO;
import com.weekdays.properties.dto.UserRegisterRequest;
import com.weekdays.properties.entity.AddPropertyModel;
import com.weekdays.properties.entity.Lottery;
import com.weekdays.properties.entity.LotteryForm;
import com.weekdays.properties.entity.ProjectEntity;
import com.weekdays.properties.entity.Reels;
import com.weekdays.properties.entity.SaveEntity;
import com.weekdays.properties.entity.User;
import com.weekdays.properties.enums.PlanType;
import com.weekdays.properties.enums.SelectProperty;
import com.weekdays.properties.repository.AddPropertyRepo;
import com.weekdays.properties.repository.LotterFormRepo;
import com.weekdays.properties.repository.LotteryRepo;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MainController {
	@GetMapping("hi")
	public String hi() {
		return "hi";
	}
	private final AddPropertyService addPropertyService;
	private final ImageService imageService;
	private final VideoService videpService;
	private final DocumentService documentService;
	private final UserService userService;
	private final AddPropertyRepo addPropertyRepo;
	private final ReelService reelService;
	private final SaveService saveService;
	private final ProjectEntityService projectEntityService;
	@Autowired
	private JavaMailSender mailSender;
	
	@PostMapping("addProperty")
	public ResponseEntity<AddPropertyResDto> addProperty(@RequestBody AddPropertyModel addPropertyModel)
	{
		addPropertyService.addnewProperty(addPropertyModel);
		return ResponseEntity.status(HttpStatus.CREATED).body(new AddPropertyResDto(addPropertyModel.getId(),addPropertyModel.getSelectProperty().name()+"was added Sucessfully"));
		
	}
	
	@PostMapping("uploadImg/{propertyId}")
	public void uploadImg(@PathVariable long propertyId,
						@RequestParam(value="image",required = false) MultipartFile image,
						@RequestParam(value="video",required = false) MultipartFile video,
						@RequestParam(value="document",required = false) MultipartFile document) throws Exception
	{
		imageService.uploadImage(image,propertyId);
		videpService.uploadVideo(video,propertyId);
		documentService.uploadDocument(document,propertyId);
		
		
	}
	@GetMapping("propertys/{propName}")
	public List<AddPropertyModel> getProperty(@PathVariable String propName) {
		SelectProperty p=SelectProperty.valueOf(propName);
		
		
		
		return addPropertyService.findBySelectProperty(p);
	}
	@GetMapping("singleProperty/{propId}")
	public ResponseEntity<AddPropertyModel> singleProperty(@PathVariable long propId) {
		AddPropertyModel singleProperty=addPropertyService.getSingleProperty(propId);
		return ResponseEntity.status(HttpStatus.OK).body(singleProperty);
	}
	@GetMapping("getPropertyImage/{imageId}")
	public ResponseEntity<Resource> getPropertyImage(@PathVariable long imageId) throws Exception
	{
		Resource r= imageService.getPropertyImage(imageId);
		String contentType=imageService.getContentType(imageId);
		return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.CONTENT_TYPE, contentType).body(r);
		
	}
	@GetMapping("getPropertyVideo/{videoId}")
	public ResponseEntity<Resource> getPropertyVideo(@PathVariable long videoId) throws Exception {
	    Map<String, Object> r = videpService.getPropertyVideo(videoId);
	    String contentType = (String) r.get("type");
	    Resource resource = (Resource) r.get("resource");

	    return ResponseEntity.status(HttpStatus.OK)
	            .header(HttpHeaders.CONTENT_TYPE, contentType)
	            .body(resource);
	}
	
	@PostMapping("postReel")
	public ResponseEntity<ResponseDTO> postReel(
			@RequestParam("title") String title,
			@RequestParam("descripation") String descripation,
			@RequestParam("reel") MultipartFile reel) throws Exception{
		reelService.postReel(title,descripation,reel);
		
		ResponseDTO res=new ResponseDTO();
		res.setMsg("reel Was added sucessfully");
		res.setStatus(200);
		
		return ResponseEntity.status(HttpStatus.OK).body(res);
	}
	
	@PutMapping("incressLikes/{reelId}")
	public void likeCount(@PathVariable int reelId)
	{
		reelService.likeCount(reelId);
	}
	
	
	
	
	
	@GetMapping("getAllReels")
	public ResponseEntity<List<Reels>> getAllReelsList(){
		List<Reels> reelsList=reelService.findListOfReels();
//		Collections.shuffle(reelsList); 
		return ResponseEntity.status(HttpStatus.OK).body(reelsList);
	}
	@GetMapping("getReelVideo/{id}")
	public ResponseEntity<Resource> getReelVideo(@PathVariable long id) throws Exception
	{
		Map<String, Object> res=reelService.getReelVideo(id);
		Resource resource=(Resource) res.get("resource");
		String type=(String) res.get("type");
		
		return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.CONTENT_TYPE, type).body(resource);
	}
	
	//--------------------
	@GetMapping("/userdetails")
	public ResponseEntity<?> getDetailsByUsername() {
	

	    User userDetails = userService.getDetailsByUsername();
	    return ResponseEntity.ok(userDetails);
	}
	   @GetMapping("getProfileImg/{userId}")
	    public ResponseEntity<Resource> getProfileImg(@PathVariable Long userId) throws Exception
	    {
	    	Map<String, Object> res=userService.getProfileImg(userId);
	    	 String contentType = (String) res.get("type");
	 	    Resource resource = (Resource) res.get("resource");
	    	return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.CONTENT_TYPE  , contentType).body(resource);
	    }
	
	//-------------------------profile------------------------------
	
	@GetMapping("/search")
	public List<AddPropertyModel> getlocationdetails(@RequestParam(required = false) String location, @RequestParam(required = false) String property ) {
		SelectProperty p=SelectProperty.valueOf(property);
		return addPropertyRepo.searchByLocationAndProperty( location,p);
	}
	
	
	 @PostMapping("save/{propertyId}")
	    public ResponseEntity<SaveEntity> saveProperty(@PathVariable Long propertyId) {
	        SaveEntity saved = saveService.save(propertyId);
	        return ResponseEntity.ok(saved);
	    }

	    @GetMapping("saved")
	    public ResponseEntity<List<SaveEntity>> getAllSaved() {
	        return ResponseEntity.ok(saveService.findAll());
	    }

	    @DeleteMapping("save/{propertyId}")
	    public ResponseEntity<String> unsaveProperty(@PathVariable Long propertyId) {
	    	saveService.unsave(propertyId);
	        return ResponseEntity.ok("Property unsaved successfully");
	    }

	    @GetMapping("/{plain}")
	    public ResponseEntity<List<ProjectEntity>> getPremiumProjects(@PathVariable String plain) {
	        PlanType p = PlanType.valueOf(plain);
	        List<ProjectEntity> projects = userService.getProjectsByPlanType(p);
	        return ResponseEntity.ok(projects);
	    }

	    @GetMapping("/companyProfile")
	    public ResponseEntity<User> getCompanyProfile(@RequestParam(required = false) Long userid) {
	    	if(userid != null) {
	    		User user = userService.getDetailsByUserId(userid);
		        return ResponseEntity.ok(user);
	    	}
	        User user = userService.getDetailsByUsername();
	        return ResponseEntity.ok(user);
	   
	    }
	    
	    
	    @GetMapping("getLogo/{userId}")
	    public ResponseEntity<Resource> getLogoImg(@PathVariable Long userId) throws Exception
	    {
	    	Map<String, Object> res=userService.getLogoImg(userId);
	    	 String contentType = (String) res.get("type");
	 	    Resource resource = (Resource) res.get("resource");
	    	return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.CONTENT_TYPE  , contentType).body(resource);
	    }
	    
	    
	    @GetMapping("getWallPaper/{userId}")
	    public ResponseEntity<Resource> getWallPaperImg(@PathVariable Long userId) throws Exception
	    {
	    	Map<String, Object> res=userService.getWallPaperImg(userId);
	    	 String contentType = (String) res.get("type");
	 	    Resource resource = (Resource) res.get("resource");
	    	return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.CONTENT_TYPE  , contentType).body(resource);
	    }
	    @GetMapping("/myUploads/{userId}")
	    public List<AddPropertyModel> getMyProperties(@PathVariable Long userId) {
	        return addPropertyService.getPropertiesByUser(userId);
	    }
	    @GetMapping("getReels/{userId}")
	    public ResponseEntity<List<Reels>> getReelsByUser(@PathVariable Long userId) {
	        List<Reels> reels = reelService.getReelsByUser(userId);
	        return ResponseEntity.ok(reels);
	    }
	    
	    @GetMapping("myreferals")
	    public ResponseEntity<List<User>>  myReferals()
	    {
	    	List<User> myReferals=userService.myReferals();
	    	return ResponseEntity.status(HttpStatus.OK).body(myReferals);
	    }
	    @GetMapping("getAllFranchiseOwners")
	    public ResponseEntity<List<User>> getAllFranchiseOwners()
	    {
	    	List<User> owners=userService.getAllFranchiseOwners();
	    	return ResponseEntity.status(HttpStatus.OK).body(owners);
	    }
	    
	    @PutMapping("/viewsCount/{userId}")
        public User views(@PathVariable Long userId) {
       	 return userService.getViews(userId);
        }
      //-------------------------------------------------------------------
        @GetMapping("/getviewsCount/{userId}")
       	 public ResponseEntity<Long> getCounts(@PathVariable Long userId ){
       	 Long clicks=userService.getCount(userId);
       	 return ResponseEntity.ok(clicks);
        }
      //-------------------------------------------------------------------
	      @PutMapping("/leadsCount/{userId}")
	      public User leads(@PathVariable Long userId) {
	    	  return userService.getLead(userId);
	      }
	   //-------------------------------------------------------------------
	      @GetMapping("/getLeadsCount/{userId}")
	      public ResponseEntity<Long> getLeadCounts(@PathVariable Long userId){
	    	  Long leads=userService.getLeadCount(userId);
	    	  return ResponseEntity.ok(leads);
	    	  
	      }
	   //-------------------------------------------------------------------
         @DeleteMapping("deleteProject/{userId}/{ProjectId}")
         public ResponseEntity<String> projectDelete(@PathVariable Long userId, @PathVariable Long ProjectId){
       	  boolean deleted = projectEntityService.deleteProject(userId, ProjectId);
       	  if (deleted) {
       		  return ResponseEntity.ok("Project delete successfully");
       	  } else {
       		  return ResponseEntity.badRequest().body("Project not found");
       	  }
         }
       //-------------------------------------------------------------------
         @DeleteMapping("deleteProperty/{userId}/{PropertyId}")
         public ResponseEntity<String> propertyDelete(@PathVariable Long userId, @PathVariable Long PropertyId){
       	  boolean delete = addPropertyService.deleteProperty(userId, PropertyId);
       	  if (delete) {
       		  return ResponseEntity.ok("Property delete successfully");
       	  } else {
       		  return ResponseEntity.badRequest().body("Property not found");
       	  }
         }
        
       
        
         
         @PostMapping("/buylottryTicket/{id}")
         public ResponseEntity<String> buyLotteryTicket(
                 @PathVariable long id,
                 @RequestParam("screenShot") MultipartFile screenShot,
                 @RequestParam("name") String name,
                 @RequestParam("mobileNumber") String mobileNumber,
                 @RequestParam(value = "altNumber", required = false) String altNumber,
                 @RequestParam(value = "toMail", required = false) String toMail,
                 @RequestParam("transcation_id") String transcationId,
                 @RequestParam("postalAddressCode") String postalAddressCode,
                 @RequestParam("State") String state,
                 @RequestParam("Distict") String distict,
                 @RequestParam("areaAndCity") String areaAndCity,
                 Principal principal
         ) {
             try {


                 addPropertyService.buyTicket(
                         id, screenShot, name, mobileNumber, altNumber, transcationId,
                         postalAddressCode, state, distict, areaAndCity, principal.getName(),toMail
                 );
                 sendSimpleMail( toMail, name, mobileNumber); 
                 return ResponseEntity.ok("🎟️ Ticket purchased successfully! OTP sent to "+toMail);

             } catch (Exception e) {
                 e.printStackTrace();
                 return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                         .body("❌ Error while buying ticket: " + e.getMessage());
             }
         }
         
         
         public void sendSimpleMail(String to,String name,String num)
         {
        	 SimpleMailMessage message = new SimpleMailMessage();
        	 message.setTo(to);
        	 message.setSubject(name);
        	 message.setFrom("weekdaysproperties@gmail.com");
        	 message.setText("Thank you for Purchasing ticket,your payment is under verfication, Plese wait for 24 hours "+name+" "+num);
        	 mailSender.send(message);

         }



        
//         @GetMapping("lottery/getAlllottry")
//         public ResponseEntity<List<LotteryForm>> getAllLotteries() {
//             List<LotteryForm> lotteries = addPropertyService.getAllLotteries();
//             return ResponseEntity.ok(lotteries);
//         }
//         @GetMapping("lottery/image/{filename}")
//         public ResponseEntity<Resource> getLotteryImage(@PathVariable String filename) {
//             try {
//                 Map<String, Object> result = addPropertyService.getLotteryImage(filename);
//                 Resource resource = (Resource) result.get("resource");
//                 String type = (String) result.get("type");
//
//                 return ResponseEntity.ok()
//                         .contentType(MediaType.parseMediaType(type))
//                         .header(HttpHeaders.CONTENT_DISPOSITION,
//                                 "inline; filename=\"" + resource.getFilename() + "\"")
//                         .body(resource);
//
//             } catch (Exception e) {
//                 return ResponseEntity.internalServerError().build();
//             }
//         }
//         private final LotterFormRepo lRepo;
//         private final LotteryRepo lotteryRepo;
//         @GetMapping("lottery/getAlllottry/{id}")
//         public ResponseEntity<LotteryForm> getLotteryById(@PathVariable Long id) {
//             LotteryForm lottery = lRepo.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Lottery not found"));
//             return ResponseEntity.ok(lottery);
//         }
         private final LotterFormRepo lRepo;
         private final LotteryRepo lotteryRepo;
         @GetMapping("/winner/{ticketNo}")
         public ResponseEntity<?> getWinnerDetails(@PathVariable String ticketNo) {
             Lottery winner = lotteryRepo.findByTicketNo(ticketNo)
                 .orElseThrow(() -> new RuntimeException("Invalid ticket number or no winner found."));

             Map<String, Object> response = new HashMap();
             response.put("winnerName", winner.getUser().getUsername());
             response.put("ticketNo", winner.getTicketNo());
//             response.put("lotteryName", winner.getLotteryForm().getTitle());
             response.put("amount", winner.getAmount());
             response.put("userId", winner.getUser().getId());  // To fetch profile image
             response.put("mobileNumber", winner.getMobileNumber());
             response.put("state", winner.getState());
             response.put("district", winner.getDistict());
             response.put("areaAndCity", winner.getAreaAndCity());
             winner.setWinner("winner");
             
             var l=winner.getLotteryForm();
             l.setActive(false);
             winner.setLotteryForm(l);
             lotteryRepo.save(winner);
             
             return ResponseEntity.ok(response);
         }
         @GetMapping("getWinner")
         public ResponseEntity<?> getWinner(@PathVariable String ticketNo) {
        	  String winner1="winner";
             Lottery winner = lotteryRepo.findByWinner(winner1)
                 .orElseThrow(() -> new RuntimeException("Invalid ticket number or no winner found."));
             return ResponseEntity.status(HttpStatus.OK).body(winner);
         }
         @PutMapping("/userdetails")
         public ResponseEntity<?> updateUserDetails(@RequestBody User updatedUser) {
             try {
                 User updated = userService.updateUserDetails(updatedUser);
                 return ResponseEntity.ok(updated);
             } catch (Exception e) {
                 return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                         .body("Error updating user details: " + e.getMessage());
             }
             
             
         }
         @PutMapping("/companyProfile/{id}")
         public ResponseEntity<User> updateCompanyProfileById(
                 @PathVariable Long id,
                 @RequestBody User updatedUser) {

             User updated = userService.updateCompanyProfileById(id, updatedUser);
             return ResponseEntity.ok(updated);
         }
         
         @PutMapping("/franchiseEdit/{id}")
         public ResponseEntity<?> updateUserDetailsById(@PathVariable Long id, @RequestBody User updatedUser) {
             try {
                 User savedUser = userService.updateUserDetailsById(id, updatedUser);
                 return ResponseEntity.ok(savedUser);
             } catch (RuntimeException e) {
                 return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                      .body("User not found with ID: " + id);
             } catch (Exception e) {
                 return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                      .body("Error updating user: " + e.getMessage());
             }
         }
         
         


}
         
