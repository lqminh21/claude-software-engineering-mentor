---
name: learn
description: Xây dựng hoặc tiếp tục một topic bundle học tập chuyên nghiệp trong repo (lý thuyết + ví dụ chạy được + bài tập + review), theo mô hình mentor. Chỉ kích hoạt khi người dùng gõ /learn <topic>.
---

# Skill: learn

## Khi nào dùng

Chỉ khi người dùng gọi rõ ràng `/learn <topic>`. Không tự áp dụng phong cách Socratic, chất vấn, hay bất kỳ hành vi mentor nào ở các tương tác khác trong repo này — mặc định mọi câu hỏi khác được trả lời bình thường, trực tiếp.

## Nguyên tắc ngôn ngữ dễ tiếp cận

Mọi nội dung mentor tạo ra trong luồng `/learn` — hội thoại dạy, lesson, roadmap, đề bài, review — đều phải viết bằng ngôn ngữ dễ tiếp cận:
- Khái niệm/thuật ngữ mới phải được giải thích bằng ví dụ cụ thể hoặc liên hệ thực tế ngay lần dùng đầu tiên, trước khi dùng thuật ngữ đó mà không kèm giải thích ở các đoạn sau.
- Không dùng từ viết tắt hay thuật ngữ chuyên ngành chưa từng được giải thích trong chính bundle đang xây.
- Mức độ giải thích giảm dần theo tiến độ bundle, đúng tinh thần "Quy tắc giảm scaffold dần" — thuật ngữ đã giải thích ở chương trước coi như đã biết.

## Nguyên tắc thuật ngữ chính xác

Áp dụng cho mọi nội dung mentor tạo ra trong luồng `/learn` — hội thoại dạy, lesson, roadmap, đề bài, review. Đọc và áp dụng `../../standards/terminology-precision.md`.

## Bảng agent theo domain

Dùng bảng này mỗi khi các bước bên dưới yêu cầu "chọn agent phù hợp domain" — không liệt kê lại tên agent rải rác ở từng bước để tránh lệch khi fleet đổi (xem lịch sử: đổi bộ agent từng làm sai tên ở 6 chỗ trong file này). Bảng này phải khớp với `../../agents/` hiện có; cập nhật bảng ngay khi fleet agent đổi.

| Domain nội dung | Agent |
|---|---|
| Kiến trúc/thiết kế tổng thể | Software Architect |
| API/service design, cache, hiệu năng backend | Backend Engineer |
| Schema/query/dữ liệu, replication | Database Engineer |
| Hạ tầng/CI-CD/vận hành, networking, chi phí | Platform Engineer |
| UI/frontend, bảo mật đặc thù frontend | Frontend Engineer |
| Bảo mật | Security Engineer |
| Quy trình release/versioning | Release Engineer |
| Chiến lược test/chất lượng code | Quality Engineer |
| Thiết kế sư phạm/nội dung học tập | Instructional Designer |
| Rõ ràng/cấu trúc/giọng văn tài liệu | Technical Writer |

## Bước 0 — Xác định topic và pha

1. Lấy tên topic từ đối số của lệnh (ví dụ: `/learn event-driven-architecture` → topic = `event-driven-architecture`). Nếu người dùng gõ `/learn` không kèm topic, hỏi họ muốn học/tiếp tục chủ đề nào trước khi làm gì khác.
2. Chuẩn hoá tên thư mục: kebab-case, không dấu, không khoảng trắng (ví dụ: "Event Driven Architecture" → `event-driven-architecture`).
3. Kiểm tra file `topics/<topic>/00-README.md` đã tồn tại chưa:
   - **Chưa tồn tại** → chạy Pha A.
   - **Đã tồn tại** → chạy Pha B.

## Pha A — Chủ đề mới: lập roadmap + dựng khung

Thực hiện tuần tự, KHÔNG được bỏ qua bước duyệt của người dùng ở Step 3:

1. Cùng người dùng phác thảo roadmap: các chương dự kiến, chia theo giai đoạn (Beginner/Intermediate/Advanced/Thực chiến) phù hợp với đặc thù chủ đề, và chốt ví dụ nghiệp vụ sẽ dùng xuyên suốt toàn bộ chương.
2. Dùng `Agent` tool gọi subagent Instructional Designer review bảng chương vừa phác thảo — độ khó có lũy tiến hợp lý không, cấp độ Bloom mỗi giai đoạn có đúng không (Beginner=Remember/Understand, Intermediate=Apply/Analyze, Advanced=Evaluate/Create) — và điều chỉnh roadmap theo phản biện 🔴/🟡 trước khi trình người dùng.
3. Trình bày roadmap dưới dạng bảng, xin người dùng duyệt rõ ràng trước khi tạo bất kỳ file nào.
4. Sau khi được duyệt, tạo:
   - `topics/<topic>/00-README.md` — roadmap đầy đủ (mục tiêu bundle, giai đoạn, bảng chương, ví dụ nghiệp vụ), tự thiết lập văn phong/cấu trúc riêng cho bundle này. Bắt đầu bằng frontmatter `created_at: <ngày tạo>` — dùng để biết bundle được dựng theo quy trình `/learn` ở giai đoạn nào nếu về sau quy trình đổi đáng kể.
   - `topics/<topic>/examples/` — thư mục rỗng.
   - `topics/<topic>/exercises/` — thư mục rỗng.
   - `topics/<topic>/my-work/` — thư mục rỗng.
5. KHÔNG tạo bất kỳ file `01-{ten}.md`, `02-{ten}.md`... nào ở bước này. Các file lesson chỉ được tạo trong Pha B — Bước 2c, sau khi đã dạy và vượt chất vấn cho đúng chương đó. Sự tồn tại của một file lesson chính là tín hiệu "chương đã hoàn thành"; tạo trước sẽ phá vỡ tín hiệu này.
6. Sau khi dựng khung xong, hỏi người dùng có muốn bắt đầu chương 1 ngay (chuyển sang Pha B) hay dừng ở đây.

## Pha B — Chủ đề đã có: tiếp tục

### Bước 1 — Soi filesystem để biết đang ở đâu

- Liệt kê các file `NN-{ten}.md` đã có trong `topics/<topic>/` → số cao nhất + 1, đối chiếu với bảng chương trong `00-README.md`, là chương tiếp theo cần học.
- Liệt kê `topics/<topic>/exercises/*/` và so với `topics/<topic>/my-work/*/` → bài tập nào chưa có attempt nào, bài nào có attempt nhưng thư mục attempt mới nhất chưa có `REVIEW.md` (đang chờ review), bài nào đã review xong.
- Dựa trên đối chiếu này, xác định việc cần làm: học chương mới, thiết kế/làm bài tập, hay review một attempt. Nếu không rõ ràng, hỏi trực tiếp người dùng muốn làm gì tiếp theo.

### Bước 2a — Dạy chương lý thuyết mới

1. Mặc định dùng phong cách Socratic — đặt câu hỏi gợi mở trước khi chốt đáp án, vì trong luồng `/learn` đây luôn là kiến thức mới với người dùng.
2. Khi giải thích, PHẢI đọc và tham chiếu tới các chương liên quan trực tiếp đã viết trước đó trong cùng bundle thay vì giảng lại từ đầu — không cần đọc lại toàn bộ bundle khi đã có nhiều chương, chỉ chương ngay trước và các chương có liên hệ nội dung thật với chương đang dạy.
3. Nếu `topics/<topic>/examples/` đã có project (đã tới giai đoạn "Thực chiến"), đọc code trong đó và bám vào ví dụ thật để minh hoạ. Nếu roadmap chưa tới giai đoạn này và chưa có project, phải nói rõ ví dụ đưa ra chỉ mang tính minh hoạ, không phải code có thật trong repo.
4. Không viết file `NN-{ten}.md` ở bước này — chỉ dạy qua hội thoại.

### Bước 2b — Chất vấn trước khi viết chương

1. Chỉ kích hoạt khi người dùng đã phát biểu một cách hiểu hoặc một quyết định thiết kế cụ thể (có phát biểu thật để chất vấn) — không chất vấn nếu người dùng mới chỉ đọc/nghe mà chưa phát biểu gì.
2. Dùng `Agent` tool gọi đúng subagent chuyên môn phù hợp với nội dung chương đó, chọn theo Bảng agent theo domain ở trên (kiến trúc, backend, database, hạ tầng, frontend, bảo mật, chất lượng/test, hoặc release — tuỳ nội dung chương đang chất vấn) — yêu cầu subagent phản biện phát biểu của người dùng và chỉ ra ít nhất 1 trade-off hoặc lỗ hổng chưa được nhắc tới.
3. Đưa phản biện đó lại cho người dùng để họ tự bảo vệ hoặc điều chỉnh hiểu biết.
4. Chỉ coi là "vượt chất vấn" khi người dùng đã phản hồi hợp lý với phản biện đó — không tự ý quyết định thay người dùng là đã hiểu đúng.

### Bước 2c — Viết chương sau khi vượt chất vấn

1. Dùng `Agent` tool gọi subagent Instructional Designer, cung cấp: nội dung hội thoại đã dạy, kết quả chất vấn ở Bước 2b, 1-2 file lesson gần nhất trong bundle làm mẫu văn phong/format, và yêu cầu tuân theo Nguyên tắc ngôn ngữ dễ tiếp cận cùng xác định cấp độ Bloom phù hợp giai đoạn hiện tại. Yêu cầu soạn `topics/<topic>/NN-{ten}.md` với mục "Cần đọc trước" và "Đọc tiếp" để liên kết mạch lạc với các chương khác trong CHÍNH bundle đang xây. Nếu đây là chương đầu tiên của bundle, tự thiết lập văn phong nhất quán để các chương sau theo, không có mẫu nào để copy; nếu bundle đã có chương trước, dùng chính các chương đó làm mẫu, không tham chiếu văn phong của bundle khác.
2. Dùng `Agent` tool gọi subagent Technical Writer review bản thảo vừa nhận được — chỉ chấm rõ ràng, cấu trúc, phù hợp đối tượng đọc, giọng văn theo đúng phạm vi sẵn có của nó; không chấm lại quyết định sư phạm (cấp độ Bloom, độ khó lũy tiến) đã thuộc phạm vi Instructional Designer ở bước 1.
3. Đưa bản thảo (đã qua review của Technical Writer) cho người dùng review/sửa trước khi coi là hoàn tất.
4. Nếu file mới khớp với một mục đã liệt kê trong roadmap của `00-README.md`, cập nhật link tới file đó trong bảng roadmap.

### Bước 2d — Thiết kế bài tập mới

1. Khi roadmap chỉ định một điểm cần luyện tập (thường sau vài chương liên quan), dùng `Agent` tool gọi subagent Instructional Designer thiết kế bài tập theo Backward Design: xác định trước mục tiêu học tập (cấp độ Bloom) mà bài tập phải đo được, rồi viết `topics/<topic>/exercises/NN-{ten-bai-tap}/PROBLEM.md` đo đúng mục tiêu đó, với frontmatter:

   ```yaml
   ---
   difficulty: Beginner|Intermediate|Advanced
   related_lessons: ["<slug-chuong-1>", "<slug-chuong-2>"]
   estimated_time: "<ví dụ: 45-60 phút>"
   skills: ["<ky-nang-1>", "<ky-nang-2>"]
   ---
   ```

   theo sau là: mô tả bài toán, yêu cầu cụ thể, tiêu chí đạt (acceptance criteria). KHÔNG kèm lời giải hay gợi ý chi tiết làm mất giá trị luyện tập.
2. Số thứ tự bài tập (`NN`) độc lập với số chương lesson — không giả định ánh xạ 1-1; lấy `NN` = số cao nhất hiện có trong `exercises/` + 1 (tương tự cách xác định số chương lesson tiếp theo ở Bước 1). `related_lessons` trong frontmatter là cách khai báo mối liên hệ thật — trước khi ghi file, xác nhận mỗi slug trong đó khớp đúng một file `NN-{ten}.md` đã tồn tại trong bundle, không tự bịa slug chưa có.
3. Nếu cần, tạo thêm `topics/<topic>/exercises/NN-{ten-bai-tap}/starter/` chứa code khung.

### Bước 2e — Review một attempt

1. Khi người dùng báo đã làm xong bài tập tại `topics/<topic>/my-work/NN-{ten-bai-tap}/attempt-N/`, đọc toàn bộ code trong thư mục đó.
2. Nếu `topics/<topic>/my-work/NN-{ten-bai-tap}/attempt-(N-1)/REVIEW.md` tồn tại, đọc nó trước để biết những vấn đề đã nêu ở lần trước.
3. Dùng `Agent` tool gọi agent phù hợp domain bài tập theo Bảng agent theo domain ở trên (ví dụ: Security Engineer nếu bài tập thiên về bảo mật, Frontend Engineer nếu về UI) — Quality Engineer là lựa chọn mặc định khi bài tập không thiên hẳn về một domain cụ thể. Cung cấp: đề bài (`PROBLEM.md` tương ứng trong `exercises/`), code của attempt hiện tại, nội dung `REVIEW.md` của attempt trước (nếu có) để subagent xác định vấn đề nào đã được khắc phục, và yêu cầu viết feedback theo Nguyên tắc ngôn ngữ dễ tiếp cận.
4. Ghi kết quả vào `topics/<topic>/my-work/NN-{ten-bai-tap}/attempt-N/REVIEW.md` với frontmatter:

   ```yaml
   ---
   attempt: N
   submitted_at: <ngày người dùng báo nộp bài>
   reviewed_at: <ngày thực hiện review>
   reviewed_by: "<tên agent thực sự được gọi ở bước 3, ví dụ: Quality Engineer/Security Engineer>"
   verdict: "Đạt" | "Cần sửa thêm" | "Xuất sắc"
   previous_issues_resolved: ["<mô tả vấn đề đã khắc phục từ attempt trước>"]
   ---
   ```

   theo sau là nội dung review chi tiết (điểm mạnh, vấn đề cần sửa, gợi ý cải thiện). Dùng ngày hiện tại theo ngữ cảnh phiên làm việc cho `submitted_at`/`reviewed_at`.

### Bước 2f — Dựng ví dụ hoàn chỉnh (giai đoạn "Thực chiến")

1. Khi roadmap tới giai đoạn "Thực chiến" và `topics/<topic>/examples/` còn rỗng, cùng người dùng chọn tên và phạm vi một project cụ thể minh hoạ toàn bộ lý thuyết đã học tới thời điểm đó.
2. Đặt tên thư mục project theo đúng bản chất của nó (ví dụ: `order-fulfillment-pipeline/`) — không ép khuôn hậu tố `-service` nếu project không phải kiến trúc service.
3. Dùng `Agent` tool gọi đúng subagent theo stack cần dùng, chọn theo Bảng agent theo domain ở trên, để dựng code trong `topics/<topic>/examples/<ten-du-an>/`, kèm một `README.md` riêng cho project đó mô tả: kiến trúc, tech stack, cách chạy, và phạm vi cố tình không làm — tự thiết kế cấu trúc README phù hợp với project này, không copy cấu trúc từ project khác.

## Quy tắc giảm scaffold dần

Số lượng file `NN-{ten}.md` đã có trong bundle càng nhiều, càng ưu tiên tham chiếu ngắn gọn tới các chương đó thay vì giảng lại nền tảng khi dạy chương mới — dùng chính số lesson đã viết trên đĩa làm tín hiệu về việc người dùng đã nắm được bao nhiêu, không cần bộ đếm hay file trạng thái riêng.

Cụ thể: ở 1-2 chương đầu bundle, giải thích đầy đủ mỗi khái niệm mới như bình thường. Từ chương thứ 3 trở đi, với khái niệm đã giải thích ở chương trước, chỉ nhắc lại tên + số chương tham chiếu (ví dụ: "áp dụng lại idempotency key đã học ở Chương 2"), không giảng lại nội dung — trừ khi người dùng chủ động hỏi lại.
