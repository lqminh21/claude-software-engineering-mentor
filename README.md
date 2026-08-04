# Software Engineering Mentor

Bộ khung biến một repo thành hệ thống học tập vận hành theo mô hình mentor, dùng trợ lý AI lập trình làm người dạy. Mỗi chủ đề kỹ thuật được xây thành một bộ tài liệu chuyên nghiệp — lý thuyết, ví dụ chạy được, bài tập, review — học từ nền tảng cơ bản đi lên, hướng tới trình độ tự ra quyết định kỹ thuật độc lập, nâng cao trình độ kỹ năng của từng cá nhân.

## Cách dùng

Gõ `/learn <tên-chủ-đề>` để xây mới hoặc tiếp tục một topic bundle (ví dụ: `/learn event-driven-architecture`). Toàn bộ quy trình sư phạm — roadmap, dạy Socratic, chất vấn, viết chương, thiết kế bài tập, review — được định nghĩa trong [`.claude/skills/learn/SKILL.md`](.claude/skills/learn/SKILL.md) và chỉ kích hoạt khi gọi lệnh này. Ngoài `/learn`, mọi tương tác khác trong repo diễn ra bình thường như một repo bất kỳ.

## Cấu trúc một topic bundle

Xem sơ đồ và quy ước đầy đủ trong [`SKILL.md`](.claude/skills/learn/SKILL.md#cấu-trúc-một-topic-bundle) — không lặp lại ở đây để tránh hai nơi mô tả cùng một cấu trúc bị lệch nhau khi quy trình đổi.

Tóm tắt: mỗi bundle gồm `00-README.md` (roadmap), các file lesson `NN-{ten}.md`, `examples/` (dự án minh hoạ), `exercises/` (đề bài) và `my-work/` (bài làm + review) — `exercises/` và `my-work/` tách biệt hoàn toàn để đề bài không lẫn lời giải, và không có file trạng thái riêng, sự tồn tại của file/thư mục chính là trạng thái.

## Bộ agent chuyên môn

Mỗi agent trong [`.claude/agents/`](.claude/agents/) là một lens chuyên môn riêng biệt, dùng được cả trong luồng `/learn` lẫn độc lập cho công việc thường ngày — review code, thẩm định thiết kế, soi bảo mật, đánh giá tài liệu, soạn nội dung mới:

| Agent | Vai trò |
|---|---|
| Software Architect | Kiến trúc/thiết kế tổng thể, đánh đổi dài hạn |
| Backend Engineer | API/service design, chịu tải, xử lý lỗi |
| Database Engineer | Mô hình hoá dữ liệu, schema, query plan, transaction, replication |
| Platform Engineer | CI/CD, hạ tầng, networking, độ tin cậy, chi phí/capacity production |
| Frontend Engineer | Component/state, hiệu năng render, accessibility, responsive, bảo mật đặc thù frontend |
| Security Engineer | Góc nhìn kẻ tấn công |
| Release Engineer | Versioning, chiến lược nhánh, điều phối release, rollback |
| Quality Engineer | Chiến lược test + chất lượng code |
| Instructional Designer | Thiết kế sư phạm (Backward Design, Bloom's Taxonomy, Cognitive Load) + tự viết nội dung học tập |
| Technical Writer | Độ chính xác, đối tượng đọc, cấu trúc, dễ tìm, nhất quán giọng văn, ví dụ & bảo trì |

Các quy tắc dùng chung giữa nhiều agent (chuẩn phản hồi review, thuật ngữ chính xác) được tách vào [`.claude/standards/`](.claude/standards/) thay vì lặp lại trong từng file agent.

## Tuỳ biến

Ba điểm can thiệp thường dùng nhất:

- **Thêm agent** — tạo file mới trong `.claude/agents/`, rồi bổ sung dòng tương ứng vào "Bảng agent theo domain" trong [`SKILL.md`](.claude/skills/learn/SKILL.md); `/learn` chọn agent qua bảng đó, không qua tên file. Cập nhật kèm bảng ở mục "Bộ agent chuyên môn" phía trên và thuật ngữ mới trong [`GLOSSARY.md`](GLOSSARY.md).
- **Thêm chuẩn dùng chung** — đặt vào `.claude/standards/` khi một quy tắc áp dụng cho từ hai agent trở lên, thay vì lặp lại trong từng file agent.
- **Đổi quy trình sư phạm** — sửa [`SKILL.md`](.claude/skills/learn/SKILL.md). Cấu trúc thư mục mà skill sinh ra cũng được đặc tả trong chính file này, nên quy trình và đặc tả đầu ra sửa cùng một chỗ.

## Tài liệu liên quan

- [`CLAUDE.md`](CLAUDE.md) — hai điều trợ lý AI cần biết ở mọi phiên: không tự nhập vai mentor khi người dùng không gõ `/learn`, và bộ agent chuyên môn dùng được cho công việc thường ngày.
- [`GLOSSARY.md`](GLOSSARY.md) — thuật ngữ chuyên ngành dùng trong bộ agent, nhóm theo lĩnh vực.
