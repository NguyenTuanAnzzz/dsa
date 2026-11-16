// Mỗi bước: { arr, compare, swap, done, range, pointer, found, msg }
// compare/swap: chỉ số đang so sánh / đổi chỗ
// done: các chỉ số đã nằm đúng vị trí
// range: [lo, hi] đoạn đang xét (tìm kiếm, chia để trị)

const snap = (arr, extra) => ({ arr: arr.slice(), compare: [], swap: [], done: [], ...extra })
const range = (a, b) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i)

function bubble(input) {
  const a = input.slice()
  const s = [snap(a, { msg: 'Mảng ban đầu.' })]
  const done = []
  for (let i = 0; i < a.length - 1; i++) {
    let swapped = false
    for (let j = 0; j < a.length - i - 1; j++) {
      s.push(snap(a, { compare: [j, j + 1], done: done.slice(), msg: `So sánh ${a[j]} và ${a[j + 1]}.` }))
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        swapped = true
        s.push(snap(a, { swap: [j, j + 1], done: done.slice(), msg: `${a[j + 1]} > ${a[j]}, đổi chỗ.` }))
      }
    }
    done.push(a.length - 1 - i)
    s.push(snap(a, { done: done.slice(), msg: `Hết lượt ${i + 1}: ${a[a.length - 1 - i]} đã về đúng chỗ.` }))
    if (!swapped) {
      s.push(snap(a, { done: range(0, a.length - 1), msg: 'Lượt này không đổi chỗ lần nào, mảng đã sắp xếp.' }))
      return s
    }
  }
  s.push(snap(a, { done: range(0, a.length - 1), msg: 'Hoàn tất.' }))
  return s
}

function selection(input) {
  const a = input.slice()
  const s = [snap(a, { msg: 'Mảng ban đầu.' })]
  const done = []
  for (let i = 0; i < a.length - 1; i++) {
    let min = i
    s.push(snap(a, { pointer: min, done: done.slice(), msg: `Lượt ${i + 1}: tạm coi ${a[i]} là nhỏ nhất.` }))
    for (let j = i + 1; j < a.length; j++) {
      s.push(snap(a, { compare: [min, j], pointer: min, done: done.slice(), msg: `So sánh ${a[j]} với min hiện tại ${a[min]}.` }))
      if (a[j] < a[min]) {
        min = j
        s.push(snap(a, { pointer: min, done: done.slice(), msg: `Cập nhật min = ${a[min]}.` }))
      }
    }
    if (min !== i) {
      ;[a[i], a[min]] = [a[min], a[i]]
      s.push(snap(a, { swap: [i, min], done: done.slice(), msg: `Đưa ${a[i]} về vị trí ${i}.` }))
    }
    done.push(i)
  }
  s.push(snap(a, { done: range(0, a.length - 1), msg: 'Hoàn tất.' }))
  return s
}

function insertion(input) {
  const a = input.slice()
  const s = [snap(a, { done: [0], msg: 'Phần tử đầu tiên coi như đã sắp xếp.' })]
  for (let i = 1; i < a.length; i++) {
    const key = a[i]
    let j = i - 1
    s.push(snap(a, { pointer: i, done: range(0, i - 1), msg: `Lấy key = ${key}.` }))
    while (j >= 0 && a[j] > key) {
      s.push(snap(a, { compare: [j, j + 1], done: range(0, i - 1), msg: `${a[j]} > ${key}, dịch ${a[j]} sang phải.` }))
      a[j + 1] = a[j]
      a[j] = key
      s.push(snap(a, { swap: [j, j + 1], done: range(0, i), msg: 'Đã dịch.' }))
      j--
    }
    s.push(snap(a, { pointer: j + 1, done: range(0, i), msg: `Đặt ${key} vào vị trí ${j + 1}.` }))
  }
  s.push(snap(a, { done: range(0, a.length - 1), msg: 'Hoàn tất.' }))
  return s
}

function merge(input) {
  const a = input.slice()
  const s = [snap(a, { msg: 'Mảng ban đầu.' })]
  const rec = (l, r) => {
    if (l >= r) return
    const m = Math.floor((l + r) / 2)
    s.push(snap(a, { range: [l, r], msg: `Chia đoạn [${l}, ${r}] tại ${m}.` }))
    rec(l, m)
    rec(m + 1, r)
    const tmp = []
    let i = l
    let j = m + 1
    while (i <= m && j <= r) {
      s.push(snap(a, { range: [l, r], compare: [i, j], msg: `Trộn: so sánh ${a[i]} và ${a[j]}.` }))
      tmp.push(a[i] <= a[j] ? a[i++] : a[j++])
    }
    while (i <= m) tmp.push(a[i++])
    while (j <= r) tmp.push(a[j++])
    for (let k = 0; k < tmp.length; k++) a[l + k] = tmp[k]
    s.push(snap(a, { range: [l, r], swap: range(l, r), msg: `Đoạn [${l}, ${r}] đã trộn xong.` }))
  }
  rec(0, a.length - 1)
  s.push(snap(a, { done: range(0, a.length - 1), msg: 'Hoàn tất.' }))
  return s
}

function quick(input) {
  const a = input.slice()
  const s = [snap(a, { msg: 'Mảng ban đầu.' })]
  const done = []
  const rec = (lo, hi) => {
    if (lo > hi) return
    if (lo === hi) {
      done.push(lo)
      return
    }
    const pivot = a[hi]
    s.push(snap(a, { range: [lo, hi], pointer: hi, done: done.slice(), msg: `Chọn pivot = ${pivot}.` }))
    let i = lo - 1
    for (let j = lo; j < hi; j++) {
      s.push(snap(a, { range: [lo, hi], pointer: hi, compare: [j], done: done.slice(), msg: `${a[j]} < ${pivot}?` }))
      if (a[j] < pivot) {
        i++
        ;[a[i], a[j]] = [a[j], a[i]]
        if (i !== j) s.push(snap(a, { range: [lo, hi], pointer: hi, swap: [i, j], done: done.slice(), msg: 'Có, đưa về bên trái.' }))
      }
    }
    ;[a[i + 1], a[hi]] = [a[hi], a[i + 1]]
    done.push(i + 1)
    s.push(snap(a, { range: [lo, hi], swap: [i + 1, hi], done: done.slice(), msg: `Pivot ${pivot} về đúng vị trí ${i + 1}.` }))
    rec(lo, i)
    rec(i + 2, hi)
  }
  rec(0, a.length - 1)
  s.push(snap(a, { done: range(0, a.length - 1), msg: 'Hoàn tất.' }))
  return s
}

function heap(input) {
  const a = input.slice()
  const s = [snap(a, { msg: 'Mảng ban đầu.' })]
  const done = []
  const heapify = (size, i) => {
    for (;;) {
      let largest = i
      const l = 2 * i + 1
      const r = l + 1
      if (l < size && a[l] > a[largest]) largest = l
      if (r < size && a[r] > a[largest]) largest = r
      const kids = [l, r].filter((k) => k < size)
      if (kids.length) s.push(snap(a, { compare: [i, ...kids], done: done.slice(), msg: `Vun đống tại ${a[i]}.` }))
      if (largest === i) return
      ;[a[i], a[largest]] = [a[largest], a[i]]
      s.push(snap(a, { swap: [i, largest], done: done.slice(), msg: 'Đổi cha với con lớn hơn.' }))
      i = largest
    }
  }
  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) heapify(a.length, i)
  s.push(snap(a, { msg: 'Đã có max-heap, phần tử lớn nhất ở đầu.' }))
  for (let end = a.length - 1; end > 0; end--) {
    ;[a[0], a[end]] = [a[end], a[0]]
    done.push(end)
    s.push(snap(a, { swap: [0, end], done: done.slice(), msg: `Đưa ${a[end]} về cuối.` }))
    heapify(end, 0)
  }
  s.push(snap(a, { done: range(0, a.length - 1), msg: 'Hoàn tất.' }))
  return s
}

function counting(input) {
  const a = input.slice()
  const s = [snap(a, { msg: 'Mảng ban đầu.' })]
  const min = Math.min(...a)
  const count = new Map()
  a.forEach((x, i) => {
    count.set(x, (count.get(x) || 0) + 1)
    s.push(snap(a, { compare: [i], msg: `Đếm ${x}: đã gặp ${count.get(x)} lần.` }))
  })
  let k = 0
  const max = Math.max(...a)
  for (let v = min; v <= max; v++) {
    let c = count.get(v) || 0
    while (c-- > 0) {
      a[k] = v
      s.push(snap(a, { swap: [k], done: range(0, k - 1), msg: `Ghi ${v} vào vị trí ${k}.` }))
      k++
    }
  }
  s.push(snap(a, { done: range(0, a.length - 1), msg: 'Hoàn tất.' }))
  return s
}

// ---------- Tìm kiếm (mảng đã sắp xếp) ----------

function linear(a, t) {
  const s = [snap(a, { msg: `Tìm ${t}.` })]
  for (let i = 0; i < a.length; i++) {
    s.push(snap(a, { compare: [i], msg: `arr[${i}] = ${a[i]}.` }))
    if (a[i] === t) return [...s, snap(a, { found: i, msg: `Tìm thấy ${t} tại chỉ số ${i}.` })]
  }
  return [...s, snap(a, { msg: `Không tìm thấy ${t}.` })]
}

function binary(a, t) {
  const s = [snap(a, { range: [0, a.length - 1], msg: `Tìm ${t} trong toàn mảng.` })]
  let lo = 0
  let hi = a.length - 1
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2)
    s.push(snap(a, { range: [lo, hi], compare: [mid], msg: `mid = ${mid}, arr[mid] = ${a[mid]}.` }))
    if (a[mid] === t) return [...s, snap(a, { found: mid, msg: `Tìm thấy tại ${mid}.` })]
    if (a[mid] < t) {
      lo = mid + 1
      s.push(snap(a, { range: [lo, hi], msg: `${a[mid]} < ${t}, bỏ nửa trái.` }))
    } else {
      hi = mid - 1
      s.push(snap(a, { range: [lo, hi], msg: `${a[mid]} > ${t}, bỏ nửa phải.` }))
    }
  }
  return [...s, snap(a, { msg: `Không tìm thấy ${t}.` })]
}

function jump(a, t) {
  const n = a.length
  const step = Math.floor(Math.sqrt(n))
  const s = [snap(a, { msg: `Tìm ${t}, bước nhảy √${n} ≈ ${step}.` })]
  let prev = 0
  let cur = step
  while (prev < n && a[Math.min(cur, n) - 1] < t) {
    s.push(snap(a, { compare: [Math.min(cur, n) - 1], msg: `arr[${Math.min(cur, n) - 1}] = ${a[Math.min(cur, n) - 1]} < ${t}, nhảy tiếp.` }))
    prev = cur
    cur += step
    if (prev >= n) return [...s, snap(a, { msg: `Không tìm thấy ${t}.` })]
  }
  const end = Math.min(cur, n) - 1
  s.push(snap(a, { range: [prev, end], msg: `Target nằm trong khối [${prev}, ${end}], quét tuyến tính.` }))
  for (let i = prev; i <= end; i++) {
    s.push(snap(a, { range: [prev, end], compare: [i], msg: `arr[${i}] = ${a[i]}.` }))
    if (a[i] === t) return [...s, snap(a, { found: i, msg: `Tìm thấy tại ${i}.` })]
  }
  return [...s, snap(a, { msg: `Không tìm thấy ${t}.` })]
}

function interpolation(a, t) {
  const s = [snap(a, { range: [0, a.length - 1], msg: `Tìm ${t}.` })]
  let lo = 0
  let hi = a.length - 1
  while (lo <= hi && t >= a[lo] && t <= a[hi]) {
    const pos = a[hi] === a[lo] ? lo : lo + Math.floor(((t - a[lo]) * (hi - lo)) / (a[hi] - a[lo]))
    s.push(snap(a, { range: [lo, hi], compare: [pos], msg: `Ước lượng pos = ${pos}, arr[pos] = ${a[pos]}.` }))
    if (a[pos] === t) return [...s, snap(a, { found: pos, msg: `Tìm thấy tại ${pos}.` })]
    if (a[pos] < t) lo = pos + 1
    else hi = pos - 1
  }
  return [...s, snap(a, { msg: `Không tìm thấy ${t}.` })]
}

function exponential(a, t) {
  const s = [snap(a, { msg: `Tìm ${t}.` })]
  if (a[0] === t) return [...s, snap(a, { found: 0, msg: 'Tìm thấy tại 0.' })]
  let i = 1
  while (i < a.length && a[i] <= t) {
    s.push(snap(a, { compare: [i], msg: `arr[${i}] = ${a[i]} <= ${t}, nhân đôi i.` }))
    i *= 2
  }
  const lo0 = Math.floor(i / 2)
  const hi0 = Math.min(i, a.length - 1)
  s.push(snap(a, { range: [lo0, hi0], msg: `Binary Search trong [${lo0}, ${hi0}].` }))
  let lo = lo0
  let hi = hi0
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2)
    s.push(snap(a, { range: [lo, hi], compare: [mid], msg: `mid = ${mid}, arr[mid] = ${a[mid]}.` }))
    if (a[mid] === t) return [...s, snap(a, { found: mid, msg: `Tìm thấy tại ${mid}.` })]
    if (a[mid] < t) lo = mid + 1
    else hi = mid - 1
  }
  return [...s, snap(a, { msg: `Không tìm thấy ${t}.` })]
}

function ternary(a, t) {
  const s = [snap(a, { range: [0, a.length - 1], msg: `Tìm ${t}.` })]
  let lo = 0
  let hi = a.length - 1
  while (lo <= hi) {
    const m1 = lo + Math.floor((hi - lo) / 3)
    const m2 = hi - Math.floor((hi - lo) / 3)
    s.push(snap(a, { range: [lo, hi], compare: [m1, m2], msg: `mid1 = ${m1} (${a[m1]}), mid2 = ${m2} (${a[m2]}).` }))
    if (a[m1] === t) return [...s, snap(a, { found: m1, msg: `Tìm thấy tại ${m1}.` })]
    if (a[m2] === t) return [...s, snap(a, { found: m2, msg: `Tìm thấy tại ${m2}.` })]
    if (t < a[m1]) hi = m1 - 1
    else if (t > a[m2]) lo = m2 + 1
    else {
      lo = m1 + 1
      hi = m2 - 1
    }
  }
  return [...s, snap(a, { msg: `Không tìm thấy ${t}.` })]
}

const sorters = { bubble, selection, insertion, merge, quick, heap, counting }
const searchers = { linear, binary, jump, interpolation, exponential, ternary }

export const isSearchViz = (kind) => kind in searchers

export function buildSteps(kind, arr, target) {
  if (kind in sorters) return sorters[kind](arr)
  if (kind in searchers) return searchers[kind](arr, target)
  return []
}

export function randomArray(kind, size = 10) {
  const vals = Array.from({ length: size }, () => 5 + Math.floor(Math.random() * 45))
  if (kind === 'counting') return vals.map((v) => 1 + (v % 8))
  if (isSearchViz(kind)) {
    const set = new Set()
    while (set.size < 14) set.add(2 + Math.floor(Math.random() * 60))
    return [...set].sort((x, y) => x - y)
  }
  return vals
}
