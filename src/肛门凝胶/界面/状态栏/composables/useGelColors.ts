/**
 * 凝胶色表。
 * 色值与前景字色逐条对应「凝胶颜色规则」条目，改色只改这一处：
 * 实色 + 前景字色保证文字压在色块上时对比度 ≥ 4.5:1。
 */
export interface GelColor {
  /** 色表里的标准名，用于兜底显示 */
  label: string;
  /** 实色 */
  solid: string;
  /** 压在该色块上的前景字色 */
  fg: string;
  /** 记录键名的匹配词，命中即取这一色 */
  match: string[];
}

export const GEL_PALETTE: GelColor[] = [
  // ── 被物质化情感 ──
  { label: '对百合行为与女性的喜爱', solid: '#F2A0BC', fg: '#3A1220', match: ['百合', '女性的喜爱'] },
  { label: '女尊男卑的观念', solid: '#7A4FB5', fg: '#FFFFFF', match: ['女尊男卑'] },
  { label: '对<user>与男性的厌恶', solid: '#5F7389', fg: '#FFFFFF', match: ['男性的厌恶', '厌恶', '男性'] },
  // ── 高潮情境凝胶 ──
  { label: '羞耻与被看穿的快感', solid: '#F2A870', fg: '#4A2410', match: ['羞耻', '看穿'] },
  { label: '支配欲与服从的快感', solid: '#8E2C3F', fg: '#FFEDEF', match: ['支配', '服从'] },
  { label: '排泄与失守的解放感', solid: '#F5F0E4', fg: '#3A3529', match: ['排泄', '解放'] },
  { label: '疼痛与忍耐的执念', solid: '#3F5BA8', fg: '#FFFFFF', match: ['疼痛', '忍耐'] },
  { label: '肉体沉溺与发情', solid: '#E0A93B', fg: '#3A2A05', match: ['沉溺', '发情'] },
  { label: '对<user>的献媚渴望', solid: '#D69A96', fg: '#3A1A18', match: ['献媚'] },
];

/** 键名不在色表里时的兜底色：中性蓝灰，不抢占九种正色 */
const FALLBACK: GelColor = { label: '未归类凝胶', solid: '#9AA7B8', fg: '#171A1F', match: [] };

/** 把记录键（情感名或高潮情境命名）落到色表上 */
export function resolveGelColor(name: string): GelColor {
  const key = String(name ?? '');
  const hit = GEL_PALETTE.find(color => color.match.some(word => key.includes(word)));
  return hit ?? FALLBACK;
}

/** 半透明化：色块本体用 0.8 左右的不透明度做凝胶质感，文字另放不透明底板 */
export function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? [...value].map(c => c + c).join('') : value;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
