// Tên "file" hiển thị trong explorer, ví dụ "07_QuickSort.md".
export function baseName(name) {
  return name
    .replace(/\(.*?\)/g, '')
    .replace(/'s\b/g, '')
    .replace(/\bAlgorithm\b/g, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

export const pad = (n) => String(n).padStart(2, '0')

export const fileName = (a) => `${pad(a.day)}_${baseName(a.name)}.md`
