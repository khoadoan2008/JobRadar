package com.jobradar.job.service;

import com.jobradar.job.dto.JobRequest;
import com.jobradar.job.entity.Job;
import com.jobradar.job.exception.ResourceNotFoundException;
import com.jobradar.job.repository.JobRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JobServiceImplTest {

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private JobServiceImpl jobService;

    private Job sampleJob;
    private JobRequest sampleJobRequest;

    @BeforeEach
    void setUp() {
        sampleJob = new Job(
                1L,
                "Java Developer",
                "FPT",
                "logo.png",
                "Hanoi",
                "20m",
                "Full-time",
                "Desc",
                "Req",
                "Java",
                "http://fpt.com",
                "TOPCV",
                null
        );

        sampleJobRequest = new JobRequest(
                "Java Developer",
                "FPT",
                "logo.png",
                "Hanoi",
                "20m",
                "Full-time",
                "Desc",
                "Req",
                "Java",
                "http://fpt.com",
                "TOPCV"
        );
    }

    @Test
    void getJobs_ShouldReturnPageOfJobs() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Job> jobPage = new PageImpl<>(Collections.singletonList(sampleJob));

        when(jobRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class), any(Pageable.class)))
                .thenReturn(jobPage);

        Page<Job> result = jobService.getJobs("Java", "Hanoi", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Java Developer", result.getContent().get(0).getTitle());
        verify(jobRepository, times(1)).findAll(any(org.springframework.data.jpa.domain.Specification.class), eq(pageable));
    }

    @Test
    void getJobById_WhenJobExists_ShouldReturnJob() {
        when(jobRepository.findById(1L)).thenReturn(Optional.of(sampleJob));

        Job result = jobService.getJobById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Java Developer", result.getTitle());
        verify(jobRepository, times(1)).findById(1L);
    }

    @Test
    void getJobById_WhenJobDoesNotExist_ShouldThrowResourceNotFoundException() {
        when(jobRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> jobService.getJobById(99L));
        verify(jobRepository, times(1)).findById(99L);
    }

    @Test
    void createJob_ShouldSaveAndReturnJob() {
        when(jobRepository.findByJobUrl(any(String.class))).thenReturn(Optional.empty());
        when(jobRepository.save(any(Job.class))).thenReturn(sampleJob);

        Job result = jobService.createJob(sampleJobRequest);

        assertNotNull(result);
        assertEquals("Java Developer", result.getTitle());
        verify(jobRepository, times(1)).findByJobUrl(sampleJobRequest.getJobUrl());
        verify(jobRepository, times(1)).save(any(Job.class));
    }

    @Test
    void createJob_WhenJobUrlAlreadyExists_ShouldThrowDuplicateResourceException() {
        when(jobRepository.findByJobUrl(sampleJobRequest.getJobUrl())).thenReturn(Optional.of(sampleJob));

        assertThrows(com.jobradar.job.exception.DuplicateResourceException.class, () -> jobService.createJob(sampleJobRequest));

        verify(jobRepository, times(1)).findByJobUrl(sampleJobRequest.getJobUrl());
        verify(jobRepository, never()).save(any(Job.class));
    }

    @Test
    void updateJob_WhenJobExists_ShouldUpdateAndSaveJob() {
        when(jobRepository.findById(1L)).thenReturn(Optional.of(sampleJob));
        when(jobRepository.save(any(Job.class))).thenReturn(sampleJob);

        Job result = jobService.updateJob(1L, sampleJobRequest);

        assertNotNull(result);
        verify(jobRepository, times(1)).findById(1L);
        verify(jobRepository, times(1)).save(any(Job.class));
    }

    @Test
    void deleteJob_WhenJobExists_ShouldDeleteJob() {
        when(jobRepository.findById(1L)).thenReturn(Optional.of(sampleJob));
        doNothing().when(jobRepository).delete(any(Job.class));

        assertDoesNotThrow(() -> jobService.deleteJob(1L));

        verify(jobRepository, times(1)).findById(1L);
        verify(jobRepository, times(1)).delete(sampleJob);
    }
}
