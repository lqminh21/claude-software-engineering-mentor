/**
 * BÀI TẬP CHƯƠNG 1 — tự viết lại `Order` mà không nhìn file minh hoạ.
 *
 * Chạy: node order.ts
 *
 * Invariant phải giữ: total luôn bằng tổng (unitPrice * qty) trên mọi item.
 *
 * Không có test. Phần phòng thủ của thiết kế này nằm ở compile-time, mà
 * `readonly` bị xoá trước khi test chạy — nên editor mới là chỗ chấm bài.
 * Cách tự kiểm: uncomment khối cuối file, đủ 4 dòng đỏ là đạt.
 */

// TODO: khai báo `Item`. Field nào nên `readonly`, và vì sao?
export type Item = {};

// TODO: Ca 1 — hình dạng dữ liệu màn hình chi tiết đơn hàng cần.
// Nhớ: ai chịu trách nhiệm tính thành tiền từng dòng?
export type OrderLine = {};

export class Order {
  // TODO: state. `id` có cần đổi sau khi tạo không?

  constructor(id: string) {
    // TODO
  }

  addItem(item: Item): void {
    // TODO
  }

  get total(): number {
    // TODO
    return 0;
  }

  // ── NHÓM A — trả lời câu hỏi, không đưa dữ liệu ──────────────────────────

  /** Ca 1 — màn hình chi tiết đơn hàng. */
  get lines(): OrderLine[] {
    // TODO
    return [];
  }

  /**
   * Ca 2 — tính phí vận chuyển cần tổng cân nặng.
   * Ranh giới: KHÔNG viết `calculateShippingFee()` vào đây. Vì sao?
   */
  get totalWeightGram(): number {
    // TODO
    return 0;
  }

  // ── NHÓM B — đưa dữ liệu, vì câu hỏi không đoán trước được ───────────────

  /**
   * Ca 5 — khuyến mãi tự lọc item theo tiêu chí của riêng nó.
   * Kiểu trả về phải chặn được cả `push` lẫn `items[0].qty = 5`.
   */
  get allItems(): readonly Item[] {
    // TODO
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TỰ KIỂM — bôi đen 4 dòng, Ctrl+/ để uncomment. Đủ 4 dòng đỏ là thiết kế đúng.
// Nhớ comment lại sau khi xem.
// ─────────────────────────────────────────────────────────────────────────────

const order = new Order("ORD-001");

// order.allItems.push(order.allItems[0]); // → Property 'push' does not exist on type 'readonly Item[]'
// order.allItems[0].qty = 99; // → Cannot assign to 'qty' because it is a read-only property
// order.total = 0; // → Cannot assign to 'total' because it is a read-only property
// order.items; // → Property 'items' is private and only accessible within class 'Order'

console.log(order.total, order.lines, order.totalWeightGram);
