package com.jobradar.job.service;

import com.jobradar.job.entity.Job;
import com.jobradar.job.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;

    @Override
    public Page<Job> getJobs(String keyword, String location, Pageable pageable) {
        return jobRepository.searchJobs(keyword, location, pageable);
    }

    @Override
    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new com.jobradar.job.exception.ResourceNotFoundException("Không tìm thấy công việc với ID: " + id));
    }

    @Override
    public Job createJob(Job job) {
        return jobRepository.save(job);
    }
}
