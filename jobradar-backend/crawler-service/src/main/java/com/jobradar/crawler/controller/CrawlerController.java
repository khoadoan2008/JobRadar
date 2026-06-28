package com.jobradar.crawler.controller;

import com.jobradar.crawler.service.JobCrawler;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/crawler")
@RequiredArgsConstructor
public class CrawlerController {

    private final List<JobCrawler> crawlers;

    @GetMapping("/crawl")
    public ResponseEntity<String> triggerCrawl(@RequestParam(required = false) String source) {
        if (source != null) {
            JobCrawler targetCrawler = crawlers.stream()
                    .filter(c -> c.getProviderName().equalsIgnoreCase(source))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bộ cào phù hợp cho nguồn: " + source));
            
            // Chạy bất đồng bộ trong thread mới để tránh block HTTP response
            new Thread(targetCrawler::crawl).start();
            return ResponseEntity.ok("Đã kích hoạt tiến trình cào dữ liệu cho nguồn: " + source.toUpperCase());
        }

        // Nếu không truyền source, chạy tất cả crawlers
        crawlers.forEach(c -> new Thread(c::crawl).start());
        return ResponseEntity.ok("Đã kích hoạt tất cả các bộ cào dữ liệu!");
    }
}
