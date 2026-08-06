---
created_at: 2026-07-26
---

# Message Brokers

## Mục tiêu bundle

Đi từ việc mới dùng qua message broker một cách hời hợt (gọi publish/subscribe cơ bản nhưng chưa hiểu delivery guarantee, ordering, scaling) đến khả năng tự đánh giá và chọn kiến trúc broker phù hợp cho một bài toán thật, giải thích được *vì sao* một lựa chọn (RabbitMQ, Kafka, SQS/SNS, Redis Streams...) phù hợp hơn lựa chọn khác trong một ngữ cảnh cụ thể — không chỉ nhớ tên sản phẩm hay copy cấu hình mẫu.

**Broker** là phần mềm/hạ tầng đứng giữa producer và consumer, nhận message, lưu trữ, định tuyến và giao message đi. **Queue** chỉ là một trong các cấu trúc mà broker dùng để quản lý message (song song với topic/exchange/partition tuỳ broker) — đây là lý do bundle được đặt tên theo "Broker" (hệ thống được nghiên cứu), còn "Queue" là một khái niệm được dạy bên trong (Chương 2), không phải tên bao trùm toàn bộ nội dung.

Bundle được tổ chức theo **vấn đề production trước, giải pháp từng broker sau**: mỗi chương Intermediate/Advanced xoay quanh một vấn đề thật mọi hệ thống dùng message broker đều gặp (delivery guarantee, dual-write, poison message, ordering, backpressure, scaling, schema evolution, replay, high availability, chi phí vận hành), dạy cơ chế cụ thể mà RabbitMQ/Kafka/SQS/Redis Streams dùng để giải quyết, và kết thúc bằng khuyến nghị theo tình huống nghiệp vụ — không phải giới thiệu từng broker rồi so sánh chung chung ở cuối.

## Ví dụ nghiệp vụ xuyên suốt

**Xử lý đơn hàng e-commerce** — đặt hàng → thanh toán → trừ kho → gửi thông báo. Domain này được chọn vì các bước xử lý vốn độc lập nghiệp vụ (thanh toán lỗi không nên chặn việc ghi nhận đơn, gửi thông báo chậm không nên ảnh hưởng trừ kho), nên nhu cầu decouple qua message broker là tự nhiên, không gượng ép. Các chương sau cũng dùng lại tình huống traffic spike (VD: Black Friday) của chính hệ thống này để minh hoạ backpressure và consumer scaling.

## Giai đoạn & bảng chương

| # | Chương | Giai đoạn | Bloom |
|---|---|---|---|
| 01 | Vì sao cần message broker — sync vs async, decoupling, buffering, chịu tải đỉnh | Beginner | Remember |
| 02 | Khái niệm cốt lõi & cơ chế lõi 4 broker — Producer/Consumer/Queue/Broker/Message; RabbitMQ (exchange/queue, exchange type, phân biệt classic/quorum/streams queue); Kafka (topic/partition/offset); SQS/SNS (queue thường vs FIFO, MessageGroupId + MessageDeduplicationId); Redis Streams (stream/consumer group/PEL); bài tập nhỏ fan-out (order placed → email/inventory/analytics) | Beginner | Understand |
| 03 | Delivery guarantee & Idempotent consumer — ack/publisher confirm (RabbitMQ), idempotent producer + transactional API (Kafka), visibility timeout + delete-as-ack + MessageDeduplicationId (SQS), PEL/XACK (Redis); kỹ thuật dedup tầng ứng dụng bằng business key | Intermediate | Apply |
| 04 | Dual-write problem & Transactional Outbox — Outbox pattern + CDC/Debezium (Kafka), tự viết poller (RabbitMQ/SQS/Redis) | Intermediate | Apply/Analyze |
| 05 | Poison message & Dead Letter Queue — DLX (RabbitMQ), rủi ro "poison-pill chặn cả partition" do offset tuần tự + tự implement DLQ ở app layer (Kafka), redrive policy + redrive-to-source (SQS), XCLAIM/XPENDING (Redis) | Intermediate | Analyze |
| 06 | Ordering guarantee — single queue/1 consumer (RabbitMQ), partition key (Kafka), FIFO MessageGroupId (SQS), stream ID + tự chia stream theo key (Redis) | Intermediate | Analyze |
| 07 | Backpressure — flow control/blocked connection (RabbitMQ), pull-based + buffer.memory (Kafka), visibility timeout (SQS), rủi ro RAM cao nhất (Redis); phát hiện qua consumer lag/queue depth | Intermediate | Analyze |
| 08 | Consumer scaling & rebalancing — competing consumers + quorum queue (RabbitMQ), consumer group + rebalancing "stop-the-world" + kỹ thuật giảm thiểu (Kafka), scale gần như không giới hạn (SQS), consumer group không partition cứng (Redis) | Intermediate | Analyze |
| 09 | Schema evolution — Confluent Schema Registry + Avro/Protobuf + compatibility mode (Kafka), tự quản lý convention/registry ngoài (RabbitMQ/SQS/Redis) | Advanced | Evaluate |
| 10 | Replay & audit lịch sử — log-based + reset offset + log compaction (Kafka), RabbitMQ Streams (khác classic/quorum), không hỗ trợ (SQS/SNS), giới hạn RAM/MAXLEN (Redis Streams) | Advanced | Evaluate |
| 11 | High availability & durability — quorum queue Raft (RabbitMQ), replication factor + ISR + acks=all (Kafka), managed multi-AZ (SQS/SNS), rủi ro mất dữ liệu qua AOF/replication async (Redis Streams) | Advanced | Evaluate |
| 12 | Operational complexity, chi phí & vendor lock-in — vhost (RabbitMQ), ACL+quota+chuyên môn vận hành sâu (Kafka), fully managed ít tuỳ biến (SQS/SNS), cần Redis Enterprise cho multi-tenancy thật (Redis); cost model + message size limit + vendor lock-in làm tiêu chí quyết định | Advanced | Evaluate |
| 13 | Chọn broker cho use case cụ thể — tổng hợp toàn bộ tiêu chí Ch3–12 thành bảng quyết định, viết ADR cho hệ thống đơn hàng | Advanced | Evaluate/Create |
| 14 | Project thực chiến: Order fulfillment pipeline — triển khai thật, structured logging + correlation ID, test cho consumer/producer | Thực chiến | Create |

Link tới từng chương sẽ được cập nhật vào bảng trên ngay khi file lesson tương ứng được tạo (sau khi dạy xong và vượt chất vấn cho chương đó).

## Ghi chú nội dung

> Mục này chỉ chứa các quyết định phạm vi TẠM THỜI cho những chương chưa viết — xoá dòng tương ứng ngay khi chương đó được viết xong (nội dung đã nằm trong chương, ghi chú hết tác dụng).

- Ch2: phải dạy đủ vocab để các chương sau không forward-reference — bắt buộc có: RabbitMQ classic/quorum/streams queue (chỉ đặt tên, chưa cần dạy sâu), SQS MessageGroupId VÀ MessageDeduplicationId (hai ID khác nhau, một cho ordering một cho dedup — dễ nhầm), Redis PEL.
- Ch3: dạy visibility timeout + delete-as-ack như cơ chế ack THẬT của SQS (không phải chỉ FIFO dedup) — đây là gap forward-reference đã phát hiện khi review roadmap.
- Ch5: giới hạn Redis còn XCLAIM (cơ chế chính) + XPENDING (thao tác inspect đi kèm) — XAUTOCLAIM chỉ nhắc như ghi chú nâng cao, không dạy ngang hàng để tránh quá tải (~3-5 khái niệm mới/chương).
- Ch5–8: bài tập PHẢI ở dạng chẩn đoán-từ-triệu-chứng (VD: "đơn hàng kẹt ở partition 3, offset không tăng — vì sao và xử lý thế nào") để đạt đúng cấp Bloom Analyze — không được là bảng so sánh 4 broker liệt kê sẵn (đó là Apply nguỵ trang, không phải Analyze thật).
- Ch5: gieo hạt khái niệm correlation ID trong bài tập chẩn đoán ("làm sao biết message này ứng với đơn hàng nào") — làm nền cho Ch14 dùng correlation ID mà không đột ngột.
- Ch9: ví dụ schema evolution phải dùng đúng field đơn hàng thật (VD thêm `giftMessage` optional, đổi `totalAmount` cents→decimal) — không dùng ví dụ textbook chung chung (VD "User thêm field").
- Ch12: neo thảo luận chi phí/vận hành bằng số liệu cụ thể của hệ thống đơn hàng (VD: đội 3 người, 10K đơn/ngày) để tránh trôi thành thảo luận trừu tượng tách khỏi ví dụ xuyên suốt.
- Ch14: phạm vi observability giới hạn ở structured logging + correlation ID — KHÔNG dạy/triển khai distributed tracing đầy đủ (không có worked example nào trước đó cho tracing, chỉ có cho correlation ID ở Ch5).
