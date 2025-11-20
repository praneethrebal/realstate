package com.weekdays.properties.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.weekdays.properties.entity.Reels;
import com.weekdays.properties.entity.User;
import com.weekdays.properties.repository.ReelRepo;
import com.weekdays.properties.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
@RequiredArgsConstructor
public class ReelService {

    private final UserRepository userRepository;
    private final ReelRepo reelRepo;
    
    @Value("${file.upload-dir}")
    private String uploadDir1;
	String reelDir="reels/";

  
	public void postReel(String title, String descripation, MultipartFile reel) throws Exception {
		Path uploadPath=Paths.get(uploadDir1,reelDir);
		if(!Files.exists(uploadPath))
		{
			Files.createDirectories(uploadPath);
		}
		String reelName=reel.getOriginalFilename();
		if(reelName != null)
		{
			reelName=reelName.replaceAll(" ", "_");
		}
		Path reelPath=uploadPath.resolve(reelName);
		String reelType=reel.getContentType();
		String username=SecurityContextHolder.getContext().getAuthentication().getName();
		User user=userRepository.findByUsername(username).orElseThrow();
		Files.copy(reel.getInputStream(), reelPath,StandardCopyOption.REPLACE_EXISTING);
		Reels reels=new Reels();
		reels.setUser(user);
		reels.setReelName(reelName);
		reels.setDescripation(descripation);
		reels.setTitle(title);
		reels.setReelPath(reelPath.toString());
		reels.setLikesCount(0);
		reels.setReelType(reelType);
		reelRepo.save(reels);
		}


	public List<Reels> findListOfReels() {
		
		return reelRepo.findAll();
	}


	public Map<String, Object> getReelVideo(long id) throws Exception{
		Map<String,Object> map=new HashMap<String, Object>();
		Reels reel=reelRepo.findById(id).orElseThrow();
		Path reelPath=Paths.get(reel.getReelPath());
		Resource resource=new UrlResource(reelPath.toUri());
		 if (!resource.exists() || !resource.isReadable()) {
		        throw new RuntimeException("Video Was not There");
		    }
		 map.put("resource", resource);
		 map.put("type", reel.getReelType());
		
		return map;
	}

	public List<Reels> getReelsByUser(Long userId) {
        return reelRepo.findByUserId(userId);
    }


	public void likeCount(int reelId) {
		Long l=(long) reelId;
		Reels reel=reelRepo.findById(l).orElseThrow();
		
		reel.setLikesCount(reel.getLikesCount()+1);
		reelRepo.save(reel);
		
	}


}
