export const greedy = [
  {
    slug: 'activity-selection',
    name: 'Activity Selection',
    category: 'greedy',
    theory:
      'Có nhiều hoạt động, mỗi hoạt động có giờ bắt đầu và kết thúc, một người chỉ làm được một việc tại một thời điểm. Chọn nhiều hoạt động nhất có thể. Lựa chọn tham lam đúng: luôn chọn hoạt động kết thúc sớm nhất, vì nó để lại nhiều thời gian nhất cho phần còn lại.',
    steps: [
      'Sắp xếp các hoạt động theo giờ kết thúc tăng dần.',
      'Chọn hoạt động đầu tiên, ghi lại lastEnd.',
      'Duyệt tiếp: hoạt động nào bắt đầu >= lastEnd thì chọn và cập nhật lastEnd.',
      'Số hoạt động đã chọn là đáp án.',
    ],
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
    insight: 'Chứng minh tham lam bằng lập luận hoán đổi: thay hoạt động đầu của lời giải tối ưu bằng hoạt động kết thúc sớm nhất, kết quả không tệ hơn.',
    code: `public static int activitySelection(int[] start, int[] end) {
    int n = start.length;
    Integer[] idx = new Integer[n];
    for (int i = 0; i < n; i++) idx[i] = i;
    Arrays.sort(idx, (a, b) -> end[a] - end[b]);
    int count = 0, lastEnd = Integer.MIN_VALUE;
    for (int i : idx) {
        if (start[i] >= lastEnd) {
            count++;
            lastEnd = end[i];
        }
    }
    return count;
}`,
    problems: [
      { id: 435, title: 'Non-overlapping Intervals', slug: 'non-overlapping-intervals', difficulty: 'Medium', note: 'Số khoảng cần xóa = n - số hoạt động chọn được tối đa.' },
      { id: 452, title: 'Minimum Number of Arrows to Burst Balloons', slug: 'minimum-number-of-arrows-to-burst-balloons', difficulty: 'Medium', note: 'Sắp theo điểm cuối, mỗi mũi tên bắn tại điểm cuối sớm nhất.' },
      { id: 646, title: 'Maximum Length of Pair Chain', slug: 'maximum-length-of-pair-chain', difficulty: 'Medium', note: 'Activity Selection nguyên bản với điều kiện bắt đầu > kết thúc.' },
      { id: 1353, title: 'Maximum Number of Events That Can Be Attended', slug: 'maximum-number-of-events-that-can-be-attended', difficulty: 'Medium', note: 'Mỗi ngày chọn sự kiện kết thúc sớm nhất bằng min-heap.' },
    ],
    solution: {
      problemId: 435,
      explain: 'Sắp xếp theo điểm kết thúc, giữ lại tối đa số khoảng không chồng nhau như Activity Selection. Số khoảng phải xóa là phần còn lại.',
      code: `class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
        int kept = 0;
        long lastEnd = Long.MIN_VALUE;
        for (int[] it : intervals) {
            if (it[0] >= lastEnd) {
                kept++;
                lastEnd = it[1];
            }
        }
        return intervals.length - kept;
    }
}`,
    },
  },
]

export const backtracking = [
  {
    slug: 'n-queens',
    name: 'N-Queens',
    category: 'backtracking',
    theory:
      'Đặt n quân hậu lên bàn cờ n x n sao cho không quân nào ăn được nhau. Quay lui: đặt từng hàng một, thử mọi cột hợp lệ, nếu đi vào ngõ cụt thì gỡ quân vừa đặt và thử cột khác. Dùng ba tập đánh dấu cột, đường chéo chính (r - c) và đường chéo phụ (r + c) để kiểm tra trong O(1).',
    steps: [
      'Xét hàng r, thử từng cột c từ 0 đến n - 1.',
      'Bỏ qua nếu cột c, chéo r - c hoặc chéo r + c đã có hậu.',
      'Đặt hậu, đánh dấu, đệ quy sang hàng r + 1.',
      'Quay về thì gỡ đánh dấu (backtrack) và thử cột tiếp theo.',
      'r == n nghĩa là đã đặt đủ, ghi nhận một lời giải.',
    ],
    complexity: { best: 'O(n!)', average: 'O(n!)', worst: 'O(n!)', space: 'O(n)' },
    insight: 'Khung quay lui: chọn, đệ quy, bỏ chọn. Mọi bài liệt kê tổ hợp, hoán vị, tập con đều dùng khung này.',
    code: `public static int nQueens(int n) {
    return place(0, n, new boolean[n], new boolean[2 * n], new boolean[2 * n]);
}

static int place(int r, int n, boolean[] cols, boolean[] d1, boolean[] d2) {
    if (r == n) return 1;
    int count = 0;
    for (int c = 0; c < n; c++) {
        if (cols[c] || d1[r - c + n] || d2[r + c]) continue;
        cols[c] = d1[r - c + n] = d2[r + c] = true;   // chọn
        count += place(r + 1, n, cols, d1, d2);       // đệ quy
        cols[c] = d1[r - c + n] = d2[r + c] = false;  // bỏ chọn
    }
    return count;
}`,
    problems: [
      { id: 51, title: 'N-Queens', slug: 'n-queens', difficulty: 'Hard', note: 'Liệt kê mọi bàn cờ hợp lệ.' },
      { id: 52, title: 'N-Queens II', slug: 'n-queens-ii', difficulty: 'Hard', note: 'Chỉ đếm số lời giải, đúng như code mẫu.' },
      { id: 46, title: 'Permutations', slug: 'permutations', difficulty: 'Medium', note: 'Khung quay lui cơ bản nhất.' },
      { id: 78, title: 'Subsets', slug: 'subsets', difficulty: 'Medium', note: 'Mỗi phần tử: chọn hoặc không chọn.' },
    ],
    solution: {
      problemId: 51,
      explain: 'Lưu queens[r] là cột của hậu ở hàng r. Khi đặt đủ n hàng thì dựng bàn cờ dạng chuỗi từ mảng queens.',
      code: `class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> res = new ArrayList<>();
        int[] queens = new int[n];
        dfs(0, n, queens, new boolean[n], new boolean[2 * n], new boolean[2 * n], res);
        return res;
    }

    private void dfs(int r, int n, int[] q, boolean[] cols, boolean[] d1, boolean[] d2,
                     List<List<String>> res) {
        if (r == n) {
            List<String> board = new ArrayList<>();
            for (int row = 0; row < n; row++) {
                char[] line = new char[n];
                Arrays.fill(line, '.');
                line[q[row]] = 'Q';
                board.add(new String(line));
            }
            res.add(board);
            return;
        }
        for (int c = 0; c < n; c++) {
            if (cols[c] || d1[r - c + n] || d2[r + c]) continue;
            q[r] = c;
            cols[c] = d1[r - c + n] = d2[r + c] = true;
            dfs(r + 1, n, q, cols, d1, d2, res);
            cols[c] = d1[r - c + n] = d2[r + c] = false;
        }
    }
}`,
    },
  },
  {
    slug: 'sudoku-solver',
    name: 'Sudoku Solver',
    category: 'backtracking',
    theory:
      'Giải Sudoku 9 x 9 bằng quay lui: tìm ô trống, thử các số 1 đến 9 không trùng hàng, cột và khối 3 x 3, rồi đệ quy. Nếu không số nào hợp lệ thì quay lui. Đánh dấu bằng mảng boolean cho hàng, cột, khối giúp kiểm tra nhanh.',
    steps: [
      'Ghi nhận các số đã có vào rows, cols, boxes.',
      'Tìm ô trống tiếp theo. Không còn ô trống là đã giải xong.',
      'Thử d từ 1 đến 9: hợp lệ thì điền và đánh dấu, đệ quy ô kế tiếp.',
      'Đệ quy thất bại thì xóa d và bỏ đánh dấu, thử số khác.',
    ],
    complexity: { best: 'O(9^m)', average: 'O(9^m)', worst: 'O(9^m)', space: 'O(m)' },
    insight: 'm là số ô trống. Ưu tiên ô có ít lựa chọn nhất trước là mẹo cắt nhánh mạnh nhất.',
    code: `static boolean[][] rows = new boolean[9][10], cols = new boolean[9][10], boxes = new boolean[9][10];

static boolean solve(int[][] b, int pos) {
    if (pos == 81) return true;
    int r = pos / 9, c = pos % 9, k = (r / 3) * 3 + c / 3;
    if (b[r][c] != 0) return solve(b, pos + 1);
    for (int d = 1; d <= 9; d++) {
        if (rows[r][d] || cols[c][d] || boxes[k][d]) continue;
        b[r][c] = d;
        rows[r][d] = cols[c][d] = boxes[k][d] = true;
        if (solve(b, pos + 1)) return true;
        b[r][c] = 0;
        rows[r][d] = cols[c][d] = boxes[k][d] = false;
    }
    return false;
}`,
    problems: [
      { id: 37, title: 'Sudoku Solver', slug: 'sudoku-solver', difficulty: 'Hard', note: 'Cài đặt trực tiếp.' },
      { id: 36, title: 'Valid Sudoku', slug: 'valid-sudoku', difficulty: 'Medium', note: 'Chỉ cần phần đánh dấu hàng, cột, khối.' },
      { id: 39, title: 'Combination Sum', slug: 'combination-sum', difficulty: 'Medium', note: 'Quay lui với cắt nhánh khi tổng vượt target.' },
    ],
    solution: {
      problemId: 37,
      explain: 'Đánh dấu số đã dùng cho từng hàng, cột, khối. Duyệt các ô theo thứ tự 0 đến 80, thử từng số và quay lui khi bế tắc.',
      code: `class Solution {
    private boolean[][] rows = new boolean[9][10];
    private boolean[][] cols = new boolean[9][10];
    private boolean[][] boxes = new boolean[9][10];

    public void solveSudoku(char[][] board) {
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++)
                if (board[r][c] != '.') mark(r, c, board[r][c] - '0', true);
        solve(board, 0);
    }

    private boolean solve(char[][] b, int pos) {
        if (pos == 81) return true;
        int r = pos / 9, c = pos % 9;
        if (b[r][c] != '.') return solve(b, pos + 1);
        int k = (r / 3) * 3 + c / 3;
        for (int d = 1; d <= 9; d++) {
            if (rows[r][d] || cols[c][d] || boxes[k][d]) continue;
            b[r][c] = (char) ('0' + d);
            mark(r, c, d, true);
            if (solve(b, pos + 1)) return true;
            mark(r, c, d, false);
            b[r][c] = '.';
        }
        return false;
    }

    private void mark(int r, int c, int d, boolean v) {
        rows[r][d] = cols[c][d] = boxes[(r / 3) * 3 + c / 3][d] = v;
    }
}`,
    },
  },
]

export const math = [
  {
    slug: 'euclidean-gcd',
    name: 'Euclidean Algorithm (GCD)',
    category: 'math',
    theory:
      'Thuật toán Euclid tìm ước chung lớn nhất dựa trên tính chất gcd(a, b) = gcd(b, a mod b), và gcd(a, 0) = a. Số bước tỉ lệ với số chữ số, nên cực nhanh kể cả với số rất lớn. Bội chung nhỏ nhất: lcm(a, b) = a / gcd(a, b) * b.',
    steps: [
      'Nếu b == 0 thì trả về a.',
      'Ngược lại thay (a, b) bằng (b, a % b).',
      'Lặp đến khi b == 0.',
    ],
    complexity: { best: 'O(1)', average: 'O(log min(a, b))', worst: 'O(log min(a, b))', space: 'O(1)' },
    insight: 'Tính lcm bằng a / gcd * b (chia trước) để tránh tràn số.',
    code: `public static int gcd(int a, int b) {
    while (b != 0) {
        int t = a % b;
        a = b;
        b = t;
    }
    return a;
}

public static long lcm(long a, long b) {
    return a / gcd((int) a, (int) b) * b;
}`,
    problems: [
      { id: 1979, title: 'Find Greatest Common Divisor of Array', slug: 'find-greatest-common-divisor-of-array', difficulty: 'Easy', note: 'gcd của số nhỏ nhất và lớn nhất.' },
      { id: 1071, title: 'Greatest Common Divisor of Strings', slug: 'greatest-common-divisor-of-strings', difficulty: 'Easy', note: 'Nếu s1 + s2 == s2 + s1 thì đáp án dài gcd(len1, len2).' },
      { id: 914, title: 'X of a Kind in a Deck of Cards', slug: 'x-of-a-kind-in-a-deck-of-cards', difficulty: 'Easy', note: 'gcd của mọi tần suất phải >= 2.' },
      { id: 2447, title: 'Number of Subarrays With GCD Equal to K', slug: 'number-of-subarrays-with-gcd-equal-to-k', difficulty: 'Medium', note: 'Mở rộng mảng con, gcd chỉ giảm dần.' },
    ],
    solution: {
      problemId: 1979,
      explain: 'Tìm min và max trong một lượt duyệt, rồi trả về gcd(min, max).',
      code: `class Solution {
    public int findGCD(int[] nums) {
        int min = Integer.MAX_VALUE, max = Integer.MIN_VALUE;
        for (int x : nums) {
            min = Math.min(min, x);
            max = Math.max(max, x);
        }
        while (min != 0) {
            int t = max % min;
            max = min;
            min = t;
        }
        return max;
    }
}`,
    },
  },
  {
    slug: 'sieve-of-eratosthenes',
    name: 'Sieve of Eratosthenes',
    category: 'math',
    theory:
      'Sàng Eratosthenes tìm mọi số nguyên tố nhỏ hơn n. Bắt đầu coi mọi số là nguyên tố, rồi với mỗi số nguyên tố p, gạch bỏ các bội của nó bắt đầu từ p². Chỉ cần xét p đến √n.',
    steps: [
      'Tạo mảng isComposite kích thước n, mặc định false.',
      'Với p từ 2 khi p * p < n: nếu p chưa bị gạch thì gạch p², p² + p, p² + 2p, ...',
      'Các số từ 2 không bị gạch là số nguyên tố.',
    ],
    complexity: { best: 'O(n log log n)', average: 'O(n log log n)', worst: 'O(n log log n)', space: 'O(n)' },
    insight: 'Bắt đầu gạch từ p² vì các bội nhỏ hơn đã bị gạch bởi các số nguyên tố nhỏ hơn p.',
    code: `public static List<Integer> sieve(int n) {
    boolean[] composite = new boolean[n + 1];
    List<Integer> primes = new ArrayList<>();
    for (long p = 2; p * p <= n; p++) {
        if (!composite[(int) p]) {
            for (long m = p * p; m <= n; m += p) composite[(int) m] = true;
        }
    }
    for (int i = 2; i <= n; i++) if (!composite[i]) primes.add(i);
    return primes;
}`,
    problems: [
      { id: 204, title: 'Count Primes', slug: 'count-primes', difficulty: 'Medium', note: 'Đếm số nguyên tố nhỏ hơn n, chính là sàng.' },
      { id: 2523, title: 'Closest Prime Numbers in Range', slug: 'closest-prime-numbers-in-range', difficulty: 'Medium', note: 'Sàng đến right, tìm cặp nguyên tố kề nhau gần nhất.' },
      { id: 952, title: 'Largest Component Size by Common Factor', slug: 'largest-component-size-by-common-factor', difficulty: 'Hard', note: 'Phân tích thừa số rồi gộp bằng Union-Find.' },
    ],
    solution: {
      problemId: 204,
      explain: 'Đề hỏi số nguyên tố nhỏ hơn n (không tính n). Sàng trên [0, n) rồi đếm các số chưa bị gạch.',
      code: `class Solution {
    public int countPrimes(int n) {
        if (n < 3) return 0;
        boolean[] composite = new boolean[n];
        int count = 0;
        for (int i = 2; i < n; i++) {
            if (composite[i]) continue;
            count++;
            for (long m = (long) i * i; m < n; m += i) composite[(int) m] = true;
        }
        return count;
    }
}`,
    },
  },
  {
    slug: 'modular-exponentiation',
    name: 'Modular Exponentiation',
    category: 'math',
    theory:
      'Tính (base^exp) mod m nhanh bằng lũy thừa nhị phân. Thay vì nhân exp lần, ta xét từng bit của exp: bình phương base mỗi bước, và nhân vào kết quả khi bit đang xét bằng 1. Chỉ mất O(log exp) phép nhân.',
    steps: [
      'result = 1, base = base mod m.',
      'Khi exp > 0: nếu bit cuối của exp là 1 thì result = result * base mod m.',
      'base = base * base mod m, exp dịch phải 1 bit.',
      'Trả về result.',
    ],
    complexity: { best: 'O(log exp)', average: 'O(log exp)', worst: 'O(log exp)', space: 'O(1)' },
    insight: 'Dùng long cho phép nhân trung gian, vì (10⁹ + 7)² vượt giới hạn int.',
    code: `public static long modPow(long base, long exp, long mod) {
    long result = 1;
    base %= mod;
    while (exp > 0) {
        if ((exp & 1) == 1) result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}`,
    problems: [
      { id: 50, title: 'Pow(x, n)', slug: 'powx-n', difficulty: 'Medium', note: 'Lũy thừa nhị phân với số thực, chú ý n âm và Integer.MIN_VALUE.' },
      { id: 372, title: 'Super Pow', slug: 'super-pow', difficulty: 'Medium', note: 'Số mũ cực lớn dạng mảng, lũy thừa theo từng chữ số mod 1337.' },
      { id: 1922, title: 'Count Good Numbers', slug: 'count-good-numbers', difficulty: 'Medium', note: 'Đáp án là 5^a * 4^b mod 10⁹ + 7.' },
    ],
    solution: {
      problemId: 50,
      explain: 'Chuyển n sang long trước khi lấy đối để tránh tràn với Integer.MIN_VALUE. n âm thì tính với 1 / x. Sau đó áp dụng lũy thừa nhị phân.',
      code: `class Solution {
    public double myPow(double x, int n) {
        long e = n;
        if (e < 0) {
            x = 1 / x;
            e = -e;
        }
        double result = 1;
        while (e > 0) {
            if ((e & 1) == 1) result *= x;
            x *= x;
            e >>= 1;
        }
        return result;
    }
}`,
    },
  },
]

export const tree = [
  {
    slug: 'tree-traversals',
    name: 'Tree Traversals',
    category: 'tree',
    theory:
      'Ba cách duyệt cây theo chiều sâu khác nhau ở thời điểm thăm nút gốc. Pre-order: gốc, trái, phải. In-order: trái, gốc, phải (với BST cho dãy tăng dần). Post-order: trái, phải, gốc (hợp với bài cần kết quả từ con trước).',
    steps: [
      'Pre-order: thăm gốc, duyệt cây con trái, duyệt cây con phải.',
      'In-order: duyệt trái, thăm gốc, duyệt phải.',
      'Post-order: duyệt trái, duyệt phải, thăm gốc.',
      'Bản lặp dùng Stack để mô phỏng ngăn xếp đệ quy.',
    ],
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(h)' },
    insight: 'h là chiều cao cây. Cây lệch hoàn toàn thì h = n, đệ quy có thể tràn stack.',
    code: `void preorder(TreeNode node, List<Integer> out) {
    if (node == null) return;
    out.add(node.val);
    preorder(node.left, out);
    preorder(node.right, out);
}

void inorder(TreeNode node, List<Integer> out) {
    if (node == null) return;
    inorder(node.left, out);
    out.add(node.val);
    inorder(node.right, out);
}

void postorder(TreeNode node, List<Integer> out) {
    if (node == null) return;
    postorder(node.left, out);
    postorder(node.right, out);
    out.add(node.val);
}`,
    problems: [
      { id: 94, title: 'Binary Tree Inorder Traversal', slug: 'binary-tree-inorder-traversal', difficulty: 'Easy', note: 'Thử cả đệ quy và lặp bằng Stack.' },
      { id: 144, title: 'Binary Tree Preorder Traversal', slug: 'binary-tree-preorder-traversal', difficulty: 'Easy', note: 'Duyệt trước.' },
      { id: 145, title: 'Binary Tree Postorder Traversal', slug: 'binary-tree-postorder-traversal', difficulty: 'Easy', note: 'Duyệt sau.' },
      { id: 105, title: 'Construct Binary Tree from Preorder and Inorder Traversal', slug: 'construct-binary-tree-from-preorder-and-inorder-traversal', difficulty: 'Medium', note: 'Dựng lại cây từ hai cách duyệt.' },
    ],
    solution: {
      problemId: 94,
      explain: 'Bản lặp: đi trái hết mức và đẩy vào stack. Pop một nút, ghi giá trị, rồi chuyển sang cây con phải của nó.',
      code: `class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode cur = root;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) {
                stack.push(cur);
                cur = cur.left;
            }
            cur = stack.pop();
            res.add(cur.val);
            cur = cur.right;
        }
        return res;
    }
}`,
    },
  },
  {
    slug: 'binary-search-tree',
    name: 'Binary Search Tree (BST)',
    category: 'tree',
    theory:
      'Cây nhị phân tìm kiếm: mọi nút bên trái nhỏ hơn gốc, mọi nút bên phải lớn hơn gốc, áp dụng cho mọi cây con. Tìm kiếm, chèn, xóa đều đi theo một đường từ gốc xuống, tốn O(h). Xóa nút có hai con: thay bằng nút nhỏ nhất của cây con phải.',
    steps: [
      'Tìm kiếm: so với gốc, nhỏ hơn thì sang trái, lớn hơn thì sang phải.',
      'Chèn: đi như tìm kiếm đến chỗ null rồi tạo nút mới.',
      'Xóa nút lá hoặc nút một con: thay nút bằng con của nó.',
      'Xóa nút hai con: lấy giá trị nhỏ nhất bên phải thế vào, rồi xóa nút đó ở cây con phải.',
    ],
    complexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)', space: 'O(h)' },
    insight: 'Chèn dãy đã sắp xếp vào BST sẽ tạo cây lệch như danh sách liên kết. Vì vậy cần cây tự cân bằng.',
    code: `TreeNode search(TreeNode root, int key) {
    while (root != null && root.val != key)
        root = key < root.val ? root.left : root.right;
    return root;
}

TreeNode insert(TreeNode root, int key) {
    if (root == null) return new TreeNode(key);
    if (key < root.val) root.left = insert(root.left, key);
    else if (key > root.val) root.right = insert(root.right, key);
    return root;
}

TreeNode delete(TreeNode root, int key) {
    if (root == null) return null;
    if (key < root.val) root.left = delete(root.left, key);
    else if (key > root.val) root.right = delete(root.right, key);
    else {
        if (root.left == null) return root.right;
        if (root.right == null) return root.left;
        TreeNode min = root.right;
        while (min.left != null) min = min.left;
        root.val = min.val;
        root.right = delete(root.right, min.val);
    }
    return root;
}`,
    problems: [
      { id: 450, title: 'Delete Node in a BST', slug: 'delete-node-in-a-bst', difficulty: 'Medium', note: 'Đủ ba trường hợp xóa.' },
      { id: 700, title: 'Search in a Binary Search Tree', slug: 'search-in-a-binary-search-tree', difficulty: 'Easy', note: 'Tìm kiếm cơ bản.' },
      { id: 701, title: 'Insert into a Binary Search Tree', slug: 'insert-into-a-binary-search-tree', difficulty: 'Medium', note: 'Chèn cơ bản.' },
      { id: 98, title: 'Validate Binary Search Tree', slug: 'validate-binary-search-tree', difficulty: 'Medium', note: 'Truyền khoảng (min, max) hợp lệ xuống từng nút.' },
    ],
    solution: {
      problemId: 450,
      explain: 'Đúng hàm delete ở trên. Điểm mấu chốt là trường hợp hai con: chép giá trị của nút kế tiếp (nhỏ nhất bên phải) rồi xóa nút kế tiếp đó.',
      code: `class Solution {
    public TreeNode deleteNode(TreeNode root, int key) {
        if (root == null) return null;
        if (key < root.val) {
            root.left = deleteNode(root.left, key);
        } else if (key > root.val) {
            root.right = deleteNode(root.right, key);
        } else {
            if (root.left == null) return root.right;
            if (root.right == null) return root.left;
            TreeNode succ = root.right;
            while (succ.left != null) succ = succ.left;
            root.val = succ.val;
            root.right = deleteNode(root.right, succ.val);
        }
        return root;
    }
}`,
    },
  },
  {
    slug: 'lowest-common-ancestor',
    name: 'Lowest Common Ancestor (LCA)',
    category: 'tree',
    theory:
      'Tổ tiên chung thấp nhất của hai nút p và q là nút sâu nhất có cả p và q trong cây con của nó. Trên cây nhị phân thường: DFS, nếu p và q nằm ở hai phía khác nhau thì nút hiện tại là LCA. Trên BST: chỉ cần so sánh giá trị.',
    steps: [
      'Nếu nút là null, p hoặc q thì trả về chính nó.',
      'Đệ quy tìm ở cây con trái và phải.',
      'Cả hai phía đều khác null: nút hiện tại là LCA.',
      'Chỉ một phía khác null: trả về phía đó.',
    ],
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(h)' },
    insight: 'Với nhiều truy vấn LCA, dùng Binary Lifting để trả lời mỗi truy vấn trong O(log n).',
    code: `TreeNode lca(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode left = lca(root.left, p, q);
    TreeNode right = lca(root.right, p, q);
    if (left != null && right != null) return root;
    return left != null ? left : right;
}`,
    problems: [
      { id: 236, title: 'Lowest Common Ancestor of a Binary Tree', slug: 'lowest-common-ancestor-of-a-binary-tree', difficulty: 'Medium', note: 'Đúng code mẫu.' },
      { id: 235, title: 'Lowest Common Ancestor of a Binary Search Tree', slug: 'lowest-common-ancestor-of-a-binary-search-tree', difficulty: 'Medium', note: 'Tận dụng thứ tự BST, O(h) không cần đệ quy hai phía.' },
      { id: 1123, title: 'Lowest Common Ancestor of Deepest Leaves', slug: 'lowest-common-ancestor-of-deepest-leaves', difficulty: 'Medium', note: 'Trả về cặp (độ sâu, LCA) từ mỗi cây con.' },
    ],
    solution: {
      problemId: 236,
      explain: 'Đệ quy hai phía. Phía nào tìm thấy p hoặc q sẽ trả về khác null. Hai phía cùng khác null nghĩa là p và q tách nhau tại nút hiện tại.',
      code: `class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;
        return left != null ? left : right;
    }
}`,
    },
  },
  {
    slug: 'avl-tree',
    name: 'AVL Tree',
    category: 'tree',
    theory:
      'AVL là BST tự cân bằng: với mọi nút, chiều cao hai cây con chênh nhau không quá 1. Sau mỗi lần chèn hoặc xóa, nếu mất cân bằng thì xoay (rotate) để khôi phục. Nhờ đó chiều cao luôn là O(log n).',
    steps: [
      'Chèn như BST thường, rồi cập nhật chiều cao trên đường quay lên.',
      'Tính balance = height(left) - height(right).',
      'Lệch trái-trái: xoay phải. Lệch phải-phải: xoay trái.',
      'Lệch trái-phải: xoay trái ở con trái rồi xoay phải. Phải-trái thì ngược lại.',
    ],
    complexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
    insight: 'TreeMap của Java dùng cây đỏ đen, một loại cây tự cân bằng khác với cùng mục đích.',
    code: `class Node { int key, height = 1; Node left, right; Node(int k) { key = k; } }

int h(Node n) { return n == null ? 0 : n.height; }
void update(Node n) { n.height = 1 + Math.max(h(n.left), h(n.right)); }

Node rotateRight(Node y) {
    Node x = y.left;
    y.left = x.right;
    x.right = y;
    update(y); update(x);
    return x;
}

Node rotateLeft(Node x) {
    Node y = x.right;
    x.right = y.left;
    y.left = x;
    update(x); update(y);
    return y;
}

Node insert(Node node, int key) {
    if (node == null) return new Node(key);
    if (key < node.key) node.left = insert(node.left, key);
    else if (key > node.key) node.right = insert(node.right, key);
    else return node;
    update(node);
    int balance = h(node.left) - h(node.right);
    if (balance > 1 && key < node.left.key) return rotateRight(node);
    if (balance < -1 && key > node.right.key) return rotateLeft(node);
    if (balance > 1) { node.left = rotateLeft(node.left); return rotateRight(node); }
    if (balance < -1) { node.right = rotateRight(node.right); return rotateLeft(node); }
    return node;
}`,
    problems: [
      { id: 1382, title: 'Balance a Binary Search Tree', slug: 'balance-a-binary-search-tree', difficulty: 'Medium', note: 'Duyệt in-order rồi dựng lại cây cân bằng từ dãy đã sắp xếp.' },
      { id: 110, title: 'Balanced Binary Tree', slug: 'balanced-binary-tree', difficulty: 'Easy', note: 'Kiểm tra đúng điều kiện cân bằng của AVL.' },
      { id: 108, title: 'Convert Sorted Array to Binary Search Tree', slug: 'convert-sorted-array-to-binary-search-tree', difficulty: 'Easy', note: 'Lấy phần tử giữa làm gốc để cây cân bằng.' },
    ],
    solution: {
      problemId: 110,
      explain: 'Hàm height trả về -1 nếu cây con đã mất cân bằng, ngược lại trả về chiều cao thật. Mỗi nút chỉ được tính một lần nên O(n).',
      code: `class Solution {
    public boolean isBalanced(TreeNode root) {
        return height(root) != -1;
    }

    private int height(TreeNode node) {
        if (node == null) return 0;
        int l = height(node.left);
        if (l == -1) return -1;
        int r = height(node.right);
        if (r == -1) return -1;
        if (Math.abs(l - r) > 1) return -1;
        return 1 + Math.max(l, r);
    }
}`,
    },
  },
]
