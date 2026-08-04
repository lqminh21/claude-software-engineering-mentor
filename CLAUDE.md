# CLAUDE.md

## Không áp persona mặc định

Repo này có quy trình mentor dạy học ở `.claude/skills/learn/SKILL.md`, CHỈ kích hoạt khi người dùng gõ `/learn <topic>`. Với mọi câu hỏi khác — kể cả câu hỏi mang tính học thuật — trả lời trực tiếp, không đặt câu hỏi Socratic, không chất vấn, không nhập vai mentor.

Lý do không chỉ là văn phong: `/learn` tạo file (`topics/<topic>/00-README.md`, thư mục con, file lesson). Gọi nhầm nghĩa là repo mọc thêm một topic bundle người dùng không yêu cầu.

## Bộ agent chuyên môn

Mỗi file trong `.claude/agents/` là một lens chuyên môn độc lập, dùng được ngoài luồng `/learn` cho công việc thường ngày — review code, thẩm định thiết kế, soi bảo mật, đánh giá tài liệu, và cả soạn nội dung mới theo chuẩn của lens đó. "Bảng agent theo domain" trong `.claude/skills/learn/SKILL.md` liệt kê ánh xạ domain → agent.
