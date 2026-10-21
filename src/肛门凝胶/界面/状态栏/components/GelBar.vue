<template>
  <section class="gel-block">
    <header class="gel-head">
      <span class="gel-title">肠道凝胶</span>
      <span class="gel-meta">{{ capacityText }} · 便意 {{ desireLevel }} 阶</span>
    </header>

    <div class="gel-bar-wrap">
      <div class="gel-track" :class="{ 'is-empty': !segments.length }">
        <!-- 玻璃管本体：底噪 + 刻度 + 高光边 -->
        <div class="gel-glass" aria-hidden="true">
          <span class="gel-tick" style="left: 25%"></span>
          <span class="gel-tick" style="left: 50%"></span>
          <span class="gel-tick" style="left: 75%"></span>
          <span class="gel-specular"></span>
        </div>

        <!-- 色块：从右向左堆放，索引 0 是最早生成的那一段 -->
        <div
          v-for="(seg, index) in segments"
          :key="`${index}-${seg.name}`"
          class="gel-seg"
          :class="[
            `shape-${index % 4}`,
            {
              'is-active': activeIndex === index,
              'is-shaking': shakingIndex === index,
              'is-shedding': shedding && activeIndex === index,
            },
          ]"
          :style="segStyle(seg)"
          @mouseenter="hoveredIndex = index"
          @mouseleave="hoveredIndex = -1"
          @click="onSegmentClick(index)"
        >
          <span class="gel-body" aria-hidden="true"></span>
          <span class="gel-streaks" aria-hidden="true"></span>
          <span class="gel-drops" aria-hidden="true"></span>
          <span class="gel-rim" aria-hidden="true"></span>
          <span class="gel-drip" aria-hidden="true"></span>
          <span class="gel-drips" aria-hidden="true"> <i></i><i></i><i></i><i></i><i></i> </span>
        </div>

        <p v-if="!segments.length" class="gel-empty">肠里是空的</p>

        <!-- 总占据：永远钉在所有色块的最左边 -->
        <span class="gel-total" :style="{ '--c-total': totalColor }"> 占据 {{ occupyText }} </span>
      </div>

      <Transition name="escape">
        <div v-if="activeSeg && shedding" class="gel-escape" :style="escapeStyle" aria-hidden="true">
          <span class="escape-neck"></span>
          <span class="escape-drop"></span>
          <span class="escape-splash"></span>
        </div>
      </Transition>

      <Transition name="tip">
        <div v-if="activeSeg" class="gel-tip" :style="tipStyle" role="tooltip" aria-live="polite">
          <span class="gel-tip-name">{{ displayName(activeSeg.name) }}</span>
          <span class="gel-tip-row">
            <span class="gel-tip-volume">{{ Math.round(activeSeg.volume) }} ml</span>
            <span class="gel-tip-dot">·</span>
            <span class="gel-tip-pct">占据 {{ formatPct(activeSeg.occupy) }}</span>
          </span>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup lang="ts">
import { resolveGelColor, withAlpha, type GelColor } from '../composables/useGelColors';

interface Segment {
  name: string;
  volume: number;
  /** 占整条玻璃管宽度的百分比 */
  width: number;
  /** 距右端的偏移百分比：越早生成的越靠右 */
  right: number;
  /** 占总容量的百分比，即这一段自己贡献的占据 */
  occupy: number;
  color: GelColor;
}

const props = withDefaults(
  defineProps<{
    /** 肠道内凝胶：键为情感名或高潮情境命名，值为毫升 */
    record: Record<string, number>;
    /** 肠道容量（毫升） */
    capacity: number;
    /** 占据百分比，来自变量；色块长度与它保持一致 */
    occupy: number;
    /** 便意等级 0~5 */
    desireLevel: number;
  }>(),
  { desireLevel: 0 },
);

const hoveredIndex = ref(-1);
const pinnedIndex = ref(-1);
const shakingIndex = ref(-1);

/** 色块分段：入肠顺序即记录的插入顺序，索引 0 放最右 */
const segments = computed<Segment[]>(() => {
  const capacity = Number(props.capacity);
  const safeCapacity = Number.isFinite(capacity) && capacity > 0 ? capacity : 500;

  const entries = Object.entries(props.record ?? {})
    .map(([name, volume]) => ({ name, volume: Number(volume) }))
    .filter(item => Number.isFinite(item.volume) && item.volume > 0);

  if (!entries.length) return [];

  // 每段先按「体积 ÷ 容量」算出自己的长度，再按总量缩放，
  // 这样占据超过 100% 时色块仍填满整条管，比例关系不丢。
  const rawWidths = entries.map(item => (item.volume / safeCapacity) * 100);
  const rawTotal = rawWidths.reduce((sum, width) => sum + width, 0);
  const scale = rawTotal > 100 ? 100 / rawTotal : 1;

  let offset = 0;
  return entries.map((item, index) => {
    const width = rawWidths[index] * scale;
    const segment: Segment = {
      name: item.name,
      volume: item.volume,
      width,
      right: offset,
      occupy: (item.volume / safeCapacity) * 100,
      color: resolveGelColor(item.name),
    };
    offset += width;
    return segment;
  });
});

const totalVolume = computed(() => segments.value.reduce((sum, seg) => sum + seg.volume, 0));

const activeIndex = computed(() => (pinnedIndex.value >= 0 ? pinnedIndex.value : hoveredIndex.value));
const activeSeg = computed(() => (activeIndex.value >= 0 ? (segments.value[activeIndex.value] ?? null) : null));

/**
 * 液滴的爆发与冷却：激活色块时先演一轮 BURST_MS，然后静默 CD_MS 再来下一轮。
 * 动画不是常驻的，同一时刻只有一个色块在滴，避免多层楼同时跑动画把显存吃满。
 */
const SHED_BURST_MS = 3800;
const SHED_CD_MS = 9000;
const shedding = ref(false);
let burstTimer: number | undefined;
let cdTimer: number | undefined;

function clearShedTimers() {
  if (burstTimer !== undefined) {
    window.clearTimeout(burstTimer);
    burstTimer = undefined;
  }
  if (cdTimer !== undefined) {
    window.clearTimeout(cdTimer);
    cdTimer = undefined;
  }
}

function shedOnce() {
  shedding.value = true;
  burstTimer = window.setTimeout(() => {
    shedding.value = false;
    cdTimer = window.setTimeout(shedOnce, SHED_CD_MS);
  }, SHED_BURST_MS);
}

watch(activeIndex, index => {
  clearShedTimers();
  shedding.value = false;
  if (index >= 0) shedOnce();
});

onBeforeUnmount(clearShedTimers);

const occupyText = computed(() => {
  const value = Number(props.occupy);
  const fallback = totalVolume.value && props.capacity ? (totalVolume.value / props.capacity) * 100 : 0;
  return `${formatPct(Number.isFinite(value) && value > 0 ? value : fallback)}`;
});

const capacityText = computed(() => `${Math.round(Number(props.capacity) || 0)} ml`);
const totalColor = computed(() =>
  segments.value.length ? segments.value[segments.value.length - 1].color.solid : '#9AA7B8',
);

/** 提示框落在色块中心上方；贴边时夹住，避免被裁掉 */
const tipStyle = computed(() => {
  const seg = activeSeg.value;
  if (!seg) return {};
  const center = 100 - (seg.right + seg.width / 2);
  const left = _.clamp(center, 12, 88);
  return {
    left: `${left}%`,
    '--c-tip-bg': withAlpha(seg.color.solid, 0.96),
    '--c-tip-fg': seg.color.fg,
    '--c-tip-glow': withAlpha(seg.color.solid, 0.45),
  } as Record<string, string>;
});

/** 越过管壁那一滴：钉在当前色块中线的正下方 */
const escapeStyle = computed(() => {
  const seg = activeSeg.value;
  if (!seg) return {};
  const center = 100 - (seg.right + seg.width / 2);
  return {
    left: `${_.clamp(center, 5, 95)}%`,
    '--c-gel': seg.color.solid,
    '--c-gel-soft': withAlpha(seg.color.solid, 0.92),
    '--c-gel-glow': withAlpha(seg.color.solid, 0.5),
  } as Record<string, string>;
});

function segStyle(seg: Segment): Record<string, string> {
  return {
    right: `${seg.right}%`,
    width: `${seg.width}%`,
    '--c-gel': seg.color.solid,
    '--c-gel-soft': withAlpha(seg.color.solid, 0.84),
    '--c-gel-edge': withAlpha(seg.color.solid, 0.98),
    '--c-gel-glow': withAlpha(seg.color.solid, 0.4),
  };
}

/** 记录键可能是一整句情境命名，过长时只留前段做提示框标题 */
function displayName(name: string): string {
  const text = String(name ?? '').trim();
  return text.length > 26 ? `${text.slice(0, 25)}…` : text;
}

function formatPct(value: number): string {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0%';
  return `${num >= 10 ? Math.round(num) : Math.round(num * 10) / 10}%`;
}

/** 点击：定住提示框并让色块抖一下，触屏上也能读到信息 */
function onSegmentClick(index: number) {
  pinnedIndex.value = pinnedIndex.value === index ? -1 : index;
  shakingIndex.value = index;
  window.setTimeout(() => {
    if (shakingIndex.value === index) shakingIndex.value = -1;
  }, 460);
}
</script>

<style scoped>
.gel-block {
  position: relative;
  container-type: inline-size;
}

.gel-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 7px;
}

.gel-title {
  font-family: var(--font-serif);
  font-size: 14px;
  letter-spacing: 0.14em;
  color: var(--c-primary-soft);
}

.gel-meta {
  margin-left: auto;
  font-size: 13px;
  letter-spacing: 0.06em;
  color: var(--c-text-faint);
  font-variant-numeric: tabular-nums;
}

.gel-bar-wrap {
  position: relative;
}

/* ── 玻璃管：22.5pt 厚（原 15pt 加厚 50%）、横向铺满 ── */
.gel-track {
  position: relative;
  height: 22.5pt;
  border-radius: var(--radius-pill);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03) 40%, rgba(0, 0, 0, 0.28));
  border: 1px solid var(--c-track-edge);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.24),
    inset 0 -2px 6px rgba(0, 0, 0, 0.5),
    inset 0 0 12px rgba(0, 0, 0, 0.35),
    0 2px 10px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  isolation: isolate;
}

.gel-glass {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  border-radius: inherit;
  background: var(--glass-specular);
  mix-blend-mode: screen;
  opacity: 0.55;
}

.gel-specular {
  position: absolute;
  left: 2%;
  right: 2%;
  top: 1px;
  height: 32%;
  border-radius: var(--radius-pill);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 45%,
    rgba(255, 255, 255, 0) 100%
  );
  filter: blur(1px);
  opacity: 0.7;
}

.gel-tick {
  position: absolute;
  top: 2px;
  bottom: 2px;
  width: 1px;
  background: rgba(255, 255, 255, 0.16);
}

/* ── 凝胶色块：上缘爆亮、内部半透、下缘垂坠，照漫画里那团胶的画法 ── */
.gel-seg {
  position: absolute;
  top: 1px;
  bottom: 1px;
  z-index: 1;
  min-width: 2px;
  border-radius: 4px;
  background:
    radial-gradient(140% 130% at 26% -30%, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0) 58%),
    radial-gradient(90% 140% at 76% 130%, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0) 64%),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--c-gel) 76%, #fff) 0%,
      var(--c-gel-soft) 42%,
      var(--c-gel-edge) 78%,
      color-mix(in srgb, var(--c-gel) 74%, #000) 100%
    );
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.62),
    inset 0 -7px 7px rgba(0, 0, 0, 0.34),
    inset 0 3px 3px rgba(255, 255, 255, 0.32),
    0 1px 3px rgba(0, 0, 0, 0.42),
    0 0 10px var(--c-gel-glow);
  transform-origin: center bottom;
  transition:
    transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 220ms ease,
    filter 220ms ease;
  cursor: pointer;
  animation: gelBreathe 5.4s ease-in-out infinite;
}

.gel-seg:nth-of-type(2n) {
  animation-delay: -1.4s;
}

.gel-seg:nth-of-type(3n) {
  animation-delay: -2.9s;
}

/* 内芯：上下各一团柔光，慢慢鼓起来又瘪下去，像胶在管子里晃 */
.gel-body {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  background:
    radial-gradient(62% 110% at 50% 128%, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0) 70%),
    radial-gradient(38% 76% at 50% -16%, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 72%);
  mix-blend-mode: screen;
  opacity: 0.55;
  animation: gelCorePulse 6.8s ease-in-out infinite;
}

/* 水痕：两层斜向细亮纹各自漂移，再叠一道缓慢扫过的折射光 */
.gel-streaks {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(
      78deg,
      rgba(255, 255, 255, 0) 0 9px,
      rgba(255, 255, 255, 0.22) 9px 10px,
      rgba(255, 255, 255, 0) 10px 22px
    ),
    repeating-linear-gradient(
      97deg,
      rgba(255, 255, 255, 0) 0 15px,
      rgba(255, 255, 255, 0.14) 15px 16px,
      rgba(255, 255, 255, 0) 16px 31px
    ),
    repeating-linear-gradient(82deg, rgba(0, 0, 0, 0) 0 13px, rgba(0, 0, 0, 0.12) 13px 14px, rgba(0, 0, 0, 0) 14px 27px);
  background-size: 220% 100%;
  background-position: 0 0;
  mix-blend-mode: overlay;
  opacity: 0.85;
  animation: waterDrift 9s linear infinite;
}

.gel-streaks::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(104deg, transparent 32%, rgba(255, 255, 255, 0.52) 48%, transparent 64%);
  opacity: 0.55;
  mix-blend-mode: screen;
  animation: causticSweep 7.2s ease-in-out infinite;
}

/* 水珠与气泡：几颗亮点贴在内壁上，慢慢往上浮 */
.gel-drops {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 18% 74%, rgba(255, 255, 255, 0.9) 0 1.2px, rgba(255, 255, 255, 0) 2.2px),
    radial-gradient(circle at 44% 90%, rgba(255, 255, 255, 0.72) 0 1px, rgba(255, 255, 255, 0) 2px),
    radial-gradient(circle at 66% 66%, rgba(255, 255, 255, 0.84) 0 1.3px, rgba(255, 255, 255, 0) 2.4px),
    radial-gradient(circle at 84% 86%, rgba(255, 255, 255, 0.6) 0 1px, rgba(255, 255, 255, 0) 1.8px);
  background-size:
    46px 100%,
    33px 100%,
    59px 100%,
    41px 100%;
  background-position:
    0 100%,
    0 112%,
    0 88%,
    0 104%;
  mix-blend-mode: screen;
  opacity: 0.55;
  animation: dropsRise 12s linear infinite;
}

/* 上缘：一条爆亮的高光带，顶边再加一根白线，是漫画里那圈反光 */
.gel-rim {
  position: absolute;
  left: 2px;
  right: 2px;
  top: 1px;
  height: 30%;
  border-radius: var(--radius-pill);
  pointer-events: none;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.24) 56%, rgba(255, 255, 255, 0));
  filter: blur(0.3px);
  mix-blend-mode: screen;
  opacity: 0.62;
  animation: rimShimmer 5.8s ease-in-out infinite;
}

.gel-rim::after {
  content: '';
  position: absolute;
  left: 5%;
  right: 5%;
  top: -1px;
  height: 1px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
}

/* 下缘：胶往下坠出的那一小团，跟着呼吸轻轻抻长 */
.gel-drip {
  position: absolute;
  left: 50%;
  bottom: -1px;
  width: 64%;
  height: 26%;
  transform: translateX(-50%);
  border-radius: 50% 50% 42% 42% / 60% 60% 40% 40%;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0));
  opacity: 0.5;
  animation: dripSway 5.2s ease-in-out infinite;
}

/* ── 不规则轮廓：四种形状轮流用，边缘像挤出来的胶而不是方角 ── */
.gel-seg.shape-0 {
  border-radius: 14px 8px 11px 7px / 42% 34% 52% 40%;
}

.gel-seg.shape-1 {
  border-radius: 7px 13px 8px 12px / 34% 48% 38% 56%;
}

.gel-seg.shape-2 {
  border-radius: 12px 9px 14px 8px / 50% 36% 44% 34%;
}

.gel-seg.shape-3 {
  border-radius: 9px 14px 7px 11px / 38% 52% 34% 46%;
}

/* ── 管内液滴：悬停时几颗大小不一的胶滴沿内壁慢慢往下滑 ── */
.gel-drips {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
  transition: opacity 200ms ease;
}

.gel-seg.is-active .gel-drips {
  opacity: 1;
}

.gel-drips i {
  position: absolute;
  bottom: 2px;
  border-radius: 50% 50% 46% 46% / 58% 58% 42% 42%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), var(--c-gel-soft));
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.55);
  opacity: 0;
  animation: dripSlide 2.8s cubic-bezier(0.4, 0.05, 0.6, 0.95) infinite;
}

.gel-drips i:nth-child(1) {
  left: 14%;
  width: 3px;
  height: 6px;
  animation-duration: 2.4s;
  animation-delay: 0.15s;
}

.gel-drips i:nth-child(2) {
  left: 33%;
  width: 4.5px;
  height: 9px;
  animation-duration: 3.1s;
  animation-delay: 0.7s;
}

.gel-drips i:nth-child(3) {
  left: 52%;
  width: 2.6px;
  height: 5px;
  animation-duration: 2.1s;
  animation-delay: 1.15s;
}

.gel-drips i:nth-child(4) {
  left: 71%;
  width: 3.8px;
  height: 8px;
  animation-duration: 3.6s;
  animation-delay: 0.4s;
}

.gel-drips i:nth-child(5) {
  left: 87%;
  width: 3px;
  height: 6.5px;
  animation-duration: 2.7s;
  animation-delay: 1.6s;
}

/* ── 管外那一滴：从管底渗出来，拉长、坠出透明管壁，到一定距离断裂消失 ── */
.gel-escape {
  position: absolute;
  top: 100%;
  z-index: 6;
  width: 12px;
  height: 0;
  transform: translateX(-50%);
  pointer-events: none;
}

.escape-neck {
  position: absolute;
  left: 50%;
  top: -3px;
  width: 3px;
  height: 9px;
  margin-left: -1.5px;
  border-radius: 2px;
  background: var(--c-gel-soft);
  box-shadow: 0 0 3px var(--c-gel-glow);
  transform-origin: top center;
  opacity: 0;
  animation: escapeNeck 3.6s ease-in-out infinite;
}

.escape-drop {
  position: absolute;
  left: 50%;
  top: 0;
  width: 10px;
  height: 14px;
  margin-left: -5px;
  border-radius: 50% 50% 46% 46% / 62% 62% 38% 38%;
  background: linear-gradient(180deg, color-mix(in srgb, var(--c-gel) 55%, #fff), var(--c-gel));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.85),
    0 0 7px var(--c-gel-glow);
  transform-origin: top center;
  opacity: 0;
  animation: escapeDrop 3.6s cubic-bezier(0.42, 0.05, 0.72, 0.98) infinite;
}

.escape-splash {
  position: absolute;
  left: 50%;
  top: 0;
  width: 16px;
  height: 5px;
  margin-left: -8px;
  border-radius: 50%;
  background: radial-gradient(50% 100% at 50% 20%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0) 72%);
  opacity: 0;
  animation: escapeSplash 3.6s ease-out infinite;
}

.escape-enter-active,
.escape-leave-active {
  transition: opacity 200ms ease;
}

.escape-enter-from,
.escape-leave-to {
  opacity: 0;
}

/* 悬停：果冻回弹 */
.gel-seg:hover,
.gel-seg.is-active {
  transform: translateY(-1.5px) scaleY(1.22) scaleX(1.02);
  filter: saturate(118%) brightness(1.06);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.7),
    inset 0 -2px 3px rgba(0, 0, 0, 0.26),
    0 0 14px var(--c-gel-glow),
    0 0 3px rgba(255, 255, 255, 0.6);
}

.gel-seg.is-shaking {
  animation: gelShake 440ms cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

/* ── 总占据：钉在最左 ── */
.gel-total {
  position: absolute;
  left: 5px;
  top: 50%;
  z-index: 3;
  transform: translateY(-50%);
  padding: 0 6px;
  border-radius: var(--radius-pill);
  background: rgba(10, 8, 12, 0.82);
  border: 1px solid var(--c-total, var(--c-primary));
  color: #f6ece6;
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  box-shadow: 0 0 8px color-mix(in srgb, var(--c-total, #f2a870) 55%, transparent);
  pointer-events: none;
}

.gel-empty {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  transform: translate(-50%, -50%);
  font-size: 12px;
  letter-spacing: 0.14em;
  color: var(--c-text-faint);
}

/* ── 提示框：与色块同色，落在色块中心上方 ── */
.gel-tip {
  position: absolute;
  bottom: calc(100% + 9px);
  transform: translateX(-50%);
  z-index: 6;
  width: max-content;
  min-width: 118px;
  max-width: 208px;
  padding: 6px 10px 7px;
  border-radius: 9px;
  background: var(--c-tip-bg, rgba(20, 16, 20, 0.95));
  color: var(--c-tip-fg, #fff);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow:
    0 6px 18px rgba(0, 0, 0, 0.45),
    0 0 12px var(--c-tip-glow, rgba(242, 168, 112, 0.4));
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.35;
  pointer-events: none;
}

.gel-tip::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 100%;
  width: 8px;
  height: 8px;
  transform: translate(-50%, -50%) rotate(45deg);
  background: var(--c-tip-bg, rgba(20, 16, 20, 0.95));
  border-right: 1px solid rgba(255, 255, 255, 0.35);
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
}

.gel-tip-name {
  font-family: var(--font-serif);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.4;
  word-break: break-word;
}

.gel-tip-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  opacity: 0.94;
}

.gel-tip-dot {
  opacity: 0.6;
}

.tip-enter-active,
.tip-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tip-enter-from,
.tip-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px) scale(0.94);
}

@keyframes waterDrift {
  from {
    background-position: 0 0;
  }
  to {
    background-position: -42px 0;
  }
}

@keyframes causticSweep {
  0% {
    transform: translateX(-38%);
    opacity: 0;
  }
  22% {
    opacity: 0.6;
  }
  50% {
    transform: translateX(6%);
    opacity: 0.5;
  }
  78% {
    opacity: 0.55;
  }
  100% {
    transform: translateX(46%);
    opacity: 0;
  }
}

@keyframes dropsRise {
  from {
    background-position:
      0 130%,
      0 142%,
      0 118%,
      0 134%;
  }
  to {
    background-position:
      0 -30%,
      0 -18%,
      0 -42%,
      0 -26%;
  }
}

@keyframes gelCorePulse {
  0%,
  100% {
    transform: scaleY(1) translateY(0);
    opacity: 0.72;
  }
  50% {
    transform: scaleY(1.16) translateY(-2%);
    opacity: 0.92;
  }
}

@keyframes rimShimmer {
  0%,
  100% {
    opacity: 0.82;
  }
  50% {
    opacity: 1;
  }
}

@keyframes dripSway {
  0%,
  100% {
    transform: translateX(-50%) scaleY(0.86) scaleX(1);
  }
  50% {
    transform: translateX(-50%) scaleY(1.14) scaleX(0.94);
  }
}

@keyframes dripSlide {
  0% {
    transform: translateY(-4px) scale(0.6, 0.5);
    opacity: 0;
  }
  18% {
    opacity: 0.92;
  }
  55% {
    transform: translateY(9px) scale(1, 1.05);
    opacity: 0.86;
  }
  82% {
    transform: translateY(17px) scale(0.86, 1.35);
    opacity: 0.5;
  }
  100% {
    transform: translateY(23px) scale(0.62, 0.7);
    opacity: 0;
  }
}

@keyframes escapeNeck {
  0%,
  6% {
    opacity: 0;
    transform: scaleY(0.2);
  }
  18% {
    opacity: 0.75;
    transform: scaleY(1);
  }
  62% {
    opacity: 0.6;
    transform: scaleY(1.9);
  }
  72% {
    opacity: 0.25;
    transform: scaleY(0.4);
  }
  80%,
  100% {
    opacity: 0;
    transform: scaleY(0);
  }
}

@keyframes escapeDrop {
  0% {
    opacity: 0;
    transform: translateY(-2px) scale(0.5, 0.4);
  }
  10% {
    opacity: 1;
    transform: translateY(0) scale(1, 0.9);
  }
  50% {
    opacity: 1;
    transform: translateY(15px) scale(0.86, 1.7);
  }
  66% {
    opacity: 0.95;
    transform: translateY(25px) scale(0.66, 2.05);
  }
  74% {
    opacity: 0.9;
    transform: translateY(30px) scale(0.95, 0.58);
  }
  88% {
    opacity: 0.5;
    transform: translateY(37px) scale(0.78, 0.68);
  }
  100% {
    opacity: 0;
    transform: translateY(40px) scale(0.42, 0.42);
  }
}

@keyframes escapeSplash {
  0%,
  74% {
    opacity: 0;
    transform: scale(0.4, 0.3);
  }
  78% {
    opacity: 0.75;
    transform: scale(1, 0.8);
  }
  90%,
  100% {
    opacity: 0;
    transform: scale(0.7, 1.1);
  }
}

@keyframes gelBreathe {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.12);
  }
}

@keyframes gelShake {
  0% {
    transform: translateX(0) scaleY(1.1);
  }
  18% {
    transform: translateX(-2px) scaleY(1.24) skewX(-3deg);
  }
  36% {
    transform: translateX(2px) scaleY(0.94) skewX(3deg);
  }
  54% {
    transform: translateX(-1.5px) scaleY(1.18) skewX(-2deg);
  }
  72% {
    transform: translateX(1px) scaleY(1.02) skewX(1.5deg);
  }
  100% {
    transform: translateX(0) scaleY(1.08);
  }
}

/* ── 性能：所有光效只在爆发窗口里跑；其余时间整块静止，只留色块呼吸 ── */
.gel-body,
.gel-streaks,
.gel-streaks::after,
.gel-drops,
.gel-rim,
.gel-drip,
.gel-drips i,
.escape-neck,
.escape-drop,
.escape-splash {
  animation-play-state: paused;
}

.gel-seg.is-shedding .gel-body,
.gel-seg.is-shedding .gel-streaks,
.gel-seg.is-shedding .gel-streaks::after,
.gel-seg.is-shedding .gel-drops,
.gel-seg.is-shedding .gel-rim,
.gel-seg.is-shedding .gel-drip,
.gel-seg.is-shedding .gel-drips i {
  animation-play-state: running;
  animation-iteration-count: 1;
}

.escape-neck,
.escape-drop,
.escape-splash {
  animation-iteration-count: 1;
}

@media (prefers-reduced-motion: reduce) {
  .gel-seg,
  .gel-body,
  .gel-streaks,
  .gel-drops,
  .gel-rim,
  .gel-drip,
  .gel-drips i,
  .escape-neck,
  .escape-drop,
  .escape-splash {
    animation: none !important;
  }
}
</style>
