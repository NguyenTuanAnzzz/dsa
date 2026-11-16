# DSA mỗi ngày

Mỗi ngày một thuật toán, mỗi ngày một bài LeetCode. 40 ngày, 8 dạng: sắp xếp, tìm kiếm, quy hoạch động, đồ thị, tham lam, quay lui, toán học, cây.

Trang chủ là bảng điều khiển kiểu trạm vệ tinh với mô hình 3D (Three.js): 40 khối là 40 ngày, bấm vào khối để mở ngày học.

Mỗi ngày gồm: lý thuyết, cách hoạt động từng bước, phần debug chạy từng bước (cho sắp xếp và tìm kiếm), code Java, độ phức tạp, bài LeetCode của ngày kèm lời giải, và các bài luyện thêm cùng dạng.

## Chạy local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Kết quả nằm trong `dist/`.

## Deploy lên Vercel

1. Đẩy thư mục này lên GitHub.
2. Vào vercel.com, chọn **Add New → Project**, import repo.
3. Vercel tự nhận Vite: Build Command `npm run build`, Output Directory `dist`. Nếu repo chứa project trong thư mục con, đặt **Root Directory** là `dsa-daily`.
4. Bấm Deploy.

Web dùng hash routing (`#/algo/quick-sort`), nên không cần cấu hình rewrite.

## Thêm một ngày mới

Thêm một object vào file dạng tương ứng trong `src/data/` (ví dụ `sorting.js`). Số ngày được đánh tự động theo thứ tự trong `src/data/index.js`. Muốn có phần debug từng bước thì thêm `viz` và viết hàm sinh bước trong `src/viz/steps.js`.

## Cấu trúc

```
src/
  data/          nội dung 40 thuật toán + bài LeetCode
  viz/steps.js   sinh các bước mô phỏng sắp xếp, tìm kiếm
  components/    StationScene (Three.js), Home, AlgoPage, Visualizer, Charts, QuickOpen (Ctrl K), CodeBlock
  lib/           tiến độ + nhật ký (localStorage), tô màu cú pháp Java
```
