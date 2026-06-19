# Superpowers Customization Plan for JobRadar Project

## Tổng quan

Dự án **JobRadar** là một hệ sinh thái tuyển dụng IT với kiến trúc **Microservices** sử dụng **Java Spring Boot**, **PostgreSQL**, **Redis**, **RabbitMQ**, và **Web Scraping** (JSoup, FlareSolverr).

Người dùng muốn tùy chỉnh **Superpowers** framework để phù hợp với dự án này, đặc biệt khi sử dụng **OpenCode** và **Antigravity CLI** như một **developer solo** đang học tập và chuẩn bị cho phỏng vấn.

## 🎯 Mục tiêu chính

### 1. Tạo skills riêng cho JobRadar
- **Spring Boot Microservice Development** - Pattern cho các service
- **Web Crawler Development** - Pattern cho các trang web tuyển dụng
- **Microservices Communication Patterns** - OpenFeign, RabbitMQ, Saga Pattern
- **Spring Boot Testing Strategies** - TDD cho Spring Boot

### 2. Tùy chỉnh workflow hiện có
- **brainstorming** - Thêm context JobRadar, mandatory architecture decisions
- **writing-plans** - Template cho cấu trúc Spring Boot, task patterns
- **using-git-worktrees** - Naming convention, worktree management

### 3. Giải quyết các pain points
- Agent nhảy vào code mà không thiết kế
- Test coverage thấp / TDD không tuân thủ
- Implementation plan quá mơ hồ
- Subagent làm việc kém chất lượng
- Không có skill cho Spring Boot / Microservices
- Git workflow lộn xộn

## 📋 Kế hoạch tùy chỉnh

### Phase 1: Setup cơ bản (Tuần 1)

#### 1.1 Cài đặt Superpowers cho cả hai agents
```bash
# OpenCode
# Tell OpenCode: "Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.opencode/INSTALL.md"

# Antigravity
agy plugin install https://github.com/obra/superpowers
```

#### 1.2 Tạo thư mục skills cá nhân
```bash
# OpenCode skills location
mkdir -p ~/.config/opencode/skills

# Antigravity skills location
mkdir -p ~/.antigravity/skills

# Symlink cho cross-agent sharing (tùy chọn)
ln -s ~/.config/opencode/skills ~/.antigravity/skills
```

### Phase 2: Tùy chỉnh workflow cốt lõi (Tuần 1-2)

#### 2.1 Tùy chỉnh `brainstorming` cho JobRadar
**File:** `~/.config/opencode/skills/brainstorming/SKILL.md`

**Tùy chỉnh:**
- Thêm **context awareness cho JobRadar** (microservices, Spring Boot, crawler architecture)
- Thêm **mandatory architecture decision recording** cho mỗi feature
- Thêm **crawler-specific design questions** (Strategy Pattern, FlareSolverr integration, selector config)
- Giảm visual companion dependency (text-first cho solo dev)

#### 2.2 Tùy chỉnh `writing-plans` cho Spring Boot Microservices
**File:** `~/.config/opencode/skills/writing-plans/SKILL.md`

**Tùy chỉnh:**
- Thêm **Maven/Gradle project structure templates**
- Thêm **Spring Boot specific task patterns**:
  - Entity → Repository → Service → Controller → Test
  - Configuration classes (SecurityConfig, WebMvcConfig)
  - Dockerfile & docker-compose service entries
- Thêm **OpenAPI/Swagger documentation** steps
- Thêm **integration test** requirements (Testcontainers)

#### 2.3 Tùy chỉnh `using-git-worktrees` cho quy tắc branch của bạn
**File:** `~/.config/opencode/skills/using-git-worktrees/SKILL.md`

**Tùy chỉnh:**
- Sử dụng **feature/{issue-number}-{short-name}** naming
- Auto-create worktree tại `../jobradar-worktrees/{branch-name}`
- Thêm **Maven wrapper** verification step
- Thêm **docker-compose up -d** cho dependency services

### Phase 3: Tạo skills domain-specific (Tuần 2-4)

#### 3.1 `spring-boot-microservice-development`
**Trigger:** Use when implementing features in Spring Boot microservices (entity, repository, service, controller, config, test)

**Nội dung:**
```markdown
---
name: spring-boot-microservice-development
description: Use when implementing features in Spring Boot microservices (entity, repository, service, controller, config, test)
---

# Spring Boot Microservice Development

## Tổng quan
Các pattern chuẩn hóa cho các microservices Spring Boot của JobRadar theo clean architecture.

## Khi nào nên sử dụng
- Tạo microservice mới
- Thêm CRUD endpoints
- Triển khai business logic trong service layer
- Cấu hình Spring Security, OpenFeign, Redis, RabbitMQ

## Template cấu trúc project
jobradar-{service}/
├── src/main/java/com/jobradar/{domain}/
│   ├── entity/          # JPA entities
│   ├── repository/      # Spring Data JPA repos
│   ├── service/         # Business logic (interfaces + impl)
│   ├── controller/      # REST endpoints
│   ├── dto/             # Request/Response DTOs
│   ├── config/          # Spring @Configuration classes
│   ├── security/        # Security config, JWT, OAuth2
│   └── exception/       # Custom exceptions, handlers
├── src/test/            # Unit + Integration tests
├── Dockerfile
└── pom.xml
```

**Các pattern chính:**
- JWT authentication filter pattern
- OpenFeign client cho inter-service communication
- Redis caching với `@Cacheable`/`@CacheEvict`
- RabbitMQ producer/consumer với `@RabbitListener`
- Testcontainers cho integration tests
- MapStruct cho DTO↔Entity mapping

#### 3.2 `web-crawler-development`
**Trigger:** Use when building web crawlers with JSoup/FlareSolverr cho job sites

**Nội dung:**
```markdown
---
name: web-crawler-development
description: Use when building web crawlers with JSoup/FlareSolverr cho job sites
---

# Web Crawler Development

## Tổng quan
Framework crawler Strategy Pattern cho việc thu thập dữ liệu việc làm đa nguồn của JobRadar.

## Khi nào nên sử dụng
- Thêm nguồn việc làm mới (VietnamWorks, TopCV, ITviec, LinkedIn, v.v.)
- Sửa crawler bị lỗi do HTML thay đổi
- Triển khai FlareSolverr integration cho các trang có Cloudflare

## Kiến trúc core
interface JobCrawler {
    List<JobDTO> crawl(SearchCriteria criteria);
    SiteConfig getSiteConfig();
}

@Component
class VietnamWorksCrawler implements JobCrawler { ... }

@Component  
class TopCVCrawler implements JobCrawler { ... }

@Component
class ITviecCrawler implements JobCrawler { ... }  // Uses FlareSolverrClient
```

**Các pattern chính:**
- Strategy Pattern cho crawlers có thể pluggable
- CSS Selector externalized sang DB (`crawler_config` table) hoặc `application.yml`
- FlareSolverrClient wrapper với retry/timeout
- Rate limiting & respectful crawling (User-Agent, delays)
- Deduplication via job URL hash
- Incremental crawling (last_crawled_at timestamp)

#### 3.3 `microservices-communication-patterns`
**Trigger:** Use when implementing inter-service communication (Sync: OpenFeign, Async: RabbitMQ)

**Nội dung:**
- OpenFeign client patterns with fallback (Resilience4j CircuitBreaker)
- RabbitMQ event-driven patterns (Domain Events, Dead Letter Queue)
- Saga Pattern cho distributed transactions
- API Gateway routing & JWT validation

#### 3.4 `spring-boot-testing-strategies`
**Trigger:** Use when writing tests cho Spring Boot microservices

**Nội dung:**
- Unit test: `@MockBean` service layer, test business logic
- Integration test: `@SpringBootTest` + Testcontainers (PostgreSQL, Redis, RabbitMQ)
- Slice tests: `@WebMvcTest`, `@DataJpaTest`, `@RestClientTest`
- Contract test: Spring Cloud Contract (optional cho sau này)
- TDD workflow specific cho Spring Boot layers

### Phase 4: Quality Gates & Automation (Tuần 3-4)

#### 4.1 Nâng cao `test-driven-development` cho JobRadar
**Thêm vào skill:**
- Maven test command: `./mvnw test -pl jobradar-{service}`
- Testcontainers startup verification
- Coverage threshold (JaCoCo): 80% line, 70% branch
- Mutation testing (PITest) cho critical paths

#### 4.2 Nâng cao `subagent-driven-development` / `executing-plans`
**Cho solo dev, recommend `executing-plans` thay vì subagent-driven:**
- Simpler: no subagent orchestration overhead
- Batch execution with **human checkpoints** (bạn review)
- Thêm **Maven verify** step: `./mvnw verify` (test + checkstyle + spotbugs)

#### 4.3 Thêm `code-quality-gates` skill (NEW)
**Trigger:** Use before committing/pushing bất kỳ code nào

**Kiểm tra:**
```bash
# Format
./mvnw spotless:check

# Static analysis  
./mvnw spotbugs:check

# Security
./mvnw dependency-check:check

# Architecture (ArchUnit)
./mvnw test -Dtest=ArchitectureTests
```

### Phase 5: Documentation & Knowledge Capture (Ongoing)

#### 5.1 Tạo `jobradar-architecture-decisions` skill
- ADR template cho JobRadar
- Link tới existing docs trong `JobRadar_Project_Plan.md` section 8

#### 5.2 Tạo `devlog-capture` skill
- Tự động hóa `JobRadar_Learning_Roadmap.md` format của bạn
- Trigger sau mỗi task hoàn thành

## 📁 Cấu trúc file đề xuất

```
~/.config/opencode/skills/
├── brainstorming/           # Customized (Phase 2.1)
│   └── SKILL.md
├── writing-plans/           # Customized (Phase 2.2)
│   └── SKILL.md
├── using-git-worktrees/     # Customized (Phase 2.3)
│   └── SKILL.md
├── test-driven-development/ # Extended (Phase 4.1)
│   └── SKILL.md
├── executing-plans/         # Customized cho solo (Phase 4.2)
│   └── SKILL.md
├── spring-boot-microservice-development/    # NEW (Phase 3.1)
│   ├── SKILL.md
│   ├── templates/
│   │   ├── entity.java.template
│   │   ├── repository.java.template
│   │   ├── service.java.template
│   │   ├── controller.java.template
│   │   ├── dockerfile.template
│   │   └── pom.xml.template
│   └── patterns/
│       ├── jwt-auth.md
│       ├── openfeign-client.md
│       ├── redis-caching.md
│       └── rabbitmq-patterns.md
├── web-crawler-development/                 # NEW (Phase 3.2)
│   ├── SKILL.md
│   ├── templates/
│   │   ├── crawler-interface.java.template
│   │   ├── crawler-impl.java.template
│   │   └── flaresolverr-client.java.template
│   └── patterns/
│       ├── strategy-pattern.md
│       ├── selector-config.md
│       └── rate-limiting.md
├── microservices-communication-patterns/    # NEW (Phase 3.3)
│   ├── SKILL.md
│   └── patterns/
│       ├── openfeign-circuitbreaker.md
│       ├── rabbitmq-events.md
│       └── saga-pattern.md
├── spring-boot-testing-strategies/          # NEW (Phase 3.4)
│   ├── SKILL.md
│   └── patterns/
│       ├── unit-testing.md
│       ├── integration-testing.md
│       └── testcontainers-setup.md
├── code-quality-gates/                      # NEW (Phase 4.3)
│   ├── SKILL.md
│   └── scripts/
│       └── quality-check.sh
├── jobradar-architecture-decisions/         # NEW (Phase 5.1)
│   ├── SKILL.md
│   └── templates/
│       └── adr-template.md
└── devlog-capture/                          # NEW (Phase 5.2)
    ├── SKILL.md
    └── templates/
        └── devlog-entry.md
```

## 🎯 Các bước tiếp theo ngay (Tuần này)

| Ưu tiên | Hành động | Công sức |
|----------|--------|--------|
| **P0** | Cài đặt Superpowers cho OpenCode + Antigravity | 30 min |
| **P0** | Test core workflow trên một task JobRadar nhỏ (ví dụ: thêm một DTO) | 1-2 hrs |
| **P1** | Tùy chỉnh `brainstorming` với context JobRadar | 1 hr |
| **P1** | Tùy chỉnh `writing-plans` với Spring Boot task templates | 2 hrs |
| **P1** | Tạo `spring-boot-microservice-development` skill (TDD: baseline → write → test) | 3-4 hrs |

## ❓ Các câu hỏi làm rõ trước khi bắt đầu

1. **Skill nào để tạo FIRST?**
   - `spring-boot-microservice-development` (most reusable)
   - `web-crawler-development` (highest domain value)
   - `code-quality-gates` (immediate ROI)

2. **OpenCode vs Antigravity priority?**
   - Primary: OpenCode (more features)
   - Secondary: Antigravity (simpler)
   - Both equally

3. **Skill storage preference?**
   - `~/.config/opencode/skills/` (OpenCode native)
   - `~/.antigravity/skills/` (Antigravity native)
   - Shared directory với symlinks

4. **Muốn tôi draft skill đầu tiên (`spring-boot-microservice-development`) sử dụng TDD methodology?**

## 📚 Tài liệu tham khảo để giữ sẵn

| Tài liệu | Mục đích |
|----------|---------|
| `skills/writing-skills/SKILL.md` | TDD methodology cho skill creation |
| `skills/test-driven-development/SKILL.md` | Core TDD rules (Iron Law) |
| `skills/brainstorming/SKILL.md` | Design-before-code enforcement |
| `skills/writing-plans/SKILL.md` | Plan format & task granularity |
| `docs/README.opencode.md` | OpenCode-specific setup |
| `docs/README.antigravity.md` | Antigravity-specific setup (nếu có) |

## 🎯 Điểm mấu chốt

### Iron Law (TDD cho Skills)
```
NO SKILL WITHOUT A FAILING TEST FIRST
```

### RED-GREEN-REFACTOR cho Skills
1. **RED** - Write failing test (baseline behavior)
2. **GREEN** - Write minimal skill (agent complies)
3. **REFACTOR** - Close loopholes (bulletproof)

### Skill Discovery Optimization (SDO)
1. **Rich Description Field** - Only triggering conditions, NO workflow summary
2. **Keyword Coverage** - Error messages, symptoms, tools
3. **Descriptive Naming** - Active voice, gerunds (-ing)
4. **Token Efficiency** - Keep frequently-loaded skills <200 words

### Anti-Patterns
- Narrative examples (too specific)
- Multi-language dilution (maintain quality)
- Code in flowcharts (can't copy-paste)
- Generic labels (helper1, step3)

### STOP: Before Next Skill
- **Do NOT** create multiple skills without testing each
- **Do NOT** move đến skill tiếp theo trước khi current verified
- **Do NOT** skip testing vì "batching is more efficient"

### Deployment Checklist (TDD Adapted)
**RED Phase - Write Failing Test:**
- [ ] Create pressure scenarios (3+ combined pressures)
- [ ] Run scenarios WITHOUT skill - document baseline
- [ ] Identify patterns in rationalizations/failures

**GREEN Phase - Write Minimal Skill:**
- [ ] Name uses letters, numbers, hyphens only
- [ ] YAML frontmatter với required fields
- [ ] Description starts with "Use when..."
- [ ] Keywords cho search
- [ ] Overview với core principle
- [ ] Address specific baseline failures
- [ ] Form matches failure type
- [ ] Run scenarios WITH skill - verify compliance

**REFACTOR Phase - Close Loopholes:**
- [ ] Identify NEW rationalizations
- [ ] Add explicit counters
- [ ] Build rationalization table
- [ ] Create red flags list
- [ ] Re-test until bulletproof

### Integration Workflow
1. **Explore project context** (files, docs, recent commits)
2. **Ask clarifying questions** (one at a time)
3. **Propose 2-3 approaches** (with trade-offs)
4. **Present design** (sections, get approval after each)
5. **Write design doc** (save & commit)
6. **Spec self-review** (fix inline)
7. **User reviews spec** (before proceeding)
8. **Invoke writing-plans skill** (next step)

### Execution Options
**Subagent-Driven (recommended):**
- Fresh subagent per task
- Task review (spec + quality) sau mỗi task
- Broad whole-branch review cuối

**Inline Execution:**
- Batch execution với checkpoints
- Human review giữa các batch

## 🎯 Kết luận

**Tạo skills IS TDD cho process documentation.**

Nếu bạn tuân thủ TDD cho code, hãy tuân thủ TDD cho skills. Đó là cùng discipline áp dụng cho documentation.

**Ready to start?** Let me know skill nào để tackle first, và tôi sẽ guide bạn qua RED-GREEN-REFACTOR cycle để tạo nó properly using writing-skills methodology.