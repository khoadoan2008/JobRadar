package com.jobradar.job.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "company_logo")
    private String companyLogo;

    private String location;

    private String salary;

    @Column(name = "job_type")
    private String jobType; // Full-time, Part-time, Remote, Internship...

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String skills; // Lưu chuỗi phân cách bởi dấu phẩy, vd: "Java, Spring Boot, SQL"

    @Column(name = "job_url")
    private String jobUrl; // Đường dẫn đến bài đăng gốc

    private String provider; // TOPCV, VIETNAMWORKS, ITVIEC...

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
