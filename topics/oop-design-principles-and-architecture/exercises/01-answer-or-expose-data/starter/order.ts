/**
 * BÀI TẬP 01 — `Order` nên trả lời câu hỏi, hay đưa dữ liệu?
 *
 * Đề bài đầy đủ ở `../PROBLEM.md`. Chép file này sang thư mục làm bài của bạn
 * rồi mới sửa, đừng sửa trực tiếp trong `exercises/`.
 *
 * Chạy: node order.ts
 *
 * Hai invariant phải giữ:
 *   1. total        = tổng (unitPrice * qty) trên mọi item          — chưa thuế
 *   2. totalPayable = tổng (unitPrice * qty * (1 + vatRate)) mọi item — đã thuế
 *
 * Node 24 chỉ XOÁ phần type rồi chạy, không kiểm tra kiểu. Nên:
 *   - không dùng parameter property `constructor(private x: T) {}`;
 *   - chỗ chấm bài là editor, không phải output của `node`.
 */

// ─────────────────────────────────────────────────────────────────────────────
// PHẦN 1 — BẢNG PHÂN LOẠI (viết trước khi viết code)
//
// Điền năm dòng dưới đây. Cột "Nhóm" ghi một trong ba: A (Order trả lời) /
// B (Order đưa dữ liệu) / ngoài (không phải việc của Order).
//
// | Nhu cầu                        | Nhóm | Vì sao                          |
// |--------------------------------|------|---------------------------------|
// | N1 hoá đơn VAT                 |      |                                 |
// | N2 chọn loại xe (khoang lạnh)  |      |                                 |
// | N3 chọn thùng carton           |      |                                 |
// | N4 gợi ý sản phẩm cùng loại    |      |                                 |
// | N5 engine khuyến mãi mua kèm   |      |                                 |
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// PHẦN 2 — KIỂU DỮ LIỆU
// ─────────────────────────────────────────────────────────────────────────────

// TODO: `Item` với tám field ở bảng trong PROBLEM.md.
// Field nào cần `readonly`, và tại sao lại là readonly chứ không phải copy?
export type Item = {};

// TODO: các kiểu chỉ để đọc mà những nhu cầu bạn xếp vào nhóm A cần tới.
// Số lượng kiểu và tên kiểu do bạn quyết định — đừng cố khớp với file minh hoạ
// của buổi học, bộ nhu cầu ở đây khác.

// ─────────────────────────────────────────────────────────────────────────────
// PHẦN 3 — CLASS ORDER
// ─────────────────────────────────────────────────────────────────────────────

export class Order {
  // TODO: `id` và danh sách item nội bộ.
  // Danh sách item cần chặn hai việc khác nhau: người ngoài với tới được nó, và
  // chính `Order` gán lại nó bằng một mảng khác. Đó là hai thứ khác nhau.

  constructor(id: string) {
    // TODO
  }

  addItem(item: Item): void {
    // TODO
  }

  get total(): number {
    // TODO — invariant 1
    return 0;
  }

  get totalPayable(): number {
    // TODO — invariant 2. Thuế suất khác nhau theo từng mặt hàng.
    return 0;
  }

  // TODO: từ đây trở xuống, thêm đúng những gì N1–N5 cần, theo bảng phân loại
  // bạn đã điền ở Phần 1.
  //
  // Với nhu cầu bạn xếp là "ngoài": không thêm method, nhưng viết một comment
  // tại đây nói rõ nó thuộc về ai và vì sao không thuộc `Order`.
}

// ─────────────────────────────────────────────────────────────────────────────
// PHẦN 4 — CHẠY THỬ
// ─────────────────────────────────────────────────────────────────────────────

const order = new Order("ORD-2026-0042");

// TODO: thêm ít nhất ba item, trong đó hai mặt hàng khác `vatRate` và ít nhất
// một mặt hàng `requiresCold: true`.

console.log("total       :", order.total.toLocaleString("vi-VN"), "đ");
console.log("totalPayable:", order.totalPayable.toLocaleString("vi-VN"), "đ");

// TODO: in kết quả của từng nhu cầu bạn đã xếp vào nhóm A hoặc B, để thấy hình
// dạng dữ liệu thật sự đi ra khỏi `Order`.

// ─────────────────────────────────────────────────────────────────────────────
// PHẦN 5 — TỰ KIỂM
//
// Bốn dòng dưới là bốn thao tác thiết kế này phải chặn. Trước khi uncomment,
// thay hai chỗ đặt tên tạm cho khớp tên bạn đã dùng:
//   <getterDanhSachItem> → tên getter trả về danh sách item đầy đủ (nhóm B)
//   <tenFieldNoiBo>      → tên field danh sách item bên trong `Order`
//
// Rồi bôi đen cả bốn dòng, Ctrl+/ để uncomment. Đủ bốn dòng đỏ là đạt. Chú thích
// nằm cùng dòng phía sau code, nên uncomment không làm hỏng cú pháp.
// Nhớ comment lại sau khi xem xong.
// ─────────────────────────────────────────────────────────────────────────────

// order.<getterDanhSachItem>.push(order.<getterDanhSachItem>[0]); // thêm item không qua addItem
// order.<getterDanhSachItem>[0].qty = 99; // sửa item đã nằm trong đơn
// order.total = 0; // gán đè total, phá invariant 1
// order.<tenFieldNoiBo>; // với tới danh sách item nội bộ từ bên ngoài

// LƯU Ý: nếu để bốn dòng trên ở dạng uncomment rồi chạy `node order.ts`, Node
// vẫn chạy tuốt và state bị sửa thật — `readonly` và `private` đã bị xoá trước
// khi chạy. Hàng rào ở đây là compile-time, đúng thiết kế: mối đe doạ là đồng
// đội viết nhầm mà không có gì báo, không phải code cố ý phá.
