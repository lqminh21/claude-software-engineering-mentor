# Glossary — Thuật ngữ dùng trong bộ agent review

Phụ lục giải thích các thuật ngữ xuất hiện trong bộ agent tại `.claude/agents/`. Mỗi mục theo cấu trúc: **định nghĩa ngắn** → *Vì sao quan trọng* → *Khi nào gặp*. Nhóm theo lĩnh vực trùng với từng agent.

Thuật ngữ giữ nguyên tiếng Anh (chuẩn ngành); giải thích bằng tiếng Việt.

Khi sửa một file agent mà thêm hoặc đổi thuật ngữ kỹ thuật, cập nhật file này ngay trong cùng lần sửa — hai file lệch nhau thì agent dùng thuật ngữ mà người đọc không tra được ở đâu.

---

## Backend

**Idempotency** — gọi cùng một thao tác ghi nhiều lần cho kết quả như gọi đúng một lần.
→ *Vì sao*: sau timeout, client/queue thường retry — request cũ có thể đã tới server. Không idempotent thì một lần "trừ tiền" chạy hai lần.
→ *Khi nào gặp*: thanh toán, tạo đơn, mọi consumer của message queue giao "at-least-once".

**Idempotency key** — khoá duy nhất client gửi kèm request để server nhận diện và bỏ qua bản lặp.
→ *Vì sao*: là cơ chế cụ thể để đạt idempotency cho thao tác vốn không tự nhiên idempotent (như "tạo mới").
→ *Khi nào gặp*: API thanh toán (Stripe), endpoint POST tạo tài nguyên.

**Retry with backoff** — thử lại sau khi lỗi, với khoảng chờ tăng dần (thường kèm jitter).
→ *Vì sao*: retry ngay lập tức và đồng loạt sẽ dồn tải lên dependency đang yếu, làm nó chết hẳn (retry storm).
→ *Khi nào gặp*: gọi HTTP/DB/queue gặp lỗi transient (timeout, 503).

**Transient vs permanent error** — lỗi tạm thời (retry có ích) vs lỗi vĩnh viễn (retry vô nghĩa).
→ *Vì sao*: retry một lỗi 400/validation chỉ lãng phí và có thể khuếch đại sự cố.
→ *Khi nào gặp*: phân loại lỗi trước khi quyết định retry hay trả về ngay.

**Circuit breaker** — sau N lỗi liên tiếp tới một dependency, "mở mạch" trả lỗi ngay trong một khoảng, không gọi nữa.
→ *Vì sao*: khi dependency chết, mọi request treo tới timeout sẽ cạn thread/connection của chính service gọi → sự cố lan ngược.
→ *Khi nào gặp*: gọi service ngoài không ổn định; thường đi cùng fallback.

**Bulkhead** — cô lập tài nguyên (pool connection/thread) riêng cho từng dependency.
→ *Vì sao*: một dependency chậm không được phép nuốt hết tài nguyên chung, kéo sập cả những luồng không liên quan.
→ *Khi nào gặp*: service gọi nhiều dependency với độ tin cậy khác nhau.

**Message ID dedup** — dùng ID gắn sẵn trên message để bỏ qua bản đã xử lý, khác cơ chế với idempotency key (client tự sinh key cho request).
→ *Vì sao*: message queue giao hàng kiểu "at-least-once" có thể gửi trùng cùng một message; consumer phải tự phát hiện trùng bằng ID của chính message đó, không phải request-level idempotency key.
→ *Khi nào gặp*: consumer xử lý message từ Kafka/SQS/RabbitMQ.

**Saga** — chuỗi giao dịch cục bộ qua nhiều service; mỗi bước có compensating action để bù khi bước sau lỗi.
→ *Vì sao*: distributed transaction (2PC) khoá tài nguyên xuyên service, mong manh và không mở rộng; saga đổi lấy eventual consistency.
→ *Khi nào gặp*: một use case ghi dữ liệu ở ≥2 service/DB (đặt hàng → trừ kho → thanh toán).

**Outbox** — ghi event vào một bảng "outbox" trong *cùng transaction* với thay đổi dữ liệu, rồi một process riêng đọc bảng đó và publish.
→ *Vì sao*: nếu ghi DB rồi publish message ở hai bước tách rời, crash ở giữa gây mất/lệch event. Outbox biến hai việc thành một transaction nguyên tử.
→ *Khi nào gặp*: cần đảm bảo "đã đổi dữ liệu thì chắc chắn có event tương ứng".

**Optimistic locking** — không khoá hàng; kèm một cột `version`, khi ghi kiểm tra version chưa đổi, nếu đổi thì báo conflict.
→ *Vì sao*: đa số trường hợp không có xung đột thật; khoá bi quan (pessimistic lock) giữ lock lâu, giảm concurrency.
→ *Khi nào gặp*: nhiều người sửa cùng bản ghi hiếm khi trùng thời điểm.

**Cache stampede (dogpile)** — khi một key cache hết hạn, nhiều request đồng thời cùng miss và dồn xuống nguồn.
→ *Vì sao*: một key "nóng" hết hạn có thể tạo cú tải đột biến đủ để hạ nguồn.
→ *Khi nào gặp*: cache TTL cho dữ liệu truy cập rất nhiều; chống bằng single-flight/lock, jitter TTL, stale-while-revalidate.

**N+1 query** — 1 query lấy N bản ghi, rồi lặp N query con cho từng bản ghi.
→ *Vì sao*: N=10 trên dev thấy nhanh; N=10.000 trên production là 10.000 round-trip.
→ *Khi nào gặp*: ORM lazy-load trong vòng lặp; sửa bằng JOIN hoặc batch load.

**p99 (99th percentile latency)** — ngưỡng mà 99% request nhanh hơn nó.
→ *Vì sao*: latency trung bình che giấu cái đuôi chậm — chính là trải nghiệm của nhóm người dùng xui nhất, và của mọi người khi tải cao.
→ *Khi nào gặp*: đặt mục tiêu hiệu năng; luôn ưu tiên p95/p99 hơn mean.

**Request ID** — mã định danh riêng cho một lần gọi cụ thể (một request/một hop).
→ *Vì sao*: cần phân biệt từng lần gọi riêng lẻ khi debug — hai request giống hệt nhau tới cùng endpoint vẫn phải tách được bằng ID riêng.
→ *Khi nào gặp*: log mỗi lời gọi HTTP/DB/queue ra ngoài.

**Correlation ID** — mã giữ nguyên xuyên suốt một luồng nghiệp vụ, dù đi qua nhiều service/request khác nhau — khác request ID (chỉ gắn với một hop).
→ *Vì sao*: một hành động của người dùng (ví dụ: đặt hàng) sinh ra nhiều request nội bộ qua nhiều service; correlation ID là sợi chỉ nối tất cả log/trace của các request đó lại thành một câu chuyện hoàn chỉnh.
→ *Khi nào gặp*: distributed tracing xuyên nhiều service; ghép request ID của từng hop lại theo cùng một correlation ID.

**Resource-oriented API design** — thiết kế endpoint theo tài nguyên mà client cần (nouns: `/orders/{id}`), không theo cấu trúc bảng DB nội bộ.
→ *Vì sao*: lộ cấu trúc DB nội bộ qua API khiến đổi schema DB kéo theo breaking change cho client, dù bản chất nghiệp vụ không đổi.
→ *Khi nào gặp*: thiết kế REST API mới; tên endpoint nên phản ánh khái niệm nghiệp vụ, không phải tên bảng.

**Contract test** — test xác nhận API vẫn khớp với những gì client đang mong đợi, chạy giữa các service độc lập với nhau.
→ *Vì sao*: phát hiện breaking change ngay khi CI chạy, trước khi service thay đổi được deploy và làm hỏng client thật ở production.
→ *Khi nào gặp*: nhiều service gọi lẫn nhau qua API; đi cùng OpenAPI/protobuf spec làm nguồn sự thật.

**Deprecation (theo giao thức)** — đánh dấu API/field cũ sắp ngừng hỗ trợ, cơ chế cụ thể khác nhau theo giao thức: header `Deprecation`/`Sunset` (RFC 8594) cho REST, `deprecated: true` trong OpenAPI spec, `[deprecated = true]` trong `.proto` cho gRPC, `@deprecated` directive cho GraphQL.
→ *Vì sao*: cắt đột ngột làm hỏng client cũ; deprecation cho họ một giai đoạn hỗ trợ để chuyển đổi trước khi field/endpoint bị gỡ hẳn.
→ *Khi nào gặp*: tiến hoá contract công khai mà không được breaking ngay; thời hạn cụ thể của giai đoạn hỗ trợ do Release Engineer quyết.

**Stateless (để scale ngang)** — service không giữ session/state cục bộ khoá vào một instance cụ thể.
→ *Vì sao*: giữ state cục bộ (session lưu trong RAM của một instance) khiến request của cùng người dùng phải luôn về đúng instance đó — autoscaling/load balancing không còn tự do phân phối request.
→ *Khi nào gặp*: thiết kế service chạy nhiều instance song song; session nên lưu ở nơi mọi instance đều đọc được (Redis, DB), không lưu trong process.

---

## Database

**Data modeling process (conceptual → logical → physical)** — ba bước thiết kế dữ liệu: xác định entity/quan hệ từ nghiệp vụ (conceptual, độc lập công nghệ) → chuẩn hoá thành bảng/cột hay collection trừu tượng (logical) → ánh xạ sang cú pháp DDL cụ thể của engine đã chọn (physical).
→ *Vì sao*: nhảy thẳng vào viết `CREATE TABLE` mà chưa qua hai bước trước dễ lẫn quyết định nghiệp vụ với quyết định công nghệ, gây mô hình khó tiến hoá khi đổi engine.
→ *Khi nào gặp*: bắt đầu thiết kế schema cho một domain mới, trước khi biết dùng SQL hay NoSQL.

**Partitioning / sharding** — chia một bảng/collection lớn thành nhiều phần nhỏ hơn theo một key (thời gian, region, tenant...).
→ *Vì sao*: bảng quá lớn làm chậm toàn bộ thao tác (index, vacuum, backup); nhưng partition sớm khi chưa cần tăng độ phức tạp mà không có lợi ích tương xứng.
→ *Khi nào gặp*: chỉ khi quy mô thực sự đòi hỏi (bảng hàng trăm triệu dòng trở lên), không triển khai sớm.

**Chuẩn hoá (1NF/2NF/3NF/BCNF)** — các dạng chuẩn tăng dần, mỗi dạng loại bỏ một nhóm anomaly (insertion/update/deletion) bằng cách tách đúng phụ thuộc dữ liệu.
→ *Vì sao*: chuẩn hoá chưa đủ để lại dữ liệu trùng lặp gây anomaly khi insert/update/delete; chuẩn hoá quá mức lại sinh nhiều join không cần thiết.
→ *Khi nào gặp*: thiết kế schema quan hệ từ mô hình logic; dừng ở 3NF đủ cho đa số trường hợp, BCNF khi có phụ thuộc hàm phức tạp hơn.

**ACID (Atomicity, Consistency, Isolation, Durability)** — bốn thuộc tính transaction, mỗi cái được engine đảm bảo bằng cơ chế riêng (WAL/undo-redo log cho atomicity & durability, isolation level/MVCC cho isolation).
→ *Vì sao*: nói chung chung "transaction an toàn" không tách được bốn thuộc tính này thì không chẩn đoán được hệ thống đang vi phạm phần nào.
→ *Khi nào gặp*: giải thích vì sao transaction crash giữa chừng không để lại trạng thái nửa vời (atomicity + durability qua WAL).

**CAP theorem / PACELC** — khi network partition xảy ra, hệ phân tán chỉ chọn được Consistency hoặc Availability (CAP); PACELC mở rộng: kể cả không partition, vẫn phải đánh đổi Latency vs Consistency.
→ *Vì sao*: là căn cứ định lượng để chọn công nghệ lưu trữ theo yêu cầu consistency thực tế, không chọn theo cảm tính "NoSQL scale tốt hơn".
→ *Khi nào gặp*: chọn giữa strong consistency (RDBMS) và eventual consistency (đa số NoSQL mặc định).

**Polyglot persistence** — dùng nhiều loại công nghệ lưu trữ khác nhau trong cùng hệ thống, mỗi loại cho đúng access pattern của nó.
→ *Vì sao*: một loại lưu trữ không tối ưu cho mọi access pattern, nhưng thêm loại mới cũng thêm chi phí vận hành — chỉ hợp lý khi access pattern thực sự khác biệt.
→ *Khi nào gặp*: service cần cả quan hệ chặt (đơn hàng) lẫn tìm kiếm full-text (catalog) — có thể dùng Postgres + Elasticsearch.

**Query-first NoSQL design** — bắt đầu từ các truy vấn cần chạy để thiết kế document/row-key, thay vì mô hình hoá entity trước rồi mới nghĩ cách query (ngược hẳn tư duy chuẩn hoá quan hệ).
→ *Vì sao*: NoSQL không có JOIN linh hoạt ở tầng engine — thiết kế theo entity trước sẽ phát hiện quá muộn rằng một truy vấn quan trọng cần join thủ công tốn kém.
→ *Khi nào gặp*: bắt đầu thiết kế document/key-value schema; liệt kê access pattern trước khi vẽ cấu trúc dữ liệu.

**Embedding vs referencing (document store)** — nhúng dữ liệu con trực tiếp vào document cha, hay lưu riêng và tham chiếu bằng ID.
→ *Vì sao*: embed giảm round-trip khi đọc cùng nhau nhưng khó cập nhật độc lập; reference ngược lại — chọn sai hướng gây dữ liệu lệch nhau hoặc query chậm.
→ *Khi nào gặp*: MongoDB — mảng con tăng trưởng không giới hạn (comment trên một post) nên reference, không embed.

**Denormalize có kiểm soát (dual-write / event-driven sync)** — cố ý trùng lặp dữ liệu ở NoSQL để tránh join, kèm cơ chế đồng bộ rõ ràng khi dữ liệu gốc đổi.
→ *Vì sao*: không có JOIN ở tầng engine nên trùng lặp là chủ đích, nhưng đồng bộ (ghi đôi hoặc qua event) là trách nhiệm phải xử lý tường minh — lờ đi sẽ để dữ liệu trôi lệch nhau dần theo thời gian.
→ *Khi nào gặp*: một entity xuất hiện lặp ở nhiều document/bảng để phục vụ nhiều access pattern.

**Single-table design (DynamoDB) & GSI/LSI** — gom nhiều loại entity vào một bảng key-value/wide-column duy nhất, dùng overloaded key và Global/Local Secondary Index (GSI/LSI) để phục vụ nhiều access pattern.
→ *Vì sao*: giảm round-trip so với multi-table, nhưng tăng độ phức tạp thiết kế key; GSI/LSI mỗi loại có đánh đổi chi phí/độ trễ riêng, chỉ đáng dùng khi access pattern đã biết rõ và ổn định trước khi thiết kế.
→ *Khi nào gặp*: hệ NoSQL không hỗ trợ join ở tầng engine, cần "join" logic thay bằng cấu trúc key.

**NoSQL index ordering & anti-pattern (ESR, ALLOW FILTERING, hot partition)** — MongoDB dùng compound index theo thứ tự Equality→Sort→Range (ESR); Cassandra bắt buộc query khớp partition/clustering key, `ALLOW FILTERING` là dấu hiệu sai mô hình; DynamoDB không có query planner, phải tự xét partition key/hot partition/consumed capacity thay vì đọc EXPLAIN.
→ *Vì sao*: mỗi hệ NoSQL không có optimizer chung như RDBMS — sai thứ tự index (Mongo) hay query không khớp key (Cassandra) sẽ quét toàn cluster thay vì tra cứu nhanh, và không có "EXPLAIN ANALYZE" nào cảnh báo trước.
→ *Khi nào gặp*: tối ưu query trên MongoDB/Cassandra/DynamoDB; dùng `.explain()` của MongoDB để chẩn đoán thay vì đoán.

**NoSQL transaction limits (MongoDB multi-document ACID, DynamoDB TransactWriteItems)** — MongoDB hỗ trợ transaction đa document (từ v4.0) nhưng tốn hiệu năng và timeout ngắn; DynamoDB `TransactWriteItems` giới hạn 100 item/4MB mỗi lần.
→ *Vì sao*: dễ mắc 1 trong 2 sai lầm đối lập — giả định NoSQL không có transaction (rồi tự chế cơ chế bù trừ không cần thiết), hoặc dùng transaction NoSQL y hệt RDBMS mà không biết giới hạn của nó.
→ *Khi nào gặp*: một use case cần ghi nguyên tử nhiều document/item trong hệ NoSQL.

**Query plan / EXPLAIN ANALYZE** — kế hoạch thực thi optimizer chọn cho một query; `EXPLAIN ANALYZE` chạy thật và in thời gian/row thực tế.
→ *Vì sao*: đây là bằng chứng để tối ưu, thay cho phỏng đoán "chắc thiếu index".
→ *Khi nào gặp*: bất kỳ query nào chậm; so sánh estimated rows vs actual rows để phát hiện thống kê sai.

**Index (B-tree, GIN, GiST, partial, covering)** — cấu trúc phụ giúp tra cứu nhanh mà không quét toàn bảng.
→ *Vì sao*: đúng loại index quyết định tốc độ — B-tree cho so sánh/khoảng, GIN cho full-text/JSONB, GiST cho range/hình học; partial index chỉ đánh một phần bảng; covering index chứa đủ cột để không phải đọc bảng.
→ *Khi nào gặp*: cột dùng ở WHERE/JOIN/ORDER BY; lưu ý index làm chậm ghi.

**Seq Scan vs Index Scan** — quét tuần tự toàn bảng vs tra qua index.
→ *Vì sao*: Seq Scan không phải lúc nào cũng xấu — với predicate độ chọn lọc thấp (khớp phần lớn bảng) nó là lựa chọn *đúng* của optimizer.
→ *Khi nào gặp*: đọc query plan; đừng vội "thêm index" khi thấy Seq Scan.

**MVCC (Multi-Version Concurrency Control)** — DB giữ nhiều phiên bản của một hàng để đọc không chặn ghi và ngược lại; mỗi transaction thấy một snapshot nhất quán.
→ *Vì sao*: cho concurrency cao mà không cần khoá đọc; nhưng sinh ra phiên bản chết cần dọn.
→ *Khi nào gặp*: Postgres/InnoDB; hiểu để lý giải table bloat, vacuum, và tác hại của long-running transaction.

**Isolation level & anomaly** — mức cô lập giữa các transaction (READ COMMITTED, REPEATABLE READ, SERIALIZABLE) và các bất thường đi kèm (dirty read, non-repeatable read, phantom, write skew).
→ *Vì sao*: chọn mức thấp thì nhanh nhưng phải chấp nhận một số anomaly; chọn mức cao thì an toàn nhưng dễ conflict.
→ *Khi nào gặp*: logic phụ thuộc dữ liệu đọc trong transaction phải nhất quán.

**Write skew** — hai transaction đọc cùng tập dữ liệu, mỗi cái ghi dựa trên cái vừa đọc, kết quả vi phạm một bất biến dù từng transaction riêng lẻ vẫn hợp lệ.
→ *Vì sao*: REPEATABLE READ **không** chặn được write skew; chỉ SERIALIZABLE mới chặn. Đây là cái bẫy hay bị bỏ sót.
→ *Khi nào gặp*: ràng buộc kiểu "luôn còn ≥1 bác sĩ trực" khi hai người cùng xin nghỉ.

**Gap lock (InnoDB)** — khoá khoảng trống giữa các index record để chặn insert vào khoảng đó.
→ *Vì sao*: là cách InnoDB ngăn phantom read ở REPEATABLE READ — khác cơ chế của Postgres, nên hành vi khoá không giống nhau giữa hai engine.
→ *Khi nào gặp*: deadlock bất ngờ trên MySQL khi insert vào cùng khoảng.

**Connection pooling (PgBouncer)** — tái dùng một tập connection thay vì mở mới mỗi request.
→ *Vì sao*: mở connection tới Postgres rất đắt; nhưng pooler ở chế độ transaction-pooling **không** giữ trạng thái session (advisory lock, prepared statement, `SET`) qua các câu lệnh.
→ *Khi nào gặp*: serverless/nhiều instance; hiểu giới hạn pooler để không dùng tính năng session-level nhầm.

**Migration (online, CONCURRENTLY, expand/contract)** — thay đổi schema có kiểm soát phiên bản, có đường lui (down-migration, hoặc backup + roll-forward đã kiểm chứng trước khi chạy).
→ *Vì sao*: `ALTER`/`CREATE INDEX` thường khoá bảng — trên bảng có traffic thật là downtime. `CREATE INDEX CONCURRENTLY` (Postgres), gh-ost/pt-online-schema-change (MySQL), hoặc `ALGORITHM=INPLACE` (MySQL online DDL) tránh khoá.
→ *Khi nào gặp*: đổi schema zero-downtime; **expand/contract** = tách một đổi phá vỡ tương thích thành các bước cộng-thêm rồi mới gỡ-bỏ, để deploy dần.

**NoSQL schema evolution** — không có DDL lock vì schema-less, nhưng vẫn cần chiến lược khi thêm field bắt buộc: đọc kép (dual-read) cho document cũ/mới song song, backfill dần.
→ *Vì sao*: tưởng NoSQL "không cần migration" là hiểu sai — thêm GSI (DynamoDB) là thao tác async tốn throughput riêng, không miễn phí; đọc document cũ thiếu field mới mà không có dual-read sẽ crash hoặc sai logic.
→ *Khi nào gặp*: thêm field bắt buộc vào document store đang có dữ liệu; thêm index mới ở DynamoDB.

**Ràng buộc toàn vẹn tại DB (CHECK/NOT NULL/FK, ON DELETE)** — đặt bất biến dữ liệu ở tầng database, không chỉ trông cậy validate ở tầng ứng dụng.
→ *Vì sao*: validate ở ứng dụng có thể bị bỏ qua (bug, đường ghi dữ liệu khác không qua tầng đó); ràng buộc tại DB là lớp bảo vệ cuối cùng không thể lách qua. `ON DELETE` rõ ràng (CASCADE/RESTRICT/SET NULL) tránh orphaned rows khi xoá bản ghi cha.
→ *Khi nào gặp*: thiết kế schema quan hệ có ràng buộc nghiệp vụ thật, không chỉ NOT NULL hình thức.

**Retention / purge / soft-delete** — chính sách giữ dữ liệu bao lâu và xoá thế nào.
→ *Vì sao*: dữ liệu giữ vô hạn tốn chi phí và tăng rủi ro pháp lý; privacy/compliance (GDPR) yêu cầu xoá/ẩn danh hoá theo hạn.
→ *Khi nào gặp*: thiết kế schema có dữ liệu cá nhân; soft-delete (đánh dấu `deleted_at`) vs hard purge (xoá thật).

**Replication & read replica lag** — dữ liệu ghi vào primary cần thời gian lan tới replica; đọc từ replica ngay sau đó có thể thấy dữ liệu cũ.
→ *Vì sao*: nhầm lẫn giữa "đã ghi" và "đã đọc được ở mọi nơi" gây bug kiểu "vừa lưu xong mà không thấy" (vi phạm read-your-writes).
→ *Khi nào gặp*: scale đọc bằng read replica; cần đọc ngay dữ liệu vừa ghi thì phải đọc từ primary, không phải replica.

**Failover & multi-leader/leaderless replication** — chuyển vai trò primary sang node khác khi sự cố; hoặc mô hình cho phép ghi ở nhiều node cùng lúc.
→ *Vì sao*: failover có thể làm mất giao dịch đang chạy trên primary cũ; multi-leader/leaderless phải giải quyết xung đột ghi bằng last-write-wins, vector clock, hoặc CRDT.
→ *Khi nào gặp*: Cassandra, DynamoDB multi-region — kiểm tra cơ chế giải quyết xung đột trước khi tin dữ liệu luôn nhất quán.

---

## Frontend

**Core Web Vitals (LCP, CLS, INP)** — ba chỉ số Google đo trải nghiệm thực.
→ *Vì sao*: LCP (Largest Contentful Paint) = khi nội dung chính hiện ra; CLS (Cumulative Layout Shift) = tổng dịch chuyển bố cục ngoài ý muốn; INP (Interaction to Next Paint) = độ trễ phản hồi tương tác.
→ *Khi nào gặp*: đánh giá hiệu năng UX. Lưu ý **INP thay FID** làm chỉ số chính thức từ 2024.

**RUM (Real User Monitoring) vs lab** — đo bằng dữ liệu người dùng thật vs đo trong môi trường mô phỏng (Lighthouse/synthetic).
→ *Vì sao*: lab chạy trên máy/mạng lý tưởng; con số đẹp ở lab không nói lên trải nghiệm trên máy tầm trung + mạng chậm.
→ *Khi nào gặp*: khẳng định "trang nhanh" — phải dựa trên RUM.

**Server state / UI state / URL state** — ba loại state khác bản chất trong frontend: server state là dữ liệu từ API (cần cache/đồng bộ, có thể cũ đi); UI state là trạng thái thuần giao diện (mở/đóng modal, tab đang chọn); URL state là state giữ trong query string/route (trang hiện tại, filter, search term) để chia sẻ link hoặc back/forward giữ đúng ngữ cảnh.
→ *Vì sao*: nhầm server state với UI state dẫn tới code rối và bug đồng bộ; nhét UI state đáng lẽ nên là URL state (như trang phân trang) vào chỉ local state làm mất khi refresh hoặc share link.
→ *Khi nào gặp*: chọn công cụ quản lý state; pagination/filter/tab nên phản ánh lên URL, modal/dropdown thì không cần.

**Virtualization (list virtualization)** — chỉ render các phần tử đang trong viewport của một danh sách dài.
→ *Vì sao*: render 10.000 dòng DOM làm treo trình duyệt; virtualize giữ DOM nhỏ bất kể dữ liệu lớn.
→ *Khi nào gặp*: bảng/list dữ liệu lớn.

**Re-render thừa & memoization** — component render lại dù dữ liệu nó phụ thuộc không đổi, thường do tạo object/function mới mỗi lần render (mất referential equality).
→ *Vì sao*: re-render thừa lãng phí CPU và làm code khó suy luận khi debug — component render nhưng "không có lý do" khiến tìm bug khó hơn.
→ *Khi nào gặp*: state đặt sai tầng khiến component cha re-render kéo theo con; dùng memoization (`useMemo`/`useCallback` hoặc tương đương framework khác) khi đã xác định đây là nút thắt thật, không mặc định thêm khắp nơi.

**Code-splitting / lazy-load** — chỉ tải phần code cần dùng ngay, phần còn lại tải khi cần đến (route/component chưa hiển thị).
→ *Vì sao*: tải hết toàn bộ bundle ngay từ đầu làm chậm lần load đầu tiên, dù phần lớn code đó người dùng có thể không bao giờ chạm tới trong phiên đó.
→ *Khi nào gặp*: route ít dùng, component nặng chỉ hiện sau một hành động cụ thể (modal, tab ẩn).

**Accessibility (WCAG AA, ARIA, semantic HTML)** — làm sản phẩm dùng được với bàn phím, screen reader, tương phản màu đạt chuẩn WCAG AA (tỷ lệ tương phản tối thiểu 4.5:1 cho chữ thường, 3:1 cho chữ lớn).
→ *Vì sao*: không chỉ là đạo đức/pháp lý — semantic HTML đúng còn giúp SEO và bảo trì. ARIA chỉ dùng khi HTML thuần không diễn đạt được, không lạm dụng.
→ *Khi nào gặp*: mọi UI; kiểm thử bằng bàn phím và screen reader thật, không chỉ tự động.

**prefers-reduced-motion (WCAG 2.3.3)** — media query cho biết người dùng đã bật cài đặt hệ điều hành yêu cầu giảm hiệu ứng chuyển động.
→ *Vì sao*: animation có thể gây khó chịu hoặc kích ứng (vestibular disorder) ở một số người dùng; animation cũng không được là yếu tố duy nhất để hiểu nội dung.
→ *Khi nào gặp*: mọi hiệu ứng chuyển động/animation trên UI — tôn trọng cờ này thay vì ép chạy animation cho mọi người.

**i18n / l10n (RTL, locale formatting, pluralization)** — quốc tế hoá (thiết kế để hỗ trợ nhiều ngôn ngữ) và bản địa hoá (áp dụng cho một locale cụ thể): layout chịu được chữ đọc phải-sang-trái (RTL), định dạng ngày/số/tiền theo locale, và quy tắc số nhiều (pluralization) khác nhau giữa các ngôn ngữ.
→ *Vì sao*: giả định text luôn ngắn và luôn đọc trái-sang-phải làm vỡ layout ở locale khác; định dạng ngày/số sai locale gây hiểu nhầm nghiêm trọng (ví dụ: 03/04 là 3 tháng 4 hay 4 tháng 3).
→ *Khi nào gặp*: sản phẩm phục vụ nhiều thị trường/ngôn ngữ — không phải chỉ dịch chữ, mà cả cấu trúc layout và định dạng dữ liệu.

**Optimistic UI** — cập nhật giao diện ngay khi người dùng thao tác, đồng bộ với server ngầm phía sau.
→ *Vì sao*: cảm giác tức thời; nhưng phải xử lý rollback khi server từ chối.
→ *Khi nào gặp*: like/thả tim, thêm vào giỏ — thao tác thường thành công.

**Error boundary** — cơ chế cô lập lỗi runtime của một nhánh component để không sập cả trang.
→ *Vì sao*: một component lỗi không nên làm trắng màn hình toàn ứng dụng.
→ *Khi nào gặp*: bọc quanh vùng có rủi ro; kết hợp trạng thái loading/error/empty.

**Critical rendering path** — chuỗi bước trình duyệt cần hoàn tất để vẽ pixel đầu tiên lên màn hình (parse HTML/CSS, render tree, layout, paint).
→ *Vì sao*: CSS/JS render-blocking nằm trong đường này sẽ trì hoãn first paint dù mạng nhanh; loại bỏ render-blocking và inline critical CSS rút ngắn thời gian này.
→ *Khi nào gặp*: tối ưu LCP/FCP — kiểm tra script có cần `defer`/`async` không.

**Resource hints (preconnect/preload) & font-display** — gợi ý trình duyệt tải trước tài nguyên quan trọng; `font-display` kiểm soát cách hiển thị khi font chưa tải xong.
→ *Vì sao*: không có resource hints, trình duyệt phát hiện tài nguyên quan trọng quá muộn; không kiểm soát font-display gây FOIT (chữ vô hình chờ font) hoặc FOUT (chữ nhảy layout khi font tới) không kiểm soát.
→ *Khi nào gặp*: font chữ, script/stylesheet quan trọng biết trước cần tải sớm.

**Token storage (localStorage vs HttpOnly cookie)** — nơi lưu access token ở phía client.
→ *Vì sao*: localStorage đọc được bởi bất kỳ script nào chạy trên trang, kể cả script chèn qua XSS; cookie HttpOnly thì JavaScript không đọc được.
→ *Khi nào gặp*: thiết kế nơi lưu token sau khi đăng nhập — ưu tiên HttpOnly cookie khi kiến trúc cho phép.

**SRI (Subresource Integrity)** — hash kiểm tra tính toàn vẹn của script/stylesheet tải từ CDN ngoài.
→ *Vì sao*: nếu CDN bên thứ ba bị chiếm và trả về file đã bị sửa, SRI khiến trình duyệt từ chối chạy file không khớp hash.
→ *Khi nào gặp*: tải script/stylesheet từ CDN không do mình kiểm soát.

**Third-party script permission scoping** — hạn chế quyền truy cập DOM/network của script bên thứ ba (analytics, ads, chat widget).
→ *Vì sao*: script third-party chạy cùng context với code chính — nếu không giới hạn, nó có toàn quyền đọc DOM (kể cả form nhạy cảm) và gửi dữ liệu ra ngoài như code của chính mình.
→ *Khi nào gặp*: nhúng bất kỳ script bên thứ ba nào; kết hợp với CSP để giới hạn domain được phép kết nối.

**`dangerouslySetInnerHTML` / `v-html` / `innerHTML`** — API render HTML thô trực tiếp vào DOM, bỏ qua cơ chế escape mặc định của framework.
→ *Vì sao*: nếu HTML này chứa dữ liệu người dùng chưa qua sanitize, đây chính là con đường XSS — framework không tự bảo vệ được vì lập trình viên đã chủ động tắt escape.
→ *Khi nào gặp*: render nội dung rich text (WYSIWYG, markdown đã convert sang HTML) — luôn sanitize trước khi đưa vào các API này.

**Bundle secret exposure** — biến môi trường/API key chỉ dành cho server bị lọt vào bundle JavaScript gửi xuống trình duyệt.
→ *Vì sao*: toàn bộ code JS gửi tới client đều đọc được bằng DevTools — khác với secret ở server (chỉ lộ khi server bị xâm nhập), secret trong bundle lộ cho *mọi* người dùng ngay khi tải trang.
→ *Khi nào gặp*: cấu hình biến môi trường cho build frontend (ví dụ: Next.js `NEXT_PUBLIC_*`) — kiểm tra kỹ biến nào thực sự an toàn để public.

**CSP compatibility (nonce/hash)** — viết code frontend tránh inline script/style và `eval` để tương thích với Content-Security-Policy nghiêm ngặt; dùng nonce hoặc hash khi bắt buộc phải inline.
→ *Vì sao*: CSP chặn cả script hợp lệ nếu nó inline không có nonce/hash khớp policy — nới lỏng CSP chỉ vì code chưa tương thích làm mất luôn lớp phòng thủ mà CSP mang lại.
→ *Khi nào gặp*: triển khai CSP nghiêm ngặt trên một codebase đã có sẵn nhiều inline script/style.

---

## Instructional Design

**Backward Design (Understanding by Design)** — thiết kế ngược: xác định mục tiêu học tập trước, rồi mới thiết kế nội dung/bài tập để đạt mục tiêu đó.
→ *Vì sao*: viết nội dung trước rồi mới nghĩ nó dạy được gì dễ lạc đề; đi từ mục tiêu đảm bảo mọi phần đều phục vụ đúng đích.
→ *Khi nào gặp*: thiết kế roadmap, chương lý thuyết, bài tập trong luồng `/learn`.

**Constructive alignment** — bài tập/đánh giá phải là bằng chứng trực tiếp cho đúng mục tiêu học tập đã định, không lệch mục tiêu dù bản thân bài tập hay.
→ *Vì sao*: một bài tập thú vị nhưng đo sai kỹ năng vẫn tính là thiết kế sai; alignment là điều kiện cần để bài tập có giá trị.
→ *Khi nào gặp*: thiết kế `PROBLEM.md` cho một bài tập gắn với chương vừa dạy.

**Bloom's Taxonomy** — sáu cấp độ nhận thức tăng dần: Remember, Understand, Apply, Analyze, Evaluate, Create.
→ *Vì sao*: chuẩn hoá độ khó theo giai đoạn — đưa bài tập "Create" (sáng tạo giải pháp mới) vào giai đoạn Beginner khi người học còn chưa nắm "Understand" là vượt cấp.
→ *Khi nào gặp*: gắn cấp độ nhận thức cho từng chương/giai đoạn (Beginner=Remember/Understand, Intermediate=Apply/Analyze, Advanced=Evaluate/Create).

**Cognitive load theory** — working memory chỉ xử lý được một lượng giới hạn thông tin mới cùng lúc; tổng tải nhận thức gồm ba loại: intrinsic (độ phức tạp vốn có của nội dung), extraneous (tải sinh ra do cách trình bày kém, không phải do nội dung), và germane (nỗ lực để xây dựng hiểu biết lâu dài).
→ *Vì sao*: nhồi quá nhiều khái niệm mới trong một chương làm người học không tiếp thu được dù từng khái niệm không khó (intrinsic load cộng dồn); trình bày dài dòng/lan man tăng extraneous load một cách không cần thiết, chiếm chỗ của germane load thực sự giúp học.
→ *Khi nào gặp*: thiết kế chương mới — giới hạn ~3-5 khái niệm lõi (kiểm soát intrinsic), viết súc tích có cấu trúc rõ (giảm extraneous), dùng worked example trước khi để tự làm (tăng germane).

**Độ khó lũy tiến** — bước nhảy về số khái niệm mới và cấp độ Bloom giữa một chương/bài tập với đơn vị ngay liền trước phải hợp lý, không quá lớn.
→ *Vì sao*: mỗi chương tự nó có thể vừa sức, nhưng nếu bước nhảy so với chương liền trước quá lớn (nhiều khái niệm mới cộng dồn + nhảy vọt cấp độ Bloom cùng lúc), người học vẫn quá tải dù từng đơn vị riêng lẻ đã được kiểm tra cognitive load.
→ *Khi nào gặp*: review roadmap hoặc một chương mới — so với đơn vị liền trước, không chỉ so với chuẩn tuyệt đối của riêng nó; đề xuất bước đệm (ví dụ nhỏ, câu hỏi khởi động) khi bước nhảy quá lớn.

---

## Platform / Vận hành

**CI/CD** — Continuous Integration (tự động build+test mỗi thay đổi) / Continuous Delivery (tự động đưa tới trạng thái deploy được).
→ *Vì sao*: bước thủ công là nguồn lỗi và nút cổ chai; tự động hoá cho phép lô nhỏ, thường xuyên, rủi ro thấp.
→ *Khi nào gặp*: pipeline của mọi dự án; phân biệt deploy (kỹ thuật) với release (quyết định phát hành).

**Ký & verify artifact (artifact signing)** — pipeline build ký số artifact sau khi build, hệ thống deploy verify chữ ký trước khi chạy.
→ *Vì sao*: bảo vệ chuỗi cung ứng của hệ thống build — nếu không ký, một artifact bị chèn thêm mã độc ở đâu đó giữa build và deploy sẽ không bị phát hiện.
→ *Khi nào gặp*: pipeline CI/CD có nhiều bước trung gian (build, registry, deploy) không hoàn toàn tin cậy lẫn nhau.

**IaC (Infrastructure as Code)** — mô tả hạ tầng bằng code có version (Terraform/CDK), thay vì bấm tay.
→ *Vì sao*: môi trường tái tạo được, review được như code, không "pet server" cấu hình bằng tay không ai nhớ.
→ *Khi nào gặp*: dựng/đổi hạ tầng; đi kèm nguyên tắc immutable (thay mới thay vì sửa tại chỗ).

**12-Factor app** — tập nguyên tắc để app chạy tốt trên cloud: image tối giản, ghim version, config tách khỏi image (biến môi trường, không hardcode), có healthcheck.
→ *Vì sao*: config lẫn vào image khiến không thể dùng chung một artifact cho nhiều môi trường (dev/staging/prod) — phải build lại cho từng nơi, phá vỡ nguyên tắc build-một-lần-promote-nhiều-nơi.
→ *Khi nào gặp*: đóng gói container; tách biến môi trường ra khỏi Dockerfile/image.

**Observability (logs / metrics / traces)** — khả năng suy ra trạng thái bên trong hệ thống từ output nó phát ra.
→ *Vì sao*: ba trụ bổ trợ nhau — metric nói "có gì đó sai", log nói "sai cái gì", trace nói "sai ở đâu trong chuỗi service".
→ *Khi nào gặp*: thiết kế hệ để debug được production; dashboard nên theo hành trình người dùng, không chỉ theo tài nguyên.

**SLI / SLO / error budget** — SLI là chỉ số đo (ví dụ: % request <300ms), SLO là mục tiêu cho SLI (ví dụ: 99.9%), error budget là phần được phép vi phạm (0.1%).
→ *Vì sao*: error budget biến "ổn định vs ra tính năng" thành quyết định có số: còn budget thì đẩy nhanh, hết budget thì phanh lại.
→ *Khi nào gặp*: định nghĩa "dịch vụ khoẻ" và cân đối ưu tiên.

**DORA metrics** — bốn chỉ số của nghiên cứu Accelerate: deployment frequency, lead time for changes, change failure rate, time to restore.
→ *Vì sao*: đo năng lực giao hàng của đội bằng dữ liệu, thay vì cảm tính "team mình nhanh".
→ *Khi nào gặp*: đánh giá sức khoẻ quy trình delivery.

**MTTR (Mean Time To Restore)** — thời gian trung bình khôi phục dịch vụ sau sự cố.
→ *Vì sao*: chấp nhận rằng sự cố sẽ xảy ra; tối ưu tốc độ hồi phục quan trọng ngang với giảm tần suất lỗi.
→ *Khi nào gặp*: mục tiêu vận hành; cải thiện bằng rollback nhanh, observability tốt.

**Blue-green vs canary** — hai chiến lược deploy giảm rủi ro.
→ *Vì sao*: blue-green chạy song song hai môi trường rồi cutover toàn bộ (rollback = switch lại tức thì); canary dịch traffic dần theo % (rollback = rút traffic dần, phát hiện sớm trên nhóm nhỏ).
→ *Khi nào gặp*: phát hành thay đổi rủi ro; chọn theo khả năng chịu lỗi và hạ tầng.

**Graceful shutdown (SIGTERM)** — xử lý tín hiệu dừng để hoàn tất request đang chạy trước khi thoát.
→ *Vì sao*: rolling update/scale-down gửi SIGTERM; không xử lý đúng thì rớt request giữa chừng.
→ *Khi nào gặp*: container/K8s; đi cùng healthcheck và resource request/limit.

**Resource limit & right-sizing** — đặt request/limit CPU-RAM rõ ràng cho container, kích cỡ dựa trên số liệu đo thực tế thay vì đoán.
→ *Vì sao*: thiếu resource limit khiến một container ngốn tài nguyên có thể làm OOM lan sang container khác cùng node; right-sizing sai (quá lớn) lãng phí chi phí, sai (quá nhỏ) gây throttling/crash.
→ *Khi nào gặp*: cấu hình container/K8s; điều chỉnh lại theo dữ liệu utilization đo được, không phải một lần rồi thôi.

**Chaos engineering** — chủ động tiêm lỗi thật (kill instance, ngắt mạng, tăng độ trễ) để kiểm chứng resilience.
→ *Vì sao*: circuit breaker/retry/bulkhead "đúng trên thiết kế" không có nghĩa là chạy đúng khi lỗi thật xảy ra.
→ *Khi nào gặp*: xác nhận hệ chịu lỗi được, trước khi lỗi tự tìm đến.

**RTO / RPO** — Recovery Time Objective (bao lâu để khôi phục) / Recovery Point Objective (chấp nhận mất bao nhiêu dữ liệu gần nhất).
→ *Vì sao*: hai con số định hình chiến lược backup/DR và chi phí.
→ *Khi nào gặp*: kế hoạch cho kịch bản mất cả region; backup phải từng được thử phục hồi thật.

**Postmortem không đổ lỗi (blameless)** — sau sự cố, phân tích nguyên nhân và biến bài học thành hành động cụ thể, không quy trách nhiệm cá nhân.
→ *Vì sao*: văn hoá đổ lỗi khiến người liên quan giấu thông tin để tránh bị khiển trách — làm mất chính dữ liệu cần thiết để sự cố không lặp lại.
→ *Khi nào gặp*: sau mọi sự cố production đáng kể; kèm quy trình rõ ràng "ai được gọi khi có sự cố".

**Capacity planning** — dự trù tài nguyên cần thiết dựa trên dữ liệu tăng trưởng thực tế, không đoán.
→ *Vì sao*: thiếu capacity planning khiến hệ thống bất ngờ quá tải khi traffic tăng theo mùa vụ hoặc tăng trưởng người dùng đã có thể dự đoán từ trước.
→ *Khi nào gặp*: lập kế hoạch trước sự kiện traffic cao (sale, ra mắt tính năng); song song với RTO/RPO cho kịch bản mất cả region.

**VPC / subnet segmentation** — tách mạng thành các vùng public/private, giới hạn route ra ngoài.
→ *Vì sao*: service không cần internet trực tiếp mà vẫn có route ra ngoài là bề mặt tấn công thừa.
→ *Khi nào gặp*: thiết kế hạ tầng cloud; DB/service nội bộ nên nằm private subnet.

**Load balancer & health check** — phân phối traffic tới các instance khoẻ mạnh, dựa trên kết quả healthcheck.
→ *Vì sao*: healthcheck chỉ kiểm tra "process còn sống" (ví dụ: trả 200 OK cố định) không phản ánh khả năng phục vụ thật — instance có thể còn chạy nhưng không kết nối được DB, vẫn nhận traffic và trả lỗi cho người dùng.
→ *Khi nào gặp*: thiết kế healthcheck endpoint — nên kiểm tra cả dependency quan trọng (DB, cache), không chỉ "process alive".

**Hạ tầng khớp với kiến trúc (monolith vs microservices)** — network topology cần khác nhau theo kiến trúc: monolith chỉ cần load balancer đứng trước các replica giống hệt nhau; microservices cần service discovery và cân nhắc service mesh khi số service đủ nhiều.
→ *Vì sao*: áp cùng một cách tiếp cận network cho cả hai kiến trúc là sai — mesh hoá một monolith là thừa, còn để microservices tự quản lý từng kết nối thủ công khi đã có hàng chục service là tốn kém không cần thiết.
→ *Khi nào gặp*: quyết định hạ tầng network sau khi Software Architect đã chọn kiến trúc — hạ tầng phải khớp với lựa chọn đó, không phải ngược lại.

**Service mesh (mTLS)** — lớp hạ tầng quản lý giao tiếp giữa các service (mã hoá, retry, circuit breaker) tách khỏi code ứng dụng.
→ *Vì sao*: chỉ đáng dùng khi số lượng service đủ lớn để tự quản lý từng kết nối trở nên tốn kém; áp dụng sớm chỉ tăng độ phức tạp vận hành.
→ *Khi nào gặp*: kiến trúc microservices có nhiều service giao tiếp nội bộ, cần xác thực service-to-service.

**Chi phí là một biến trong đánh đổi kiến trúc** — redundancy/failover multi-AZ/multi-region tốn tiền thật; mức độ dự phòng phải khớp với RTO/RPO cần thiết, không phải "càng dư thừa càng an toàn".
→ *Vì sao*: dư thừa không giới hạn luôn "an toàn hơn" trên lý thuyết nhưng chi phí tăng tuyến tính (hoặc hơn) trong khi lợi ích giảm dần — mức dự phòng nên neo vào RTO/RPO thực tế, không phải cảm giác an toàn.
→ *Khi nào gặp*: quyết định multi-AZ/multi-region; cân bằng giữa Độ tin cậy và Chi phí hạ tầng.

**Cost visibility & allocation** — chi phí hạ tầng gắn được với team/service cụ thể (cost allocation tag), không phải một khoản chung không ai chịu trách nhiệm.
→ *Vì sao*: chi phí không ai sở hữu thì không ai có động lực tối ưu — một service gây tốn kém bất thường có thể không bị phát hiện nhiều tháng nếu không tag theo team/service.
→ *Khi nào gặp*: thiết lập billing/tagging trên cloud; review chi phí định kỳ theo từng team.

---

## Quality / Test

**Test pyramid** — nhiều unit test (nhanh, ít tốn kém, ổn định), ít hơn integration, ít nhất e2e (chậm, giòn, tốn kém).
→ *Vì sao*: dồn hết vào e2e cho bộ test chậm và hay flaky; pyramid cân bằng độ tin cậy và tốc độ. Là hướng dẫn, không phải luật cứng.
→ *Khi nào gặp*: quyết định phân bổ loại test cho một tính năng.

**Test theo hành vi (behavior), không theo cách cài đặt (implementation)** — assert đầu ra/hành vi quan sát được từ bên ngoài, không assert chi tiết bên trong hàm được gọi thế nào.
→ *Vì sao*: test gắn vào chi tiết cài đặt sẽ vỡ mỗi lần refactor dù hành vi không đổi — test tốt phải sống sót qua refactor, chỉ vỡ khi hành vi thật sự sai.
→ *Khi nào gặp*: viết assertion cho unit test — hỏi "test này có vỡ nếu tôi refactor mà không đổi hành vi không?"

**Test double (fake / stub / mock)** — vật thế chỗ cho dependency thật khi test.
→ *Vì sao*: dùng sai loại làm test giòn: fake = cài đặt đơn giản chạy thật (in-memory DB); stub = trả sẵn giá trị cố định; mock = kiểm tra *tương tác* (verify được gọi đúng cách).
→ *Khi nào gặp*: cô lập unit; mock quá mức làm test lộ chi tiết cài đặt và vỡ khi refactor.

**Coverage vs mutation testing** — coverage = % code được test chạy qua; mutation testing = cố tình sửa code rồi xem test có "giết" được mutant không.
→ *Vì sao*: 90% coverage vẫn có thể không verify hành vi gì (chạy qua nhưng không assert). Mutation testing đo chất lượng test thật hơn.
→ *Khi nào gặp*: nghi ngờ bộ test "xanh nhưng rỗng".

**Flaky test** — test khi pass khi fail mà code không đổi (do thời gian, thứ tự chạy, mạng, state chia sẻ).
→ *Vì sao*: flaky làm cả đội mất niềm tin vào CI, rồi bỏ qua cả fail thật.
→ *Khi nào gặp*: test phụ thuộc `sleep`, `now()`, random, hoặc thứ tự — cần cô lập để deterministic.

**Testability (dependency injection, pure function)** — thiết kế để test không cần dựng cả hệ thống.
→ *Vì sao*: code khó test là *triệu chứng* của coupling cao/side-effect trộn lẫn logic. "Khó test" là tín hiệu thiết kế cần xem lại — gọi tên đúng là **code smell**: dấu hiệu bề mặt cho thấy vấn đề thiết kế sâu hơn bên dưới, không phải bản thân lỗi.
→ *Khi nào gặp*: tách I/O khỏi logic; inject dependency thay vì tạo bên trong.

**Review tính đúng đắn (bắt lỗi logic, giả định ngầm)** — review không chỉ đọc code chạy được, mà tìm điều kiện biên sai, case chưa xử lý, và giả định không được nói ra (race condition, trạng thái không nhất quán giữa các bước).
→ *Vì sao*: code compile và chạy qua happy path không đồng nghĩa đúng — race condition và trạng thái không nhất quán thường chỉ lộ ra dưới tải thật hoặc trong trường hợp hiếm.
→ *Khi nào gặp*: review PR — luôn hỏi "điều gì xảy ra nếu hai request này chạy đồng thời?" hoặc "case nào ở đây chưa được xử lý?"

**Review khả năng bảo trì** — đánh giá code có dễ thay đổi trong tương lai không: đặt tên rõ nghĩa, hàm không quá dài/đa trách nhiệm, giải thích *why* không chỉ *what*.
→ *Vì sao*: code đúng nhưng khó bảo trì vẫn tạo gánh nặng dài hạn — người sau không hiểu được lý do đằng sau một quyết định sẽ ngại sửa hoặc sửa sai.
→ *Khi nào gặp*: mọi lần review PR, không chỉ khi có bug.

**Technical debt (deliberate vs inadvertent)** — nợ có chủ đích (đánh đổi biết trước) vs vô tình (do thiếu hiểu biết).
→ *Vì sao*: nợ có chủ đích + ghi lại là quyết định kỹ thuật hợp lý; nợ vô tình + giấu đi là bẫy cho người sau.
→ *Khi nào gặp*: TODO cần kèm ngữ cảnh; ưu tiên trả nợ theo đòn bẩy, không theo chỗ dễ.

---

## Release

**Semantic Versioning (semver)** — `MAJOR.MINOR.PATCH`: major = breaking change, minor = thêm tính năng tương thích, patch = fix tương thích.
→ *Vì sao*: là hợp đồng với người dùng về mức độ rủi ro khi nâng cấp; tăng major bừa làm mất ý nghĩa.
→ *Khi nào gặp*: phát hành thư viện/API; CalVer là lựa chọn khác cho sản phẩm.

**Conventional commit** — format `feat:`/`fix:`/`chore:`... cho commit message.
→ *Vì sao*: cho phép tự sinh changelog và suy ra bước version; log đọc được như một câu chuyện.
→ *Khi nào gặp*: đội muốn changelog tự động, commit nguyên tử.

**Trunk-based development** — nhánh sống ngắn, tích hợp liên tục vào `main` (luôn deploy được).
→ *Vì sao*: nhánh sống lâu gây "merge hell"; trunk-based giảm rủi ro tích hợp.
→ *Khi nào gặp*: đa số đội hiện đại; đi cùng feature flag để giấu tính năng chưa xong.

**`--force-with-lease`** — force-push chỉ thành công nếu nhánh remote chưa bị người khác đẩy thêm.
→ *Vì sao*: `--force` trần có thể xoá commit người khác vừa push; `--with-lease` là phiên bản an toàn.
→ *Khi nào gặp*: dọn history nhánh cá nhân trước PR; **không bao giờ** force-push nhánh chia sẻ.

**Artifact traceability & promotion** — mỗi artifact đánh version, biết build ra từ commit/pipeline run nào; build một lần rồi promote qua các môi trường, không build lại riêng cho từng môi trường.
→ *Vì sao*: build lại riêng cho từng môi trường có thể cho ra artifact khác nhau dù cùng source — mất khả năng biết chính xác cái gì đang chạy ở production. Cơ chế build tất định/tái lập được (byte-identical) là việc của Platform Engineer; Release Engineer chỉ xác nhận đúng version đi qua đúng trình tự môi trường.
→ *Khi nào gặp*: multi-environment deployment (dev→staging→production); audit "phiên bản nào đang chạy ở đâu".

**Provenance** — biết rõ artifact release này sinh ra từ commit nào, pipeline run nào.
→ *Vì sao*: khi có sự cố, cần truy ngược từ artifact đang chạy về đúng commit gây ra nó; khác với SBOM (danh mục dependency, dùng để chặn CVE, thuộc Security Engineer) — provenance là truy vết nguồn gốc build, thuộc Release Engineer.
→ *Khi nào gặp*: audit release, incident response cần biết "bản này build từ đâu".

**Rollback đã diễn tập** — khả năng quay lại phiên bản trước khi phát hiện sự cố sau release.
→ *Vì sao*: rollback "đúng trên lý thuyết" không có nghĩa là chạy được thật — phải từng thử nghiệm rollback thật, phối hợp với chiến lược migration nếu release có đổi schema.
→ *Khi nào gặp*: mọi release có rủi ro; đặc biệt khi kèm database migration.

**Feature flag & canary cho điều phối release** — dùng feature flag để giấu tính năng chưa sẵn sàng, canary để dịch traffic dần sang phiên bản mới.
→ *Vì sao*: tách thời điểm deploy code khỏi thời điểm bật tính năng cho người dùng, giảm rủi ro vì rollback chỉ cần tắt flag, không cần revert deploy.
→ *Khi nào gặp*: điều phối release nhiều service phụ thuộc nhau, hoặc ra tính năng rủi ro cao.

**Changelog tự động vs release notes** — changelog sinh tự động từ conventional commit (kỹ thuật, cho dev); release notes biên tập riêng cho end-user (không kỹ thuật).
→ *Vì sao*: gộp chung hai loại khiến changelog kỹ thuật (refactor, chore) làm nhiễu thông tin end-user thực sự cần biết.
→ *Khi nào gặp*: phát hành sản phẩm có người dùng cuối không phải dev.

**Hotfix riêng khỏi luồng release thường** — sửa lỗi khẩn cấp đi qua đường riêng, không chờ chu trình release thông thường (vốn chậm hơn).
→ *Vì sao*: lỗi nghiêm trọng đang ảnh hưởng người dùng không thể chờ chu trình release đầy đủ (test, staging, phê duyệt nhiều bước).
→ *Khi nào gặp*: production incident cần fix ngay, không đợi release theo lịch.

**Monorepo/nhiều service — điều phối version & thứ tự** — khi nhiều service release cùng lúc, phải biết version nào tương thích với version nào, và thứ tự deploy để tránh service mới gọi vào API cũ chưa kịp deploy (hoặc ngược lại).
→ *Vì sao*: deploy sai thứ tự làm service mới gọi vào API đã bị đổi/xoá ở service cũ chưa deploy, hoặc ngược lại.
→ *Khi nào gặp*: kiến trúc nhiều service phụ thuộc lẫn nhau, release đồng thời.

---

## Security

**Authentication vs Authorization** — xác thực "bạn là ai" vs phân quyền "bạn được làm gì".
→ *Vì sao*: hai việc khác nhau; lỗi hay gặp là xác thực tốt nhưng quên kiểm quyền trên từng thao tác.
→ *Khi nào gặp*: mọi endpoint; kiểm quyền phải ở server, ẩn nút UI không thay thế được.

**RBAC / ABAC / least privilege** — phân quyền theo vai trò / theo thuộc tính; nguyên tắc trao quyền tối thiểu đủ dùng.
→ *Vì sao*: quyền rải rác bằng if-else khó kiểm toán và dễ hở; least privilege giới hạn thiệt hại khi một thành phần bị chiếm.
→ *Khi nào gặp*: thiết kế mô hình quyền; cả service account và DB user.

**Rate limiting cho auth flow (login/OTP/reset password)** — giới hạn số lần thử trong một khoảng thời gian.
→ *Vì sao*: không giới hạn thì kẻ tấn công brute-force mật khẩu/OTP bằng cách thử hàng loạt tự động.
→ *Khi nào gặp*: mọi endpoint đăng nhập, xác thực OTP, đặt lại mật khẩu.

**Session an toàn** — thu hồi token đúng lúc (logout, đổi mật khẩu), cookie `HttpOnly`/`Secure`/`SameSite`, MFA ở thao tác rủi ro cao.
→ *Vì sao*: token sống mãi không thu hồi được là lỗ hổng nếu bị đánh cắp; thiếu cờ cookie khiến token bị JS đọc được (XSS) hoặc gửi qua kênh không mã hoá.
→ *Khi nào gặp*: thiết kế vòng đời session; MFA riêng cho thao tác nhạy cảm (đổi email, chuyển tiền).

**bcrypt / scrypt / argon2id** — hàm băm mật khẩu *chậm có chủ đích*, có salt.
→ *Vì sao*: SHA-256 nhanh → kẻ tấn công thử hàng tỉ mật khẩu/giây. Hàm băm chậm làm brute-force bất khả thi. Không tự chế crypto.
→ *Khi nào gặp*: lưu mật khẩu — không bao giờ dùng SHA/MD5.

**SQL injection & parameterized query** — chèn SQL độc hại qua input; câu query tham số hoá tách dữ liệu khỏi lệnh.
→ *Vì sao*: ghép chuỗi input vào SQL cho phép `'; DROP TABLE...`. Parameterized query khiến input luôn là dữ liệu, không bao giờ là lệnh.
→ *Khi nào gặp*: mọi truy vấn có input người dùng — tuyệt đối không ghép chuỗi.

**XSS & output encoding** — chèn script vào trang; encode output để trình duyệt không thực thi nó.
→ *Vì sao*: dữ liệu người dùng hiển thị lại mà không encode có thể chạy JS trong phiên nạn nhân.
→ *Khi nào gặp*: render nội dung do người dùng nhập; đề phòng cả `dangerouslySetInnerHTML`/`v-html`.

**Deserialization không an toàn & template injection** — parse dữ liệu đầu vào thành object/thực thi template mà không kiểm soát, cho phép kẻ tấn công chạy code tuỳ ý.
→ *Vì sao*: thư viện deserialize (Java, PHP, Python pickle...) hoặc template engine có thể bị lợi dụng để thực thi mã khi input chứa payload đặc biệt, ít quen thuộc hơn SQLi/XSS nên dễ bị bỏ sót.
→ *Khi nào gặp*: parse dữ liệu nhị phân/object không rõ nguồn gốc; template engine render input người dùng trực tiếp.

**IDOR (Insecure Direct Object Reference)** — truy cập tài nguyên của người khác chỉ bằng cách đổi ID trong request.
→ *Vì sao*: "ID khó đoán" không phải kiểm soát truy cập; phải kiểm quyền sở hữu thật trên server.
→ *Khi nào gặp*: `/orders/1234` — thử đổi thành `1235` xem có chặn không.

**SSRF (Server-Side Request Forgery)** — lừa server gửi request tới đích nội bộ mà kẻ tấn công không tới trực tiếp được.
→ *Vì sao*: server thường có quyền mạng nội bộ (metadata endpoint cloud, DB) — bị lợi dụng làm bàn đạp.
→ *Khi nào gặp*: tính năng "nhập URL để server fetch" (webhook, import ảnh từ link).

**Secrets management (vault/KMS, rotation)** — quản lý khoá/mật khẩu qua kho chuyên dụng, xoay vòng định kỳ.
→ *Vì sao*: secret hardcode hoặc để cố định trong biến môi trường sống mãi — lộ một lần là lộ vĩnh viễn.
→ *Khi nào gặp*: mọi khoá API, mật khẩu DB; không commit vào repo dưới bất kỳ hình thức nào.

**Mã hoá khi truyền (TLS) & mã hoá at rest** — dữ liệu nhạy cảm được mã hoá cả lúc di chuyển qua mạng lẫn lúc lưu trữ.
→ *Vì sao*: TLS chặn nghe lén trên đường truyền; mã hoá at rest bảo vệ dữ liệu (PII, thanh toán) nếu ổ đĩa/backup bị lộ dù đường truyền đã an toàn — hai lớp bảo vệ độc lập nhau.
→ *Khi nào gặp*: mọi dữ liệu nhạy cảm; encryption at rest đặc biệt quan trọng cho backup và ổ đĩa đã ngừng dùng.

**SBOM (Software Bill of Materials) & CVE gating** — danh mục mọi thành phần/dependency trong artifact; pipeline build tự chặn khi phát hiện CVE nghiêm trọng chưa vá.
→ *Vì sao*: khi một CVE nổ ra, SBOM cho biết ngay artifact nào chứa thư viện dính lỗi, không phải rà thủ công toàn bộ hệ thống; khác với provenance (Release Engineer, truy vết nguồn gốc build) — SBOM tập trung vào lỗ hổng của thành phần.
→ *Khi nào gặp*: quản lý rủi ro chuỗi cung ứng phần mềm, không chỉ CVE trực tiếp trong code mình viết.

**Security logging & audit** — ghi log riêng cho sự kiện bảo mật (đăng nhập, đổi quyền), tách khỏi log vận hành thông thường.
→ *Vì sao*: log bảo mật lẫn trong log vận hành khó dựng lại chuỗi sự kiện khi điều tra sự cố, và dễ vô tình ghi cả secret dạng plaintext.
→ *Khi nào gặp*: thiết kế audit trail; cảnh báo khi phát hiện hành vi bất thường (nhiều lần đăng nhập sai, đổi quyền bất thường).

**Deny by default & CORS chặt** — mặc định từ chối, chỉ cho phép rõ ràng những gì cần thiết.
→ *Vì sao*: thông báo lỗi rò rỉ chi tiết hệ thống nội bộ giúp kẻ tấn công dò cấu trúc; CORS wildcard origin kèm credentials cho phép bất kỳ trang nào gọi API bằng danh nghĩa người dùng đã đăng nhập.
→ *Khi nào gặp*: cấu hình mặc định của mọi service; error handling và CORS policy.

**STRIDE** — khung threat modeling: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege.
→ *Vì sao*: cho một danh sách có hệ thống để soi bề mặt tấn công từ khi thiết kế, không phải kiểm tra sau cùng.
→ *Khi nào gặp*: thiết kế tính năng nhạy cảm; đi cùng tinh thần shift-left (an ninh gắn vào quá trình phát triển).

**CSP (Content-Security-Policy)** — header khai báo nguồn script/style được phép chạy trên trang.
→ *Vì sao*: defense-in-depth cho XSS — dù output encoding có sót, CSP vẫn chặn script lạ không nằm trong whitelist thực thi.
→ *Khi nào gặp*: cấu hình security header mặc định; đòi code frontend tránh inline script/eval để tương thích CSP nghiêm ngặt.

**Clickjacking (X-Frame-Options / frame-ancestors)** — kẻ tấn công nhúng trang thật vào iframe ẩn để lừa người dùng click.
→ *Vì sao*: người dùng tưởng đang click vào trang khác nhưng thực chất click vào trang thật bị nhúng ẩn bên dưới.
→ *Khi nào gặp*: mọi trang có thao tác nhạy cảm (đổi mật khẩu, chuyển tiền) nên chặn bị nhúng iframe trái phép.

**CSRF (Cross-Site Request Forgery)** — trang độc hại khiến trình duyệt gửi request tới hệ thống thật bằng session đã đăng nhập của nạn nhân.
→ *Vì sao*: nạn nhân không chủ động làm gì, chỉ cần mở trang độc hại trong khi vẫn đăng nhập hệ thống thật; cookie `SameSite` là cơ chế phòng chống chính hiện nay.
→ *Khi nào gặp*: mọi request thay đổi trạng thái (POST/PUT/DELETE) dựa trên cookie session.

**Service-to-service authentication (mTLS/service token)** — xác thực giữa các service với nhau, không chỉ giữa user và hệ thống.
→ *Vì sao*: mạng nội bộ không phải vùng an toàn mặc định — một service bị chiếm có thể giả danh gọi service khác nếu không xác thực lẫn nhau.
→ *Khi nào gặp*: kiến trúc microservices, đặc biệt khi dùng service mesh.

---

## Software Architecture

**Ubiquitous language (DDD)** — domain expert và code dùng chung một từ vựng, không lệch nghĩa giữa hai bên (business nói "đơn hàng chờ duyệt", code không nên chỉ có `status = 3`).
→ *Vì sao*: khi thuật ngữ business và code lệch nhau, mỗi lần trao đổi đều phải "dịch" qua lại, dễ hiểu sai và code phản ánh sai mô hình nghiệp vụ thật.
→ *Khi nào gặp*: đặt tên class/field/hàm trong domain model — nên đọc lên giống cách domain expert nói, không phải thuật ngữ kỹ thuật nội bộ.

**CAP theorem / PACELC** — xem định nghĩa đầy đủ ở mục Database (khi network partition xảy ra, hệ phân tán chỉ chọn được Consistency hoặc Availability).
→ *Vì sao*: là căn cứ định lượng khi Chọn kiến trúc phân tán, không riêng chuyện chọn công nghệ lưu trữ — service phân tán nào cũng phải đối mặt đánh đổi này khi mạng chập chờn.
→ *Khi nào gặp*: quyết định mức độ phân tán của kiến trúc, không chỉ khi Database Engineer chọn công nghệ lưu trữ.

**Bounded context (DDD)** — ranh giới trong đó một mô hình, ngôn ngữ và tập quy tắc nhất quán nội bộ.
→ *Vì sao*: "khách hàng" trong bán hàng khác "khách hàng" trong kế toán; ép một model dùng chung tạo coupling và nhầm lẫn.
→ *Khi nào gặp*: chia hệ lớn thành các phần tự trị; giao tiếp chéo context qua contract/event, không gọi thẳng.

**Aggregate** — cụm object được xử lý như một đơn vị nhất quán, có một root làm cửa vào.
→ *Vì sao*: xác định ranh giới bất biến và ranh giới transaction — thay đổi trong một aggregate là nguyên tử.
→ *Khi nào gặp*: mô hình miền có ràng buộc kiểu "đơn hàng và các dòng của nó phải khớp tổng tiền".

**Anemic domain model** — object miền chỉ có getter/setter, toàn bộ logic dồn vào service/controller.
→ *Vì sao*: là *anti-pattern* của DDD — logic tản mát khó bảo trì; nhưng với CRUD đơn giản thì lại chấp nhận được.
→ *Khi nào gặp*: khi cân nhắc có nên áp DDD hay không.

**Anti-corruption layer (ACL)** — lớp dịch giữa mô hình nội bộ và một hệ ngoài/legacy.
→ *Vì sao*: không để cấu trúc xấu của hệ ngoài rò rỉ vào và làm hỏng mô hình miền của mình.
→ *Khi nào gặp*: tích hợp hệ third-party hoặc hệ cũ.

**Hexagonal architecture (ports & adapters)** — lõi nghiệp vụ định nghĩa "port" (interface), hạ tầng cắm vào bằng "adapter".
→ *Vì sao*: đổi DB/transport/framework không phải viết lại logic nghiệp vụ; dễ test bằng adapter giả.
→ *Khi nào gặp*: độ phức tạp đủ lớn để đáng — CRUD đơn giản thì indirection này thừa.

**CQRS** — tách model đọc và model ghi.
→ *Vì sao*: đọc và ghi thường có yêu cầu bất đối xứng (đọc nhiều, query phức tạp); tách ra tối ưu riêng được. Đổi lại độ phức tạp.
→ *Khi nào gặp*: read/write asymmetry rõ rệt — không dùng cho CRUD đơn giản.

**Event sourcing** — lưu chuỗi event là nguồn sự thật, trạng thái hiện tại được dựng lại từ event.
→ *Vì sao*: có audit trail đầy đủ, dựng lại được trạng thái tại mọi thời điểm; đổi lại độ phức tạp và versioning event.
→ *Khi nào gặp*: miền cần lịch sử/kiểm toán mạnh; thường đi cùng CQRS.

**ADR (Architecture Decision Record)** — ghi một quyết định kiến trúc: context, decision, consequences.
→ *Vì sao*: ghi lại *vì sao* (không chỉ *cái gì*) để người sau hiểu bối cảnh và biết khi nào nên xem lại. Khi giả định ban đầu không còn đúng (quy mô vượt dự kiến, đội tái cấu trúc, công nghệ bị deprecate) — ADR cũ không bị xoá mà đánh dấu **superseded** và link sang ADR mới thay thế, giữ nguyên lịch sử quyết định.
→ *Khi nào gặp*: mọi quyết định quan trọng; xem lại khi bối cảnh đổi, không coi ADR là bất biến vĩnh viễn.

**Build vs buy** — so sánh chi phí tự viết (thời gian, rủi ro bug, bảo trì lâu dài) với dùng giải pháp thị trường đã kiểm chứng ở quy mô lớn.
→ *Vì sao*: viết lại một message queue/OAuth server/ORM từ đầu khi Kafka/Keycloak/Auth0 đã giải quyết đúng vấn đề đó là tốn công sức lẽ ra nên dành cho logic nghiệp vụ riêng của sản phẩm.
→ *Khi nào gặp*: trước khi bắt tay viết lại một thành phần hạ tầng/nền tảng đã có giải pháp trưởng thành trên thị trường.

**Reversible decisions & lock-in** — ưu tiên quyết định có chi phí quay lại (revert) thấp hơn khi hai lựa chọn đều hợp lý, thay vì chọn nhánh "tối ưu trên lý thuyết" nhưng khoá chết kiến trúc (lock-in).
→ *Vì sao*: đổi ORM thường ít tốn kém hơn đổi giao thức giữa các service, và đổi giao thức lại ít tốn kém hơn đổi mô hình dữ liệu đã có transaction phân tán — các quyết định không "reversible" ngang nhau, nên xếp hạng theo chi phí quay lại thật, không phải cảm giác.
→ *Khi nào gặp*: đứng giữa hai lựa chọn kiến trúc đều hợp lý trên giấy — hỏi "nếu sai thì quay lại tốn bao nhiêu" trước khi quyết.

**Dependency cycle** — hai (hoặc nhiều) bounded context/service gọi vòng lẫn nhau (A gọi B, B gọi lại A trực tiếp hoặc gián tiếp qua C).
→ *Vì sao*: cycle khiến không xác định được thứ tự deploy an toàn (đổi A cần B mới, nhưng B cũng cần A mới) và dễ lan truyền lỗi khi một bên down — dependency giữa các context nên luôn một chiều.
→ *Khi nào gặp*: vẽ sơ đồ phụ thuộc giữa các service/context khi review kiến trúc; phát hiện cycle là dấu hiệu ranh giới vẽ sai.

**Quality attribute scale-independence** — mở rộng đúng chỗ chịu tải mà không cần scale toàn hệ thống.
→ *Vì sao*: một thành phần dùng nhiều CPU (xử lý ảnh, encode video) nằm chung deployment unit với thành phần ít tài nguyên (API đọc dữ liệu) thì không thể scale riêng phần chịu tải cao — ranh giới ghép chung ép cả hai phải scale cùng nhau, lãng phí tài nguyên.
→ *Khi nào gặp*: đánh giá boundary giữa các component có thực sự cho phép scale độc lập hay không, trước khi cam kết một kiến trúc chịu được tải lớn.

**C4 model** — sơ đồ kiến trúc theo 4 mức zoom: Context, Container, Component, Code.
→ *Vì sao*: chọn đúng độ chi tiết cho đúng người nghe, thay vì một sơ đồ "hộp và mũi tên" lẫn lộn mọi mức.
→ *Khi nào gặp*: giao tiếp kiến trúc với các đối tượng khác nhau.

**Strangler fig** — thay hệ cũ dần bằng cách bọc và chuyển từng phần chức năng sang hệ mới.
→ *Vì sao*: big-bang rewrite rủi ro cao và hay thất bại; strangler cho tiến hoá an toàn, đảo ngược được.
→ *Khi nào gặp*: hiện đại hoá hệ legacy.

**Distributed monolith** — nhiều service nhưng khớp chặt tới mức phải deploy cùng nhau.
→ *Vì sao*: là cái bẫy tệ nhất — gánh chi phí vận hành của microservices mà không có lợi ích tách rời.
→ *Khi nào gặp*: cảnh báo khi chia microservices theo trend mà ranh giới không rõ.

**Shotgun surgery** — một thay đổi khái niệm buộc phải sửa nhiều module không liên quan trực tiếp.
→ *Vì sao*: là dấu hiệu coupling cao — thiết kế tốt thì một quyết định chỉ cần sửa đúng 1-2 chỗ.
→ *Khi nào gặp*: đo coupling giữa các module khi review kiến trúc.

**Conway's Law** — cấu trúc hệ thống có xu hướng phản ánh cấu trúc giao tiếp của tổ chức xây nó.
→ *Vì sao*: chọn microservices khi đội không thực sự vận hành độc lập theo từng service sẽ tạo ra distributed monolith — vấn đề tổ chức, không phải kỹ thuật.
→ *Khi nào gặp*: quyết định chọn kiến trúc theo quy mô đội, không chỉ theo công nghệ.

---

## Technical Writing

**Diátaxis** — bốn loại tài liệu tách biệt theo hai trục (học vs làm việc, lý thuyết vs thực hành): tutorial (học bằng cách làm theo), how-to (làm việc cụ thể đã biết mục tiêu), reference (tra cứu chi tiết chính xác), explanation (hiểu sâu bối cảnh/lý do).
→ *Vì sao*: trộn bốn mục đích vào một trang khiến người mới học (cần tutorial dẫn từng bước) bị lạc giữa chi tiết tra cứu (reference), còn người đang tra cứu nhanh lại phải lướt qua phần giải thích lý thuyết không cần lúc đó.
→ *Khi nào gặp*: cấu trúc bộ tài liệu; trước đây khung này tên "Divio".

**Curse of knowledge** — người viết vô thức giả định người đọc biết những gì mình cho là hiển nhiên, vì bản thân đã quá quen thuộc để nhận ra đó là kiến thức chuyên sâu.
→ *Vì sao*: là nguyên nhân số một của tài liệu khó hiểu — ví dụ, người viết quen dùng "idempotent" nên quên giải thích, nhưng người đọc mới có thể chưa từng gặp khái niệm này; thuật ngữ chưa giới thiệu cứ thế được dùng tiếp không kèm định nghĩa.
→ *Khi nào gặp*: viết cho người mới; kiểm bằng cách để người thực sự chưa biết chủ đề đọc thử bản thảo.

**Inverted pyramid** — đặt thông tin quan trọng nhất lên đầu, chi tiết phía sau.
→ *Vì sao*: người đọc kỹ thuật quét chứ không đọc tuần tự; phần đầu phải trả lời "cái này là gì, có giúp tôi không".
→ *Khi nào gặp*: README, phần mở đầu mọi trang.

**Docs-as-code** — tài liệu được viết, review, version và test *như code*.
→ *Vì sao*: tài liệu tách rời khỏi code sẽ dần không còn khớp với phiên bản hiện tại; ví dụ được test tự động thì không "chạy được trong doc, hỏng trong thực tế".
→ *Khi nào gặp*: đặt doc cạnh code, ship trong cùng PR với thay đổi.
