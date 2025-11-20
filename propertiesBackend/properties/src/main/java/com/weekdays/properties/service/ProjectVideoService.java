package com.weekdays.properties.service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.weekdays.properties.entity.ProjectEntity;
import com.weekdays.properties.entity.ProjectVideo;
import com.weekdays.properties.repository.ProjectRepo;
import com.weekdays.properties.repository.ProjectVideoRepo;

import lombok.RequiredArgsConstructor;
import java.nio.file.Files;
@Service
@RequiredArgsConstructor
public class ProjectVideoService {

String uploadDir="Projectvideos";
	

private final ProjectVideoRepo projectVideoRepo;
private final ProjectRepo projectEntityRepo;

public void uploadProjectVideo(MultipartFile video,Long projectId) throws Exception {
	
	Path uploadPath=Paths.get(uploadDir);
	if(!Files.exists(uploadPath))
	{
		Files.createDirectory(uploadPath);
	}
	String videoName=video.getOriginalFilename();
	if(videoName != null)
	{
		videoName=videoName.replaceAll(" ", "_");
	}
	Path videoPath=uploadPath.resolve(videoName);
	String videoType=video.getContentType();

	Files.copy(video.getInputStream(),videoPath,StandardCopyOption.REPLACE_EXISTING );
	ProjectVideo projectVideo=new ProjectVideo();
	//projectVideo.setProject(projectName);
	projectVideo.setFileName(videoName);
	projectVideo.setFileType(videoType);
	projectVideo.setFilePath(videoPath.toString());
	ProjectEntity project=projectEntityRepo.findById(projectId).orElseThrow();
	projectVideo.setProject(project);
	projectVideoRepo.save(projectVideo);
}

}