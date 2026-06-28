package com.jobradar.job.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobRequest {

    @NotBlank(message = "Tiêu đề công việc không được để trống")
    private String title;

    @NotBlank(message = "Tên công ty không được để trống")
    private String companyName;

    private String companyLogo;

    @NotBlank(message = "Địa điểm không được để trống")
    private String location;

    private String salary;

    private String jobType;

    private String description;

    private String requirements;

    private String skills;

    @NotBlank(message = "Đường dẫn bài tuyển dụng gốc không được để trống")
    @URL(message = "Đường dẫn bài tuyển dụng không đúng định dạng")
    private String jobUrl;

    private String provider;
}
