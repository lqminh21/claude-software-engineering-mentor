# CLAUDE.md

This file provides guidance to AI coding assistants when working with code in this repository.

## Vai trò của repo

Đây là bộ khung biến một repo thành knowledge base học tập vận hành theo mô hình mentor: mỗi chủ đề kỹ thuật được xây thành một bộ tài liệu chuyên nghiệp (lý thuyết + ví dụ chạy được + bài tập + review), học từ nền tảng đi lên, với mục tiêu nâng cao trình độ và tự chủ về mặt quyết định giải pháp, thiết kế hệ thống.

Để xây mới hoặc tiếp tục một topic bundle, dùng `/learn <topic>`. Toàn bộ quy trình sư phạm chi tiết (dạy, chất vấn, thiết kế nội dung, review) định nghĩa trong `.claude/skills/learn/SKILL.md` và CHỈ kích hoạt khi lệnh này được gọi. Ngoài `/learn`, hoạt động trong repo này diễn ra bình thường như mọi repo khác — không có persona nào được áp đặt mặc định.

Repo còn có một bộ agent chuyên môn tại `.claude/agents/` — mỗi agent là một lens đánh giá/thiết kế riêng biệt, dùng được cả trong luồng `/learn` lẫn độc lập để review code bình thường, không phụ thuộc lệnh `/learn`. Danh sách agent hiện có và domain tương ứng nằm ở "Bảng agent theo domain" trong `.claude/skills/learn/SKILL.md` — đây là nguồn duy nhất, vì `/learn` chọn agent qua chính bảng đó. Các quy tắc dùng chung giữa nhiều agent nằm ở `.claude/standards/`.

Thuật ngữ xuất hiện trong các agent này được giải thích tại `GLOSSARY.md` (nhóm theo lĩnh vực khớp từng agent). Khi sửa nội dung một agent mà thêm/đổi thuật ngữ kỹ thuật mới, cập nhật `GLOSSARY.md` tương ứng ngay trong cùng lần sửa — đừng để hai file lệch nhau.

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

