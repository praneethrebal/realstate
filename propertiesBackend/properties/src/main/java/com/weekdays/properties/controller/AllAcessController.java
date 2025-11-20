package com.weekdays.properties.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.HttpHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.weekdays.properties.dto.ProfileDto;
import com.weekdays.properties.entity.AddPropertyModel;
import com.weekdays.properties.entity.LotteryForm;
import com.weekdays.properties.entity.ProjectEntity;
import com.weekdays.properties.entity.User;
import com.weekdays.properties.enums.PlanType;
import com.weekdays.properties.enums.marketingSubscripationType;
import com.weekdays.properties.repository.LotterFormRepo;
import com.weekdays.properties.repository.LotteryRepo;
import com.weekdays.properties.service.AddPropertyService;
import com.weekdays.properties.service.ProjectEntityService;
import com.weekdays.properties.service.UserService;

import lombok.RequiredArgsConstructor;

@RequestMapping("/free-acess")
@RestController
@RequiredArgsConstructor
public class AllAcessController {
	private final UserService userService;
	private final AddPropertyService addPropertyService;
	private final ProjectEntityService projectEntityService;
	@GetMapping("/hi")
	public String hi() {
		return "hi";
		}
    @GetMapping("/getExports")
	public List<User> getAllExports(){
		List<User> exports=userService.findAllExports(PlanType.MARKETER_EXPORT);
		
		return exports;
	}

    @GetMapping("/getExportPros")
  	public List<User> getAllExportPros(){
  		List<User> exports=userService.findAllExports(PlanType.MARKETER_EXPORT_PRO);
  	
  		return exports;
  	}
    @GetMapping("/getConstructionProfessionals")
  	public List<User> getAllExportConstructionProfessionals(){
  		List<User> exports=userService.findAllExports(PlanType.PROFESSIONAL_SINGLE);
  	
  		return exports;
  	}
    @GetMapping("getProfileImg/{userId}")
    public ResponseEntity<Resource> getProfileImg(@PathVariable Long userId) throws Exception
    {
    	Map<String, Object> res=userService.getProfileImg(userId);
    	 String contentType = (String) res.get("type");
 	    Resource resource = (Resource) res.get("resource");
    	return ResponseEntity.status(HttpStatus.OK).header(HttpHeaders.CONTENT_TYPE  , contentType).body(resource);
    }
    
    @GetMapping("profile/{user_id}")
    public ResponseEntity<ProfileDto> getProfile(@PathVariable Long user_id){
    	var add= addPropertyService.getProfileDetails(user_id);
    	return ResponseEntity.status(HttpStatus.OK).body(add);
    	
    }


    //  COMPANY PROJECT//

    @GetMapping("/singleProject/{id}")
    public ResponseEntity<ProjectEntity> getProjectById(@PathVariable Long id) {
        ProjectEntity project = projectEntityService.getProjectById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        return ResponseEntity.ok(project);
    }

    @GetMapping("/getProjectImage/{id}")
    public ResponseEntity<Resource> getProjectImage(@PathVariable Long id) throws Exception {
        Map<String, Object> res = projectEntityService.getProjectImage(id);
        String contentType = (String) res.get("type"); // e.g., "image/jpeg"
        Resource resource = (Resource) res.get("resource");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .body(resource);
    }

    @GetMapping("/getProjectVideo/{id}")
    public ResponseEntity<Resource> getProjectVideo(@PathVariable Long id) throws Exception {
        Map<String, Object> res = projectEntityService.getProjectVideo(id);
        String contentType = (String) res.get("type"); // e.g., "video/mp4"
        Resource resource = (Resource) res.get("resource");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .body(resource);
    }

    @GetMapping("/getProjectBrochure/{id}")
    public ResponseEntity<Resource> getProjectBrochure(@PathVariable Long id) throws Exception {
        Map<String, Object> res = projectEntityService.getProjectBrochure(id);
        String contentType = (String) res.get("type"); // e.g., "application/pdf"
        Resource resource = (Resource) res.get("resource");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + res.get("fileName") + "\"")
                .body(resource);
    }


// This is the end for company projects //

    @GetMapping("/getCompanyNormal")
    public List<User> getAllCompaniesByPlanType(){
        List<User> companies = userService.findAllExports(PlanType.COMPANY_NORMAL);
        return companies;
    }

    @GetMapping("/getCompanyPro")
    public List<User> getCompaniesByPlanType(){
        List<User> companies = userService.findAllExports(PlanType.COMPANY_PRO);
        return companies;
    }
    @GetMapping("/{plain}")
    public ResponseEntity<List<ProjectEntity>> getPremiumProjects(@PathVariable String plain) {
        PlanType p = PlanType.valueOf(plain);
        List<ProjectEntity> projects = userService.getProjectsByPlanType(p);
        return ResponseEntity.ok(projects);
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
    
    @GetMapping("lottery/getAlllottry")
    public ResponseEntity<List<LotteryForm>> getAllLotteries() {
        List<LotteryForm> lotteries = addPropertyService.getAllLotteries();
        return ResponseEntity.ok(lotteries);
    }
    @GetMapping("lottery/image/{filename}")
    public ResponseEntity<Resource> getLotteryImage(@PathVariable String filename) {
        try {
            Map<String, Object> result = addPropertyService.getLotteryImage(filename);
            Resource resource = (Resource) result.get("resource");
            String type = (String) result.get("type");

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(type))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    private final LotterFormRepo lRepo;
    private final LotteryRepo lotteryRepo;
    @GetMapping("lottery/getAlllottry/{id}")
    public ResponseEntity<LotteryForm> getLotteryById(@PathVariable Long id) {
        LotteryForm lottery = lRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Lottery not found"));
        return ResponseEntity.ok(lottery);
    }


}
