package com.weekdays.properties.service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.Files;

import com.weekdays.properties.repository.ProjectBrochureRepo;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.weekdays.properties.entity.ProjectBrochure;
import com.weekdays.properties.entity.ProjectEntity;
import com.weekdays.properties.repository.ProjectRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectBrochureService {
String uploadDir="projectBrochures";
	
	private final ProjectRepo projectEntityRepo;
	private final ProjectBrochureRepo projectBrochureRepo;
	

	public void uploadProjectBrochure(MultipartFile brochure,Long projectId) throws Exception {
	    if (brochure == null || brochure.isEmpty()) {
	        System.out.println("No brochure uploaded — skipping brochure upload");
	        return; // Exit safely instead of crashing
	    }

	    Path uploadPath = Paths.get(uploadDir);
	    if (!Files.exists(uploadPath)) {
	        Files.createDirectories(uploadPath);
	    }

	    String brochureName = brochure.getOriginalFilename();
	    if (brochureName != null) {
	        brochureName = brochureName.replaceAll(" ", "_");
	    }

	    Path brochurePath = uploadPath.resolve(brochureName);
	    Files.copy(brochure.getInputStream(), brochurePath, StandardCopyOption.REPLACE_EXISTING);
	    String brochureType = brochure.getContentType();

	    ProjectBrochure projectBrochure = new ProjectBrochure();
	    projectBrochure.setFileName(brochureName);
	    projectBrochure.setFileType(brochureType);
	    projectBrochure.setFilePath(brochurePath.toString());
	    ProjectEntity project=projectEntityRepo.findById(projectId).orElseThrow();
		projectBrochure.setProject(project);
	    projectBrochureRepo.save(projectBrochure);
	}


}