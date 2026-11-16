export const sorting = [
  {
    slug: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    viz: 'bubble',
    theory:
      'Bubble Sort so sánh từng cặp phần tử kề nhau và đổi chỗ nếu chúng sai thứ tự. Sau mỗi lượt duyệt, phần tử lớn nhất còn lại sẽ "nổi" về cuối mảng giống bọt khí nổi lên mặt nước. Thuật toán dừng sớm khi một lượt duyệt không có lần đổi chỗ nào.',
    steps: [
      'Duyệt từ đầu mảng, so sánh arr[j] với arr[j + 1].',
      'Nếu arr[j] > arr[j + 1] thì đổi chỗ hai phần tử.',
      'Hết một lượt, phần tử lớn nhất đã nằm đúng vị trí cuối, lượt sau bỏ qua nó.',
      'Nếu một lượt không đổi chỗ lần nào thì mảng đã sắp xếp, dừng lại.',
    ],
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    insight: 'Ít dùng thực tế, nhưng ý tưởng "đổi chỗ phần tử kề nhau" xuất hiện trong nhiều bài thao tác mảng tại chỗ.',
    code: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
                swapped = true;
            }
        }
        if (!swapped) break; // mảng đã sắp xếp
    }
}`,
    problems: [
      { id: 283, title: 'Move Zeroes', slug: 'move-zeroes', difficulty: 'Easy', note: 'Đẩy số 0 về cuối bằng cách đổi chỗ, giữ thứ tự phần còn lại.' },
      { id: 912, title: 'Sort an Array', slug: 'sort-an-array', difficulty: 'Medium', note: 'Thử nộp Bubble Sort để thấy nó bị TLE, hiểu vì sao O(n²) không đủ.' },
      { id: 2161, title: 'Partition Array According to Given Pivot', slug: 'partition-array-according-to-given-pivot', difficulty: 'Medium', note: 'Sắp xếp ổn định theo 3 nhóm, liên hệ tính ổn định của Bubble Sort.' },
    ],
    solution: {
      problemId: 283,
      explain: 'Dùng con trỏ last chỉ vị trí tiếp theo cho số khác 0. Mỗi khi gặp số khác 0 thì đổi chỗ nó về vị trí last. Mỗi phần tử chỉ đi qua một lần nên O(n).',
      code: `class Solution {
    public void moveZeroes(int[] nums) {
        int last = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) {
                int tmp = nums[i];
                nums[i] = nums[last];
                nums[last] = tmp;
                last++;
            }
        }
    }
}`,
    },
  },
  {
    slug: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    viz: 'selection',
    theory:
      'Selection Sort chia mảng thành hai phần: đã sắp xếp (bên trái) và chưa sắp xếp (bên phải). Mỗi lượt tìm phần tử nhỏ nhất trong phần chưa sắp xếp rồi đưa nó về đầu phần đó. Số lần đổi chỗ tối đa chỉ là n - 1, hữu ích khi thao tác ghi tốn kém.',
    steps: [
      'Với vị trí i từ 0 đến n - 2, giả sử arr[i] là nhỏ nhất.',
      'Duyệt phần còn lại để tìm chỉ số minIdx của phần tử nhỏ nhất.',
      'Đổi chỗ arr[i] với arr[minIdx].',
      'Tăng i, phần bên trái i luôn là phần đã sắp xếp.',
    ],
    complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    insight: 'Ý tưởng "mỗi lượt chọn ra phần tử tốt nhất" chính là nền móng của Heap Sort và nhiều bài tham lam.',
    code: `public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        int tmp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = tmp;
    }
}`,
    problems: [
      { id: 1051, title: 'Height Checker', slug: 'height-checker', difficulty: 'Easy', note: 'Sắp xếp bản sao rồi so sánh với mảng gốc.' },
      { id: 2073, title: 'Time Needed to Buy Tickets', slug: 'time-needed-to-buy-tickets', difficulty: 'Easy', note: 'Mỗi vòng chọn và xử lý từng người, cùng tư duy duyệt lặp như Selection Sort.' },
      { id: 747, title: 'Largest Number At Least Twice of Others', slug: 'largest-number-at-least-twice-of-others', difficulty: 'Easy', note: 'Chính là một lượt "tìm min/max" của Selection Sort.' },
    ],
    solution: {
      problemId: 1051,
      explain: 'Sao chép mảng, sắp xếp bản sao (tự cài Selection Sort hoặc Arrays.sort), rồi đếm số vị trí khác nhau giữa hai mảng.',
      code: `class Solution {
    public int heightChecker(int[] heights) {
        int[] expected = heights.clone();
        for (int i = 0; i < expected.length - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < expected.length; j++)
                if (expected[j] < expected[minIdx]) minIdx = j;
            int t = expected[i]; expected[i] = expected[minIdx]; expected[minIdx] = t;
        }
        int count = 0;
        for (int i = 0; i < heights.length; i++)
            if (heights[i] != expected[i]) count++;
        return count;
    }
}`,
    },
  },
  {
    slug: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    viz: 'insertion',
    theory:
      'Insertion Sort hoạt động giống cách bạn xếp bài trên tay: lấy từng lá mới và chèn vào đúng chỗ trong phần đã xếp. Thuật toán rất nhanh với mảng gần như đã sắp xếp và là thuật toán ổn định.',
    steps: [
      'Bắt đầu từ phần tử thứ hai, gọi nó là key.',
      'Dịch các phần tử lớn hơn key trong phần bên trái sang phải một ô.',
      'Đặt key vào khoảng trống vừa tạo ra.',
      'Lặp lại cho đến hết mảng.',
    ],
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    insight: 'Java dùng Insertion Sort cho các mảng con nhỏ bên trong thuật toán sắp xếp lai vì hằng số rất nhỏ.',
    code: `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j]; // dịch sang phải
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    problems: [
      { id: 147, title: 'Insertion Sort List', slug: 'insertion-sort-list', difficulty: 'Medium', note: 'Cài đặt đúng Insertion Sort trên danh sách liên kết.' },
      { id: 35, title: 'Search Insert Position', slug: 'search-insert-position', difficulty: 'Easy', note: 'Tìm vị trí chèn, bước cốt lõi của Insertion Sort.' },
      { id: 57, title: 'Insert Interval', slug: 'insert-interval', difficulty: 'Medium', note: 'Chèn một khoảng vào danh sách đã sắp xếp rồi gộp lại.' },
    ],
    solution: {
      problemId: 147,
      explain: 'Tạo node giả dummy làm đầu danh sách kết quả. Lấy lần lượt từng node của danh sách gốc, đi từ dummy tìm chỗ đầu tiên có giá trị lớn hơn và chèn vào trước nó.',
      code: `class Solution {
    public ListNode insertionSortList(ListNode head) {
        ListNode dummy = new ListNode(0);
        ListNode cur = head;
        while (cur != null) {
            ListNode next = cur.next;
            ListNode prev = dummy;
            while (prev.next != null && prev.next.val < cur.val) {
                prev = prev.next;
            }
            cur.next = prev.next;
            prev.next = cur;
            cur = next;
        }
        return dummy.next;
    }
}`,
    },
  },
  {
    slug: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    viz: 'merge',
    theory:
      'Merge Sort là thuật toán chia để trị: chia mảng làm đôi, sắp xếp đệ quy từng nửa, rồi trộn hai nửa đã sắp xếp lại. Bước trộn chỉ cần duyệt tuyến tính nên tổng thời gian luôn là O(n log n), kể cả trường hợp xấu nhất.',
    steps: [
      'Nếu đoạn có ít hơn 2 phần tử thì đã sắp xếp, trả về.',
      'Chia đoạn [left, right] tại mid.',
      'Gọi đệ quy sắp xếp [left, mid] và [mid + 1, right].',
      'Trộn hai nửa bằng hai con trỏ, luôn lấy phần tử nhỏ hơn trước.',
    ],
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    insight: 'Bước trộn hai dãy đã sắp xếp là một mẫu bài riêng: trộn danh sách, đếm nghịch thế, trộn k danh sách.',
    code: `public static void mergeSort(int[] arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

private static void merge(int[] arr, int left, int mid, int right) {
    int[] tmp = new int[right - left + 1];
    int i = left, j = mid + 1, k = 0;
    while (i <= mid && j <= right) {
        tmp[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++];
    }
    while (i <= mid) tmp[k++] = arr[i++];
    while (j <= right) tmp[k++] = arr[j++];
    System.arraycopy(tmp, 0, arr, left, tmp.length);
}`,
    problems: [
      { id: 148, title: 'Sort List', slug: 'sort-list', difficulty: 'Medium', note: 'Merge Sort trên danh sách liên kết, dùng con trỏ nhanh chậm để chia đôi.' },
      { id: 88, title: 'Merge Sorted Array', slug: 'merge-sorted-array', difficulty: 'Easy', note: 'Chính là bước merge, làm từ cuối mảng để không cần bộ nhớ phụ.' },
      { id: 21, title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists', difficulty: 'Easy', note: 'Bước merge trên danh sách liên kết.' },
      { id: 315, title: 'Count of Smaller Numbers After Self', slug: 'count-of-smaller-numbers-after-self', difficulty: 'Hard', note: 'Đếm trong lúc trộn, ứng dụng nâng cao của Merge Sort.' },
    ],
    solution: {
      problemId: 148,
      explain: 'Tìm giữa danh sách bằng con trỏ slow/fast, cắt đôi, sắp xếp đệ quy hai nửa rồi trộn. Không cần mảng phụ nên phù hợp yêu cầu bộ nhớ của bài.',
      code: `class Solution {
    public ListNode sortList(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode slow = head, fast = head.next;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode right = slow.next;
        slow.next = null;
        return merge(sortList(head), sortList(right));
    }

    private ListNode merge(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0), tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; }
            else { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = (a != null) ? a : b;
        return dummy.next;
    }
}`,
    },
  },
  {
    slug: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    viz: 'quick',
    theory:
      'Quick Sort chọn một phần tử làm pivot, phân hoạch mảng sao cho các phần tử nhỏ hơn pivot nằm bên trái và lớn hơn nằm bên phải, rồi đệ quy hai bên. Trung bình rất nhanh và sắp xếp tại chỗ, nhưng nếu pivot luôn rơi vào cực trị thì suy biến thành O(n²).',
    steps: [
      'Chọn pivot (ở đây là phần tử cuối đoạn).',
      'Duyệt đoạn, đưa mọi phần tử nhỏ hơn pivot về phía trái.',
      'Đặt pivot vào giữa, nó đã nằm đúng vị trí cuối cùng.',
      'Đệ quy với nửa trái và nửa phải của pivot.',
    ],
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    insight: 'Chỉ cần phân hoạch một phía (Quickselect) là tìm được phần tử lớn thứ k trong O(n) trung bình.',
    code: `public static void quickSort(int[] arr, int low, int high) {
    if (low >= high) return;
    int p = partition(arr, low, high);
    quickSort(arr, low, p - 1);
    quickSort(arr, p + 1, high);
}

private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }
    }
    int t = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = t;
    return i + 1;
}`,
    problems: [
      { id: 215, title: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array', difficulty: 'Medium', note: 'Quickselect: chỉ đệ quy vào phía chứa vị trí cần tìm.' },
      { id: 75, title: 'Sort Colors', slug: 'sort-colors', difficulty: 'Medium', note: 'Phân hoạch 3 phần (Dutch National Flag), biến thể của partition.' },
      { id: 973, title: 'K Closest Points to Origin', slug: 'k-closest-points-to-origin', difficulty: 'Medium', note: 'Quickselect theo khoảng cách.' },
    ],
    solution: {
      problemId: 215,
      explain: 'Phần tử lớn thứ k nằm ở chỉ số n - k sau khi sắp xếp tăng. Phân hoạch, nếu pivot đúng chỉ số đó thì trả về, ngược lại chỉ đi tiếp một phía. Chọn pivot ngẫu nhiên để tránh trường hợp xấu.',
      code: `class Solution {
    private final java.util.Random rnd = new java.util.Random();

    public int findKthLargest(int[] nums, int k) {
        int target = nums.length - k;
        int lo = 0, hi = nums.length - 1;
        while (true) {
            int p = partition(nums, lo, hi);
            if (p == target) return nums[p];
            if (p < target) lo = p + 1; else hi = p - 1;
        }
    }

    private int partition(int[] a, int lo, int hi) {
        int r = lo + rnd.nextInt(hi - lo + 1);
        swap(a, r, hi);
        int pivot = a[hi], i = lo;
        for (int j = lo; j < hi; j++)
            if (a[j] < pivot) swap(a, i++, j);
        swap(a, i, hi);
        return i;
    }

    private void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }
}`,
    },
  },
  {
    slug: 'heap-sort',
    name: 'Heap Sort',
    category: 'sorting',
    viz: 'heap',
    theory:
      'Heap Sort xây một max-heap từ mảng (cây nhị phân hoàn chỉnh mà cha luôn lớn hơn con), sau đó lặp lại: đổi gốc (phần tử lớn nhất) xuống cuối mảng, thu nhỏ heap và vun đống lại. Luôn O(n log n) và không cần bộ nhớ phụ.',
    steps: [
      'Xây max-heap: gọi heapify từ nút cha cuối cùng (n / 2 - 1) ngược về 0.',
      'Đổi arr[0] (lớn nhất) với phần tử cuối của heap.',
      'Giảm kích thước heap đi 1 rồi heapify lại tại gốc.',
      'Lặp đến khi heap chỉ còn 1 phần tử.',
    ],
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
    insight: 'Trong Java, PriorityQueue là một binary heap. Hiểu heapify giúp bạn giải nhanh các bài "top k".',
    code: `public static void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int end = n - 1; end > 0; end--) {
        int t = arr[0]; arr[0] = arr[end]; arr[end] = t;
        heapify(arr, end, 0);
    }
}

private static void heapify(int[] arr, int size, int i) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < size && arr[l] > arr[largest]) largest = l;
    if (r < size && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int t = arr[i]; arr[i] = arr[largest]; arr[largest] = t;
        heapify(arr, size, largest);
    }
}`,
    problems: [
      { id: 912, title: 'Sort an Array', slug: 'sort-an-array', difficulty: 'Medium', note: 'Cài Heap Sort để qua được mọi test trong O(n log n).' },
      { id: 1046, title: 'Last Stone Weight', slug: 'last-stone-weight', difficulty: 'Easy', note: 'Liên tục lấy hai phần tử lớn nhất từ max-heap.' },
      { id: 347, title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements', difficulty: 'Medium', note: 'Min-heap kích thước k giữ các phần tử xuất hiện nhiều nhất.' },
    ],
    solution: {
      problemId: 912,
      explain: 'Bài yêu cầu sắp xếp không dùng hàm có sẵn với O(n log n). Heap Sort đáp ứng và không bị trường hợp xấu như Quick Sort với pivot cố định.',
      code: `class Solution {
    public int[] sortArray(int[] nums) {
        int n = nums.length;
        for (int i = n / 2 - 1; i >= 0; i--) heapify(nums, n, i);
        for (int end = n - 1; end > 0; end--) {
            int t = nums[0]; nums[0] = nums[end]; nums[end] = t;
            heapify(nums, end, 0);
        }
        return nums;
    }

    private void heapify(int[] a, int size, int i) {
        while (true) {
            int largest = i, l = 2 * i + 1, r = l + 1;
            if (l < size && a[l] > a[largest]) largest = l;
            if (r < size && a[r] > a[largest]) largest = r;
            if (largest == i) return;
            int t = a[i]; a[i] = a[largest]; a[largest] = t;
            i = largest;
        }
    }
}`,
    },
  },
  {
    slug: 'counting-sort',
    name: 'Counting Sort',
    category: 'sorting',
    viz: 'counting',
    theory:
      'Counting Sort không so sánh các phần tử. Nó đếm số lần xuất hiện của mỗi giá trị trong một mảng đếm, rồi ghi lại các giá trị theo thứ tự tăng dần. Rất nhanh khi miền giá trị k nhỏ so với n.',
    steps: [
      'Tìm min và max của mảng để biết miền giá trị.',
      'Tạo mảng count kích thước max - min + 1, đếm tần suất từng giá trị.',
      'Duyệt count từ nhỏ đến lớn, ghi mỗi giá trị đúng số lần đã đếm.',
    ],
    complexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)', space: 'O(k)' },
    insight: 'Khi đề cho giá trị trong khoảng nhỏ (0..100, chữ cái a..z), hãy nghĩ ngay đến mảng đếm thay vì sắp xếp.',
    code: `public static void countingSort(int[] arr) {
    if (arr.length == 0) return;
    int min = arr[0], max = arr[0];
    for (int x : arr) { min = Math.min(min, x); max = Math.max(max, x); }
    int[] count = new int[max - min + 1];
    for (int x : arr) count[x - min]++;
    int k = 0;
    for (int v = 0; v < count.length; v++) {
        while (count[v]-- > 0) arr[k++] = v + min;
    }
}`,
    problems: [
      { id: 75, title: 'Sort Colors', slug: 'sort-colors', difficulty: 'Medium', note: 'Chỉ có 3 giá trị 0, 1, 2: đếm rồi ghi lại.' },
      { id: 1122, title: 'Relative Sort Array', slug: 'relative-sort-array', difficulty: 'Easy', note: 'Đếm tần suất, ghi theo thứ tự của arr2 trước.' },
      { id: 242, title: 'Valid Anagram', slug: 'valid-anagram', difficulty: 'Easy', note: 'Mảng đếm 26 chữ cái thay cho sắp xếp chuỗi.' },
      { id: 274, title: 'H-Index', slug: 'h-index', difficulty: 'Medium', note: 'Đếm theo số trích dẫn, gộp các giá trị lớn hơn n.' },
    ],
    solution: {
      problemId: 75,
      explain: 'Đếm số lượng 0, 1, 2 trong một lượt, rồi ghi đè mảng theo thứ tự. Hai lượt duyệt, O(n) thời gian, O(1) bộ nhớ.',
      code: `class Solution {
    public void sortColors(int[] nums) {
        int[] count = new int[3];
        for (int x : nums) count[x]++;
        int k = 0;
        for (int v = 0; v < 3; v++) {
            while (count[v]-- > 0) nums[k++] = v;
        }
    }
}`,
    },
  },
]
