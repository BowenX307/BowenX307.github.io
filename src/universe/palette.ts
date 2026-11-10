// 与 styles/tokens.css 保持一致；画布和 SVG 里需要具体色值，所以这里再存一份。
// 领域色在 content.ts 的 FIELDS 里。
export const BG = '#09090b'; // 接近纯黑的单色
export const INK = '#f3f1ea';

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** 两个颜色按 t 混合，返回 hex */
export function mix(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const c = ca.map((v, i) => Math.round(v + (cb[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
