import { sorting } from './sorting.js'
import { searching } from './searching.js'
import { dp } from './dp.js'
import { graph } from './graph.js'
import { greedy, backtracking, math, tree } from './others.js'

export const categories = [
  { id: 'sorting', name: 'Sắp xếp', blurb: 'Đưa dữ liệu về đúng thứ tự, nền móng cho tìm kiếm và tham lam.' },
  { id: 'searching', name: 'Tìm kiếm', blurb: 'Tìm một giá trị, hoặc tìm đáp án trên một miền đơn điệu.' },
  { id: 'dp', name: 'Quy hoạch động', blurb: 'Chia bài toán thành bài con chồng nhau và ghi nhớ kết quả.' },
  { id: 'graph', name: 'Đồ thị', blurb: 'Duyệt, đường đi ngắn nhất, cây khung, thành phần liên thông.' },
  { id: 'greedy', name: 'Tham lam', blurb: 'Chọn phương án tốt nhất ở mỗi bước khi có thể chứng minh nó đúng.' },
  { id: 'backtracking', name: 'Quay lui', blurb: 'Thử, đệ quy, gỡ bỏ. Liệt kê mọi cấu hình hợp lệ.' },
  { id: 'math', name: 'Toán học', blurb: 'Ước chung, số nguyên tố, lũy thừa nhanh theo modulo.' },
  { id: 'tree', name: 'Cây', blurb: 'Duyệt cây, BST, tổ tiên chung và cây tự cân bằng.' },
]

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]))

export const algorithms = [
  ...sorting,
  ...searching,
  ...dp,
  ...graph,
  ...greedy,
  ...backtracking,
  ...math,
  ...tree,
].map((a, i) => ({ ...a, day: i + 1 }))

export const algorithmBySlug = Object.fromEntries(algorithms.map((a) => [a.slug, a]))

export const leetcodeUrl = (slug) => `https://leetcode.com/problems/${slug}/`
