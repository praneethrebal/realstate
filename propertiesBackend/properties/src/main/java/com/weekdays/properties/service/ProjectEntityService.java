package com.weekdays.properties.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.weekdays.properties.entity.ProjectBrochure;
import com.weekdays.properties.entity.ProjectEntity;
import com.weekdays.properties.entity.ProjectImage;
import com.weekdays.properties.entity.ProjectVideo;
import com.weekdays.properties.entity.User;
import com.weekdays.properties.repository.*;
import com.weekdays.properties.repository.ProjectBrochureRepo;
import com.weekdays.properties.repository.ProjectImageRepo;
import com.weekdays.properties.repository.ProjectVideoRepo;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectEntityService {

    private final UserRepository userRepo;
    private final ProjectRepo projectEntityRepo;

    private final ProjectImageRepo projectImageRepo;
    private final ProjectVideoRepo projectVideoRepo;
    private final ProjectBrochureRepo projectBrochureRepo;

    // Add new project
    public long addNewProject(ProjectEntity projectEntity) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        projectEntity.setUser(user);
        projectEntityRepo.save(projectEntity);
        return projectEntity.getId();
    }

    // Get project by ID
    public Optional<ProjectEntity> getProjectById(Long id) {
        return projectEntityRepo.findById(id);
    }

    // Fetch single image
    public Map<String, Object> getProjectImage(Long id) throws Exception {
        ProjectImage image = projectImageRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));
        return loadFileResource(image.getFilePath(), image.getFileName());
    }

    // Fetch single video
    public Map<String, Object> getProjectVideo(Long id) throws Exception {
        ProjectVideo video = projectVideoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        return loadFileResource(video.getFilePath(), video.getFileName());
    }

    // Fetch single brochure
    public Map<String, Object> getProjectBrochure(Long id) throws Exception {
        ProjectBrochure brochure = projectBrochureRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Brochure not found"));
        return loadFileResource(brochure.getFilePath(), brochure.getFileName());
    }

    // Helper method to read file and return Resource + MIME type
    private Map<String, Object> loadFileResource(String filePath, String fileName) throws Exception {
        Path path = Path.of(filePath);
        if (!Files.exists(path)) throw new RuntimeException("File not found on server");

        Resource resource = new FileSystemResource(path);
        String contentType = Files.probeContentType(path);

        Map<String, Object> res = new HashMap<>();
        res.put("resource", resource);
        res.put("type", contentType != null ? contentType : "application/octet-stream");
        res.put("fileName", fileName);
        return res;
    }
    public boolean deleteProject(Long userId, Long ProjectId) {
    	Optional<ProjectEntity> projectOpt = projectEntityRepo.findById(ProjectId);
    	if (projectOpt.isPresent()) {
    		ProjectEntity project = projectOpt.get();
            if (project.getUser() != null && project.getUser().getId().equals(userId)) {
            	projectEntityRepo.deleteById(ProjectId);
                return true;
            }
        }
        return false;
    }

	public List<ProjectEntity> getProjectsByUser(Long userId) {
	return projectEntityRepo.findByUser_Id(userId);
	    
	}
}