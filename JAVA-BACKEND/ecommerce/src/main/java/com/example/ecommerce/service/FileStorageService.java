package com.example.ecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeFile(MultipartFile file) throws IOException {
        try{
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path targetLocation = Paths.get(uploadDir).toAbsolutePath().resolve(fileName);
            Files.createDirectories(targetLocation.getParent());
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

