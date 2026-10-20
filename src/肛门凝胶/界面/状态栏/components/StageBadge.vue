<template>
  <div class="stage" :style="{ '--c-stage': tone.color }">
    <span class="stage-name">{{ stage }}</span>
    <span class="stage-note">{{ tone.note }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ stage: string; imprinted?: boolean }>();

// 四阶段色阶：把「改造推进」翻译成从冷到血的渐深
const TONES: Record<string, { color: string; note: string }> = {
  沾染: { color: '#9fb4c7', note: '术式刚起效' },
  初步倒转: { color: '#c9a3b5', note: '灵魂首次永久改变' },
  深层重塑: { color: '#b8748a', note: '主动求欢' },
  完全母猪化: { color: '#8e2c3f', note: '对<user>争相献媚' },
};

const FALLBACK = { color: '#9fb4c7', note: '阶段未定' };

// 尚未刻印的人停在「沾染」阶，但身上还没有纹 —— 备注要说清这一点，
// 否则面板会让人以为术式已经生效。
const tone = computed(() => {
  const base = TONES[props.stage] ?? FALLBACK;
  if (props.imprinted === false) return { color: base.color, note: '尚未刻印' };
  return base;
});
</script>

<style scoped>
.stage {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 2px 10px 2px 8px;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--c-stage) 26%, transparent);
  border: 1px solid color-mix(in srgb, var(--c-stage) 72%, transparent);
  box-shadow:
    0 0 12px color-mix(in srgb, var(--c-stage) 38%, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
}

.stage-name {
  font-family: var(--font-serif);
  font-size: 14px;
  letter-spacing: 0.1em;
  color: #fdf2ee;
}

.stage-note {
  font-size: 12px;
  letter-spacing: 0.04em;
  color: rgba(253, 242, 238, 0.72);
}
</style>
