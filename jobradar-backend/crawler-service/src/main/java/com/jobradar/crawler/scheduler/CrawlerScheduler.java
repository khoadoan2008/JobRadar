package com.jobradar.crawler.scheduler;

import com.jobradar.crawler.service.JobCrawler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class CrawlerScheduler {

    private final List<JobCrawler> crawlers;

    /**
     * Tự động kích hoạt cào dữ liệu từ tất cả các nguồn định kỳ.
     * fixedRateString được cấu hình qua key "crawler.schedule.rate-ms".
     * Mặc định là 1800000 ms (tương đương 30 phút).
     * initialDelay = 10000 ms (10 giây sau khi ứng dụng khởi động thành công để ổn định hệ thống).
     */
    @Scheduled(fixedRateString = "${crawler.schedule.rate-ms:1800000}", initialDelay = 10000)
    public void scheduleCrawlAllSources() {
        log.info("⏰ [Scheduler] Kích hoạt cào dữ liệu định kỳ cho toàn bộ nguồn tuyển dụng...");
        
        if (crawlers == null || crawlers.isEmpty()) {
            log.warn("⚠️ [Scheduler] Không tìm thấy bộ cào (JobCrawler) nào được đăng ký trong hệ thống!");
            return;
        }

        for (JobCrawler crawler : crawlers) {
            try {
                log.info("⏰ [Scheduler] Đang chạy bộ cào: {}", crawler.getProviderName());
                // Chạy trên Thread riêng biệt để tránh block luồng chính của Scheduler
                new Thread(crawler::crawl).start();
            } catch (Exception e) {
                log.error("❌ [Scheduler] Gặp lỗi khi kích hoạt bộ cào {}: {}", crawler.getProviderName(), e.getMessage());
            }
        }
    }
}
