---
name: learn
description: Xây dựng hoặc tiếp tục một topic bundle học tập chuyên nghiệp trong repo (lý thuyết + ví dụ chạy được + bài tập + review), theo mô hình mentor. Chỉ kích hoạt khi người dùng gõ /learn <topic>.
---

# Skill: learn

## Khi nào dùng

Chỉ khi người dùng gọi rõ ràng `/learn <topic>`. Không tự áp dụng phong cách Socratic, chất vấn, hay bất kỳ hành vi mentor nào ở các tương tác khác trong repo này — mặc định mọi câu hỏi khác được trả lời bình thường, trực tiếp.

## Cấu trúc một topic bundle

Mỗi thư mục con trong `topics/` là một topic bundle độc lập, có cấu trúc sau:

```
topics/<topic>/
├── 00-README.md                      # frontmatter created_at + roadmap: giai đoạn, chương, ví dụ nghiệp vụ xuyên suốt
├── 01-{ten}.md ... NN-{ten}.md       # lesson lý thuyết, đánh số tuần tự
├── examples/
│   └── <ten-du-an-cu-the>/           # dự án ví dụ hoàn chỉnh, chạy được
├── exercises/                        # đề bài, không chứa lời giải
│   └── NN-{ten-bai-tap}/
│       ├── PROBLEM.md
│       └── starter/                  # code khung (tuỳ chọn)
└── my-work/                          # bài làm và review của người học
    └── NN-{ten-bai-tap}/
        └── attempt-N/
            ├── ...
            └── REVIEW.md
```

File lesson (`NN-{ten}.md`) chỉ được tạo sau khi đã dạy xong chương đó — sự tồn tại của file chính là tín hiệu "chương đã hoàn thành". Thư mục project trong `examples/` đặt tên theo đúng bản chất dự án, không ép khuôn theo một hậu tố cố định.

`exercises/` (đề bài) và `my-work/` (bài làm, review) tách biệt hoàn toàn để đề bài không lẫn lời giải. Không có file trạng thái/tiến độ riêng: sự tồn tại của các file/thư mục trên chính là trạng thái.

## Nguyên tắc ngôn ngữ

Hai nguyên tắc dưới đây áp cho mọi nội dung mentor tạo ra trong luồng `/learn` — hội thoại dạy, lesson, roadmap, đề bài, review — kể cả hội thoại chứ không riêng file ghi ra đĩa.

**Ngôn ngữ dễ tiếp cận.** Thuật ngữ và từ viết tắt vẫn dùng bình thường, nhưng không được dùng trần trụi: lần đầu xuất hiện trong bundle phải kèm ví dụ cụ thể hoặc liên hệ thực tế. Cấm ở đây là cấm bỏ lửng, không phải cấm dùng thuật ngữ. Mức độ giải thích giảm dần theo tiến độ bundle, đúng tinh thần "Quy tắc giảm scaffold dần" — thuật ngữ đã giải thích ở chương trước coi như đã biết.

**Viết tiếng Việt kỹ thuật.** Đọc và áp dụng `../../standards/vietnamese-technical-writing.md`.

Thứ tự giữa hai nguyên tắc: gọi đúng tên khái niệm và diễn đạt sang tiếng Việt không dịch bám chữ (chuẩn dùng chung) → rồi mới giải thích bằng ví dụ ở lần dùng đầu. Không được đảo thứ tự thành né thuật ngữ cho "dễ hiểu".

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

1. **Phát biểu rõ giới hạn nội dung trước khi giao cho ai soạn:** đối tượng đọc và cấp độ Bloom (tra bảng chương ở `00-README.md`, không tự đặt mới), giới hạn độ dài dự kiến, và nội dung đẩy sang chương sau — ghi ngay vào bảng chương của `00-README.md` trong cùng lần sửa, vì phiên sau đọc file này để biết việc cần làm, không đọc lại hội thoại của phiên trước.
2. Dùng `Agent` tool gọi subagent Instructional Designer, cung cấp: nội dung hội thoại đã dạy, kết quả chất vấn ở Bước 2b, giới hạn vừa chốt ở mục 1, 1-2 file lesson gần nhất trong bundle làm mẫu văn phong/format, và yêu cầu tuân theo cả hai Nguyên tắc ngôn ngữ ở trên. Nếu đây là chương đầu tiên của bundle, tự thiết lập văn phong nhất quán để các chương sau theo; nếu bundle đã có chương trước, dùng chính chương đó làm mẫu.

   Yêu cầu bản thảo trả lời đủ các câu hỏi sau — danh mục **nội dung phải có**, không phải danh mục **đề mục phải đặt đúng tên đó**, thứ tự và tên đề mục do người soạn quyết định:
   1. Vấn đề chương này giải quyết — chương này tồn tại vì công việc thật gặp khó khăn gì?
   2. Cách làm trước đó và chỗ nó hỏng — không có khái niệm này thì người ta làm thế nào, và cách đó thất bại ở tình huống nào?
   3. Khái niệm, gọi bằng tên chuẩn ngành — định nghĩa, và cơ chế của nó.
   4. Ví dụ chạy được, bằng đúng ngôn ngữ đã dùng nhất quán trong các chương trước của bundle.
   5. Giới hạn: khi nào không dùng. Nếu khái niệm nền tảng tới mức không có giới hạn nào có ý nghĩa thật (ví dụ Class, Object ở chương mở đầu), thay bằng ngộ nhận thường gặp khi mới học.
   6. So sánh với lựa chọn khác, đánh đổi ở đâu — không có lựa chọn đáng so sánh thì ghi rõ lý do, không bịa.
   7. Tổng kết, thuật ngữ, đọc thêm, liên kết chương — gồm mục "Cần đọc trước"/"Đọc tiếp" để liên kết với các chương khác trong CHÍNH bundle đang xây.

   Loại trừ: tên người, năm, tên bài báo, thuật ngữ hàn lâm — chỉ giữ khi thiếu nó người đọc sẽ chọn sai công cụ hoặc quyết định sai, không thì chuyển xuống phần đọc thêm; bài tập/bộ từ vựng riêng của đề bài không được làm khung hay bộ từ vựng của chương.
3. Dùng `Agent` tool gọi subagent Technical Writer review bản thảo — rõ ràng, cấu trúc, phù hợp đối tượng đọc, giọng văn (không chấm lại quyết định sư phạm như cấp độ Bloom, độ khó lũy tiến — thuộc phạm vi Instructional Designer ở mục 2). Vì đây là bên chưa viết bản thảo, giao thêm ba việc: đối chiếu Có/Thiếu với 7 thành phần ở mục 2; áp phép thử độc lập với buổi dạy — file lesson phải đọc được bởi người **không** dự buổi dạy, trích câu cụ thể nếu bản thảo còn phụ thuộc buổi dạy hoặc đề bài (ví dụ "như đã hỏi ở trên"), không tự nhận chung "đạt"; nếu bản thảo vượt giới hạn độ dài ở mục 1, đối chiếu lý do với nội dung thật đã thêm vào — lý do không khớp với phần nội dung thêm vào thì yêu cầu cắt bớt.
4. Đưa bản thảo (đã qua review của Technical Writer) cho người dùng review/sửa trước khi coi là hoàn tất. Nếu mục 1 đã sửa bảng chương của `00-README.md`, nêu rõ phần đã sửa để người dùng xác nhận cùng lúc — bảng chương từng được duyệt ở Pha A.
5. Nếu file mới khớp với một mục đã liệt kê trong roadmap của `00-README.md`, cập nhật link tới file đó trong bảng chương.

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
3. Dùng `Agent` tool gọi agent phù hợp domain bài tập theo Bảng agent theo domain ở trên (ví dụ: Security Engineer nếu bài tập thiên về bảo mật, Frontend Engineer nếu về UI) — Quality Engineer là lựa chọn mặc định khi bài tập không thiên hẳn về một domain cụ thể. Cung cấp: đề bài (`PROBLEM.md` tương ứng trong `exercises/`), code của attempt hiện tại, nội dung `REVIEW.md` của attempt trước (nếu có) để subagent xác định vấn đề nào đã được khắc phục, và yêu cầu viết feedback theo cả hai Nguyên tắc ngôn ngữ ở trên.
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
