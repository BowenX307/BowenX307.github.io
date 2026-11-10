// 宇宙的模拟：轨道公转、弹簧物理、鼠标与星球之间的吸引、入场编排、镜头。
// 纯数据和计算，不碰 DOM；渲染在 UniverseScene 里做。
import { FIELDS, type Project } from '../content';

// ---------------------------------------------------------------- 轨道

const TILT = (-10 * Math.PI) / 180;
const COS_T = Math.cos(TILT);
const SIN_T = Math.sin(TILT);

/** 内、中、外三条轨道。omega 是公转角速度（弧度/秒）：内圈快、外圈慢 */
export const ORBITS = [
  { rx: 180, ry: 100, omega: 0.032, start: -70 },
  { rx: 310, ry: 175, omega: 0.019, start: -35 },
  { rx: 440, ry: 250, omega: 0.011, start: -100 },
];
export const TILT_DEG = -10;
export const SLOTS = 8;

export function slotAngle(orbit: number, slot: number) {
  return ((ORBITS[orbit].start + (slot * 360) / SLOTS) * Math.PI) / 180;
}

export function orbitPoint(orbit: number, theta: number): [number, number] {
  const o = ORBITS[orbit];
  const x = o.rx * Math.cos(theta);
  const y = o.ry * Math.sin(theta);
  return [x * COS_T - y * SIN_T, x * SIN_T + y * COS_T];
}

// ---------------------------------------------------------------- 星球（每颗是一个项目）

export type Body = {
  id: string;
  index: number; // 在索引里的顺序，用于 "PROJECT 04"
  project: Project;
  orbit: number;
  theta0: number;
  r: number; // 世界坐标下的半径
  color: string;
  ring: boolean; // 获奖的项目带环
  // 物理状态
  x: number;
  y: number;
  vx: number;
  vy: number;
  // 动画状态
  activateAt: number; // 入场：第几秒点亮
  appear: number; // 0 → 1
  hover: number; // 0 → 1，平滑过渡
  breathPhase: number;
  breathSpeed: number;
  labelSide: number; // 0 下 1 上 2 右 3 左
  bornAt: number | null; // 点亮的时刻（sim.t），用来做出现时的闪光
};

export type Ghost = { orbit: number; slot: number; theta0: number; filledBy: string | null };

/** 唤醒时的波纹：Orb 收缩 → 放出光波 → 光波到达轨道时星球点亮 */
export type Ripple = { start: number };
export const RIPPLE = {
  gather: 0.7, // Orb 收缩蓄力
  travel: 2.0, // 光波从中心扩散到最外圈之外
  reach: 1.12, // 光波最终比外圈大多少
};

/** 光波在第 x 秒（从放出开始算）的大小，相对外圈；ease-out */
export function rippleScale(x: number) {
  const p = Math.min(1, Math.max(0, x / RIPPLE.travel));
  return (1 - Math.pow(1 - p, 3)) * RIPPLE.reach;
}

/** 从唤醒到光波到达某条轨道一共多少秒（含 Orb 蓄力） */
export function orbitArrival(orbit: number) {
  const target = ORBITS[orbit].rx / ORBITS[2].rx / RIPPLE.reach;
  return RIPPLE.gather + (1 - Math.cbrt(1 - target)) * RIPPLE.travel;
}

// 固定种子的伪随机数：刷新后呼吸节奏、星点位置都不变
export function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------- 模拟

export type Sim = {
  ripple: Ripple | null;
  awake: boolean; // 一开始只有睡着的 Orb；唤醒后光波点亮整个宇宙
  wakeAt: number; // 唤醒的时刻（sim.t）
  t: number; // 总时间
  orbitTime: number; // 公转时间（聚焦时暂停）
  timeScale: number;
  introStart: number;
  bodies: Body[];
  ghosts: Ghost[];
  reduced: boolean;
};

export type Input = {
  pointerIn: boolean;
  worldX: number;
  worldY: number;
  dragging: boolean;
  hoveredId: string | null;
  focusedId: string | null;
};

export function createSim(projects: Project[], reduced: boolean): Sim {
  const rand = seeded(7);
  const sim: Sim = {
    ripple: null,
    awake: false,
    wakeAt: Infinity,
    t: 0,
    orbitTime: 0,
    timeScale: 1,
    introStart: 0,
    bodies: [],
    ghosts: [],
    reduced,
  };

  // 同一条轨道上的项目均匀分开：n 颗就隔 8/n 个槽位
  const slotsByOrbit = [0, 1, 2].map((orbit) => {
    const n = projects.filter((p) => p.orbit === orbit).length;
    return Array.from({ length: n }, (_, i) => Math.round((i * SLOTS) / n) % SLOTS);
  });
  const usedCount = [0, 0, 0];

  // 中圈和外圈的每个空槽位画一个小圆圈：还空着的位置
  for (const orbit of [1, 2]) {
    for (let slot = 0; slot < SLOTS; slot++) sim.ghosts.push({ orbit, slot, theta0: slotAngle(orbit, slot), filledBy: null });
  }

  projects.forEach((project, index) => {
    const orbit = project.orbit;
    const slot = slotsByOrbit[orbit][usedCount[orbit]++];
    const ghost = sim.ghosts.find((g) => g.orbit === orbit && g.slot === slot);
    if (ghost) ghost.filledBy = project.id;
    sim.bodies.push({
      id: project.id,
      index,
      project,
      orbit,
      theta0: slotAngle(orbit, slot),
      r: project.size,
      color: FIELDS[project.field].hex,
      ring: !!project.award,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      activateAt: 0,
      appear: 0,
      hover: 0,
      breathPhase: rand() * Math.PI * 2,
      breathSpeed: 0.9 + rand() * 0.7,
      labelSide: 0,
      bornAt: null,
    });
  });
  sleep(sim);

  if (reduced) skipIntro(sim);
  return sim;
}

/** 回到一开始的样子：只有睡着的 Orb，所有星球和轨道都还没出现 */
export function sleep(sim: Sim) {
  sim.awake = false;
  sim.wakeAt = Infinity;
  sim.ripple = null;
  sim.introStart = sim.t;
  for (const b of sim.bodies) {
    b.activateAt = Infinity;
    b.appear = 0;
    b.bornAt = null;
    b.vx = b.vy = 0;
    [b.x, b.y] = orbitPoint(b.orbit, b.theta0 + ORBITS[b.orbit].omega * sim.orbitTime);
  }
}

/** 唤醒：Orb 放出光波，光波扫到哪条轨道，那条轨道上的星球就在原地依次点亮 */
export function wake(sim: Sim) {
  if (sim.awake) return;
  sim.awake = true;
  sim.wakeAt = sim.t;
  sim.introStart = sim.t;
  sim.ripple = { start: sim.t };
  sim.bodies.forEach((b, i) => {
    const delay = orbitArrival(b.orbit) + (i % 4) * 0.06; // 同一条轨道上的星球错开一点点
    b.activateAt = delay;
    b.bornAt = sim.t + delay;
    b.vx = b.vy = 0;
    [b.x, b.y] = orbitPoint(b.orbit, b.theta0 + ORBITS[b.orbit].omega * (sim.orbitTime + delay));
  });
}

/** 跳过开场（?intro=off、减少动态效果）：宇宙直接是醒着、完整的样子 */
export function skipIntro(sim: Sim) {
  sim.awake = true;
  sim.wakeAt = sim.t - 100;
  sim.introStart = sim.t - 100;
  sim.ripple = null;
  for (const b of sim.bodies) {
    [b.x, b.y] = orbitPoint(b.orbit, b.theta0 + ORBITS[b.orbit].omega * sim.orbitTime);
    b.activateAt = 0;
    b.bornAt = null;
    b.appear = 1;
  }
}

export function ghostPoint(sim: Sim, g: Ghost) {
  return orbitPoint(g.orbit, g.theta0 + ORBITS[g.orbit].omega * sim.orbitTime);
}

const SPRING = 7; // 拉回轨道位置的弹簧
const CURSOR_PULL = 110; // 鼠标的引力
const CURSOR_RANGE = 170; // 鼠标引力范围（世界单位，按缩放换算前）
const KIN_PULL = 22; // 同领域星球之间常驻的微弱引力
const HOVER_KIN_PULL = 70; // hover 时，同领域的星球被拉向它

export function step(sim: Sim, dt: number, inp: Input, zoom: number) {
  sim.t += dt;

  // 聚焦或减少动态效果时，公转慢慢停下
  const targetScale = sim.reduced || inp.focusedId ? 0 : 1;
  sim.timeScale += (targetScale - sim.timeScale) * (1 - Math.exp(-dt * 2.5));
  sim.orbitTime += dt * sim.timeScale;

  const introT = sim.t - sim.introStart;
  const hovered = sim.bodies.find((b) => b.id === inp.hoveredId);
  const cursorRange = CURSOR_RANGE / zoom;
  const calm = sim.reduced || !!inp.focusedId;

  for (const b of sim.bodies) {
    const active = introT >= b.activateAt;
    if (b.bornAt !== null && !active) continue;
    b.appear += ((active ? 1 : 0) - b.appear) * (1 - Math.exp(-dt * 3.2));
    if (!active) continue;

    const [tx, ty] = orbitPoint(b.orbit, b.theta0 + ORBITS[b.orbit].omega * sim.orbitTime);
    let fx = SPRING * (tx - b.x);
    let fy = SPRING * (ty - b.y);

    if (!calm) {
      // 鼠标附近的星球被轻轻拉向鼠标
      if (inp.pointerIn && !inp.dragging) {
        const dx = inp.worldX - b.x;
        const dy = inp.worldY - b.y;
        const d = Math.hypot(dx, dy);
        if (d > 1 && d < cursorRange) {
          const f = CURSOR_PULL * (1 - d / cursorRange) ** 2;
          fx += (dx / d) * f;
          fy += (dy / d) * f;
        }
      }
      for (const o of sim.bodies) {
        if (o === b || introT < o.activateAt) continue;
        const dx = o.x - b.x;
        const dy = o.y - b.y;
        const d = Math.hypot(dx, dy) || 1;
        // 相关的星球彼此吸引；hover 时被 hover 的那颗拉得更明显
        if (related(b, o)) {
          const pull = hovered === o ? HOVER_KIN_PULL : KIN_PULL;
          fx += (dx / d) * pull;
          fy += (dy / d) * pull;
        }
        // 太近就互相推开，保证不重叠
        const min = b.r + o.r + 26;
        if (d < min) {
          const push = 260 * (1 - d / min);
          fx -= (dx / d) * push;
          fy -= (dy / d) * push;
        }
      }
    }

    // 刚飞出时阻尼小，会冲过头再弹回；稳定后阻尼变大
    const settle = Math.min(1, (introT - b.activateAt) / 2.5);
    const damping = 2.4 + 2.8 * settle;
    b.vx = (b.vx + fx * dt) * Math.exp(-dt * damping);
    b.vy = (b.vy + fy * dt) * Math.exp(-dt * damping);
    b.x += b.vx * dt;
    b.y += b.vy * dt;

    const h = inp.hoveredId === b.id || inp.focusedId === b.id ? 1 : 0;
    b.hover += (h - b.hover) * (1 - Math.exp(-dt * 9));
  }
}

/** 同领域，或在内容里互相标了 related，就算相关 */
export function related(a: Body, b: Body) {
  return a.project.field === b.project.field || a.project.related.includes(b.id) || b.project.related.includes(a.id);
}

/** 呼吸：0 到 1 之间缓慢起伏 */
export function breath(sim: Sim, b: Body) {
  if (sim.reduced) return 0.5;
  return 0.5 + 0.5 * Math.sin(sim.t * b.breathSpeed + b.breathPhase);
}
