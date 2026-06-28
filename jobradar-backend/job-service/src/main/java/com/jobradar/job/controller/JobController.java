package com.jobradar.job.controller;

import com.jobradar.job.dto.JobRequest;
import com.jobradar.job.entity.Job;
import com.jobradar.job.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // API lấy danh sách công việc có hỗ trợ tìm kiếm và phân trang
    @GetMapping
    public ResponseEntity<Page<Job>> getJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        // Sắp xếp theo ngày tạo mới nhất (descending)
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobs = jobService.getJobs(keyword, location, pageable);
        return ResponseEntity.ok(jobs);
    }

    // API lấy thông tin chi tiết một công việc theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    // API tạo mới công việc (Dùng cho test hoặc crawler đẩy lên)
    @PostMapping
    public ResponseEntity<Job> createJob(@Valid @RequestBody JobRequest jobRequest) {
        return ResponseEntity.ok(jobService.createJob(jobRequest));
    }

    // API cập nhật công việc theo ID
    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @Valid @RequestBody JobRequest jobRequest) {
        return ResponseEntity.ok(jobService.updateJob(id, jobRequest));
    }

    // API xóa công việc theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}
