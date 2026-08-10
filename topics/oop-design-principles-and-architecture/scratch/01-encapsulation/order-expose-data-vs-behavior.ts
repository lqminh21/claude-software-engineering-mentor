/**
 * NĂM CA CALLER CẦN ĐỌC DỮ LIỆU TỪ `Order`
 * =========================================
 *
 * File này là code minh hoạ để đọc, KHÔNG phải bài tập. Bài tập nằm ở `order.ts`.
 *
 * Chạy: node order-expose-data-vs-behavior.ts
 *
 * Câu hỏi xuyên suốt: khi một chỗ nào đó trong hệ thống cần biết về nội dung
 * đơn hàng, `Order` nên đưa ra cái gì?
 *
 * Kết luận đi tới ở cuối file — đọc tuần tự từ trên xuống sẽ tự thấy.
 */

// ─────────────────────────────────────────────────────────────────────────────
// STATE NỘI BỘ
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mọi field đều `readonly`. Đây là tuyến phòng thủ chính, và nó hoạt động lúc
 * BIÊN DỊCH: ai gõ `item.qty = 5` sẽ thấy đỏ ngay trong editor.
 *
 * Lưu ý `unitPrice` — giá được chốt tại thời điểm thêm vào đơn, không phải giá
 * hiện tại trong catalog. Nếu đọc giá sống, mở lại đơn cũ sau khi shop tăng giá
 * sẽ thấy total khác hoá đơn đã xuất.
 */
export type Item = {
  readonly productId: string;
  readonly name: string;
  readonly unitPrice: number;
  readonly qty: number;
  readonly weightGram: number;
  readonly category: string;
};

// GHI CHÚ — `readonly` áp lên HAI TẦNG ĐỘC LẬP, thiếu tầng nào cũng hở:
//
//   Item[]                     push ✅   items[0].qty = 5 ✅
//   readonly Item[]            push ❌   items[0].qty = 5 ✅  ← chỉ khoá mảng
//   Readonly<Item>[]           push ✅   items[0].qty = 5 ❌  ← chỉ khoá field
//   readonly Readonly<Item>[]  push ❌   items[0].qty = 5 ❌
//
// `Item` ở trên đã readonly từng field, nên chỉ cần thêm `readonly` ở kiểu trả
// về của `allItems` là khoá được cả hai tầng.
//
// Ba cách viết `readonly Item[]` ≡ `Readonly<Item[]>` ≡ `ReadonlyArray<Item>` là
// cùng một kiểu. `Readonly` chỉ đi một tầng — field lồng bên trong vẫn sửa được.
// `readonly` chỉ dùng cho mảng/tuple; Map phải dùng `ReadonlyMap`.

// ─────────────────────────────────────────────────────────────────────────────
// CÁC KIỂU DỮ LIỆU CHỈ ĐỂ ĐỌC, MỖI CÁI SINH RA CHO MỘT NHU CẦU
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ca 1 — hình dạng dữ liệu màn hình chi tiết đơn hàng cần.
 *
 * Nó KHÔNG phải state của `Order`. Nó là bản chụp được tạo mới mỗi lần gọi.
 * Khác biệt đó quan trọng: sửa một bản chụp thì hiển nhiên là vô nghĩa, không
 * ai hiểu nhầm là mình vừa sửa đơn hàng. Nên ở đây không cần `readonly`,
 * không cần phòng thủ gì cả — vấn đề không phát sinh.
 *
 * `lineTotal` do `Order` tính sẵn. Nếu để màn hình tự nhân `unitPrice * qty`
 * thì công thức tính tiền tồn tại ở hai nơi, và chúng sẽ lệch nhau.
 */
export type OrderLine = {
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

/**
 * Ca 3 — hình dạng service kho cần. Chỉ có productId và qty.
 *
 * Cố tình KHÔNG có `unitPrice`. Service kho không có việc gì với giá; và cái gì
 * nó nhìn thấy được thì sớm muộn sẽ có người dùng tới, rồi thành phụ thuộc thật.
 */
export type StockRequirement = {
  productId: string;
  qty: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// CLASS ORDER
// ─────────────────────────────────────────────────────────────────────────────

export class Order {
  readonly id: string;

  /**
   * `private` trong TypeScript cũng chỉ tồn tại lúc biên dịch — Node xoá nó đi
   * rồi mới chạy. Muốn riêng tư thật lúc chạy thì dùng `#items`.
   *
   * Ở đây `private` là đủ, vì mối đe doạ mình phòng thủ là "đồng đội vô tình
   * viết sai mà không có gì báo" — loại đó compile-time chặn trọn vẹn, và chặn
   * sớm hơn bất kỳ hàng rào runtime nào.
   */
  private readonly items: Item[] = [];

  constructor(id: string) {
    this.id = id;
  }

  addItem(item: Item): void {
    this.items.push(item);
  }

  /**
   * Invariant: total luôn bằng tổng (unitPrice * qty) trên mọi item.
   *
   * Là getter tính lại chứ không phải field được lưu — nên không tồn tại trạng
   * thái nào để lệch khỏi invariant. An toàn được ở đây vì `unitPrice` đã đông
   * cứng lúc thêm item; nếu nó đọc giá sống thì getter lại thành sai.
   */
  get total(): number {
    return this.items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // NHÓM A — caller cần một câu trả lời mà `Order` biết trước
  //
  // `Order` trả lời, không đưa nguyên liệu. Không có gì rò rỉ, vì không có gì
  // được đưa ra ngoài.
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * CA 1 — Màn hình chi tiết đơn hàng.
   *
   * ❌ Cách sai: `order.getItems().map(i => ({...i, lineTotal: i.unitPrice * i.qty}))`
   *    Màn hình tự nhân giá với số lượng — đúng công thức nằm trong invariant
   *    của `Order`. Mai thêm VAT từng dòng: bạn sửa `Order`, màn hình vẫn hiện
   *    số cũ, không ai báo lỗi.
   *
   * ✅ Cách đúng: `Order` tính, màn hình chỉ in.
   */
  get lines(): OrderLine[] {
    return this.items.map((i) => ({
      name: i.name,
      qty: i.qty,
      unitPrice: i.unitPrice,
      lineTotal: i.unitPrice * i.qty,
    }));
  }

  /**
   * CA 2 — Tính phí vận chuyển.
   *
   * ❌ Cách sai: caller tự `reduce` cân nặng từ danh sách item. Mai thêm quy tắc
   *    "bao bì cộng 200g mỗi đơn" thì phải đi tìm mọi chỗ đang cộng cân nặng.
   *
   * ✅ Cách đúng: `Order` trả tổng cân nặng.
   *
   * ⚠️ Ranh giới cần giữ: KHÔNG viết `calculateShippingFee()` vào đây.
   *    Cân nặng là SỰ THẬT về đơn hàng → thuộc `Order`.
   *    "18k cho 3kg đầu, miễn phí đơn trên 500k" là CHÍNH SÁCH của nhà vận
   *    chuyển → không thuộc `Order`, và nó đổi mỗi quý.
   *    Nguyên tắc: Order cho ra sự thật, không cho ra chính sách. (chương 8)
   */
  get totalWeightGram(): number {
    return this.items.reduce((sum, i) => sum + i.weightGram * i.qty, 0);
  }

  /**
   * CA 3 — Kiểm tra tồn kho.
   *
   * ❌ Cách sai: đưa cả `Item[]` cho service kho. Nó thấy được `unitPrice`, và
   *    ba tháng sau sẽ có người viết "ưu tiên giữ hàng cho đơn giá trị cao".
   *    Từ đó service kho phụ thuộc vào giá.
   *
   * ✅ Cách đúng: một kiểu hẹp, chỉ đúng phần cần.
   *
   * Nguyên tắc: least privilege — chỉ đưa phần tối thiểu đủ dùng. Không chỉ để
   * an toàn hôm nay, mà để giới hạn những gì có thể phụ thuộc vào bạn ngày mai.
   */
  get stockRequirements(): StockRequirement[] {
    return this.items.map((i) => ({ productId: i.productId, qty: i.qty }));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // NHÓM B — caller cần tự đặt câu hỏi mà `Order` không đoán được
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * CA 5 — Khuyến mãi: "giảm 10% cho danh mục điện tử".
   *
   * Ca duy nhất thật sự cần cả `Item` với đủ field. Nó khác ba ca trên ở chỗ:
   * ba ca kia caller cần một câu trả lời CỐ ĐỊNH, còn ca này caller tự đặt câu
   * hỏi của riêng nó — mà `Order` không biết trước câu hỏi là gì.
   *
   * ❌ Cách sai: `get electronicsTotal()`, rồi `booksTotal`, rồi...
   *    `Order` phình ra theo số mã khuyến mãi. Mỗi campaign marketing là một
   *    lần sửa class lõi.
   *
   * ✅ Cách đúng: trả thẳng mảng, KHÔNG copy.
   *
   * An toàn nhờ hai lớp, cả hai đều ở compile-time và đều miễn phí lúc chạy:
   *   - kiểu trả về `readonly Item[]`  → chặn `push`, `pop`, `splice`...
   *   - `Item` có mọi field `readonly` → chặn `items[0].qty = 5`
   *
   * Vì sao KHÔNG deep copy: deep copy cũng chặn được, nhưng nó chặn trong im
   * lặng — người gõ `items[0].qty = 5` không nhận được gì cả, không lỗi, không
   * log, và tin rằng mình vừa sửa đơn hàng. Đúng loại bug khó truy nhất. Cách
   * trên thì họ thấy đỏ ngay lúc gõ, trước khi chạy.
   */
  get allItems(): readonly Item[] {
    return this.items;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CA 4 — LƯU XUỐNG DATABASE (ca đứng riêng, không có đáp án gọn)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tầng lưu trữ cần đọc HẾT state — đúng thứ encapsulation tồn tại để ngăn.
 * Không có đáp án gọn; ba hướng và đánh đổi của từng hướng nằm ở README.
 *
 * Bên dưới là hướng "cặp snapshot": một cửa riêng cho persistence, tên nói rõ
 * mục đích, code nghiệp vụ không dùng tới.
 */
export type OrderSnapshot = {
  id: string;
  items: Item[];
};

export class OrderWithSnapshot extends Order {
  toSnapshot(): OrderSnapshot {
    return { id: this.id, items: [...this.allItems] };
  }

  static fromSnapshot(s: OrderSnapshot): OrderWithSnapshot {
    const order = new OrderWithSnapshot(s.id);
    for (const item of s.items) order.addItem(item);
    return order;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CHẠY THỬ
// ─────────────────────────────────────────────────────────────────────────────

const order = new Order("ORD-001");

order.addItem({
  productId: "KB-01", name: "Bàn phím cơ", unitPrice: 500_000,
  qty: 2, weightGram: 900, category: "electronics",
});
order.addItem({
  productId: "BK-07", name: "Clean Code", unitPrice: 250_000,
  qty: 1, weightGram: 600, category: "books",
});

console.log("total            :", order.total.toLocaleString("vi-VN"), "đ");
console.log("Ca 1 — lines     :", order.lines);
console.log("Ca 2 — cân nặng  :", order.totalWeightGram, "g");
console.log("Ca 3 — cần ở kho :", order.stockRequirements);

// Ca 5 — caller tự đặt câu hỏi riêng của nó
const giamGiaDienTu = order.allItems
  .filter((i) => i.category === "electronics")
  .reduce((sum, i) => sum + i.unitPrice * i.qty, 0) * 0.1;

console.log("Ca 5 — giảm 10%  :", giamGiaDienTu.toLocaleString("vi-VN"), "đ");

// ─────────────────────────────────────────────────────────────────────────────
// NHỮNG GÌ KHÔNG VIẾT ĐƯỢC TỪ BÊN NGOÀI
//
// Bốn dòng dưới đây CỐ TÌNH SAI. Đó là toàn bộ phần phòng thủ của thiết kế này:
// không một dòng code runtime nào, chỉ là kiểu dữ liệu.
// ─────────────────────────────────────────────────────────────────────────────

// Bôi đen đúng 4 dòng dưới, Ctrl+/ để uncomment — cả 4 đỏ lên cùng lúc.

// order.allItems.push(order.allItems[0]); // thêm item không qua addItem → Property 'push' does not exist on type 'readonly Item[]'
// order.allItems[0].qty = 99; // sửa item đã nằm trong đơn → Cannot assign to 'qty' because it is a read-only property
// order.total = 0; // gán đè total, phá invariant → Cannot assign to 'total' because it is a read-only property
// order.items; // với tới state nội bộ → Property 'items' is private and only accessible within class 'Order'

// LƯU Ý: `node file.ts` chỉ XOÁ phần type rồi chạy, KHÔNG kiểm tra kiểu. Nên nếu
// để 4 dòng trên ở dạng uncomment, Node vẫn chạy tuốt và state bị sửa thật —
// kể cả `order.items`, vì `private` bị xoá mất nên lúc chạy nó là property
// bình thường, trả về đúng mảng nội bộ.
// Hàng rào ở đây là compile-time chứ không phải runtime — đúng thiết kế, vì mối
// đe doạ là đồng đội viết nhầm, không phải code cố ý phá.
// Nhớ comment lại sau khi xem xong.
