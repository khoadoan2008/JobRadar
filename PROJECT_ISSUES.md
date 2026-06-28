# 🛠️ JobRadar Project - Issue Tracking & Refactoring Plan

File này dùng để theo dõi tất cả các vấn đề (Issues), các tính năng cần tái cấu trúc (Refactoring) và các mục tiêu nâng cấp kỹ thuật cho toàn bộ hệ thống JobRadar Microservices.

Đánh dấu `[x]` cho những mục đã hoàn thành, `[ ]` cho các mục đang chờ xử lý.

---

## 🔐 Phân hệ: Auth Service (Service Xác thực & Phân quyền)

### 1. 🧪 Testing (Kiểm thử)
- [x] Viết Unit Test cho `AuthServiceImpl` (Đã bắt đầu triển khai với Mockito).
- [x] Viết Unit Test cho `CustomOAuth2UserService`.
- [x] Viết Integration Test cho `AuthController` (Sử dụng MockMvc).
- [x] Viết Test kiểm tra cấu hình `SecurityConfig` và bộ lọc `JwtAuthenticationFilter`.

### 2. 🚨 Error Handling (Xử lý lỗi)
- [x] Loại bỏ `RuntimeException` chung chung trong các service và controller.
- [x] Tạo các Custom Exception (`UnauthorizedException` - 401, `DuplicateResourceException` - 409, `ResourceNotFoundException` - 404).
- [x] Xây dựng `GlobalExceptionHandler` (`@RestControllerAdvice`) để tự động map Exception thành HTTP Status và ErrorResponse chuẩn.

### 3. 🔄 Token Refresh (Cơ chế Refresh Token)
- [x] **Bước 1: Cấu hình Expiration:** Giảm thời gian sống của Access Token xuống 15 phút và khai báo thêm thời gian cho Refresh Token (vd: 7 ngày) trong `application.properties`.
- [x] **Bước 2: Tạo Entity & Repository:** Xây dựng bảng `RefreshToken` (gồm các trường: id, token, expiryDate, user_id) và `RefreshTokenRepository`.
- [x] **Bước 3: Cập nhật DTO:** Cập nhật `AuthResponse` để server có thể trả về cả `accessToken` lẫn `refreshToken`.
- [x] **Bước 4: Xây dựng Service:** Tạo `RefreshTokenService` chứa các logic xử lý: `createRefreshToken`, `verifyExpiration`, `deleteByUserId`.
- [x] **Bước 5: Thêm Endpoints API:** Bổ sung API `/api/v1/auth/refresh` (để cấp token mới) và `/api/v1/auth/logout` (để xóa token khỏi DB) trong `AuthController`.

### 4. 🔐 JWT Security & Secrets Management (Bảo mật thông tin cấu hình)
- [x] Xóa bỏ giá trị chuỗi Secret hardcode mặc định trong `application.properties`.
- [x] Bắt buộc ứng dụng phải đọc `JWT_SECRET_KEY` từ biến môi trường (Environment Variables).

### 5. 🛡️ Rate Limiting & Security (Chống tấn công Brute-force)
- [x] Tích hợp cơ chế Rate Limiting (Giới hạn số lần gọi API) cho các endpoint nhạy cảm như `/login` và `/register`.
- [x] Khảo sát việc triển khai thư viện `Bucket4j` tại Service hoặc chuyển cấu hình chặn IP lên API Gateway.

### 6. 📝 Audit / Logging (Ghi log chuẩn)
- [x] Loại bỏ các lệnh `System.out.println()` không tiêu chuẩn.
- [x] Thư viện hóa bằng `SLF4J` (`@Slf4j`) kết hợp với Logback mặc định của Spring Boot để quản lý log dễ dàng hơn.

### 7. 🌐 CORS (Cross-Origin Resource Sharing)
- [x] Bổ sung cấu hình `CorsConfigurationSource` trong `SecurityConfig` để cho phép ReactJS Client (vd: `http://localhost:5173`) có thể giao tiếp với Backend an toàn.

---

## 🚪 Phân hệ: API Gateway (Spring Cloud Gateway)
*(Chưa có issue nào. Sẽ bổ sung khi phát triển).*

## 💼 Phân hệ: Job Service (Quản lý việc làm)

### 1. ⚙️ CRUD API & Validation
- [x] Tạo thực thể `Job` ánh xạ xuống database.
- [x] Viết API GET (tìm kiếm phân trang theo từ khóa và địa điểm), GET /{id} (chi tiết tin).
- [x] Viết API POST (tạo mới tin tuyển dụng).
- [x] Bổ sung API PUT (cập nhật tin tuyển dụng) và DELETE (xóa tin tuyển dụng) để hoàn thiện CRUD.
- [x] Tạo `JobRequest` DTO tách biệt dữ liệu đầu vào và Entity.
- [x] Tích hợp `jakarta.validation` để validate dữ liệu đầu vào (không để trống title, companyName, location; đúng định dạng URL cho jobUrl).

### 2. 🚨 Error Handling (Xử lý lỗi)
- [x] Tạo custom `ResourceNotFoundException`.
- [x] Xây dựng `GlobalExceptionHandler` dùng `@RestControllerAdvice` để format JSON lỗi thống nhất.
- [x] Bổ sung bộ xử lý lỗi Validation (`MethodArgumentNotValidException`) để trả lỗi chi tiết về client.

### 3. ⚡ Redis Caching (Tối ưu truy xuất)
- [x] Thêm cấu hình Container `redis` Alpine trong `docker-compose.yml` ở cổng 6379.
- [x] Tích hợp `spring-boot-starter-data-redis` vào `pom.xml`.
- [x] Cho phép `Job` entity implements `Serializable` để tuần tự hóa dữ liệu ghi xuống Redis.
- [x] Sử dụng `@Cacheable` cho API GET chi tiết, `@CachePut` cho API PUT cập nhật và `@CacheEvict` cho API DELETE để xóa cache tương ứng.

### 4. 🧪 Testing & CI/CD (Kế hoạch sắp tới)
- [ ] Viết Unit Test cho `JobServiceImpl` bằng Mockito.
- [ ] Viết Integration Test cho `JobController` bằng MockMvc.

## 🕷️ Phân hệ: Crawler Service (Thu thập dữ liệu)

### 1. ⚙️ Module Setup & Routing
- [x] Khởi tạo module độc lập `crawler-service` chạy ở cổng 8084.
- [x] Cấu hình định tuyến và bỏ qua xác thực cho API `/api/v1/crawler/**` ở API Gateway.
- [x] Tạo `JobRequest` DTO đồng bộ dữ liệu với `job-service`.
- [x] Thiết lập `JobClient` sử dụng OpenFeign để gọi POST sang `job-service`.

### 2. 🕷️ Crawler Strategies (Các bộ cào tin)
- [x] Định nghĩa interface chung `JobCrawler` theo Strategy Pattern.
- [x] Triển khai thành công bộ cào tin `ChoTotCrawler` lấy tin từ API JSON công khai của Chợ Tốt.
- [x] Tạo `CrawlerController` cung cấp API `/api/v1/crawler/crawl` để trigger bộ cào thủ công.
- [ ] Triển khai bộ cào HTML `VietnamWorksCrawler` sử dụng JSoup.
- [ ] Triển khai bộ cào HTML `TopCVCrawler` sử dụng JSoup.
- [ ] Tích hợp **FlareSolverr** qua Docker để vượt Cloudflare cào tin từ ITviec.
