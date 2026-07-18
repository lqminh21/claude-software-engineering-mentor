# Software Engineering Mentor

Hệ thống học tập cá nhân, vận hành theo mô hình mentor: mục tiêu là đi từ trình độ hiện tại lên senior, xa hơn là nâng cao chuyên môn tới mức tự ra quyết định kỹ thuật độc lập như Staff/Principal Engineer, bằng cách xây dựng các bộ tài liệu chuyên nghiệp (lý thuyết + ví dụ chạy được + bài tập + review) cho từng chủ đề kỹ thuật, học từ nền tảng cơ bản, dùng Claude Code làm mentor.

## Cách dùng

Gõ `/learn <tên-chủ-đề>` trong Claude Code để xây mới hoặc tiếp tục một topic bundle (ví dụ: `/learn event-driven-architecture`). Toàn bộ quy trình sư phạm — roadmap, dạy Socratic, chất vấn, viết chương, thiết kế bài tập, review — được định nghĩa trong [`.claude/skills/learn/SKILL.md`](.claude/skills/learn/SKILL.md) và chỉ kích hoạt khi gọi lệnh này. Ngoài `/learn`, mọi tương tác khác trong repo diễn ra bình thường như một repo bất kỳ.

## Cấu trúc một topic bundle

Xem sơ đồ và quy ước đầy đủ trong [`CLAUDE.md`](CLAUDE.md#cấu-trúc-một-topic-bundle) — không lặp lại ở đây để tránh hai nơi mô tả cùng một cấu trúc bị lệch nhau khi quy trình đổi.

Tóm tắt: mỗi bundle gồm `00-README.md` (roadmap), các file lesson `NN-{ten}.md`, `examples/` (dự án minh hoạ), `exercises/` (đề bài) và `my-work/` (bài làm + review) — `exercises/` và `my-work/` tách biệt hoàn toàn để đề bài không lẫn lời giải, và không có file trạng thái riêng, sự tồn tại của file/thư mục chính là trạng thái.

## Bộ agent chuyên môn

Repo có 10 agent trong [`.claude/agents/`](.claude/agents/), mỗi agent là một lens đánh giá/thiết kế riêng biệt, dùng được cả trong luồng `/learn` lẫn độc lập cho việc review code bình thường:

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

## Tài liệu liên quan

- [`CLAUDE.md`](CLAUDE.md) — hướng dẫn cho Claude Code, mô tả vai trò repo và cấu trúc bundle.
- [`GLOSSARY.md`](GLOSSARY.md) — thuật ngữ chuyên ngành dùng trong bộ agent, nhóm theo lĩnh vực.
