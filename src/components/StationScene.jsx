import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { algorithms, categories } from '../data/index.js'
import { fileName } from '../lib/files.js'

const MINT = 0x5fe0b0
const MINT_DIM = 0x2c5c4c
const WIRE = 0x8a9490
const HUB = 0x4b5451

// Mỗi dạng là một cụm có hình giống cấu trúc dữ liệu của nó.
const CLUSTERS = {
  sorting: { center: [-4.6, 0.4, 0], layout: 'array', callout: [-1, -1] },
  searching: { center: [4.6, 0.4, 0], layout: 'line', callout: [1, -1] },
  dp: { center: [0, 0.2, -4.4], layout: 'grid', callout: [1, -1] },
  graph: { center: [0, 0.2, 4.4], layout: 'network', callout: [-1, 1] },
  tree: { center: [0, 3.4, 0], layout: 'tree', callout: [1, -1] },
  math: { center: [0, -3.2, 0], layout: 'triangle', callout: [1, 1] },
  backtracking: { center: [-3.4, -1.8, 3.2], layout: 'branch', callout: [-1, 1] },
  greedy: { center: [3.4, -1.8, -3.2], layout: 'single', callout: [1, 1] },
}

function layoutPoints(kind, n) {
  const pts = []
  if (kind === 'array') for (let i = 0; i < n; i++) pts.push([0, 0, (i - (n - 1) / 2) * 0.62])
  if (kind === 'line') for (let i = 0; i < n; i++) pts.push([0, 0, (i - (n - 1) / 2) * 0.7])
  if (kind === 'grid') for (let i = 0; i < n; i++) pts.push([((i % 3) - 1) * 0.95, 0, (Math.floor(i / 3) - 0.5) * 0.7])
  if (kind === 'network') {
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const t = i * 2.399963
      pts.push([Math.cos(t) * r * 1.3, y * 1.3, Math.sin(t) * r * 1.3])
    }
  }
  if (kind === 'tree') [[0, 0.6, 0], [-0.8, -0.2, 0], [0.8, -0.2, 0], [-1.2, -1, 0]].slice(0, n).forEach((p) => pts.push(p))
  if (kind === 'triangle') [[0, 0.5, 0], [-0.6, -0.4, 0], [0.6, -0.4, 0]].slice(0, n).forEach((p) => pts.push(p))
  if (kind === 'branch') [[0, 0.4, 0], [0.5, -0.4, 0.3]].slice(0, n).forEach((p) => pts.push(p))
  if (kind === 'single') pts.push([0, 0, 0])
  return pts
}

function edgesFor(kind, n) {
  const e = []
  if (kind === 'array' || kind === 'line') for (let i = 0; i < n - 1; i++) e.push([i, i + 1])
  if (kind === 'grid') for (let i = 0; i < n; i++) {
    if (i % 3 < 2 && i + 1 < n) e.push([i, i + 1])
    if (i + 3 < n) e.push([i, i + 3])
  }
  if (kind === 'network') for (let i = 0; i < n; i++) {
    e.push([i, (i + 1) % n])
    if (i % 2 === 0) e.push([i, (i + 4) % n])
  }
  if (kind === 'tree') e.push([0, 1], [0, 2], [1, 3])
  if (kind === 'triangle') e.push([0, 1], [1, 2], [2, 0])
  if (kind === 'branch') e.push([0, 1])
  return e.filter(([a, b]) => a < n && b < n)
}

function nodeGeometry(kind, i) {
  if (kind === 'array') return new THREE.BoxGeometry(0.42, 0.5 + ((i * 37) % 7) * 0.12, 0.42)
  if (kind === 'grid') return new THREE.BoxGeometry(0.8, 0.06, 0.55)
  if (kind === 'network' || kind === 'line') return new THREE.OctahedronGeometry(0.22)
  return new THREE.IcosahedronGeometry(0.26)
}

const line = (a, b, color, opacity = 1) => {
  const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...a), new THREE.Vector3(...b)])
  return new THREE.Line(g, new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity }))
}

export default function StationScene({ done, nextSlug, rotating, onPick, onReady, onError }) {
  const mountRef = useRef(null)
  const calloutRefs = useRef({})
  const leaderRefs = useRef({})
  const tipRef = useRef(null)
  const api = useRef({})

  // Dựng scene một lần.
  useEffect(() => {
    const mount = mountRef.current
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch (err) {
      onError?.(err)
      return undefined
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.prepend(renderer.domElement)
    renderer.domElement.setAttribute('aria-hidden', 'true')

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(9, 6.5, 11)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = 8
    controls.maxDistance = 22
    controls.autoRotateSpeed = 0.6

    const root = new THREE.Group()
    scene.add(root)

    // Lõi trạm: trụ + vòng + thanh giàn.
    const hubGeo = new THREE.CylinderGeometry(0.7, 0.7, 2.6, 12, 4, true)
    root.add(new THREE.LineSegments(new THREE.EdgesGeometry(hubGeo, 1), new THREE.LineBasicMaterial({ color: WIRE })))
    root.add(new THREE.LineSegments(new THREE.WireframeGeometry(hubGeo), new THREE.LineBasicMaterial({ color: HUB, transparent: true, opacity: 0.35 })))
    const ring = new THREE.TorusGeometry(1.6, 0.05, 6, 48)
    const ringMesh = new THREE.LineSegments(new THREE.EdgesGeometry(ring, 20), new THREE.LineBasicMaterial({ color: WIRE }))
    ringMesh.rotation.x = Math.PI / 2
    root.add(ringMesh)

    const pickables = []
    const nodes = {}
    const anchors = {}

    categories.forEach((cat) => {
      const cfg = CLUSTERS[cat.id]
      const items = algorithms.filter((a) => a.category === cat.id)
      const group = new THREE.Group()
      group.position.set(...cfg.center)
      if (cfg.layout === 'grid') group.rotation.y = 0
      root.add(group)

      // Giàn nối về lõi.
      const c = new THREE.Vector3(...cfg.center)
      const start = c.clone().setLength(1.0)
      root.add(line(start.toArray(), cfg.center, WIRE, 0.55))

      const pts = layoutPoints(cfg.layout, items.length)
      edgesFor(cfg.layout, items.length).forEach(([a, b]) => group.add(line(pts[a], pts[b], WIRE, 0.5)))

      items.forEach((a, i) => {
        const geo = nodeGeometry(cfg.layout, i)
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: WIRE }))
        const fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: MINT, transparent: true, opacity: 0 }))
        const node = new THREE.Group()
        node.add(edges, fill)
        node.position.set(...pts[i])
        node.userData.slug = a.slug
        fill.userData.slug = a.slug
        group.add(node)
        pickables.push(fill)
        nodes[a.slug] = { node, edges, fill }
      })

      anchors[cat.id] = group
    })

    // Lưới sàn mờ để có chiều sâu.
    const grid = new THREE.GridHelper(24, 24, 0x1c2220, 0x1c2220)
    grid.position.y = -4.6
    scene.add(grid)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let hovered = null
    let downAt = null

    const setPointer = (e) => {
      const r = renderer.domElement.getBoundingClientRect()
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
      pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1
      return r
    }
    const pick = () => {
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(pickables, false)[0]
      return hit ? hit.object.userData.slug : null
    }
    const onMove = (e) => {
      const r = setPointer(e)
      hovered = pick()
      renderer.domElement.style.cursor = hovered ? 'pointer' : 'grab'
      const tip = tipRef.current
      if (!tip) return
      if (hovered) {
        const a = algorithms.find((x) => x.slug === hovered)
        tip.textContent = `${fileName(a).replace('.md', '')}  ·  ${api.current.done?.has(hovered) ? 'ĐÃ HỌC' : 'CHƯA HỌC'}`
        tip.style.transform = `translate(${e.clientX - r.left + 14}px, ${e.clientY - r.top + 14}px)`
        tip.hidden = false
      } else tip.hidden = true
    }
    const onDown = (e) => {
      downAt = [e.clientX, e.clientY]
    }
    const onUp = (e) => {
      if (!downAt) return
      const moved = Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1])
      downAt = null
      if (moved > 5) return
      setPointer(e)
      const slug = pick()
      if (slug) api.current.onPick?.(slug)
    }
    const onLeave = () => {
      if (tipRef.current) tipRef.current.hidden = true
    }
    renderer.domElement.addEventListener('pointermove', onMove)
    renderer.domElement.addEventListener('pointerdown', onDown)
    renderer.domElement.addEventListener('pointerup', onUp)
    renderer.domElement.addEventListener('pointerleave', onLeave)

    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.position.setLength(w < 560 ? 21 : 14.5)
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(mount)
    resize()

    const tmp = new THREE.Vector3()
    let raf = 0
    const clock = new THREE.Clock()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      controls.autoRotate = Boolean(api.current.rotating) && !reduce
      controls.update()

      const next = api.current.nextSlug
      Object.entries(nodes).forEach(([slug, n]) => {
        const s = slug === next && !reduce ? 1 + Math.sin(t * 3) * 0.12 : 1
        n.node.scale.setScalar(slug === hovered ? 1.25 : s)
      })

      renderer.render(scene, camera)

      // Đặt callout HTML + đường dẫn theo vị trí 2D của từng cụm.
      const w = mount.clientWidth
      const h = mount.clientHeight
      const boxes = []
      categories.forEach((cat) => {
        const el = calloutRefs.current[cat.id]
        const ld = leaderRefs.current[cat.id]
        if (!el || !ld) return
        anchors[cat.id].getWorldPosition(tmp)
        tmp.project(camera)
        const x = (tmp.x * 0.5 + 0.5) * w
        const y = (-tmp.y * 0.5 + 0.5) * h
        const [dx, dy] = CLUSTERS[cat.id].callout
        const bw = el.offsetWidth
        const bh = el.offsetHeight
        const lx = Math.min(w - bw - 8, Math.max(8, x + dx * 70 - (dx < 0 ? bw : 0)))
        const ly = Math.min(h - bh - 8, Math.max(8, y + dy * 56 - (dy < 0 ? bh : 0)))
        boxes.push({ el, ld, x, y, dx, dy, lx, ly, bw, bh })
      })
      // Đẩy các nhãn chồng nhau theo chiều dọc để không che nhau.
      boxes.sort((a, b) => a.ly - b.ly)
      for (let i = 0; i < boxes.length; i++) {
        for (let j = 0; j < i; j++) {
          const a = boxes[j]
          const b = boxes[i]
          const overlapX = a.lx < b.lx + b.bw + 6 && b.lx < a.lx + a.bw + 6
          if (overlapX && b.ly < a.ly + a.bh + 6) b.ly = a.ly + a.bh + 6
        }
      }
      boxes.forEach(({ el, ld, x, y, dx, lx, ly, bw, bh }) => {
        const cy = Math.min(h - bh - 4, ly)
        el.style.transform = `translate(${lx}px, ${cy}px)`
        const ex = dx < 0 ? lx + bw : lx
        const ey = cy + (cy > y ? 0 : bh)
        ld.setAttribute('points', `${x},${y} ${ex},${y + (ey - y) * 0.6} ${ex},${ey}`)
      })
    }
    tick()

    api.current.nodes = nodes
    onReady?.()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      controls.dispose()
      renderer.domElement.removeEventListener('pointermove', onMove)
      renderer.domElement.removeEventListener('pointerdown', onDown)
      renderer.domElement.removeEventListener('pointerup', onUp)
      renderer.domElement.removeEventListener('pointerleave', onLeave)
      scene.traverse((o) => {
        o.geometry?.dispose()
        o.material?.dispose()
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Đồng bộ props vào vòng render mà không dựng lại scene.
  useEffect(() => {
    api.current.done = done
    api.current.nextSlug = nextSlug
    api.current.rotating = rotating
    api.current.onPick = onPick
    const nodes = api.current.nodes || {}
    Object.entries(nodes).forEach(([slug, n]) => {
      const isDone = done.has(slug)
      n.edges.material.color.set(isDone || slug === nextSlug ? MINT : WIRE)
      n.fill.material.opacity = isDone ? 0.4 : 0.001
      n.fill.material.color.set(isDone ? MINT : MINT_DIM)
    })
  }, [done, nextSlug, rotating, onPick])

  return (
    <div className="station" ref={mountRef}>
      <svg className="station__leaders" aria-hidden="true">
        {categories.map((c) => (
          <polyline key={c.id} ref={(el) => (leaderRefs.current[c.id] = el)} points="" />
        ))}
      </svg>
      {categories.map((c) => {
        const items = algorithms.filter((a) => a.category === c.id)
        const doneN = items.filter((a) => done.has(a.slug)).length
        const target = items.find((a) => !done.has(a.slug)) || items[0]
        return (
          <a
            key={c.id}
            ref={(el) => (calloutRefs.current[c.id] = el)}
            href={`#/algo/${target.slug}`}
            className="callout"
            aria-label={`${c.name}: đã học ${doneN} trên ${items.length}. Mở ${target.name}`}
          >
            <span className="callout__name">{c.id.toUpperCase()}</span>
            <span className="callout__val">
              <span className="segs" aria-hidden="true">
                {items.map((a) => (
                  <i key={a.slug} className={done.has(a.slug) ? 'on' : undefined} />
                ))}
              </span>
              {doneN}/{items.length}
            </span>
          </a>
        )
      })}
      <div className="station__tip" ref={tipRef} hidden />
    </div>
  )
}
