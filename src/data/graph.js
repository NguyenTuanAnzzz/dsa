export const graph = [
  {
    slug: 'dfs',
    name: 'Depth First Search (DFS)',
    category: 'graph',
    theory:
      'DFS đi sâu nhất có thể theo một nhánh trước khi quay lui. Có thể cài bằng đệ quy (dùng ngăn xếp lời gọi) hoặc bằng Stack. DFS là công cụ chính để đếm thành phần liên thông, tìm đường, phát hiện chu trình và sắp xếp topo.',
    steps: [
      'Đánh dấu đỉnh hiện tại là đã thăm.',
      'Với mỗi đỉnh kề chưa thăm, gọi DFS đệ quy.',
      'Khi mọi đỉnh kề đã thăm, quay lui về đỉnh trước.',
      'Đồ thị không liên thông: gọi DFS từ mọi đỉnh chưa thăm.',
    ],
    complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
    insight: 'Lưới 2D cũng là đồ thị: mỗi ô là đỉnh, nối với 4 ô kề.',
    code: `public static void dfs(List<List<Integer>> adj, int u, boolean[] visited) {
    visited[u] = true;
    System.out.print(u + " ");
    for (int v : adj.get(u)) {
        if (!visited[v]) dfs(adj, v, visited);
    }
}`,
    problems: [
      { id: 200, title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'Medium', note: 'Mỗi lần gọi DFS từ ô đất chưa thăm là một hòn đảo mới.' },
      { id: 695, title: 'Max Area of Island', slug: 'max-area-of-island', difficulty: 'Medium', note: 'DFS trả về số ô đã loang.' },
      { id: 547, title: 'Number of Provinces', slug: 'number-of-provinces', difficulty: 'Medium', note: 'Đếm thành phần liên thông trên ma trận kề.' },
      { id: 79, title: 'Word Search', slug: 'word-search', difficulty: 'Medium', note: 'DFS kèm quay lui trên lưới.' },
    ],
    solution: {
      problemId: 200,
      explain: 'Duyệt từng ô. Gặp ô "1" thì tăng đếm và DFS loang ra 4 hướng, đổi các ô đã thăm thành "0" để không đếm lại.',
      code: `class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    sink(grid, r, c);
                }
            }
        }
        return count;
    }

    private void sink(char[][] g, int r, int c) {
        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != '1') return;
        g[r][c] = '0';
        sink(g, r + 1, c);
        sink(g, r - 1, c);
        sink(g, r, c + 1);
        sink(g, r, c - 1);
    }
}`,
    },
  },
  {
    slug: 'bfs',
    name: 'Breadth First Search (BFS)',
    category: 'graph',
    theory:
      'BFS thăm đồ thị theo từng lớp: mọi đỉnh cách nguồn 1 cạnh, rồi 2 cạnh, và cứ thế. Dùng hàng đợi (Queue). Trên đồ thị không trọng số, BFS cho đường đi ngắn nhất tính theo số cạnh.',
    steps: [
      'Đưa đỉnh nguồn vào hàng đợi và đánh dấu đã thăm.',
      'Lấy một đỉnh u ra khỏi hàng đợi.',
      'Đưa mọi đỉnh kề chưa thăm của u vào hàng đợi, đánh dấu ngay khi đưa vào.',
      'Lặp đến khi hàng đợi rỗng.',
    ],
    complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
    insight: 'Muốn đếm "số bước" hoặc "số phút", hãy xử lý hàng đợi theo từng lớp (lấy size trước mỗi vòng).',
    code: `public static void bfs(List<List<Integer>> adj, int start) {
    boolean[] visited = new boolean[adj.size()];
    Deque<Integer> queue = new ArrayDeque<>();
    queue.offer(start);
    visited[start] = true;
    while (!queue.isEmpty()) {
        int u = queue.poll();
        System.out.print(u + " ");
        for (int v : adj.get(u)) {
            if (!visited[v]) {
                visited[v] = true;
                queue.offer(v);
            }
        }
    }
}`,
    problems: [
      { id: 994, title: 'Rotting Oranges', slug: 'rotting-oranges', difficulty: 'Medium', note: 'BFS đa nguồn, mỗi lớp là một phút.' },
      { id: 102, title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal', difficulty: 'Medium', note: 'BFS trên cây, gom theo từng tầng.' },
      { id: 127, title: 'Word Ladder', slug: 'word-ladder', difficulty: 'Hard', note: 'Đường đi ngắn nhất giữa hai từ, mỗi bước đổi một chữ.' },
      { id: 542, title: '01 Matrix', slug: '01-matrix', difficulty: 'Medium', note: 'BFS đa nguồn từ mọi ô 0.' },
    ],
    solution: {
      problemId: 994,
      explain: 'Đưa mọi quả cam thối vào hàng đợi cùng lúc. Mỗi vòng xử lý một lớp là một phút, làm thối các quả tươi kề bên. Cuối cùng còn cam tươi thì trả về -1.',
      code: `class Solution {
    public int orangesRotting(int[][] grid) {
        int m = grid.length, n = grid[0].length, fresh = 0;
        Deque<int[]> q = new ArrayDeque<>();
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 2) q.offer(new int[]{r, c});
                else if (grid[r][c] == 1) fresh++;
            }
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        int minutes = 0;
        while (!q.isEmpty() && fresh > 0) {
            for (int size = q.size(); size > 0; size--) {
                int[] cur = q.poll();
                for (int[] d : dirs) {
                    int r = cur[0] + d[0], c = cur[1] + d[1];
                    if (r >= 0 && c >= 0 && r < m && c < n && grid[r][c] == 1) {
                        grid[r][c] = 2;
                        fresh--;
                        q.offer(new int[]{r, c});
                    }
                }
            }
            minutes++;
        }
        return fresh == 0 ? minutes : -1;
    }
}`,
    },
  },
  {
    slug: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'graph',
    theory:
      'Dijkstra tìm đường đi ngắn nhất từ một nguồn tới mọi đỉnh trên đồ thị có trọng số không âm. Mỗi bước lấy đỉnh có khoảng cách tạm thời nhỏ nhất (dùng PriorityQueue) và nới lỏng các cạnh đi ra từ nó.',
    steps: [
      'dist[src] = 0, các đỉnh khác bằng vô cùng. Đưa (0, src) vào min-heap.',
      'Lấy đỉnh u có dist nhỏ nhất. Nếu giá trị lấy ra đã cũ thì bỏ qua.',
      'Với mỗi cạnh (u, v, w): nếu dist[u] + w < dist[v] thì cập nhật và đưa v vào heap.',
      'Lặp đến khi heap rỗng.',
    ],
    complexity: { best: 'O((V + E) log V)', average: 'O((V + E) log V)', worst: 'O((V + E) log V)', space: 'O(V + E)' },
    insight: 'Không dùng được khi có cạnh âm. Khi đó chuyển sang Bellman-Ford.',
    code: `public static int[] dijkstra(List<List<int[]>> adj, int src) {
    int n = adj.size();
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, src});
    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        int d = top[0], u = top[1];
        if (d > dist[u]) continue; // bản ghi cũ
        for (int[] e : adj.get(u)) {
            int v = e[0], w = e[1];
            if (d + w < dist[v]) {
                dist[v] = d + w;
                pq.offer(new int[]{dist[v], v});
            }
        }
    }
    return dist;
}`,
    problems: [
      { id: 743, title: 'Network Delay Time', slug: 'network-delay-time', difficulty: 'Medium', note: 'Dijkstra chuẩn, đáp án là dist lớn nhất.' },
      { id: 1631, title: 'Path With Minimum Effort', slug: 'path-with-minimum-effort', difficulty: 'Medium', note: 'Dijkstra trên lưới với chi phí là max chênh lệch.' },
      { id: 1514, title: 'Path with Maximum Probability', slug: 'path-with-maximum-probability', difficulty: 'Medium', note: 'Dijkstra với max-heap và phép nhân xác suất.' },
      { id: 778, title: 'Swim in Rising Water', slug: 'swim-in-rising-water', difficulty: 'Hard', note: 'Biến thể minimax trên lưới.' },
    ],
    solution: {
      problemId: 743,
      explain: 'Dựng danh sách kề từ times, chạy Dijkstra từ k. Nếu còn đỉnh không tới được thì trả về -1, ngược lại trả về khoảng cách lớn nhất.',
      code: `class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        for (int[] t : times) adj.get(t[0]).add(new int[]{t[1], t[2]});
        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[k] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.offer(new int[]{0, k});
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int d = top[0], u = top[1];
            if (d > dist[u]) continue;
            for (int[] e : adj.get(u)) {
                if (d + e[1] < dist[e[0]]) {
                    dist[e[0]] = d + e[1];
                    pq.offer(new int[]{dist[e[0]], e[0]});
                }
            }
        }
        int ans = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == Integer.MAX_VALUE) return -1;
            ans = Math.max(ans, dist[i]);
        }
        return ans;
    }
}`,
    },
  },
  {
    slug: 'bellman-ford',
    name: 'Bellman-Ford Algorithm',
    category: 'graph',
    theory:
      'Bellman-Ford tìm đường đi ngắn nhất từ một nguồn và chấp nhận cạnh có trọng số âm. Nó nới lỏng toàn bộ cạnh V - 1 lần. Nếu lần thứ V vẫn còn nới lỏng được thì đồ thị có chu trình âm.',
    steps: [
      'dist[src] = 0, các đỉnh khác bằng vô cùng.',
      'Lặp V - 1 lần: với mọi cạnh (u, v, w), nếu dist[u] + w < dist[v] thì cập nhật.',
      'Duyệt cạnh thêm một lần. Còn cập nhật được nghĩa là có chu trình âm.',
    ],
    complexity: { best: 'O(V·E)', average: 'O(V·E)', worst: 'O(V·E)', space: 'O(V)' },
    insight: 'Sau đúng k vòng, dist là đường ngắn nhất dùng tối đa k cạnh. Đây là chìa khóa của bài giới hạn số điểm dừng.',
    code: `public static int[] bellmanFord(int n, int[][] edges, int src) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    for (int i = 0; i < n - 1; i++) {
        for (int[] e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    for (int[] e : edges) {
        if (dist[e[0]] != Integer.MAX_VALUE && dist[e[0]] + e[2] < dist[e[1]]) {
            throw new IllegalStateException("Có chu trình âm");
        }
    }
    return dist;
}`,
    problems: [
      { id: 787, title: 'Cheapest Flights Within K Stops', slug: 'cheapest-flights-within-k-stops', difficulty: 'Medium', note: 'Chạy đúng k + 1 vòng Bellman-Ford trên bản sao mảng dist.' },
      { id: 743, title: 'Network Delay Time', slug: 'network-delay-time', difficulty: 'Medium', note: 'Giải lại bằng Bellman-Ford để so với Dijkstra.' },
      { id: 1334, title: 'Find the City With the Smallest Number of Neighbors at a Threshold Distance', slug: 'find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance', difficulty: 'Medium', note: 'Chạy từ mỗi đỉnh (hoặc dùng Floyd-Warshall).' },
    ],
    solution: {
      problemId: 787,
      explain: 'Tối đa k điểm dừng nghĩa là tối đa k + 1 cạnh. Chạy k + 1 vòng, mỗi vòng nới lỏng dựa trên bản sao dist của vòng trước để không đi quá số cạnh cho phép.',
      code: `class Solution {
    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        int INF = Integer.MAX_VALUE;
        int[] dist = new int[n];
        Arrays.fill(dist, INF);
        dist[src] = 0;
        for (int i = 0; i <= k; i++) {
            int[] next = dist.clone();
            for (int[] f : flights) {
                if (dist[f[0]] != INF && dist[f[0]] + f[2] < next[f[1]]) {
                    next[f[1]] = dist[f[0]] + f[2];
                }
            }
            dist = next;
        }
        return dist[dst] == INF ? -1 : dist[dst];
    }
}`,
    },
  },
  {
    slug: 'floyd-warshall',
    name: 'Floyd-Warshall Algorithm',
    category: 'graph',
    theory:
      'Floyd-Warshall tìm đường đi ngắn nhất giữa mọi cặp đỉnh. Ý tưởng DP: lần lượt cho phép đi qua đỉnh trung gian k, cập nhật dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]). Code chỉ có ba vòng lặp lồng nhau.',
    steps: [
      'Khởi tạo dist[i][j] bằng trọng số cạnh, dist[i][i] = 0, không có cạnh thì vô cùng.',
      'Với mỗi k từ 0 đến n - 1 (vòng ngoài cùng):',
      'Với mọi cặp (i, j): dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).',
      'dist[i][i] < 0 sau khi chạy nghĩa là có chu trình âm.',
    ],
    complexity: { best: 'O(V³)', average: 'O(V³)', worst: 'O(V³)', space: 'O(V²)' },
    insight: 'Vòng k phải nằm ngoài cùng. Đặt sai thứ tự vòng lặp là lỗi phổ biến nhất.',
    code: `public static void floydWarshall(int[][] dist) {
    int n = dist.length;
    final int INF = Integer.MAX_VALUE / 2; // tránh tràn khi cộng
    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
}`,
    problems: [
      { id: 1334, title: 'Find the City With the Smallest Number of Neighbors at a Threshold Distance', slug: 'find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance', difficulty: 'Medium', note: 'Tính mọi cặp rồi đếm hàng xóm trong ngưỡng.' },
      { id: 1462, title: 'Course Schedule IV', slug: 'course-schedule-iv', difficulty: 'Medium', note: 'Floyd-Warshall dạng boolean (bao đóng bắc cầu).' },
      { id: 399, title: 'Evaluate Division', slug: 'evaluate-division', difficulty: 'Medium', note: 'Đi qua đỉnh trung gian, nhân tỉ lệ thay vì cộng.' },
    ],
    solution: {
      problemId: 1334,
      explain: 'Chạy Floyd-Warshall, rồi với mỗi thành phố đếm số thành phố có dist <= threshold. Chọn thành phố có số đếm nhỏ nhất, hòa thì lấy chỉ số lớn hơn.',
      code: `class Solution {
    public int findTheCity(int n, int[][] edges, int distanceThreshold) {
        int INF = Integer.MAX_VALUE / 2;
        int[][] d = new int[n][n];
        for (int[] row : d) Arrays.fill(row, INF);
        for (int i = 0; i < n; i++) d[i][i] = 0;
        for (int[] e : edges) {
            d[e[0]][e[1]] = e[2];
            d[e[1]][e[0]] = e[2];
        }
        for (int k = 0; k < n; k++)
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    d[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]);
        int best = -1, bestCount = Integer.MAX_VALUE;
        for (int i = 0; i < n; i++) {
            int count = 0;
            for (int j = 0; j < n; j++) if (d[i][j] <= distanceThreshold) count++;
            if (count <= bestCount) { bestCount = count; best = i; }
        }
        return best;
    }
}`,
    },
  },
  {
    slug: 'a-star',
    name: 'A* Search Algorithm',
    category: 'graph',
    theory:
      'A* là Dijkstra có "la bàn". Thứ tự ưu tiên là f = g + h, trong đó g là chi phí đã đi và h là ước lượng chi phí còn lại tới đích (heuristic). Nếu h không bao giờ ước lượng quá thực tế, A* vẫn cho đường ngắn nhất nhưng duyệt ít đỉnh hơn nhiều.',
    steps: [
      'Đưa nguồn vào min-heap với f = h(nguồn), g = 0.',
      'Lấy đỉnh có f nhỏ nhất. Nếu là đích thì trả về g.',
      'Với mỗi đỉnh kề v: g mới = g + chi phí cạnh. Nếu tốt hơn thì cập nhật và đưa v vào heap với f = g + h(v).',
      'Heuristic hay dùng trên lưới: Manhattan (4 hướng) hoặc Chebyshev (8 hướng).',
    ],
    complexity: { best: 'O(E)', average: 'phụ thuộc h', worst: 'O(E log V)', space: 'O(V)' },
    insight: 'Khi h = 0, A* chính là Dijkstra. Heuristic càng sát thực tế thì càng duyệt ít.',
    code: `// A* trên lưới 4 hướng, ô 1 là tường
public static int aStar(int[][] grid, int[] s, int[] t) {
    int m = grid.length, n = grid[0].length;
    int[][] g = new int[m][n];
    for (int[] row : g) Arrays.fill(row, Integer.MAX_VALUE);
    g[s[0]][s[1]] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{h(s[0], s[1], t), s[0], s[1]});
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int r = cur[1], c = cur[2];
        if (r == t[0] && c == t[1]) return g[r][c];
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nc < 0 || nr >= m || nc >= n || grid[nr][nc] == 1) continue;
            int ng = g[r][c] + 1;
            if (ng < g[nr][nc]) {
                g[nr][nc] = ng;
                pq.offer(new int[]{ng + h(nr, nc, t), nr, nc});
            }
        }
    }
    return -1;
}

private static int h(int r, int c, int[] t) {
    return Math.abs(r - t[0]) + Math.abs(c - t[1]); // Manhattan
}`,
    problems: [
      { id: 1091, title: 'Shortest Path in Binary Matrix', slug: 'shortest-path-in-binary-matrix', difficulty: 'Medium', note: 'Lưới 8 hướng, dùng heuristic Chebyshev.' },
      { id: 773, title: 'Sliding Puzzle', slug: 'sliding-puzzle', difficulty: 'Hard', note: 'Tìm kiếm trạng thái, heuristic là tổng khoảng cách Manhattan.' },
      { id: 1293, title: 'Shortest Path in a Grid with Obstacles Elimination', slug: 'shortest-path-in-a-grid-with-obstacles-elimination', difficulty: 'Hard', note: 'Trạng thái (ô, số lần phá tường), A* hoặc BFS.' },
    ],
    solution: {
      problemId: 1091,
      explain: 'Đi 8 hướng nên heuristic Chebyshev max(|dr|, |dc|) không bao giờ ước lượng quá. Độ dài đường tính theo số ô, nên g của ô xuất phát là 1.',
      code: `class Solution {
    public int shortestPathBinaryMatrix(int[][] grid) {
        int n = grid.length;
        if (grid[0][0] == 1 || grid[n - 1][n - 1] == 1) return -1;
        int[][] g = new int[n][n];
        for (int[] row : g) Arrays.fill(row, Integer.MAX_VALUE);
        g[0][0] = 1;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.offer(new int[]{1 + h(0, 0, n), 0, 0});
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int r = cur[1], c = cur[2];
            if (r == n - 1 && c == n - 1) return g[r][c];
            if (cur[0] > g[r][c] + h(r, c, n)) continue;
            for (int dr = -1; dr <= 1; dr++)
                for (int dc = -1; dc <= 1; dc++) {
                    int nr = r + dr, nc = c + dc;
                    if (nr < 0 || nc < 0 || nr >= n || nc >= n || grid[nr][nc] == 1) continue;
                    if (g[r][c] + 1 < g[nr][nc]) {
                        g[nr][nc] = g[r][c] + 1;
                        pq.offer(new int[]{g[nr][nc] + h(nr, nc, n), nr, nc});
                    }
                }
        }
        return -1;
    }

    private int h(int r, int c, int n) {
        return Math.max(n - 1 - r, n - 1 - c);
    }
}`,
    },
  },
  {
    slug: 'kruskal',
    name: "Kruskal's Algorithm",
    category: 'graph',
    alsoIn: ['greedy'],
    theory:
      'Kruskal tìm cây khung nhỏ nhất (MST) theo kiểu tham lam: sắp xếp cạnh theo trọng số tăng dần, lần lượt thêm cạnh nếu nó không tạo chu trình. Việc kiểm tra chu trình dùng cấu trúc Union-Find (DSU).',
    steps: [
      'Sắp xếp mọi cạnh theo trọng số tăng dần.',
      'Khởi tạo DSU, mỗi đỉnh là một tập riêng.',
      'Duyệt từng cạnh (u, v): nếu find(u) != find(v) thì thêm cạnh vào MST và union(u, v).',
      'Dừng khi đã có V - 1 cạnh.',
    ],
    complexity: { best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)', space: 'O(V)' },
    insight: 'Union-Find với nén đường đi gần như O(1) mỗi thao tác. Đây là cấu trúc rất đáng thuộc lòng.',
    code: `static int[] parent;

static int find(int x) {
    return parent[x] == x ? x : (parent[x] = find(parent[x]));
}

public static int kruskal(int n, int[][] edges) {
    parent = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    Arrays.sort(edges, (a, b) -> a[2] - b[2]);
    int total = 0, used = 0;
    for (int[] e : edges) {
        int ru = find(e[0]), rv = find(e[1]);
        if (ru != rv) {
            parent[ru] = rv;
            total += e[2];
            if (++used == n - 1) break;
        }
    }
    return total;
}`,
    problems: [
      { id: 1584, title: 'Min Cost to Connect All Points', slug: 'min-cost-to-connect-all-points', difficulty: 'Medium', note: 'Sinh mọi cạnh Manhattan rồi chạy Kruskal.' },
      { id: 684, title: 'Redundant Connection', slug: 'redundant-connection', difficulty: 'Medium', note: 'Cạnh đầu tiên nối hai đỉnh đã cùng tập chính là cạnh thừa.' },
      { id: 1489, title: 'Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree', slug: 'find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree', difficulty: 'Hard', note: 'Chạy Kruskal nhiều lần, bắt buộc hoặc cấm từng cạnh.' },
    ],
    solution: {
      problemId: 684,
      explain: 'Thêm cạnh lần lượt vào DSU. Cạnh nào có hai đầu đã nằm cùng một tập thì nó tạo chu trình, đó là đáp án. Đây chính là bước kiểm tra chu trình trong Kruskal.',
      code: `class Solution {
    private int[] parent;

    public int[] findRedundantConnection(int[][] edges) {
        parent = new int[edges.length + 1];
        for (int i = 0; i < parent.length; i++) parent[i] = i;
        for (int[] e : edges) {
            int a = find(e[0]), b = find(e[1]);
            if (a == b) return e;
            parent[a] = b;
        }
        return new int[0];
    }

    private int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
}`,
    },
  },
  {
    slug: 'prim',
    name: "Prim's Algorithm",
    category: 'graph',
    alsoIn: ['greedy'],
    theory:
      'Prim cũng tìm cây khung nhỏ nhất nhưng "mọc" cây từ một đỉnh: mỗi bước thêm cạnh rẻ nhất nối cây hiện tại với một đỉnh chưa thuộc cây. Với đồ thị dày (nhiều cạnh), bản O(V²) dùng mảng thường nhanh hơn Kruskal.',
    steps: [
      'Chọn đỉnh bắt đầu, minEdge[start] = 0, các đỉnh khác bằng vô cùng.',
      'Lặp V lần: chọn đỉnh u chưa trong cây có minEdge nhỏ nhất, thêm u vào cây.',
      'Với mỗi đỉnh v chưa trong cây: minEdge[v] = min(minEdge[v], w(u, v)).',
      'Tổng các minEdge đã chọn là trọng số MST.',
    ],
    complexity: { best: 'O(V²)', average: 'O(E log V)', worst: 'O(V²)', space: 'O(V)' },
    insight: 'Prim gần giống Dijkstra, khác ở chỗ so sánh trọng số cạnh thay vì tổng khoảng cách từ nguồn.',
    code: `// Bản O(V^2) cho ma trận kề, w[u][v] = 0 nghĩa là không có cạnh
public static int prim(int[][] w) {
    int n = w.length, total = 0;
    int[] minEdge = new int[n];
    boolean[] inTree = new boolean[n];
    Arrays.fill(minEdge, Integer.MAX_VALUE);
    minEdge[0] = 0;
    for (int it = 0; it < n; it++) {
        int u = -1;
        for (int v = 0; v < n; v++)
            if (!inTree[v] && (u == -1 || minEdge[v] < minEdge[u])) u = v;
        inTree[u] = true;
        total += minEdge[u];
        for (int v = 0; v < n; v++)
            if (!inTree[v] && w[u][v] != 0 && w[u][v] < minEdge[v]) minEdge[v] = w[u][v];
    }
    return total;
}`,
    problems: [
      { id: 1584, title: 'Min Cost to Connect All Points', slug: 'min-cost-to-connect-all-points', difficulty: 'Medium', note: 'Đồ thị đầy đủ, Prim O(n²) là lựa chọn tối ưu.' },
      { id: 1135, title: 'Connecting Cities With Minimum Cost', slug: 'connecting-cities-with-minimum-cost', difficulty: 'Medium', premium: true, note: 'MST chuẩn (cần Premium).' },
      { id: 1168, title: 'Optimize Water Distribution in a Village', slug: 'optimize-water-distribution-in-a-village', difficulty: 'Hard', premium: true, note: 'Thêm đỉnh ảo đại diện cho giếng (cần Premium).' },
    ],
    solution: {
      problemId: 1584,
      explain: 'Mọi cặp điểm đều có cạnh với trọng số là khoảng cách Manhattan. Không cần dựng cạnh, tính trực tiếp trong vòng cập nhật của Prim O(n²).',
      code: `class Solution {
    public int minCostConnectPoints(int[][] points) {
        int n = points.length, total = 0;
        int[] minEdge = new int[n];
        boolean[] inTree = new boolean[n];
        Arrays.fill(minEdge, Integer.MAX_VALUE);
        minEdge[0] = 0;
        for (int it = 0; it < n; it++) {
            int u = -1;
            for (int v = 0; v < n; v++)
                if (!inTree[v] && (u == -1 || minEdge[v] < minEdge[u])) u = v;
            inTree[u] = true;
            total += minEdge[u];
            for (int v = 0; v < n; v++) {
                if (inTree[v]) continue;
                int d = Math.abs(points[u][0] - points[v][0])
                      + Math.abs(points[u][1] - points[v][1]);
                if (d < minEdge[v]) minEdge[v] = d;
            }
        }
        return total;
    }
}`,
    },
  },
  {
    slug: 'tarjan',
    name: "Tarjan's Algorithm (SCC)",
    category: 'graph',
    theory:
      'Tarjan tìm các thành phần liên thông mạnh (SCC) chỉ với một lần DFS. Mỗi đỉnh có disc (thời điểm được thăm) và low (disc nhỏ nhất có thể quay về được). Đỉnh có low == disc là gốc của một SCC. Cùng ý tưởng low-link dùng để tìm cầu và khớp.',
    steps: [
      'DFS, gán disc[u] = low[u] = timer++, đẩy u vào stack.',
      'Với đỉnh kề v chưa thăm: DFS(v), rồi low[u] = min(low[u], low[v]).',
      'Với v đang nằm trong stack: low[u] = min(low[u], disc[v]).',
      'Nếu low[u] == disc[u]: pop stack đến u, các đỉnh đó tạo một SCC.',
    ],
    complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
    insight: 'Tìm cầu trên đồ thị vô hướng: cạnh (u, v) là cầu khi low[v] > disc[u].',
    code: `int timer = 0;
int[] disc, low;
boolean[] onStack;
Deque<Integer> stack = new ArrayDeque<>();
List<List<Integer>> sccs = new ArrayList<>();

void tarjan(List<List<Integer>> adj, int u) {
    disc[u] = low[u] = ++timer;
    stack.push(u);
    onStack[u] = true;
    for (int v : adj.get(u)) {
        if (disc[v] == 0) {
            tarjan(adj, v);
            low[u] = Math.min(low[u], low[v]);
        } else if (onStack[v]) {
            low[u] = Math.min(low[u], disc[v]);
        }
    }
    if (low[u] == disc[u]) {
        List<Integer> comp = new ArrayList<>();
        int v;
        do {
            v = stack.pop();
            onStack[v] = false;
            comp.add(v);
        } while (v != u);
        sccs.add(comp);
    }
}`,
    problems: [
      { id: 1192, title: 'Critical Connections in a Network', slug: 'critical-connections-in-a-network', difficulty: 'Hard', note: 'Tìm cầu bằng disc/low của Tarjan.' },
      { id: 2360, title: 'Longest Cycle in a Graph', slug: 'longest-cycle-in-a-graph', difficulty: 'Hard', note: 'Mỗi đỉnh có tối đa một cạnh ra, chu trình là các SCC lớn hơn 1.' },
      { id: 1568, title: 'Minimum Number of Days to Disconnect Island', slug: 'minimum-number-of-days-to-disconnect-island', difficulty: 'Hard', note: 'Tìm khớp (articulation point) trên lưới.' },
    ],
    solution: {
      problemId: 1192,
      explain: 'DFS tính disc và low, bỏ qua cạnh quay về cha trực tiếp. Cạnh (u, v) là cầu (critical connection) khi low[v] > disc[u], nghĩa là v không có đường nào khác quay về u hoặc tổ tiên của u.',
      code: `class Solution {
    private int timer = 0;
    private int[] disc, low;
    private List<List<Integer>> adj = new ArrayList<>();
    private List<List<Integer>> res = new ArrayList<>();

    public List<List<Integer>> criticalConnections(int n, List<List<Integer>> connections) {
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (List<Integer> c : connections) {
            adj.get(c.get(0)).add(c.get(1));
            adj.get(c.get(1)).add(c.get(0));
        }
        disc = new int[n];
        low = new int[n];
        dfs(0, -1);
        return res;
    }

    private void dfs(int u, int parent) {
        disc[u] = low[u] = ++timer;
        for (int v : adj.get(u)) {
            if (v == parent) continue;
            if (disc[v] == 0) {
                dfs(v, u);
                low[u] = Math.min(low[u], low[v]);
                if (low[v] > disc[u]) res.add(Arrays.asList(u, v));
            } else {
                low[u] = Math.min(low[u], disc[v]);
            }
        }
    }
}`,
    },
  },
  {
    slug: 'kosaraju',
    name: "Kosaraju's Algorithm (SCC)",
    category: 'graph',
    theory:
      'Kosaraju tìm SCC bằng hai lần DFS. Lần 1 trên đồ thị gốc, ghi lại thứ tự hoàn thành. Lần 2 trên đồ thị đảo chiều, duyệt các đỉnh theo thứ tự hoàn thành giảm dần, mỗi cây DFS thu được là một SCC. Dễ hiểu và dễ cài hơn Tarjan.',
    steps: [
      'DFS trên đồ thị gốc, khi một đỉnh hoàn thành thì đẩy nó vào stack.',
      'Đảo chiều mọi cạnh.',
      'Pop từng đỉnh khỏi stack, nếu chưa thăm thì DFS trên đồ thị đảo.',
      'Mỗi lần DFS ở bước 3 thu được đúng một SCC.',
    ],
    complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V + E)' },
    insight: 'Gộp mỗi SCC thành một đỉnh sẽ được DAG (đồ thị không chu trình), mở đường cho DP trên DAG.',
    code: `public static int kosaraju(List<List<Integer>> adj) {
    int n = adj.size();
    boolean[] seen = new boolean[n];
    Deque<Integer> order = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (!seen[i]) dfs1(adj, i, seen, order);

    List<List<Integer>> rev = new ArrayList<>();
    for (int i = 0; i < n; i++) rev.add(new ArrayList<>());
    for (int u = 0; u < n; u++) for (int v : adj.get(u)) rev.get(v).add(u);

    Arrays.fill(seen, false);
    int count = 0;
    while (!order.isEmpty()) {
        int u = order.pop();
        if (!seen[u]) { dfs2(rev, u, seen); count++; }
    }
    return count; // số SCC
}

static void dfs1(List<List<Integer>> g, int u, boolean[] seen, Deque<Integer> order) {
    seen[u] = true;
    for (int v : g.get(u)) if (!seen[v]) dfs1(g, v, seen, order);
    order.push(u);
}

static void dfs2(List<List<Integer>> g, int u, boolean[] seen) {
    seen[u] = true;
    for (int v : g.get(u)) if (!seen[v]) dfs2(g, v, seen);
}`,
    problems: [
      { id: 802, title: 'Find Eventual Safe States', slug: 'find-eventual-safe-states', difficulty: 'Medium', note: 'Đỉnh an toàn là đỉnh không đi tới được SCC có chu trình.' },
      { id: 2360, title: 'Longest Cycle in a Graph', slug: 'longest-cycle-in-a-graph', difficulty: 'Hard', note: 'SCC lớn nhất có kích thước lớn hơn 1 là chu trình dài nhất.' },
      { id: 1557, title: 'Minimum Number of Vertices to Reach All Nodes', slug: 'minimum-number-of-vertices-to-reach-all-nodes', difficulty: 'Medium', note: 'Trên DAG: đỉnh có bậc vào 0, ý tưởng của đồ thị nén SCC.' },
    ],
    solution: {
      problemId: 802,
      explain: 'Đỉnh không an toàn là đỉnh có thể đi vào chu trình. Dùng DFS ba màu: 0 chưa thăm, 1 đang thăm, 2 an toàn. Gặp đỉnh màu 1 nghĩa là có chu trình. Đây là cách gọn hơn so với tính SCC đầy đủ.',
      code: `class Solution {
    public List<Integer> eventualSafeNodes(int[][] graph) {
        int n = graph.length;
        int[] color = new int[n];
        List<Integer> res = new ArrayList<>();
        for (int i = 0; i < n; i++) if (safe(graph, i, color)) res.add(i);
        return res;
    }

    private boolean safe(int[][] g, int u, int[] color) {
        if (color[u] != 0) return color[u] == 2;
        color[u] = 1;
        for (int v : g[u]) if (!safe(g, v, color)) return false;
        color[u] = 2;
        return true;
    }
}`,
    },
  },
  {
    slug: 'cycle-detection',
    name: 'Cycle Detection (có hướng và vô hướng)',
    category: 'graph',
    theory:
      'Đồ thị có hướng: dùng DFS ba trạng thái. Gặp lại đỉnh đang nằm trên đường DFS hiện tại (màu xám) là có chu trình. Hoặc dùng thuật toán Kahn: nếu sắp xếp topo không lấy được đủ V đỉnh thì có chu trình. Đồ thị vô hướng: DFS bỏ qua cha, hoặc dùng Union-Find.',
    steps: [
      'Có hướng (DFS): trắng = chưa thăm, xám = đang trên đường đi, đen = xong.',
      'Đi tới đỉnh xám nghĩa là có cạnh ngược, tồn tại chu trình.',
      'Có hướng (Kahn): đếm bậc vào, lấy dần đỉnh bậc 0. Lấy được ít hơn V đỉnh là có chu trình.',
      'Vô hướng: DFS gặp đỉnh đã thăm mà không phải cha là có chu trình.',
    ],
    complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
    insight: 'Bài "lịch học", "phụ thuộc", "thứ tự build" đều là phát hiện chu trình trên đồ thị có hướng.',
    code: `// Đồ thị có hướng, DFS ba màu
public static boolean hasCycle(List<List<Integer>> adj) {
    int[] state = new int[adj.size()]; // 0 trắng, 1 xám, 2 đen
    for (int i = 0; i < adj.size(); i++) {
        if (state[i] == 0 && dfs(adj, i, state)) return true;
    }
    return false;
}

static boolean dfs(List<List<Integer>> adj, int u, int[] state) {
    state[u] = 1;
    for (int v : adj.get(u)) {
        if (state[v] == 1) return true;
        if (state[v] == 0 && dfs(adj, v, state)) return true;
    }
    state[u] = 2;
    return false;
}`,
    problems: [
      { id: 207, title: 'Course Schedule', slug: 'course-schedule', difficulty: 'Medium', note: 'Học được hết khi và chỉ khi đồ thị điều kiện không có chu trình.' },
      { id: 210, title: 'Course Schedule II', slug: 'course-schedule-ii', difficulty: 'Medium', note: 'Trả về thứ tự topo bằng Kahn.' },
      { id: 261, title: 'Graph Valid Tree', slug: 'graph-valid-tree', difficulty: 'Medium', premium: true, note: 'Vô hướng: đủ n - 1 cạnh và không chu trình (cần Premium).' },
      { id: 2608, title: 'Shortest Cycle in a Graph', slug: 'shortest-cycle-in-a-graph', difficulty: 'Hard', note: 'BFS từ mỗi đỉnh để tìm chu trình ngắn nhất.' },
    ],
    solution: {
      problemId: 207,
      explain: 'Dùng thuật toán Kahn: tính bậc vào, đưa mọi môn có bậc vào 0 vào hàng đợi. Mỗi lần lấy ra một môn thì giảm bậc vào của các môn phụ thuộc. Học được đủ numCourses môn nghĩa là không có chu trình.',
      code: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        int[] indeg = new int[numCourses];
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);
            indeg[p[0]]++;
        }
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.offer(i);
        int taken = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            taken++;
            for (int v : adj.get(u)) if (--indeg[v] == 0) q.offer(v);
        }
        return taken == numCourses;
    }
}`,
    },
  },
]
