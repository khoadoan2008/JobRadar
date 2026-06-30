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
        org.springframework.data.jpa.domain.Specification<Job> spec = (root, query, cb) -> {
            java.util.List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
            
            // Lọc theo địa điểm (AND)
            if (location != null && !location.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }
            
            // Lọc theo từ khóa / danh sách kỹ năng (OR giữa các từ khóa)
            if (keyword != null && !keyword.trim().isEmpty()) {
                String[] parts = keyword.split("[,;]");
                java.util.List<jakarta.persistence.criteria.Predicate> keywordPredicates = new java.util.ArrayList<>();
                for (String part : parts) {
                    if (part.trim().isEmpty()) continue;
                    String cleanPart = "%" + part.trim().toLowerCase() + "%";
                    // Tìm kiếm khớp OR với tiêu đề, công ty, hoặc kỹ năng
                    keywordPredicates.add(cb.like(cb.lower(root.get("title")), cleanPart));
                    keywordPredicates.add(cb.like(cb.lower(root.get("companyName")), cleanPart));
                    keywordPredicates.add(cb.like(cb.lower(root.get("skills")), cleanPart));
                }
                if (!keywordPredicates.isEmpty()) {
                    predicates.add(cb.or(keywordPredicates.toArray(new jakarta.persistence.criteria.Predicate[0])));
                }
            }
            
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
        return jobRepository.findAll(spec, pageable);
    }

    @Override
    @Cacheable(value = "jobs", key = "#id")
    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy công việc với ID: " + id));
    }

    @Override
    public Job createJob(JobRequest jobRequest) {
        if (jobRepository.findByJobUrl(jobRequest.getJobUrl()).isPresent()) {
            throw new com.jobradar.job.exception.DuplicateResourceException("Tin tuyển dụng với URL này đã tồn tại: " + jobRequest.getJobUrl());
        }
        Job job = new Job();
        mapDtoToEntity(jobRequest, job);
        return jobRepository.save(job);
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
