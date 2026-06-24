package com.jobradar.job.config;

import com.jobradar.job.entity.Job;
import com.jobradar.job.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final JobRepository jobRepository;

    @Override
    public void run(String... args) throws Exception {
        // Tự động chèn dữ liệu mẫu nếu bảng jobs hiện tại trống
        if (jobRepository.count() == 0) {
            Job job1 = new Job(
                    null,
                    "Senior Java Backend Developer (Spring Boot)",
                    "VNG Corporation",
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Z3m5S_aY3tN7b4a2C1R9H9P-yM8P2A6o8Q&s",
                    "Hồ Chí Minh",
                    "30 - 50 triệu",
                    "Full-time",
                    "Chúng tôi đang tìm kiếm Senior Java Developer phát triển hệ thống ZaloPay chịu tải cao...",
                    "Yêu cầu tối thiểu 5 năm kinh nghiệm Java, Spring Boot, Microservices, Caching (Redis), Database (Postgres)...",
                    "Java, Spring Boot, Microservices, Redis, PostgreSQL",
                    "https://vng.com.vn/careers",
                    "TOPCV",
                    null
            );

            Job job2 = new Job(
                    null,
                    "Frontend Engineer (ReactJS/Vite)",
                    "OneMount Group",
                    "https://static.ybox.vn/2021/4/2/1619623869911-Logo.png",
                    "Hà Nội",
                    "20 - 35 triệu",
                    "Full-time",
                    "Phát triển giao diện web cho hệ sinh thái VinShop, VinID ứng dụng các công nghệ mới nhất...",
                    "Thành thạo ReactJS, Javascript ES6+, CSS/Tailwind CSS, quản lý state (Redux/Zustand)...",
                    "ReactJS, JavaScript, Tailwind CSS, Vite",
                    "https://onemount.com/careers",
                    "VIETNAMWORKS",
                    null
            );

            Job job3 = new Job(
                    null,
                    "DevOps Engineer (Docker, Kubernetes)",
                    "FPT Software",
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcoV6x1cO7y_b3p0g1g3K0P-8g8P2A6o8Q&s",
                    "Đà Nẵng",
                    "1500 - 2500 USD",
                    "Remote",
                    "Vận hành hạ tầng Cloud (AWS/Azure), thiết lập CI/CD pipeline cho các dự án lớn...",
                    "Kinh nghiệm làm việc với Docker, K8s, Jenkins/Github Actions, Scripting (Python/Bash)...",
                    "Docker, Kubernetes, AWS, CI/CD, Jenkins",
                    "https://fpt-software.com/careers",
                    "ITVIEC",
                    null
            );

            Job job4 = new Job(
                    null,
                    "Junior Java Backend Developer",
                    "Shopee Vietnam",
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Z3m5S_aY3tN7b4a2C1R9H9P-yM8P2A6o8Q&s",
                    "Hồ Chí Minh",
                    "15 - 25 triệu",
                    "Full-time",
                    "Tham gia phát triển các tính năng thanh toán và giỏ hàng của ứng dụng Shopee...",
                    "Tốt nghiệp đại học chuyên ngành CNTT, nắm chắc cấu trúc dữ liệu, thuật toán và Java Core. Biết Spring Boot là lợi thế.",
                    "Java, Java Core, Spring Boot, MySQL",
                    "https://shopee.vn/careers",
                    "TOPCV",
                    null
            );

            Job job5 = new Job(
                    null,
                    "Fullstack Developer (Node.js & React)",
                    "Tiki.vn",
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcoV6x1cO7y_b3p0g1g3K0P-8g8P2A6o8Q&s",
                    "Hồ Chí Minh",
                    "25 - 40 triệu",
                    "Hybrid",
                    "Phát triển cả phần Frontend và Backend của hệ thống kho vận TikiNow...",
                    "Thành thạo Node.js (NestJS/Express) và ReactJS. Có kinh nghiệm với NoSQL (MongoDB) và REST API.",
                    "Node.js, ReactJS, MongoDB, REST API",
                    "https://tiki.vn/careers",
                    "ITVIEC",
                    null
            );

            jobRepository.saveAll(List.of(job1, job2, job3, job4, job5));
            System.out.println("✅ Khởi tạo thành công 5 tin tuyển dụng mẫu vào Database!");
        } else {
            System.out.println("ℹ️ Database đã có sẵn tin tuyển dụng, bỏ qua bước khởi tạo.");
        }
    }
}
