package com.weekdays.properties.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

import com.weekdays.properties.entity.ProjectEntity;
import com.weekdays.properties.repository.ProjectRepo;
import com.weekdays.properties.service.ImageService;
import com.weekdays.properties.service.ProjectBrochureService;
import com.weekdays.properties.service.ProjectEntityService;
import com.weekdays.properties.service.ProjectImageService;
import com.weekdays.properties.service.ProjectVideoService;

import lombok.RequiredArgsConstructor;

@RestController
public class CompanyController {

//    private final ImageService imageService;
//    private final ProjectRepo projectRepo;

	@Autowired
    private ProjectEntityService projectEntityService;
	@Autowired
    private ProjectVideoService projectVideoService;
	@Autowired
    private ProjectImageService projectImageService;
	@Autowired
    private ProjectBrochureService projectBrochureService;

    @PostMapping("/addProject")
    public long addProject(@RequestBody ProjectEntity projectEntity)
    {
        long id=projectEntityService.addNewProject(projectEntity);
//		return ResponseEntity.status(HttpStatus.CREATED).body(new ProjectEntity(projectEntity.getId()+"was added Sucessfully"));
        return id;
    }

    @PostMapping("/addProject/{projectId}")
    public ResponseEntity<?> addProject(
            @PathVariable Long projectId,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
                @RequestParam(value = "videos", required = false) List<MultipartFile> videos,
            @RequestParam(value = "brochures", required = false) List<MultipartFile> brochures
    ) {
        try {
            if (images != null && !images.isEmpty()) {
                for (MultipartFile image : images) {
                    projectImageService.uploadProjectImage(image, projectId);
                }
            }

            if (videos != null && !videos.isEmpty()) {
                for (MultipartFile video : videos) {
                    projectVideoService.uploadProjectVideo(video, projectId);
                }
            }

            if (brochures != null && !brochures.isEmpty()) {
                for (MultipartFile brochure : brochures) {
                    projectBrochureService.uploadProjectBrochure(brochure, projectId);
                }
            }

            return ResponseEntity.ok("Project media uploaded successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload project media: " + e.getMessage());
        }
    }
    @GetMapping("/getProject/{userId}")  
    public List<ProjectEntity> getProjectsByUser(@PathVariable Long userId) {
        return projectEntityService.getProjectsByUser(userId);
    }

	


}
