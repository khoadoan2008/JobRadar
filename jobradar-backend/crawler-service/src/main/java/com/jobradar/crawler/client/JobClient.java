package com.jobradar.crawler.client;

import com.jobradar.crawler.dto.JobRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "job-service", url = "${services.job-service.url}")
public interface JobClient {

    @PostMapping(value = "/api/v1/jobs", headers = "Content-Type=application/json;charset=UTF-8")
    void createJob(@RequestBody JobRequest jobRequest);
}
