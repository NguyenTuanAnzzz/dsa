export const searching = [
  {
    slug: 'linear-search',
    name: 'Linear Search',
    category: 'searching',
    viz: 'linear',
    theory:
      'Linear Search duyệt lần lượt từng phần tử từ đầu đến cuối cho đến khi gặp giá trị cần tìm. Không yêu cầu mảng đã sắp xếp, là lựa chọn duy nhất khi dữ liệu không có cấu trúc gì đặc biệt.',
    steps: [
      'Bắt đầu từ chỉ số 0.',
      'So sánh arr[i] với target, bằng nhau thì trả về i.',
      'Đi hết mảng mà không thấy thì trả về -1.',
    ],
    complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    insight: 'Hầu hết bài "duyệt một lượt" đều là Linear Search kèm thêm điều kiện hoặc biến đếm.',
    code: `public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
    problems: [
      { id: 2108, title: 'Find First Palindromic String in the Array', slug: 'find-first-palindromic-string-in-the-array', difficulty: 'Easy', note: 'Duyệt tuần tự, trả về chuỗi đầu tiên thỏa điều kiện.' },
      { id: 1, title: 'Two Sum', slug: 'two-sum', difficulty: 'Easy', note: 'Bản brute force là Linear Search lồng nhau, sau đó tối ưu bằng HashMap.' },
      { id: 485, title: 'Max Consecutive Ones', slug: 'max-consecutive-ones', difficulty: 'Easy', note: 'Một lượt duyệt với biến đếm chuỗi hiện tại.' },
    ],
    solution: {
      problemId: 2108,
      explain: 'Duyệt từng chuỗi, kiểm tra palindrome bằng hai con trỏ. Gặp chuỗi đầu tiên thỏa mãn thì trả về ngay.',
      code: `class Solution {
    public String firstPalindrome(String[] words) {
        for (String w : words) {
            if (isPalindrome(w)) return w;
        }
        return "";
    }

    private boolean isPalindrome(String s) {
        int i = 0, j = s.length() - 1;
        while (i < j) {
            if (s.charAt(i++) != s.charAt(j--)) return false;
        }
        return true;
    }
}`,
    },
  },
  {
    slug: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    viz: 'binary',
    theory:
      'Binary Search chỉ áp dụng cho dãy đã sắp xếp (hoặc dãy có tính đơn điệu). Mỗi bước so sánh target với phần tử ở giữa và loại bỏ một nửa không thể chứa đáp án. Với 1 tỷ phần tử, chỉ cần khoảng 30 lần so sánh.',
    steps: [
      'Đặt low = 0, high = n - 1.',
      'Tính mid = low + (high - low) / 2 để tránh tràn số.',
      'arr[mid] == target thì trả về mid.',
      'arr[mid] < target thì low = mid + 1, ngược lại high = mid - 1.',
      'Lặp khi low <= high, hết vòng mà không thấy thì trả về -1.',
    ],
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    insight: 'Binary Search mạnh nhất khi dùng "tìm kiếm trên đáp án": đoán một giá trị, kiểm tra được hay không, rồi thu hẹp khoảng.',
    code: `public static int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
    problems: [
      { id: 704, title: 'Binary Search', slug: 'binary-search', difficulty: 'Easy', note: 'Bài cài đặt chuẩn.' },
      { id: 34, title: 'Find First and Last Position of Element in Sorted Array', slug: 'find-first-and-last-position-of-element-in-sorted-array', difficulty: 'Medium', note: 'Hai lần tìm cận trái và cận phải.' },
      { id: 33, title: 'Search in Rotated Sorted Array', slug: 'search-in-rotated-sorted-array', difficulty: 'Medium', note: 'Xác định nửa nào đang được sắp xếp rồi mới loại bỏ.' },
      { id: 875, title: 'Koko Eating Bananas', slug: 'koko-eating-bananas', difficulty: 'Medium', note: 'Tìm kiếm nhị phân trên đáp án (tốc độ ăn).' },
    ],
    solution: {
      problemId: 704,
      explain: 'Cài đặt đúng mẫu ở trên. Lưu ý điều kiện low <= high và cách tính mid tránh tràn số khi low + high vượt quá int.',
      code: `class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
}`,
    },
  },
  {
    slug: 'jump-search',
    name: 'Jump Search',
    category: 'searching',
    viz: 'jump',
    theory:
      'Jump Search nhảy qua mảng đã sắp xếp theo từng khối kích thước √n. Khi gặp khối có phần tử cuối lớn hơn hoặc bằng target, nó lùi lại và tìm tuyến tính trong khối đó. Hữu ích khi việc nhảy lùi tốn kém hơn nhảy tới.',
    steps: [
      'Chọn bước nhảy step = √n.',
      'Nhảy tới trong khi arr[min(step, n) - 1] < target.',
      'Khi dừng, target (nếu có) nằm trong khối vừa nhảy qua.',
      'Tìm tuyến tính trong khối đó.',
    ],
    complexity: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)', space: 'O(1)' },
    insight: 'Tư duy "nhảy theo khối rồi quét trong khối" là nền tảng của kỹ thuật chia căn (sqrt decomposition).',
    code: `public static int jumpSearch(int[] arr, int target) {
    int n = arr.length;
    int step = (int) Math.floor(Math.sqrt(n));
    int prev = 0, cur = step;
    while (prev < n && arr[Math.min(cur, n) - 1] < target) {
        prev = cur;
        cur += step;
        if (prev >= n) return -1;
    }
    for (int i = prev; i < Math.min(cur, n); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
    problems: [
      { id: 278, title: 'First Bad Version', slug: 'first-bad-version', difficulty: 'Easy', note: 'Dãy đơn điệu false...true. Thử Jump Search, rồi so với Binary Search.' },
      { id: 744, title: 'Find Smallest Letter Greater Than Target', slug: 'find-smallest-letter-greater-than-target', difficulty: 'Easy', note: 'Tìm khối chứa vị trí đầu tiên lớn hơn target.' },
      { id: 1351, title: 'Count Negative Numbers in a Sorted Matrix', slug: 'count-negative-numbers-in-a-sorted-matrix', difficulty: 'Easy', note: 'Mỗi hàng đã sắp xếp, có thể nhảy tìm điểm bắt đầu số âm.' },
    ],
    solution: {
      problemId: 278,
      explain: 'Nhảy theo bước √n đến khi gặp phiên bản lỗi, rồi quét lại trong khối trước đó. Cách tối ưu cho bài này là Binary Search, phiên bản Jump Search giúp bạn thấy khác biệt số lần gọi API.',
      code: `public class Solution extends VersionControl {
    public int firstBadVersion(int n) {
        long step = (long) Math.sqrt(n);
        long prev = 1, cur = step;
        while (cur < n && !isBadVersion((int) cur)) {
            prev = cur + 1;
            cur += step;
        }
        long end = Math.min(cur, n);
        for (long v = prev; v <= end; v++) {
            if (isBadVersion((int) v)) return (int) v;
        }
        return n;
    }
}`,
    },
  },
  {
    slug: 'interpolation-search',
    name: 'Interpolation Search',
    category: 'searching',
    viz: 'interpolation',
    theory:
      'Interpolation Search cải tiến Binary Search cho dữ liệu phân bố đều. Thay vì luôn chọn điểm giữa, nó ước lượng vị trí của target theo tỉ lệ giá trị, giống như khi tra từ điển bạn mở gần cuối nếu từ bắt đầu bằng chữ "x".',
    steps: [
      'Đặt low = 0, high = n - 1.',
      'Ước lượng pos = low + (target - arr[low]) * (high - low) / (arr[high] - arr[low]).',
      'arr[pos] == target thì trả về pos.',
      'arr[pos] < target thì low = pos + 1, ngược lại high = pos - 1.',
      'Lặp khi target còn nằm trong [arr[low], arr[high]].',
    ],
    complexity: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)', space: 'O(1)' },
    insight: 'Với dữ liệu lệch (ví dụ 1, 2, 3, 1000000) nó suy biến về O(n). Luôn kiểm tra giả thiết phân bố đều.',
    code: `public static int interpolationSearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (arr[high] == arr[low]) {
            return arr[low] == target ? low : -1;
        }
        int pos = low + (int) ((long) (target - arr[low]) * (high - low)
                / (arr[high] - arr[low]));
        if (arr[pos] == target) return pos;
        if (arr[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    return -1;
}`,
    problems: [
      { id: 35, title: 'Search Insert Position', slug: 'search-insert-position', difficulty: 'Easy', note: 'Mảng tăng dần: thử ước lượng vị trí theo tỉ lệ rồi chỉnh lại.' },
      { id: 704, title: 'Binary Search', slug: 'binary-search', difficulty: 'Easy', note: 'Nộp bằng Interpolation Search và so sánh với Binary Search.' },
      { id: 69, title: 'Sqrt(x)', slug: 'sqrtx', difficulty: 'Easy', note: 'Tìm kiếm trên miền giá trị liên tục, có thể ước lượng điểm đoán tốt hơn điểm giữa.' },
    ],
    solution: {
      problemId: 35,
      explain: 'Thu hẹp khoảng [lo, hi] bằng điểm ước lượng theo tỉ lệ. Khi target nằm ngoài khoảng giá trị của đoạn hiện tại thì vị trí chèn chính là lo.',
      code: `class Solution {
    public int searchInsert(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            if (target <= nums[lo]) return lo;
            if (target > nums[hi]) return hi + 1;
            int pos = (nums[hi] == nums[lo]) ? lo
                    : lo + (int) ((long) (target - nums[lo]) * (hi - lo) / (nums[hi] - nums[lo]));
            if (nums[pos] == target) return pos;
            if (nums[pos] < target) lo = pos + 1;
            else hi = pos - 1;
        }
        return lo;
    }
}`,
    },
  },
  {
    slug: 'exponential-search',
    name: 'Exponential Search',
    category: 'searching',
    viz: 'exponential',
    theory:
      'Exponential Search tìm nhanh khoảng chứa target bằng cách nhân đôi chỉ số: 1, 2, 4, 8... cho đến khi vượt quá target, rồi chạy Binary Search trong khoảng đó. Rất hợp với mảng không biết trước độ dài hoặc vô hạn.',
    steps: [
      'Nếu arr[0] == target thì trả về 0.',
      'Đặt i = 1, nhân đôi i khi i < n và arr[i] <= target.',
      'Target nằm trong đoạn [i / 2, min(i, n - 1)].',
      'Chạy Binary Search trong đoạn đó.',
    ],
    complexity: { best: 'O(1)', average: 'O(log i)', worst: 'O(log n)', space: 'O(1)' },
    insight: 'Độ phức tạp phụ thuộc vị trí i của target, không phải n. Target càng gần đầu thì tìm càng nhanh.',
    code: `public static int exponentialSearch(int[] arr, int target) {
    int n = arr.length;
    if (n == 0) return -1;
    if (arr[0] == target) return 0;
    int i = 1;
    while (i < n && arr[i] <= target) i *= 2;
    int lo = i / 2, hi = Math.min(i, n - 1);
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
    problems: [
      { id: 702, title: 'Search in a Sorted Array of Unknown Size', slug: 'search-in-a-sorted-array-of-unknown-size', difficulty: 'Medium', premium: true, note: 'Bài kinh điển của Exponential Search (cần LeetCode Premium).' },
      { id: 1539, title: 'Kth Missing Positive Number', slug: 'kth-missing-positive-number', difficulty: 'Easy', note: 'Tìm khoảng chứa đáp án rồi tìm nhị phân.' },
      { id: 704, title: 'Binary Search', slug: 'binary-search', difficulty: 'Easy', note: 'Bản miễn phí để luyện: thay đoạn tìm ban đầu bằng bước nhân đôi.' },
    ],
    solution: {
      problemId: 702,
      explain: 'Không biết độ dài mảng, ArrayReader trả về 2^31 - 1 khi vượt biên. Nhân đôi hi cho đến khi reader.get(hi) >= target, sau đó Binary Search trong [hi / 2, hi].',
      code: `class Solution {
    public int search(ArrayReader reader, int target) {
        if (reader.get(0) == target) return 0;
        int hi = 1;
        while (reader.get(hi) < target) hi <<= 1;
        int lo = hi >> 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int v = reader.get(mid);
            if (v == target) return mid;
            if (v < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
}`,
    },
  },
  {
    slug: 'ternary-search',
    name: 'Ternary Search',
    category: 'searching',
    viz: 'ternary',
    theory:
      'Ternary Search chia đoạn tìm kiếm thành ba phần bằng hai điểm mid1 và mid2. Với mảng đã sắp xếp nó không nhanh hơn Binary Search, nhưng nó tỏa sáng khi tìm cực trị của hàm đơn đỉnh (tăng rồi giảm).',
    steps: [
      'Tính mid1 = lo + (hi - lo) / 3 và mid2 = hi - (hi - lo) / 3.',
      'Nếu target bằng một trong hai điểm thì trả về.',
      'Target < arr[mid1]: tìm trong [lo, mid1 - 1].',
      'Target > arr[mid2]: tìm trong [mid2 + 1, hi].',
      'Ngược lại tìm trong [mid1 + 1, mid2 - 1].',
    ],
    complexity: { best: 'O(1)', average: 'O(log₃ n)', worst: 'O(log₃ n)', space: 'O(1)' },
    insight: 'Gặp dãy hình núi hoặc hàm lồi, hãy so sánh f(mid1) với f(mid2) để bỏ một phần ba không chứa đỉnh.',
    code: `public static int ternarySearch(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
        int mid1 = lo + (hi - lo) / 3;
        int mid2 = hi - (hi - lo) / 3;
        if (arr[mid1] == target) return mid1;
        if (arr[mid2] == target) return mid2;
        if (target < arr[mid1]) hi = mid1 - 1;
        else if (target > arr[mid2]) lo = mid2 + 1;
        else { lo = mid1 + 1; hi = mid2 - 1; }
    }
    return -1;
}`,
    problems: [
      { id: 852, title: 'Peak Index in a Mountain Array', slug: 'peak-index-in-a-mountain-array', difficulty: 'Medium', note: 'Hàm đơn đỉnh: bỏ đi một phần ba không chứa đỉnh.' },
      { id: 162, title: 'Find Peak Element', slug: 'find-peak-element', difficulty: 'Medium', note: 'Biến thể tìm đỉnh, so sánh hai điểm kề nhau.' },
      { id: 1095, title: 'Find in Mountain Array', slug: 'find-in-mountain-array', difficulty: 'Hard', note: 'Tìm đỉnh trước, rồi tìm nhị phân hai sườn núi.' },
    ],
    solution: {
      problemId: 852,
      explain: 'Mảng tăng rồi giảm. Nếu arr[m1] < arr[m2] thì đỉnh không thể nằm trong [lo, m1], bỏ phần đó. Ngược lại bỏ [m2, hi]. Còn ít phần tử thì quét trực tiếp.',
      code: `class Solution {
    public int peakIndexInMountainArray(int[] arr) {
        int lo = 0, hi = arr.length - 1;
        while (hi - lo > 2) {
            int m1 = lo + (hi - lo) / 3;
            int m2 = hi - (hi - lo) / 3;
            if (arr[m1] < arr[m2]) lo = m1 + 1;
            else hi = m2 - 1;
        }
        int best = lo;
        for (int i = lo; i <= hi; i++) if (arr[i] > arr[best]) best = i;
        return best;
    }
}`,
    },
  },
]
