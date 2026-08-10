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
// Điền năm dòng dưới đây. Cột "Nhóm" ghi một trong hai: A (Order trả lời) /
// B (Order đưa dữ liệu).
//
// Định nghĩa — phân biệt bằng MỘT câu hỏi: method đó có làm phép tính nào
// không (cộng, lọc, so sánh), hay chỉ đưa lại đúng thứ đã có sẵn?
//
//   A (trả lời)     — method TÍNH ra một giá trị mới, giá trị đó không tồn
//                      tại sẵn dưới dạng field nào trong Order. Đổi công thức
//                      tính thì sửa ngay trong class Order.
//   B (đưa dữ liệu) — method KHÔNG tính gì, chỉ trả lại nguyên (hoặc một
//                      phần) dữ liệu đang lưu sẵn. Caller tự tính theo công
//                      thức của họ, Order không biết và không cần biết công
//                      thức đó là gì. Lưu ý: một field Order CÓ SẴN (như
//                      volumeCm3) vẫn có thể nên là B nếu QUYẾT ĐỊNH áp lên
//                      field đó (ví dụ ngưỡng chọn thùng) là chính sách hay
//                      đổi của bộ phận khác — Order đưa dữ liệu thô, không tự
//                      khoá cứng chính sách đó thành method riêng.
//
// (Bản trước của bảng này có ghi thêm nhóm "ngoài" — đã bỏ, vì cả 5 nhu cầu
// đều dùng dữ liệu nằm sẵn trên Item của chính đơn hàng, không có nhu cầu
// nào Order thực sự không với tới được.)
//
// | Nhu cầu                        | Nhóm | Vì sao                          |
// |--------------------------------|------|---------------------------------|
// | N1 hoá đơn VAT                 |   A   | Phải tự tính thêm tiền thuế của dòng để trả về                              |
// | N2 chọn loại xe (khoang lạnh)  |   A   | Cần kiểm tra xem có tồn tại item cần giữ lạnh không                                |
// | N3 chọn thùng carton           |   B   | Caller sẽ tự tính tổng thể tích tùy theo chính sách thay đổi                                |
// | N4 gợi ý sản phẩm cùng loại    |   A   | Cần trả về danh sách category của order                                |
// | N5 engine khuyến mãi mua kèm   |   B   | Chỉ cần trả về items để caller tự tính toán theo nghiệp vụ                                |
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// PHẦN 2 — KIỂU DỮ LIỆU
// ─────────────────────────────────────────────────────────────────────────────

// TODO: `Item` với tám field ở bảng trong PROBLEM.md.
// Field nào cần `readonly`, và tại sao lại là readonly chứ không phải copy?
export type Item = {
  readonly productId: string,
  readonly name: string,
  readonly unitPrice: number,
  readonly qty: number,
  readonly vatRate: number,
  readonly requiresCold: boolean,
  readonly volumeCm3: string,
  readonly category: string,
};

export type ItemWithTax = Pick<Item, 'name' | 'qty' | 'unitPrice' | 'vatRate'> & {
  taxAmount: number,
  priceAfterTax: number
}

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
  private readonly _id: string;
  private readonly _items: Item[] = [];

  constructor(id: string) {
    // TODO
    this._id = id;
  }

  addItem(item: Item): void {
    // TODO
    this._items.push(item);
  }

  get id(): string {
    return this._id;
  }

  get total(): number {
    // TODO — invariant 1
    if (!this._items.length) return 0;
    return this._items.reduce((total, { unitPrice, qty }) => total + unitPrice * qty, 0);
  }

  get totalPayable(): number {
    // TODO — invariant 2. Thuế suất khác nhau theo từng mặt hàng.
    return this._items.reduce((total, { unitPrice, qty, vatRate }) => total + (unitPrice * qty * (vatRate + 1)), 0);
  }

  // TODO: từ đây trở xuống, thêm đúng những gì N1–N5 cần, theo bảng phân loại
  // bạn đã điền ở Phần 1.
  //
  // Với nhu cầu bạn xếp là "ngoài": không thêm method, nhưng viết một comment
  // tại đây nói rõ nó thuộc về ai và vì sao không thuộc `Order`.

  // N3 & N5
  get items(): readonly Item[] {
    return this._items;
  }

  // N1
  get invoiceLines(): readonly ItemWithTax[] {
    return this._items.map(({ name, qty, unitPrice, vatRate }) => ({
      name, qty, unitPrice, vatRate,
      taxAmount: unitPrice * qty * vatRate,
      priceAfterTax: unitPrice * qty * (1 + vatRate),
    }));
  }

  // N2
  get hasFrozenItem(): boolean {
    return this._items.some(item => item.requiresCold);
  }

  // N4
  get orderCategories(): string[] {
    return [...new Set(this._items.map(item => item.category))];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PHẦN 4 — CHẠY THỬ
// ─────────────────────────────────────────────────────────────────────────────

const order = new Order("ORD-2026-0042");

order.addItem({
  productId: 'P001',
  name: 'Fresh Milk',
  unitPrice: 30000,
  qty: 2,
  vatRate: 0.05,
  requiresCold: true,
  volumeCm3: '1000',
  category: 'Dairy',
});
order.addItem({
  productId: 'P002',
  name: 'Coffee Beans',
  unitPrice: 120000,
  qty: 1,
  vatRate: 0.10,
  requiresCold: false,
  volumeCm3: '500',
  category: 'Beverage',
});
order.addItem({
  productId: 'P003',
  name: 'Chocolate',
  unitPrice: 50000,
  qty: 3,
  vatRate: 0.10,
  requiresCold: false,
  volumeCm3: '250',
  category: 'Snack',
})

// TODO: thêm ít nhất ba item, trong đó hai mặt hàng khác `vatRate` và ít nhất
// một mặt hàng `requiresCold: true`.

console.log("total       :", order.total.toLocaleString("vi-VN"), "đ");
console.log("totalPayable:", order.totalPayable.toLocaleString("vi-VN"), "đ");

console.log("invoiceLines:", order.invoiceLines);
console.log("hasFrozenItem:", order.hasFrozenItem);
console.log("orderCategories:", order.orderCategories);

// TODO: in kết quả của từng nhu cầu bạn đã xếp vào nhóm A hoặc B, để thấy hình
// dạng dữ liệu thật sự đi ra khỏi `Order`.

// ─────────────────────────────────────────────────────────────────────────────
// PHẦN 5 — TỰ KIỂM
//
// Bốn dòng dưới là bốn thao tác thiết kế này phải chặn. Trước khi uncomment,
// thay hai chỗ đặt tên tạm cho khớp tên bạn đã dùng:
//    → tên getter trả về danh sách item đầy đủ (nhóm B)
//         → tên field danh sách item bên trong `Order`
//
// Rồi bôi đen cả bốn dòng, Ctrl+/ để uncomment. Đủ bốn dòng đỏ là đạt. Chú thích
// nằm cùng dòng phía sau code, nên uncomment không làm hỏng cú pháp.
// Nhớ comment lại sau khi xem xong.
// ─────────────────────────────────────────────────────────────────────────────

// order.items.push(order.items[0]); // thêm item không qua addItem
// order.items[0].qty = 99; // sửa item đã nằm trong đơn
// order.total = 0; // gán đè total, phá invariant 1
// order._items; // với tới danh sách item nội bộ từ bên ngoài

// LƯU Ý: nếu để bốn dòng trên ở dạng uncomment rồi chạy `node order.ts`, Node
// vẫn chạy tuốt và state bị sửa thật — `readonly` và `private` đã bị xoá trước
// khi chạy. Hàng rào ở đây là compile-time, đúng thiết kế: mối đe doạ là đồng
// đội viết nhầm mà không có gì báo, không phải code cố ý phá.
