export const dp = [
  {
    slug: 'fibonacci-dp',
    name: 'Fibonacci (Quy hoạch động)',
    category: 'dp',
    theory:
      'Fibonacci là ví dụ nhập môn của quy hoạch động: F(n) = F(n - 1) + F(n - 2). Đệ quy thuần tính lại cùng một giá trị rất nhiều lần (O(2ⁿ)). Lưu kết quả đã tính (memoization) hoặc tính từ dưới lên (tabulation) đưa về O(n).',
    steps: [
      'Xác định trạng thái: dp[i] là số Fibonacci thứ i.',
      'Trường hợp cơ sở: dp[0] = 0, dp[1] = 1.',
      'Công thức chuyển: dp[i] = dp[i - 1] + dp[i - 2].',
      'Chỉ cần hai giá trị trước đó nên có thể thay mảng bằng hai biến.',
    ],
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    insight: 'Mọi bài DP đều trả lời ba câu: trạng thái là gì, cơ sở là gì, chuyển trạng thái thế nào.',
    code: `public static long fibonacci(int n) {
    if (n <= 1) return n;
    long prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        long cur = prev1 + prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,
    problems: [
      { id: 509, title: 'Fibonacci Number', slug: 'fibonacci-number', difficulty: 'Easy', note: 'Cài đặt trực tiếp.' },
      { id: 70, title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'Easy', note: 'Số cách lên bậc n bằng tổng số cách lên bậc n - 1 và n - 2.' },
      { id: 746, title: 'Min Cost Climbing Stairs', slug: 'min-cost-climbing-stairs', difficulty: 'Easy', note: 'Cùng khung, thay cộng bằng min.' },
      { id: 198, title: 'House Robber', slug: 'house-robber', difficulty: 'Medium', note: 'dp[i] = max(dp[i - 1], dp[i - 2] + nums[i]).' },
    ],
    solution: {
      problemId: 70,
      explain: 'Để đứng ở bậc i, bước cuối cùng là từ bậc i - 1 hoặc i - 2. Vậy ways(i) = ways(i - 1) + ways(i - 2), chính là dãy Fibonacci dịch đi một vị trí.',
      code: `class Solution {
    public int climbStairs(int n) {
        int a = 1, b = 1; // ways(0), ways(1)
        for (int i = 2; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}`,
    },
  },
  {
    slug: 'knapsack-01',
    name: '0/1 Knapsack',
    category: 'dp',
    theory:
      'Có n món đồ, mỗi món có trọng lượng và giá trị, balo chứa tối đa W. Mỗi món chỉ được lấy hoặc không lấy (0 hoặc 1). Ta cần tối đa tổng giá trị. dp[w] là giá trị lớn nhất với sức chứa w khi xét các món đến hiện tại.',
    steps: [
      'Trạng thái: dp[i][w] là giá trị lớn nhất khi xét i món đầu với sức chứa w.',
      'Không lấy món i: dp[i][w] = dp[i - 1][w].',
      'Lấy món i (nếu wt[i] <= w): dp[i - 1][w - wt[i]] + val[i].',
      'Lấy max của hai lựa chọn.',
      'Tối ưu bộ nhớ: dùng mảng 1 chiều và duyệt w từ lớn xuống nhỏ.',
    ],
    complexity: { best: 'O(n·W)', average: 'O(n·W)', worst: 'O(n·W)', space: 'O(W)' },
    insight: 'Duyệt w giảm dần đảm bảo mỗi món chỉ được dùng một lần. Duyệt tăng dần thì thành bài Unbounded Knapsack.',
    code: `public static int knapsack(int[] wt, int[] val, int W) {
    int[] dp = new int[W + 1];
    for (int i = 0; i < wt.length; i++) {
        for (int w = W; w >= wt[i]; w--) {
            dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);
        }
    }
    return dp[W];
}`,
    problems: [
      { id: 416, title: 'Partition Equal Subset Sum', slug: 'partition-equal-subset-sum', difficulty: 'Medium', note: 'Có chọn được tập con tổng bằng sum / 2 không: Knapsack dạng boolean.' },
      { id: 494, title: 'Target Sum', slug: 'target-sum', difficulty: 'Medium', note: 'Biến đổi về đếm số tập con có tổng cho trước.' },
      { id: 474, title: 'Ones and Zeroes', slug: 'ones-and-zeroes', difficulty: 'Medium', note: 'Knapsack hai chiều sức chứa (số 0 và số 1).' },
      { id: 1049, title: 'Last Stone Weight II', slug: 'last-stone-weight-ii', difficulty: 'Medium', note: 'Chia đá thành hai nhóm có tổng gần nhau nhất.' },
    ],
    solution: {
      problemId: 416,
      explain: 'Nếu tổng lẻ thì không thể chia. Ngược lại tìm tập con có tổng target = sum / 2. dp[s] = true nếu đạt được tổng s. Mỗi số chỉ dùng một lần nên duyệt s giảm dần.',
      code: `class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int x : nums) sum += x;
        if (sum % 2 != 0) return false;
        int target = sum / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int x : nums) {
            for (int s = target; s >= x; s--) {
                dp[s] = dp[s] || dp[s - x];
            }
        }
        return dp[target];
    }
}`,
    },
  },
  {
    slug: 'lcs',
    name: 'Longest Common Subsequence (LCS)',
    category: 'dp',
    theory:
      'Dãy con chung dài nhất của hai chuỗi là dãy ký tự xuất hiện theo cùng thứ tự trong cả hai (không cần liền nhau). dp[i][j] là độ dài LCS của i ký tự đầu chuỗi A và j ký tự đầu chuỗi B. Đây là nền tảng của công cụ diff.',
    steps: [
      'Tạo bảng dp kích thước (m + 1) x (n + 1), hàng và cột 0 bằng 0.',
      'Nếu A[i - 1] == B[j - 1] thì dp[i][j] = dp[i - 1][j - 1] + 1.',
      'Ngược lại dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]).',
      'Đáp án là dp[m][n].',
    ],
    complexity: { best: 'O(m·n)', average: 'O(m·n)', worst: 'O(m·n)', space: 'O(m·n)' },
    insight: 'DP trên hai chuỗi gần như luôn có dạng dp[i][j] xét tiền tố của mỗi chuỗi.',
    code: `public static int lcs(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}`,
    problems: [
      { id: 1143, title: 'Longest Common Subsequence', slug: 'longest-common-subsequence', difficulty: 'Medium', note: 'Cài đặt trực tiếp.' },
      { id: 583, title: 'Delete Operation for Two Strings', slug: 'delete-operation-for-two-strings', difficulty: 'Medium', note: 'Đáp án là m + n - 2 * LCS.' },
      { id: 1092, title: 'Shortest Common Supersequence', slug: 'shortest-common-supersequence', difficulty: 'Hard', note: 'Truy vết bảng LCS để dựng chuỗi kết quả.' },
      { id: 516, title: 'Longest Palindromic Subsequence', slug: 'longest-palindromic-subsequence', difficulty: 'Medium', note: 'LCS của chuỗi với chuỗi đảo ngược của chính nó.' },
    ],
    solution: {
      problemId: 1143,
      explain: 'Đúng công thức ở trên. Có thể giảm bộ nhớ xuống O(n) vì mỗi hàng chỉ phụ thuộc hàng trước.',
      code: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1))
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                else
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        return dp[m][n];
    }
}`,
    },
  },
  {
    slug: 'lis',
    name: 'Longest Increasing Subsequence (LIS)',
    category: 'dp',
    theory:
      'Dãy con tăng dài nhất. Cách DP cơ bản: dp[i] là độ dài LIS kết thúc tại i, O(n²). Cách tối ưu O(n log n): duy trì mảng tails, tails[k] là phần tử cuối nhỏ nhất của dãy tăng độ dài k + 1, và dùng Binary Search để cập nhật.',
    steps: [
      'Cách O(n²): dp[i] = 1 + max(dp[j]) với mọi j < i và a[j] < a[i].',
      'Cách O(n log n): duyệt từng x, tìm vị trí đầu tiên trong tails có giá trị >= x.',
      'Nếu không có thì nối x vào cuối tails, ngược lại thay giá trị đó bằng x.',
      'Độ dài tails là đáp án.',
    ],
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    insight: 'tails không phải là dãy LIS thật, nó chỉ giữ "đuôi tốt nhất" cho từng độ dài.',
    code: `public static int lis(int[] nums) {
    int[] tails = new int[nums.length];
    int size = 0;
    for (int x : nums) {
        int lo = 0, hi = size;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (tails[mid] < x) lo = mid + 1;
            else hi = mid;
        }
        tails[lo] = x;
        if (lo == size) size++;
    }
    return size;
}`,
    problems: [
      { id: 300, title: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence', difficulty: 'Medium', note: 'Cài đặt trực tiếp, thử cả hai cách.' },
      { id: 673, title: 'Number of Longest Increasing Subsequence', slug: 'number-of-longest-increasing-subsequence', difficulty: 'Medium', note: 'Thêm mảng đếm cnt[i] bên cạnh dp[i].' },
      { id: 354, title: 'Russian Doll Envelopes', slug: 'russian-doll-envelopes', difficulty: 'Hard', note: 'Sắp xếp theo rộng tăng, cao giảm, rồi LIS theo chiều cao.' },
      { id: 1671, title: 'Minimum Number of Removals to Make Mountain Array', slug: 'minimum-number-of-removals-to-make-mountain-array', difficulty: 'Hard', note: 'LIS từ trái và LIS từ phải.' },
    ],
    solution: {
      problemId: 300,
      explain: 'Dùng mảng tails và Binary Search như mẫu ở trên. Mỗi phần tử tốn O(log n), tổng O(n log n).',
      code: `class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int x : nums) {
            int lo = 0, hi = size;
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (tails[mid] < x) lo = mid + 1;
                else hi = mid;
            }
            tails[lo] = x;
            if (lo == size) size++;
        }
        return size;
    }
}`,
    },
  },
  {
    slug: 'matrix-chain',
    name: 'Matrix Chain Multiplication',
    category: 'dp',
    theory:
      'Cho dãy ma trận, tìm cách đặt ngoặc để số phép nhân vô hướng là nhỏ nhất. Đây là mẫu "DP trên đoạn" (interval DP): dp[i][j] là chi phí tốt nhất cho đoạn i..j, thử mọi điểm cắt k ở giữa.',
    steps: [
      'Ma trận thứ i có kích thước dims[i - 1] x dims[i].',
      'dp[i][i] = 0 (một ma trận không cần nhân).',
      'Xét các đoạn theo độ dài tăng dần, len từ 2 đến n.',
      'dp[i][j] = min(dp[i][k] + dp[k + 1][j] + dims[i - 1] * dims[k] * dims[j]) với i <= k < j.',
    ],
    complexity: { best: 'O(n³)', average: 'O(n³)', worst: 'O(n³)', space: 'O(n²)' },
    insight: 'Gặp bài "gộp", "cắt", "chia đoạn" mà kết quả phụ thuộc thứ tự thực hiện, hãy nghĩ tới interval DP.',
    code: `public static int matrixChain(int[] dims) {
    int n = dims.length - 1; // số ma trận
    int[][] dp = new int[n + 1][n + 1];
    for (int len = 2; len <= n; len++) {
        for (int i = 1; i + len - 1 <= n; i++) {
            int j = i + len - 1;
            dp[i][j] = Integer.MAX_VALUE;
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k + 1][j] + dims[i - 1] * dims[k] * dims[j];
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }
    return dp[1][n];
}`,
    problems: [
      { id: 1039, title: 'Minimum Score Triangulation of Polygon', slug: 'minimum-score-triangulation-of-polygon', difficulty: 'Medium', note: 'Gần như giống hệt Matrix Chain, đỉnh k chia đa giác thành hai phần.' },
      { id: 312, title: 'Burst Balloons', slug: 'burst-balloons', difficulty: 'Hard', note: 'Chọn quả bóng nổ cuối cùng trong đoạn làm điểm cắt.' },
      { id: 1547, title: 'Minimum Cost to Cut a Stick', slug: 'minimum-cost-to-cut-a-stick', difficulty: 'Hard', note: 'Interval DP trên các vị trí cắt đã sắp xếp.' },
    ],
    solution: {
      problemId: 1039,
      explain: 'Với cạnh (i, j), chọn đỉnh k ở giữa tạo tam giác (i, k, j). Đa giác chia thành đoạn i..k và k..j. dp[i][j] = min(dp[i][k] + dp[k][j] + v[i] * v[k] * v[j]).',
      code: `class Solution {
    public int minScoreTriangulation(int[] values) {
        int n = values.length;
        int[][] dp = new int[n][n];
        for (int len = 2; len < n; len++) {
            for (int i = 0; i + len < n; i++) {
                int j = i + len;
                dp[i][j] = Integer.MAX_VALUE;
                for (int k = i + 1; k < j; k++) {
                    dp[i][j] = Math.min(dp[i][j],
                        dp[i][k] + dp[k][j] + values[i] * values[k] * values[j]);
                }
            }
        }
        return dp[0][n - 1];
    }
}`,
    },
  },
  {
    slug: 'edit-distance',
    name: 'Edit Distance (Levenshtein)',
    category: 'dp',
    theory:
      'Khoảng cách chỉnh sửa là số thao tác ít nhất (chèn, xóa, thay) để biến chuỗi A thành chuỗi B. Dùng trong kiểm tra chính tả, so khớp DNA. dp[i][j] là chi phí biến i ký tự đầu của A thành j ký tự đầu của B.',
    steps: [
      'dp[i][0] = i (xóa hết), dp[0][j] = j (chèn hết).',
      'Nếu A[i - 1] == B[j - 1] thì dp[i][j] = dp[i - 1][j - 1].',
      'Ngược lại dp[i][j] = 1 + min(dp[i - 1][j] (xóa), dp[i][j - 1] (chèn), dp[i - 1][j - 1] (thay)).',
      'Đáp án là dp[m][n].',
    ],
    complexity: { best: 'O(m·n)', average: 'O(m·n)', worst: 'O(m·n)', space: 'O(m·n)' },
    insight: 'Cùng khung bảng với LCS. Học xong hai bài này là bạn đọc được hầu hết DP hai chuỗi.',
    code: `public static int editDistance(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (a.charAt(i - 1) == b.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],
                        Math.min(dp[i - 1][j], dp[i][j - 1]));
            }
        }
    }
    return dp[m][n];
}`,
    problems: [
      { id: 72, title: 'Edit Distance', slug: 'edit-distance', difficulty: 'Medium', note: 'Cài đặt trực tiếp.' },
      { id: 161, title: 'One Edit Distance', slug: 'one-edit-distance', difficulty: 'Medium', premium: true, note: 'Trường hợp đặc biệt, giải bằng hai con trỏ (cần Premium).' },
      { id: 712, title: 'Minimum ASCII Delete Sum for Two Strings', slug: 'minimum-ascii-delete-sum-for-two-strings', difficulty: 'Medium', note: 'Chỉ có thao tác xóa, chi phí là mã ASCII.' },
    ],
    solution: {
      problemId: 72,
      explain: 'Áp dụng công thức ở trên. Ba ô dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1] tương ứng ba thao tác xóa, chèn, thay.',
      code: `class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],
                            Math.min(dp[i - 1][j], dp[i][j - 1]));
                }
            }
        }
        return dp[m][n];
    }
}`,
    },
  },
]
