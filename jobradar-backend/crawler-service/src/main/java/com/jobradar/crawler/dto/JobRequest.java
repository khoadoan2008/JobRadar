package com.jobradar.crawler.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequest {
    private String title;
    private String companyName;
    private String companyLogo;
    private String location;
    private String salary;
    private String jobType;
    private String description;
    private String requirements;
    private String skills;
    private String jobUrl;
    private String provider;
}
