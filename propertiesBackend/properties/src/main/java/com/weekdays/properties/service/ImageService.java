package com.weekdays.properties.service;

import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.weekdays.properties.entity.AddPropertyModel;
import com.weekdays.properties.entity.ImageEntity;
import com.weekdays.properties.entity.ProjectImage;
import com.weekdays.properties.repository.AddPropertyRepo;
import com.weekdays.properties.repository.ImageRepo;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImageService {

	  @Value("${file.upload-dir}")
	    private String uploadDir1;
	String imageDir="images/";
	private final AddPropertyRepo addPropertyRepo;
	private final ImageRepo imageRepo;


   
	public void uploadImage(MultipartFile image, long userId) throws Exception {
		Path uploadPath=Paths.get(uploadDir1,imageDir);
		if(!Files.exists(uploadPath))
		{
			Files.createDirectories(uploadPath);
		}
		String imageName=image.getOriginalFilename();
		if(imageName != null)
		{
			imageName=imageName.replaceAll(" ", "_");
		}
		Path imagePath=uploadPath.resolve(imageName);
		String imageType=image.getContentType();
		Files.copy(image.getInputStream(), imagePath,StandardCopyOption.REPLACE_EXISTING);
		AddPropertyModel addPropertyModel=addPropertyRepo.findById(userId).orElseThrow(()->new RuntimeException("Property FoundNot "));
		ImageEntity imageEntity=new ImageEntity( );
		imageEntity.setAddPropertyModel(addPropertyModel);
		imageEntity.setImageName(imageName);
		imageEntity.setImagePath(imagePath.toString());
		imageEntity.setImageType(imageType);
		imageRepo.save(imageEntity);
		
	}


	public Resource getPropertyImage(long imageId) throws Exception {
		ImageEntity image=imageRepo.findById(imageId).orElseThrow(()->new RuntimeException("Image was not Uploaded"));
		Path imagePathProp=Paths.get(image.getImagePath());
		Resource resource=new UrlResource(imagePathProp.toUri());
		 if (!resource.exists() || !resource.isReadable()) {
		        throw new RuntimeException("Image Was not There");
		    }
		return resource;
	}


	public String getContentType(long imageId) {
		ImageEntity image=imageRepo.findById(imageId).orElseThrow(()->new RuntimeException("Image was not Uploaded"));
		
		
		return image.getImageType();
	}


	


	

}
