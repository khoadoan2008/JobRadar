# 📚 Sổ Tay Kiến Thức & Lộ Trình Học Tập: JobRadar

Tài liệu này đóng vai trò là "kim chỉ nam" định hướng việc học công nghệ mới trong dự án. Bạn hãy dùng file này như một **nhật ký code (DevLog)**, liên tục ghi chú lại những gì mới học được hoặc cách sửa một con bug khó để sau này làm tư liệu viết vào CV và trả lời phỏng vấn nhé!

---

# Phần 1: Lộ Trình Học Tập (Cuốn Chiếu Theo Tiến Độ)
*Chiến lược: Không học nhồi nhét. Code đến Phase nào, học công nghệ của Phase đó.*

### Chặng 1: Nền tảng Lưu trữ (Khi bắt đầu với Auth Service)
**1. PostgreSQL**

*   **Nhiệm vụ:** Chuyển đổi tư duy từ SQL Server sang PostgreSQL.

*   **Trọng tâm cần học:** 

    *   Cách sử dụng các công cụ quản lý như pgAdmin hoặc DBeaver.

    *   Điểm sáng CV: Tìm hiểu cách sử dụng kiểu dữ liệu `JSONB` trong Postgre để lưu cấu hình linh hoạt (ví dụ: lưu CSS Selector của Crawler) mà không cần tạo quá nhiều bảng.

### Chặng 2: Công cụ thu thập dữ liệu (Khi code Crawler Service)
**2. JSoup & HTML Parsing**

*   **Nhiệm vụ:** Cào dữ liệu từ TopCV, VietnamWorks.

*   **Trọng tâm cần học:** Cú pháp **CSS Selector** (cách móc lấy dữ liệu từ thẻ `div.class-name` hoặc `a[href]`).

*   **Thực hành:** Đừng ghép vào Spring Boot vội, hãy viết một hàm `main` Java nhỏ chạy thử việc cào tiêu đề báo VnExpress trước cho quen tay.

### Chặng 3: Tối ưu Hiệu năng & Bất đồng bộ (Khi hoàn thiện Job Service & Alert)
**3. Redis (In-memory Caching)**

*   **Nhiệm vụ:** Tăng tốc độ load danh sách Job trên trang chủ, giảm tải cho Database.

*   **Trọng tâm cần học:** Cấu hình Redis vào Spring Boot. Cú pháp và ý nghĩa của các annotation `@Cacheable`, `@CachePut`, `@CacheEvict`.

**4. RabbitMQ (Message Broker)**

*   **Nhiệm vụ:** Xử lý hệ thống gửi Email cảnh báo việc làm tự động.

*   **Trọng tâm cần học:** Hiểu rõ luồng đi của dữ liệu: `Producer` (Người gửi) -> `Exchange` -> `Queue` (Hàng đợi) -> `Consumer` (Người nhận và xử lý). Hiểu lý do tại sao phải dùng hàng đợi để xử lý bất đồng bộ.

### Chặng 4: DevOps & Triển khai (Thực hành xuyên suốt)
**5. Docker & Docker Compose**

*   **Nhiệm vụ:** Thiết lập môi trường chạy code "1-click".

*   **Trọng tâm cần học:** 

    *   Biết cách viết `Dockerfile` để đóng gói app Spring Boot thành Image.

    *   Biết cách viết `docker-compose.yml` để khởi chạy đồng loạt PostgreSQL, Redis, RabbitMQ và FlareSolverr trên máy tính cá nhân.

### Chặng 5: Kiến trúc Microservices (Giai đoạn ghép nối cuối cùng)
**6. Spring Cloud Gateway & OpenFeign**

*   **Nhiệm vụ:** Nối các Service rời rạc lại thành 1 hệ thống thống nhất.

*   **Trọng tâm cần học:** 

    *   Gateway: Đóng vai trò làm "cổng bảo vệ" (Kiểm tra token) và Routing (Điều hướng request từ `/api/auth` về cổng của Auth Service).

    *   OpenFeign: Cách để Service A (ví dụ Job) có thể lấy dữ liệu từ Service B (ví dụ Auth) qua giao thức HTTP nội bộ.

---

# Phần 2: Sổ Tay Ghi Chú Kiến Thức (Take Notes)
*(💡 Hướng dẫn: Đừng chỉ copy code, hãy dùng format dưới đây để ghi lại tư duy giải quyết vấn đề của bạn. Khi phỏng vấn, nhà tuyển dụng rất thích hỏi "Em từng gặp khó khăn gì và cách em giải quyết ra sao?")*
<!--### 📝 Ngày .../.../202... - Chủ đề: [Tên công nghệ hoặc Tính năng]

*   **Khái niệm mới học được (Hiểu theo ý mình):**

    *   *Ghi chú ngắn gọn...*

*   **Đoạn code / Cấu hình tâm đắc:**
    ```java
    // Paste những đoạn code hay, config khó tìm vào đây
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**

    *   *Mô tả lỗi:* Chạy Spring Boot báo lỗi Connection Refused ở cổng 5432...

    *   *Cách giải quyết:* Do cấu hình sai username/password trong file application.yml...

    *   *Link tham khảo (StackOverflow, Blogs):* https://...

---
-->
<!--### 📝 Ngày .../.../202... - Chủ đề: 

*   **Khái niệm mới học được:**

    *   ...

*   **Đoạn code / Cấu hình tâm đắc:**
    ```yml
    
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**

    *   *Mô tả lỗi:* ...

    *   *Cách giải quyết:* ...
    -->


### 📝 Ngày 09/06/2026 - Chủ đề: Setup cấu hình Docker Compose
*   **Khái niệm mới học được:**

    * DOCKER: được sinh ra trên nền tảng linux, dùng để thay thế cho việc phải chạy máy ảo, gom ứng dụng và các thư viện vào 1 môi trường cách ly(Container). Windows tạo 1 Linux thu nhỏ gọi là WSL 

    * FILE docker-compose.yml: khai báo mọi thứ vào file này và chỉ cần gõ  docker-compose up -d , toàn bộ hệ thống sẽ tự động tải và khởi chạy ngầm.

*   **Đoạn code / Cấu hình tâm đắc:**
    ```yml
     postgres:
        image: postgres:15-alpine # Dùng phiên bản alpine siêu nhẹ, tiết kiệm RAM
        container_name: jobradar_postgres
        environment:
          POSTGRES_USER: postgres       # Username mặc định
          POSTGRES_PASSWORD: root       # Password đăng nhập
          POSTGRES_DB: jobradar_db      # Tên Database tự động tạo khi chạy lần đầu
        ports:

          - "5432:5432"                 # Ánh xạ Cổng của máy tính (Windows) vào cổng của Docker
        volumes:

          - postgres_data:/var/lib/postgresql/data # QUAN TRỌNG: Lưu dữ liệu ra ổ cứng thật, tắt Docker không bị mất data.
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**

    *   *Mô tả lỗi:* WSL old

    *   *Cách giải quyết:* down WSL mới bằng wsl --update --web install và nhớ cấp quền admin
### 📝 Ngày 10/06/2026 - Chủ đề: Thiết kế database PostgreSQL
*   **Khái niệm mới học được (Hiểu theo ý mình):**

    *   *BIGINT: id tự tăng giá trị *

    *   *VARCHAR: có thể tự hiểu tiếng việt và anh, không cần khai báo NVARCHAR

*   **Đoạn code / Cấu hình tâm đắc:**
    ```java
    // Paste những đoạn code hay, config khó tìm vào đây
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**

    *   *Mô tả lỗi:* Chạy Spring Boot báo lỗi Connection Refused ở cổng 5432...

    *   *Cách giải quyết:* Do cấu hình sai username/password trong file application.yml...

    *   *Link tham khảo (StackOverflow, Blogs):* https://...

---

### 📝 Ngày 12/06/2026 - Chủ đề: Cấu hình JWT (JSON Web Token) cho Auth Service

*   **Khái niệm mới học được (Hiểu theo ý mình):**

    *   **JWT là gì:** Một cơ chế tạo "thẻ thông hành" gồm 3 phần (Header, Payload, Signature). Server không cần lưu token vào database (giảm tải), chỉ cần dùng Secret Key để kiểm tra chữ ký xem token có hợp lệ không.
    *   **Bảo mật:** Không bao giờ lưu password vào Payload vì thông tin này có thể dễ dàng giải mã trên mạng. Chỉ lưu email hoặc ID.

*   **Đoạn code / Cấu hình tâm đắc:**
    ```java
    public String generateToken(Map<String, Object> extraClaims, String username) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(username) // Lưu email người dùng vào phần Payload của Token
                .setIssuedAt(new Date(System.currentTimeMillis())) // Thời gian tạo
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration)) // Thời gian hết hạn
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // Ký bằng mã bảo mật
                .compact();
    }
    ```

    *   *Mô tả lỗi:* ...

    *   *Cách giải quyết:* ...

    *   *Link tham khảo (StackOverflow, Blogs):* ...

---

### 📝 Ngày 12/06/2026 - Chủ đề: Spring Security & "Cú lừa" 403 Forbidden

*   **Khái niệm mới học được (Hiểu theo ý mình):**

    *   **Cơ chế báo lỗi của Spring Boot:** Khi code xảy ra lỗi (ví dụ 500 Internal Server Error do sập DB, NullPointer...), Spring Boot tự động chuyển hướng (forward) request đến đường dẫn ngầm là `/error` để tạo ra câu báo lỗi trả về cho màn hình/Postman.
    *   **Tại sao lại bị 403 Forbidden?** Vì cài Spring Security mà quên mở cửa cho `/error`. Khi lỗi 500 xảy ra -> Spring văng ra `/error` -> Spring Security thấy endpoint này chưa đăng ký `permitAll()` -> Đập ngay cái khiên chặn lại và báo 403 (Cấm truy cập). Kết quả là ta bị "mù", không biết lỗi thực sự ở bên trong là gì.

*   **Đoạn code / Cấu hình tâm đắc:**
    ```java
    // File: SecurityConfig.java
    .authorizeHttpRequests(auth -> auth
        // Bắt buộc phải thêm "/error" vào permitAll để không bị ghi đè mã lỗi
        .requestMatchers("/api/v1/auth/**", "/error").permitAll() 
        .anyRequest().authenticated()
    )
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**

    *   *Mô tả lỗi:* Test API đăng ký bằng Postman nhưng bị văng mã 403 Forbidden dù đã cho phép `/api/v1/auth/register`.
    *   *Cách giải quyết:* Thêm `"/error"` vào trong `.requestMatchers(...)` của SecurityConfig. Sau khi khởi động lại, Postman đã nhả ra đúng mã lỗi 500 và chỉ rõ dòng code bị sai để fix.

---

### 📝 Ngày 12/06/2026 - Chủ đề: Bảo mật Config (Environment Variables)

*   **Khái niệm mới học được (Hiểu theo ý mình):**

    *   **Nợ kỹ thuật (Technical Debt):** Hardcode chuỗi bí mật (Secret Key) vào code Java là tối kỵ vì lộ mã nguồn là lộ chìa khóa.
    *   **Cú pháp `${ENV:default}`:** Sử dụng cú pháp `${JWT_SECRET_KEY:chuoi_mac_dinh}` trong file `application.properties`. Khi chạy trên IDE thì Spring lấy chuỗi mặc định, khi đưa lên Docker (Production) thì ưu tiên đọc từ biến môi trường.

*   **Đoạn code / Cấu hình tâm đắc:**
    *   *TODO - Nhớ làm cái này khi Deploy Auth Service lên Docker:*
    ```yml
    # Sẽ thêm đoạn này vào docker-compose.yml sau này:
      auth-service:
        # ... image, ports ...
        environment:
          - JWT_SECRET_KEY=Mot_Chuoi_Sieu_Bao_Mat_Danh_Rieng_Cho_Production
          - JWT_EXPIRATION=3600000
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**

    *   *Mô tả lỗi:* ...

    *   *Cách giải quyết:* ...

    *   *Link tham khảo (StackOverflow, Blogs):* ...

---

### 📝 Ngày 12/06/2026 - Chủ đề: Luồng hoạt động của Spring Security & JWT (Cực kỳ quan trọng)

*   **Khái niệm mới học được (Hiểu theo ý mình):**

    Để hiểu toàn bộ những file code vừa viết, hãy tưởng tượng hệ thống API của bạn là một **Tòa nhà văn phòng cao cấp**, và Spring Security là **Hệ thống an ninh**.

    **1. `UserDetails` và `CustomUserDetailsService` (Căn cước công dân & Cục dữ liệu)**
    *   Mình phải cho class `User` *implements* `UserDetails`. Việc này giống như in thông tin User thành một tấm **"Căn cước theo mẫu chuẩn"** mà mấy ông bảo vệ (Spring Security) có thể đọc hiểu được.
    *   `CustomUserDetailsService` đóng vai trò là cơ quan tra cứu. Giao cho nó cái Email, nó sẽ lặn xuống Database lùng sục và móc tấm Căn cước đó lên trả cho bảo vệ.

    **2. `JwtAuthenticationFilter` (Chốt bảo vệ soát vé)**
    *   Mọi yêu cầu (Request) đi vào tòa nhà đều bị ông bảo vệ này chặn lại. 
    *   Ổng sẽ nhìn lên trán khách (tức là cái `Header: Authorization` trong HTTP). Nếu thấy có chữ `Bearer ...` (Tấm vé JWT), ổng sẽ lấy máy ra soi (gọi hàm `isTokenValid`).

    **3. `SecurityContextHolder` (Bảng tên dán trước ngực)**
    *   Nếu vé hợp lệ, ông bảo vệ không chỉ cho qua, mà còn phát cho khách một cái "Bảng tên" và ghim chặt vào người khách. Hành động này chính là đoạn code `SecurityContextHolder.getContext().setAuthentication(authToken)`.
    *   **Ma thuật ở đây là:** Nhờ cái bảng tên này, khi khách vào tới các phòng ban bên trong (ví dụ hàm `getMyProfile()`), nhân viên bên trong không cần hỏi khách là ai nữa, cứ chọc thẳng vào `SecurityContextHolder` để coi bảng tên là biết sạch sành sanh họ tên, quyền hạn! Cực kỳ tiện lợi.

    **4. `SessionCreationPolicy.STATELESS` (Não cá vàng)**
    *   Cấu hình này ép Tòa nhà phải mắc chứng "Não cá vàng"(STATELESS). Tức là 5 phút trước bạn vừa quét vé vào, bạn quay ra đi vệ sinh, lúc quay lại tòa nhà đã... quên mất bạn là ai. Bạn **bắt buộc phải quét vé lại** thì mới được vào. 
    *   Ưu điểm: Server không phải tốn RAM để nhớ ai đang online, rất dễ mở rộng (Scale) hệ thống.

*   **Đoạn code / Cấu hình tâm đắc:**
    ```java
    // Cách để "bốc" ông User đang đăng nhập ra ở bất kỳ đâu trong dự án:
    User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    System.out.println("Xin chào, " + currentUser.getEmail());
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**

    *   *Mô tả lỗi:* ...

    *   *Cách giải quyết:* ...

    *   *Link tham khảo (StackOverflow, Blogs):* ...

---

### 📝 Ngày 19/06/2026 - Chủ đề: Khởi tạo API Gateway & Chuyển giao "quyền lực" (CORS, JWT)

*   **Khái niệm mới học được (Hiểu theo ý mình):**

    *   **Spring Cloud Gateway (Người bảo vệ cổng chính):** Thay vì Frontend (ReactJS) phải nhớ và gọi đến từng service (phòng ban) riêng lẻ qua nhiều cổng khác nhau (8081, 8082...), nó chỉ cần nói chuyện duy nhất với Gateway (cổng 8080). Gateway sẽ làm nhiệm vụ điều hướng (Routing) request tới đúng đích.
    
    *   **Global CORS (Quản lý CORS tập trung):** Việc chuyển cấu hình CORS từ `auth-service` lên Gateway giúp làm sạch code. Trình duyệt gửi preflight request hỏi Gateway, Gateway cho phép, sau đó đẩy request vào trong. Các service bên trong (như `auth-service`, `job-service`) từ nay không cần bận tâm về cấu hình CORS nữa.
    
    *   **Xác thực JWT tại Gateway (Centralized Security):** Kiểm tra "vé thông hành" ngay từ vòng gửi xe. Thay vì mỗi service phải tự cắt cử người ra kiểm tra chữ ký JWT, `AuthenticationFilter` của Gateway sẽ chặn mọi request. Nếu vé lậu, trả về `401 Unauthorized`. Nếu vé thật, Gateway sẽ móc `username` ra, gắn vào header (`X-Auth-User`) rồi mới cho đi tiếp. Điều này giúp các microservices bên trong cực kỳ nhẹ nhàng và không lặp lại code bảo mật.

*   **Đoạn code / Cấu hình tâm đắc:**
    ```properties
    # Cấu hình "Người gác cổng" kiểm tra và điều hướng
    spring.cloud.gateway.routes[0].id=auth-service
    spring.cloud.gateway.routes[0].uri=http://localhost:8081
    spring.cloud.gateway.routes[0].predicates[0]=Path=/api/v1/auth/**
    
    # Gắn Filter kiểm soát vé vào route
    spring.cloud.gateway.routes[0].filters[0]=AuthenticationFilter
    ```

*   **Bug / Khó khăn gặp phải & Cách khắc phục:**

    *   *Kinh nghiệm xương máu:* Khi chuyển CORS lên Gateway, PHẢI xóa triệt để đoạn cấu hình CORS cũ (`.cors()`) ở trong `SecurityConfig` của `auth-service`. Nếu cả Gateway và Service đều xử lý CORS, trình duyệt sẽ bị "bối rối" vì nhận được nhiều header cho phép trùng lặp, dẫn tới lỗi ngớ ngẩn không gọi được API.

---
