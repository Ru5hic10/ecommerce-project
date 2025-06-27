package com.example.ecommerce.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

// @Service
 public class S3FileService {
//
//     @Value("${aws.access-key}")
//     private String accessKey;
//
//     @Value("${aws.secret-key}")
//     private String secretKey;
//
//     @Value("${aws.s3.bucket-name}")
//     private String bucketName;
//
//     @Value("${aws.region}")
//     private String region;
//
//     public String uploadFile(MultipartFile file) {
//         BasicAWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);
//         AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
//                 .withRegion(region)
//                 .withCredentials(new AWSStaticCredentialsProvider(credentials))
//                 .build();
//
//         String key = "products/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
//         try {
//             s3Client.putObject(new PutObjectRequest(bucketName, key, file.getInputStream(), new ObjectMetadata()));
//             return s3Client.getUrl(bucketName, key).toString();
//         } catch (IOException e) {
//             throw new RuntimeException("Failed to upload to S3", e);
//         }
//     }
 }


