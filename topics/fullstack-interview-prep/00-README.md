---
created_at: 2026-08-10
---

# Ôn phỏng vấn Fullstack — Middle (mạnh Backend) / Pre-Senior

## Mục tiêu bundle

Đây **không phải** bundle mastery từ-đầu-đến-cuối như các bundle khác trong repo (`message-brokers`, `application-security`, `nodejs-project-architecture`, `api-types`) — bundle này hoàn toàn độc lập, không kế thừa hay merge nội dung từ các bundle đó, mà là bộ **ôn tập chắt lọc** để chuẩn bị phỏng vấn vị trí Middle Full-stack Developer (mạnh Backend), đồng thời nhắm level Pre-Senior.

Đối tượng học đã có kinh nghiệm thực chiến với phần lớn stack (PostgreSQL/MySQL, Node.js/NestJS/Express, React/Next.js dùng xuyên suốt sự nghiệp) — nội dung vì vậy đi thẳng vào chiều sâu cần cho phỏng vấn (trade-off, cơ chế, câu hỏi hay gặp), không dạy lại từ số 0. Riêng Kafka/RabbitMQ/Redis là mảng ít kinh nghiệm thực tế nhưng nhà tuyển dụng đòi hỏi, nên được ôn kỹ hơn hẳn so với một bundle tổng quan thông thường (xem chương 14-18).

Kết thúc bundle, có thể:

- Giải thích cơ chế đứng sau các quyết định kỹ thuật thường bị hỏi (Event Loop, transaction/isolation, backpressure, chọn broker/cache) thay vì chỉ nêu định nghĩa.
- So sánh và nêu trade-off giữa các lựa chọn cùng tầng (REST/GraphQL/gRPC, SQL/NoSQL, Redis/RabbitMQ/Kafka, Monolith/Microservice) cho một tình huống cụ thể.
- Áp dụng toàn bộ kiến thức vào một bài toán system design hoàn chỉnh ở mức Pre-Senior.

## Ví dụ nghiệp vụ xuyên suốt

**Quản lý Order & Inventory** (đặt hàng, trừ kho, thanh toán) — dùng làm ví dụ minh hoạ xuyên suốt các chương. Đây chỉ đóng vai trò ví dụ, KHÔNG phải trục tổ chức nội dung — nội dung mỗi chương xoay quanh khái niệm/kỹ thuật cần ôn, ví dụ order/inventory chỉ xuất hiện để minh hoạ cụ thể hoá.

## Giai đoạn & bảng chương

| # | Chương | Giai đoạn | Nội dung chính |
|---|---|---|---|
| 1 | TypeScript cho phỏng vấn | Nền tảng | Type system, generic, utility types, câu hỏi TS hay gặp; phân biệt `interface` vs `type`, khi nào dùng loại nào |
| 2 | Node.js Runtime & Performance | Nền tảng | Kiến trúc Event Loop (các phase), non-blocking I/O, điểm mạnh Node (I/O-bound) và khi nào KHÔNG nên dùng (CPU-bound); vấn đề hiệu năng thường gặp (block event loop, memory leak, GC); cluster module/worker_threads |
| 3 | Kiến trúc NestJS vs Express | Nền tảng | Module/Provider/DI, Middleware/Guard/Interceptor/Pipe |
| 4 | SOLID, Design Pattern & Clean Architecture/DDD | Nền tảng | SOLID và layering Clean Architecture/DDD (bounded context) là trọng tâm; pattern phổ biến (Factory/Strategy/Observer/Singleton/Repository) lướt nhanh dạng bảng tra cứu |
| 5 | Monolith vs Microservice & pattern kiến trúc microservice | Backend | Trade-off khi nào tách service; API Gateway, Service Discovery, Saga, Circuit Breaker & load shedding, eventual consistency, distributed transaction |
| 6 | API design: REST, GraphQL, gRPC | Backend | Resource/versioning/error handling/pagination (REST); schema/resolver/N+1 (GraphQL); protobuf/streaming (gRPC) |
| 7 | AuthN/AuthZ & bảo mật ứng dụng | Backend | JWT/session, RBAC; OWASP essentials: injection, XSS, CSRF, IDOR, secret management |
| 8 | Concurrency & Transaction | Backend | Race condition khi nhiều request cùng sửa dữ liệu, DB transaction, isolation level, idempotency key, distributed lock |
| 9 | Testing & performance backend | Backend | Unit/integration test; góc nhìn phát hiện qua test/benchmark: N+1 query, cache miss, connection pool exhaustion |
| 10 | React & state management (Redux/Jotai/React Query) | Frontend | Render cycle, hook pitfalls, re-render optimization; server state vs client state |
| 11 | Next.js rendering strategies & frontend performance | Frontend | SSR/SSG/ISR/CSR, data fetching; bundle size, memoization, virtualization |
| 12 | SQL sâu (PostgreSQL/MySQL) | Database | ACID, chuẩn hoá (normalization), transaction & isolation level, index & execution plan, viết query hiệu quả (EXPLAIN ANALYZE), partitioning/sharding/replication ở tầng cơ chế DB, trigger & stored procedure |
| 13 | NoSQL & search (MongoDB, Elasticsearch) | Database | Khi nào chọn document DB; query DSL cơ bản để xem log |
| 14 | Redis: caching & nâng cao | Message Broker & Cache | Cache-aside, TTL, invalidation, distributed lock (Redlock); Pub/Sub nhẹ |
| 15 | Backpressure trong thực tế: Node.js Streams & Background Worker (BullMQ) | Message Broker & Cache | Stream + backpressure (nền tảng TCP/HTTP flow control); ví dụ: stream export CSV, stream upload theo chunk, stream download report; worker BullMQ, retry/concurrency/scheduling |
| 16 | RabbitMQ | Message Broker & Cache | Exchange/queue/routing/DLQ, prefetch count (backpressure broker-driven) |
| 17 | Kafka: event streaming | Message Broker & Cache | Topic/partition/consumer group/delivery guarantee, max.poll.records/pause-resume (backpressure consumer-driven) |
| 18 | Chọn công cụ phù hợp cho use case | Message Broker & Cache | Trade-off tổng hợp Redis/BullMQ/RabbitMQ/Kafka |
| 19 | AWS | Cloud | Lambda, API Gateway, AppSync, S3; serverless, cold start |
| 20 | Docker | Cloud | Dockerfile, multi-stage build, docker-compose |
| 21 | Bài toán scale hệ thống | Tổng hợp | Horizontal/vertical scaling, load balancing, stateless service, CDN — áp dụng lại partition/sharding/replication đã học ở chương 12 |
| 22 | System design tổng hợp | Tổng hợp | Thiết kế hệ thống order/inventory mức Pre-Senior, trade-off |
| 23 | Ôn tập nhanh xuyên suốt | Tổng hợp | Mock Q&A toàn bộ stack |
| 24 | Best practice xây dựng skill cho AI | Mở rộng | Nội dung mở, lệch chủ đề có chủ đích — mentor phác thảo trước, người học bổ sung kinh nghiệm cá nhân |

Link tới từng chương sẽ được cập nhật vào bảng trên ngay khi file lesson tương ứng được tạo (sau khi dạy xong và vượt chất vấn cho chương đó).

## Ghi chú vận hành bundle

> Đây là chỉ dẫn đứng (không phải TODO tạm thời) cho cách dạy bundle này — khác với "Ghi chú nội dung" tạm thời ở các bundle khác vốn bị xoá dần khi từng chương được viết xong.

- **Không thiết kế bài tập.** Bundle này bỏ qua hoàn toàn Bước 2d (thiết kế bài tập) — không tạo `exercises/`/`my-work/`. Luyện tập diễn ra qua trao đổi hội thoại, không qua bài tập viết code.
- **Tăng cường trao đổi.** Khi dạy mỗi chương, ưu tiên hỏi-đáp/phản biện qua lại nhiều hơn mức thường lệ — không chỉ hỏi 1 câu Socratic mở đầu rồi giảng một mạch, mà liên tục kiểm tra hiểu qua đối thoại trong suốt buổi học.

## Ghi chú nội dung (tạm thời, xoá khi chương tương ứng viết xong)

- Ch5: nêu 1 câu signpost "trade-off transaction phân tán này sẽ được đào sâu ở góc độ DB tại chương 8 (Concurrency & Transaction) và chương 12 (SQL sâu)" — tránh cảm giác forward-reference treo lơ lửng.
- Ch9: định vị chương này là góc nhìn TEST/BENCHMARK phát hiện vấn đề, KHÔNG dạy cơ chế đầy đủ — N+1 dạy cơ chế đầy đủ ở ch.12, cache dạy cơ chế đầy đủ ở ch.14. Phải có signpost rõ trỏ tới 2 chương đó để người học không hiểu nhầm đây là lần dạy duy nhất.
- Ch12: khi viết, đảm bảo `partitioning/sharding/replication` dạy ở tầng CƠ CHẾ DB (Postgres/MySQL làm điều đó thế nào) — ch.21 sẽ tái dùng lại các khái niệm này ở tầng quyết định scale toàn hệ thống, không dạy trùng.
- Ch24: nội dung mở, KHÔNG cần fit vào ví dụ order/inventory hay mạch Bloom chung của bundle — đây là ngoại lệ có chủ đích theo yêu cầu người học.
