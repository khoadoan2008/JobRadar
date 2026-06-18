package com.jobradar.auth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "candidate_profiles")
public class CandidateProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name = "full_name")
    private String fullName;

    private String phone;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "cv_url")
    private String cvUrl;

    @Column(columnDefinition = "TEXT")
    private String skills;
}
