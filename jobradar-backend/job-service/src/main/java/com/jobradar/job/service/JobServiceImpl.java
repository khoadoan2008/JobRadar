package com.jobradar.job.service;

import com.jobradar.job.dto.JobRequest;
import com.jobradar.job.entity.Job;
import com.jobradar.job.exception.ResourceNotFoundException;
import com.jobradar.job.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
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
    @Cacheable(value = "jobs", key = "#id")
    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy công việc với ID: " + id));
    }

    @Override
    public Job createJob(JobRequest jobRequest) {
        return jobRepository.findByJobUrl(jobRequest.getJobUrl())
                .orElseGet(() -> {
                    Job job = new Job();
                    mapDtoToEntity(jobRequest, job);
                    return jobRepository.save(job);
                });
    }

    @Override
    @CachePut(value = "jobs", key = "#id")
    public Job updateJob(Long id, JobRequest jobRequest) {
        Job existingJob = getJobById(id);
        mapDtoToEntity(jobRequest, existingJob);
        return jobRepository.save(existingJob);
    }

    @Override
    @CacheEvict(value = "jobs", key = "#id")
    public void deleteJob(Long id) {
        Job existingJob = getJobById(id);
        jobRepository.delete(existingJob);
    }

    private void mapDtoToEntity(JobRequest dto, Job entity) {
        entity.setTitle(dto.getTitle());
        entity.setCompanyName(dto.getCompanyName());
        entity.setCompanyLogo(dto.getCompanyLogo());
        entity.setLocation(dto.getLocation());
        entity.setSalary(dto.getSalary());
        entity.setJobType(dto.getJobType());
        entity.setDescription(dto.getDescription());
        entity.setRequirements(dto.getRequirements());
        entity.setSkills(dto.getSkills());
        entity.setJobUrl(dto.getJobUrl());
        entity.setProvider(dto.getProvider());
    }
}
