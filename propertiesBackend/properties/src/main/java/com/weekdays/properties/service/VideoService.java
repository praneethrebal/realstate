package com.weekdays.properties.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.weekdays.properties.entity.AddPropertyModel;
import com.weekdays.properties.entity.VideoEmtity;
import com.weekdays.properties.repository.AddPropertyRepo;
import com.weekdays.properties.repository.VideoRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VideoService {
	   @Value("${file.upload-dir}")
	    private String uploadDir1;
	String uploadDir="videos/";
	private final AddPropertyRepo addPropertyRepo;
	private final VideoRepo videoRepo;
	

	public void uploadVideo(MultipartFile video, long propertyId) throws Exception {
		Path uploadPath=Paths.get(uploadDir1,uploadDir);
		if(!Files.exists(uploadPath))
		{
			Files.createDirectories(uploadPath);
		}
		String videoName=video.getOriginalFilename();
		if(videoName != null)
		{
			videoName=videoName.replaceAll(" ", "_");
		}
		Path videoPath=uploadPath.resolve(videoName);
		String videoType=video.getContentType();
		AddPropertyModel addPropertyModel=addPropertyRepo.findById(propertyId)
					.orElseThrow(()->new RuntimeException("Property FoundNot "));
		Files.copy(video.getInputStream(),videoPath,StandardCopyOption.REPLACE_EXISTING );
		VideoEmtity videoEntity=new VideoEmtity();
		videoEntity.setAddPropertyModel(addPropertyModel);
		videoEntity.setVideoName(videoName);
		videoEntity.setVideoType(videoType);
		videoEntity.setVideoPath(videoPath.toString());
		videoRepo.save(videoEntity);
	}


	public Map<String, Object> getPropertyVideo(long videoId) throws Exception {
	    HashMap<String, Object> map = new HashMap<>();

	    VideoEmtity video = videoRepo.findById(videoId)
	            .orElseThrow(() -> new RuntimeException("Video Not Found with ID: " + videoId));
	    Path videoPathProp = Paths.get(video.getVideoPath());

	    if (!Files.exists(videoPathProp)) {
	        throw new RuntimeException("Video file not found at: " + videoPathProp);
	    }

	    Resource resource = new UrlResource(videoPathProp.toUri());
	    if (!resource.exists() || !resource.isReadable()) {
	        throw new RuntimeException("Video is not readable: " + videoPathProp);
	    }

	    // ✅ Determine video content type safely
	    String type = video.getVideoType();
	    if (type == null || type.isEmpty()) {
	        type = Files.probeContentType(videoPathProp);
	        if (type == null) type = "video/mp4";
	    }

	    map.put("resource", resource);
	    map.put("type", type);

	    System.out.println("🎬 Serving video: " + videoPathProp + " (type: " + type + ")");
	    return map;
	}



}
