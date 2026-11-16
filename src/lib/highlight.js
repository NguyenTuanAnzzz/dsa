// Tô màu cú pháp Java tối giản, trả về mảng token để React render (không dùng innerHTML).
const KEYWORDS = new Set(
  'public private protected static final class extends implements interface new return if else for while do break continue void int long double boolean char byte short float true false null this super try catch throw throws import package var'.split(
    ' ',
  ),
)
const TYPES = /^[A-Z][A-Za-z0-9_]*$/

const TOKEN_RE = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?[lLfFdD]?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+|[^\sA-Za-z0-9_"'/]+|\/)/g

export function tokenize(code) {
  const out = []
  let m
  TOKEN_RE.lastIndex = 0
  while ((m = TOKEN_RE.exec(code)) !== null) {
    const [text, comment, str, num, word] = m
    let type = 'plain'
    if (comment) type = 'comment'
    else if (str) type = 'string'
    else if (num) type = 'number'
    else if (word) {
      if (KEYWORDS.has(word)) type = 'keyword'
      else if (TYPES.test(word)) type = 'type'
      else if (code[TOKEN_RE.lastIndex] === '(') type = 'fn'
    }
    out.push({ type, text })
  }
  return out
}
