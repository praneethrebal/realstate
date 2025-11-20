package com.weekdays.properties.service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.weekdays.properties.entity.ProjectEntity;
import com.weekdays.properties.entity.ProjectImage;
import com.weekdays.properties.repository.ProjectImageRepo;
import com.weekdays.properties.repository.ProjectRepo;

import lombok.RequiredArgsConstructor;
import java.nio.file.Files;

@Service
@RequiredArgsConstructor
public class ProjectImageService {
String imageDir="projectImages";
	
	private final ProjectRepo projectEntityRepo;
	private final ProjectImageRepo projectImageRepo;
	

	public void uploadProjectImage(MultipartFile image,Long projectId) throws Exception{
		
		Path uploadPath=Paths.get(imageDir);
		if(!Files.exists(uploadPath))
		{
			Files.createDirectory(uploadPath);
		}
		String imageName=image.getOriginalFilename();
		if(imageName != null)
		{
			imageName=imageName.replaceAll(" ", "_");
		}
		Path imagePath=uploadPath.resolve(imageName);
		String imageType=image.getContentType();
		Files.copy(image.getInputStream(), imagePath,StandardCopyOption.REPLACE_EXISTING);
		
		ProjectImage projectImage=new ProjectImage( );
		//projectImage.setProject(projectName);
		projectImage.setFileName(imageName);
		projectImage.setFilePath(imagePath.toString());
		projectImage.setFileType(imageType);
		ProjectEntity project=projectEntityRepo.findById(projectId).orElseThrow();
		projectImage.setProject(project);
		projectImageRepo.save(projectImage);
		
	}

}