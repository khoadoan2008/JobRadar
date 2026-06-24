package com.jobradar.job.repository;

import com.jobradar.job.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    // Tìm kiếm phân trang theo từ khóa (tiêu đề, công ty, kỹ năng) và địa điểm
    @Query("SELECT j FROM Job j WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(j.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(j.skills) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:location IS NULL OR :location = '' OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    Page<Job> searchJobs(@Param("keyword") String keyword, 
                         @Param("location") String location, 
                         Pageable pageable);
}
