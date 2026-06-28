package com.jobradar.job.service;

import com.jobradar.job.dto.JobRequest;
import com.jobradar.job.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JobService {
    Page<Job> getJobs(String keyword, String location, Pageable pageable);
    Job getJobById(Long id);
    Job createJob(JobRequest jobRequest);
    Job updateJob(Long id, JobRequest jobRequest);
    void deleteJob(Long id);
}
