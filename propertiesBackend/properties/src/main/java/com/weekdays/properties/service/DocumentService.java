package com.weekdays.properties.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.weekdays.properties.entity.AddPropertyModel;
import com.weekdays.properties.entity.DocumentEntity;
import com.weekdays.properties.repository.AddPropertyRepo;
import com.weekdays.properties.repository.DocumentRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentService {
	  @Value("${file.upload-dir}")
	    private String uploadDir1;
	
	String uploadDir="documents/";
	private final DocumentRepo documentRepo;
	private final AddPropertyRepo addPropertyRepo;
	public void uploadDocument(MultipartFile document, long propertyId) throws Exception {
		
		if (document == null || document.isEmpty()) {
	        System.out.println("No document uploaded — skipping document upload");
	        return; // Exit safely instead of crashing
	    }
		Path uploadPath=Paths.get(uploadDir1,uploadDir);
		if(!Files.exists(uploadPath))
		{
			Files.createDirectories(uploadPath);
		}
		String documentName=document.getOriginalFilename();
		if(documentName != null)
		{
			documentName=documentName.replaceAll(" ", "_");
		}
		Path documentPath=uploadPath.resolve(documentName);
		Files.copy(document.getInputStream(), documentPath,StandardCopyOption.REPLACE_EXISTING);
		String documentType=document.getContentType();
		AddPropertyModel addPropertyModel=addPropertyRepo.findById(propertyId).orElseThrow(()-> new RuntimeException("Property Not Found"));
		DocumentEntity documentEntity=new DocumentEntity();
		documentEntity.setAddPropertyModel(addPropertyModel);
		documentEntity.setDocumentName(documentName);
		documentEntity.setDocumentType(documentType);
		documentEntity.setDocumrntPath(documentPath.toString());
		documentRepo.save(documentEntity);
		
	}

}
