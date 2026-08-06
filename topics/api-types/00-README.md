---
created_at: 2026-07-27
---

# Các loại API: REST, GraphQL, gRPC, Realtime & Webhook

## Mục tiêu bundle

Đi từ việc chỉ biết "gọi API" theo thói quen đến khả năng tự **chọn đúng kiểu API** cho một bài toán cụ thể — hiểu rõ điểm mạnh, điểm yếu, và vấn đề thường gặp của từng kiểu (REST, GraphQL, gRPC, giao tiếp realtime, Webhook), để giải thích *vì sao* kiểu này phù hợp hơn kiểu kia trong một tình huống nghiệp vụ, thay vì dùng REST cho mọi thứ chỉ vì quen tay.

Năm kiểu API được gộp vào một bundle vì chúng không cạnh tranh loại trừ nhau mà thường **cùng tồn tại trong một hệ thống thật** — một nền tảng sản xuất hiện đại hiếm khi chỉ dùng một kiểu duy nhất. Bundle này dạy từng kiểu đủ sâu để dùng được, đồng thời liên tục đối chiếu chúng với nhau để người học xây dựng được một khung ra quyết định thực dụng.

## Ví dụ nghiệp vụ xuyên suốt

**Real-time Food Delivery Platform** — nền tảng đặt đồ ăn và giao hàng real-time. Domain này được chọn vì cần dùng cả 5 kiểu API một cách tự nhiên, không gượng ép:

- **REST** — API công khai cho nhà hàng quản lý menu, tạo/cập nhật đơn hàng.
- **GraphQL** — API cho app khách hàng (mobile) truy vấn linh hoạt dữ liệu lồng nhau (đơn hàng + nhà hàng + tài xế) mà không phải gọi nhiều endpoint hay nhận thừa dữ liệu.
- **gRPC** — giao tiếp nội bộ tốc độ cao giữa Order Service, Payment Service, Courier Service.
- **Giao tiếp realtime (WebSocket/SSE)** — theo dõi vị trí tài xế và trạng thái đơn hàng theo thời gian thực trên app khách hàng.
- **Webhook** — thông báo cho hệ thống bên ngoài (POS nhà hàng, cổng thanh toán) khi có sự kiện như đơn hàng được xác nhận hoặc thanh toán hoàn tất.

## Giai đoạn & bảng chương

| # | Chương | Giai đoạn | Bloom |
|---|---|---|---|
| 01 | API là gì & vì sao có nhiều "kiểu" API (client-server, request/response vs event-driven) | Beginner | Remember |
| 02 | REST cơ bản: resource, HTTP verb, status code, stateless; quy ước đặt tên & path/query param/header (dạng checklist tham chiếu); auth nền tảng (API key/Bearer token/JWT — cấu trúc/claims/expiry). Điểm mạnh/điểm yếu của REST | Beginner | Understand |
| 03 | REST nâng cao: versioning, pagination (cursor-based), error handling chuẩn hoá (kiểu RFC 7807); điểm qua HATEOAS và caching header (ETag/Cache-Control) | Beginner | Understand |
| 04 | GraphQL cơ bản: schema, type, query/mutation, resolver, quy ước đặt tên schema. Điểm mạnh/điểm yếu so với REST | Intermediate | Understand/Apply |
| 05 | GraphQL sâu hơn: over-fetching/under-fetching, N+1 problem (DataLoader), Relay cursor pagination, khi nào GraphQL thắng/thua REST | Intermediate | Apply/Analyze |
| 06 | gRPC & Protocol Buffers cơ bản: RPC là gì, protobuf schema (kèm quy ước đặt tên & rule đánh số field dạng checklist), codegen, unary call, mTLS/metadata auth, deadline/timeout | Intermediate | Apply |
| 07 | gRPC streaming trong thực tế: server/client/bidirectional streaming, retry với backoff, health checking protocol. Điểm mạnh/yếu, khi nào KHÔNG nên dùng gRPC | Intermediate | Apply/Analyze |
| 08 | Giao tiếp realtime: WebSocket vs Server-Sent Events vs long polling — cài đặt, auth tại thời điểm handshake, reconnect với backoff, heartbeat/ping-pong, fallback về polling; so sánh chọn giải pháp | Intermediate | Apply/Analyze |
| 09 | Webhook: push-based, chữ ký HMAC, retry exponential backoff + dead-letter, idempotency key phía người nhận, theo dõi/replay lịch sử gửi. Điểm mạnh/yếu | Intermediate | Apply |
| 10 | So sánh tổng hợp 5 kiểu API: bảng đối chiếu đầy đủ (điểm mạnh, điểm yếu, vấn đề thường gặp, chi phí vận hành) + khung ra quyết định chọn kiểu phù hợp với nghiệp vụ cụ thể | Intermediate | Analyze |
| 11 | API Gateway & BFF (Backend for Frontend) + resilience pattern khi hệ thống dùng nhiều kiểu API cùng lúc: circuit breaker, service mesh, client-side load balancing (đặc thù gRPC) | Advanced | Evaluate |
| 12 | Scale ngang server realtime: sticky session vs broadcast qua pub/sub (Redis) | Advanced | Evaluate |
| 13 | Versioning & backward compatibility ở quy mô lớn, áp dụng cho nhiều kiểu API + đào sâu compat của protobuf (field-numbering ở nhiều phiên bản) | Advanced | Evaluate |
| 14 | AuthN/AuthZ & rate limiting xuyên suốt các kiểu API (nâng cấp từ nền tảng ở Ch02) + idempotency key cho REST | Advanced | Evaluate |
| 15 | Bảo mật đặc thù GraphQL & Webhook: query depth/cost limiting, tắt introspection ở production, persisted queries; webhook signature verification | Advanced | Evaluate |
| 16 | Observability & contract testing cho hệ thống dùng nhiều kiểu API hỗn hợp | Advanced | Evaluate |
| 17 | Project thực chiến: Real-time Food Delivery Platform — dựng theo milestone tăng dần (REST+gRPC nội bộ → thêm GraphQL BFF → thêm WebSocket → thêm Webhook) | Thực chiến | Create |

Link tới từng chương sẽ được cập nhật vào bảng trên ngay khi file lesson tương ứng được tạo (sau khi dạy xong và vượt chất vấn cho chương đó).

## Ghi chú nội dung

> Mục này chỉ chứa các quyết định phạm vi TẠM THỜI cho những chương chưa viết — xoá dòng tương ứng ngay khi chương đó được viết xong (nội dung đã nằm trong chương, ghi chú hết tác dụng).

- Mỗi chương dạy một kiểu API cụ thể (Ch02-03, 04-05, 06-07, 08, 09) PHẢI nêu rõ: điểm mạnh, điểm yếu, vấn đề thường gặp trong thực tế — không chỉ dạy cách dùng. Đây là yêu cầu xuyên suốt bundle, không riêng Ch10.
- Ch02: JWT chỉ dạy cấu trúc/claims/expiry. KHÔNG dạy trade-off chọn thuật toán ký (HS256 vs RS256) hay refresh-token rotation ở đây — những phần đó thuộc Ch14 (Evaluate-level). Quy ước đặt tên/path/query/header trình bày dưới dạng bảng checklist tham chiếu đi kèm phần dạy REST semantics, KHÔNG tách thành mục học/worked-example riêng — tránh chương Beginner này quá tải khái niệm.
- Ch03: HATEOAS chỉ dạy ở mức nhận biết (đọc hiểu khi gặp), không yêu cầu người học tự áp dụng — vì hiếm gặp trong domain giao đồ ăn thực tế. Caching header (ETag/Cache-Control) chỉ một đoạn ngắn gắn với lợi thế cacheability của REST, không dạy sâu — nội dung này được dùng lại khi so sánh ở Ch10.
- Ch04: nêu 1 câu cảnh báo ngắn về rủi ro query độc hại/tốn tài nguyên (không dạy cách phòng chống ở đây) — chi tiết depth-limit/introspection dạy đủ ở Ch15, tránh trùng lặp và tránh nhảy Bloom (phòng chống tấn công là Evaluate-level, chương này mới ở Understand/Apply).
- Ch06: quy ước đặt tên & rule đánh số field trong `.proto` trình bày dưới dạng checklist quy tắc đi kèm phần dạy protobuf schema (đã dạy sẵn ở đây), KHÔNG tách mục học riêng. Chỉ giữ rule trần "đánh số field, đừng tái sử dụng" — phần đào sâu compat giữa nhiều phiên bản proto thuộc Ch13, tránh dạy 2 lần.
- Ch07: bidirectional streaming cần một kịch bản cụ thể trong domain (vd chat real-time giữa tài xế và tổng đài hỗ trợ, hoặc re-tính tuyến đường liên tục hai chiều), không dạy như ví dụ minh hoạ hời hợt cho đủ 4 loại streaming.
- Ch11: gồm 2 cụm nội dung (gateway/BFF/resilience pattern) — cụm circuit breaker/service mesh/client-side LB vốn là nội dung dời từ Ch07 vì thuộc phạm vi kiến trúc phân tán Evaluate-level, không phải nội dung Apply-level của chương gRPC gốc. Ghi chú ngắn rằng chi tiết authN/authZ enforcement sẽ đào sâu ở Ch14, tránh trùng lặp.
- Ch12: nội dung dời từ Ch08 (scale ngang realtime server) vì thuộc phạm vi hạ tầng phân tán Evaluate-level, tách riêng khỏi Ch11 vì không cùng mạch tư duy (traffic-layer gateway khác với scale server stateful).
- Ch13: phần "đào sâu compat của protobuf" là nội dung dời từ Ch06 — Ch06 chỉ giữ rule trần, chương này mới dạy hệ quả đầy đủ khi thay đổi schema qua nhiều phiên bản.
- Ch14: idempotency-key cho REST là nội dung dời từ Ch02, rate limiting là nội dung dời từ Ch03 — cả hai đều là production-hardening Evaluate-level, không phù hợp nhét vào chương REST cơ bản/nâng cao (Understand-level).
- Ch15: nội dung dời từ Ch04/Ch05 (GraphQL depth-limit, tắt introspection, persisted queries) vì là tư duy tấn công/phòng thủ Evaluate-level, tách riêng khỏi nhóm authN/authZ chung ở Ch14 vì đặc thù theo giao thức (GraphQL, Webhook) chứ không phải cross-cutting thuần.
- Ch17: KHÔNG giao đề bài "dựng cả 5 kiểu API cùng lúc" ngay từ đầu — chia milestone tăng dần để tránh learner bị choáng ở bước tích hợp. Các exercise ở Ch04, Ch06-07, Ch08, Ch09 nên xây từng mảnh nhỏ của cùng hệ thống food-delivery, để đến Ch17 là ráp nối chứ không phải viết mới từ đầu.
- Bundle đã mở rộng từ 15 lên 17 chương qua nhiều vòng bổ sung phạm vi (auth, production-grade design, tiêu chuẩn cơ bản) — đây là quyết định phạm vi có chủ đích của người học, không phải phình lặng lẽ.
