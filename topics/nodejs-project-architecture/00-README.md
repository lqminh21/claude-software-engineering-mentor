---
created_at: 2026-07-26
---

# Cấu trúc tổ chức source code & kiến trúc hệ thống cho Node.js

## Mục tiêu bundle

Sau khi hoàn thành bundle này, người học có thể:

- Chọn và áp dụng một mô hình tổ chức thư mục phù hợp (MVC/MVCS, Layered, Feature-based, Hexagonal/DDD) cho một service Node.js cụ thể, thay vì copy cấu trúc có sẵn mà không hiểu vì sao.
- Phân biệt các loại API phổ biến (REST, GraphQL, gRPC, WebSocket) và biết khi nào một hệ thống cần dùng nhiều loại cùng lúc.
- Thiết kế hạ tầng dữ liệu và xử lý nền phù hợp với từng domain (SQL/NoSQL, cache, queue/worker) thay vì dùng một công thức cho mọi loại dữ liệu.
- Đánh giá được đánh đổi giữa Monolith, Modular Monolith, Microservice và Serverless cho một hệ thống cụ thể — bao gồm cả chi phí tổ chức source code (monorepo/polyrepo) và chi phí triển khai (CI/CD, container hoá, scaling) đi kèm mỗi lựa chọn.
- Tự tin giải thích lý do đứng sau một quyết định kiến trúc, không chỉ mô tả lại khái niệm.

**Phạm vi:** chỉ tập trung vào backend Node.js (Express, NestJS). Không đi sâu vào vận hành hạ tầng ở mức chi tiết (ví dụ: viết Kubernetes manifest) — các chương động tới hạ tầng triển khai chỉ dừng ở mức khái niệm cần thiết để ra quyết định kiến trúc.

## Ví dụ nghiệp vụ xuyên suốt

**Hệ thống đặt hàng & giao hàng (E-commerce Order Fulfillment)**, với các domain con dùng xuyên suốt mọi chương: **Order** (đặt hàng), **Payment** (thanh toán), **Inventory** (tồn kho), **Shipping** (giao hàng). Các domain này đủ khác nhau về đặc tính (Order/Payment cần tính nhất quán cao và dùng SQL, Inventory/Catalog phù hợp NoSQL, Shipping xử lý bất đồng bộ qua queue) để minh hoạ tự nhiên từ tổ chức code trong một service, tới việc chọn loại API, tới quyết định có tách service hay không.

## Giai đoạn & bảng chương

### Beginner (Remember / Understand)

| # | Chương | File |
|---|--------|------|
| 1 | Vì sao cần tổ chức source code — từ 1 file `server.js` tới nhu cầu cấu trúc | |
| 2 | Cấu trúc thư mục Express cơ bản (MVC/MVCS: routes/controllers/services/models) | |
| 3 | Tổng quan các loại API (REST, GraphQL, gRPC, WebSocket) — đặc điểm, khi nào dùng | |
| 4 | Tổng quan kiến trúc hệ thống (Monolith, Microservice, Serverless) | |

### Intermediate (Apply / Analyze)

| # | Chương | File |
|---|--------|------|
| 5 | NestJS module system (Module/Provider/Dependency Injection) so với Express | |
| 6 | So sánh mô hình tổ chức thư mục: Layered Architecture vs Feature-based (Vertical Slice) — áp dụng Order/Payment/Inventory/Shipping | |
| 7 | REST API cho Order service (routing, validation, error handling) | |
| 8 | Thêm gRPC nội bộ (Inventory) bên cạnh REST | |
| 9 | Thêm GraphQL cho client bên cạnh REST/gRPC | |
| 10 | Giao tiếp bất đồng bộ: Queue/Worker (BullMQ) — Payment/Shipping xử lý nền | |
| 11 | Polyglot persistence: SQL + NoSQL theo domain | |
| 12 | Cache theo domain (Redis) — khi nào cache, invalidation cơ bản | |

### Advanced (Evaluate / Create)

| # | Chương | File |
|---|--------|------|
| 13 | Modular Monolith — ranh giới cứng bằng Hexagonal (Ports & Adapters) và DDD bounded context, chuẩn bị tách | |
| 14 | Monorepo vs Polyrepo — tổ chức source code đa service/đa package (Turborepo, Nx, pnpm/yarn workspaces; NestJS monorepo mode là một cách áp dụng cụ thể) | |
| 15 | Giao tiếp giữa service: sync (REST/gRPC) vs async (event-driven), API Gateway | |
| 16 | Tổ chức triển khai: Monolith vs Microservice (container hoá, CI/CD riêng từng service, scaling, service discovery — mức khái niệm) | |
| 17 | Quyết định tách Microservice — dùng ch.15+16 làm dữ kiện, chi phí vận hành, khi nào KHÔNG nên tách | |
| 18 | Serverless (Lambda) — khi nào phù hợp, trade-off cold start/state/chi phí | |

### Thực chiến (Create)

| # | Chương | File |
|---|--------|------|
| 19 | Project: Order Fulfillment system — modular monolith NestJS, REST + gRPC nội bộ, BullMQ, Postgres + MongoDB, Redis | |

## Bài tập dự kiến

Gắn sau các chương liên quan, thiết kế chi tiết (PROBLEM.md) khi tới đúng thời điểm:

- Sau ch.2 — refactor cấu trúc Express từ code chưa tổ chức.
- Sau ch.6 — thiết kế ranh giới module cho Order/Payment/Inventory/Shipping.
- Sau ch.12 — chọn chiến lược DB/cache cho từng domain, giải thích lý do.
- Sau ch.17 — quyết định tách 1 domain cụ thể thành microservice hoặc giữ trong modular monolith, giải thích lý do dựa trên dữ kiện đã học.
