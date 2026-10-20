<template>
  <section class="desire">
    <header class="desire-head">
      <span class="desire-label">便意压力</span>
      <span class="desire-name">{{ label }}</span>
      <span class="desire-value">{{ level }} / 5</span>
    </header>

    <div
      class="desire-track"
      role="meter"
      :aria-valuenow="level"
      aria-valuemin="0"
      aria-valuemax="5"
      :aria-label="`便意 ${label}`"
    >
      <span
        v-for="step in 5"
        :key="step"
        class="desire-cell"
        :class="{ 'is-on': level >= step, 'is-last': level === step }"
        :style="{ '--c-step': stepColor(step) }"
      />
      <div class="desire-glow" :style="{ width: (level / 5) * 100 + '%', '--c-glow': stepColor(Math.max(level, 1)) }" />
    </div>

    <p class="desire-note">{{ note }}</p>
  </section>
</template>

<script setup lang="ts">
import { DESIRE_LABELS, DESIRE_NOTES } from '../composables/useLore';

const props = defineProps<{ level: number }>();

// 便意是 0~5 的整数档，写坏时按最近的整数兜住
const level = computed(() => _.clamp(Math.round(Number(props.level) || 0), 0, 5));
const label = computed(() => DESIRE_LABELS[level.value] ?? '无感');
const note = computed(() => DESIRE_NOTES[level.value] ?? '');

// 由冷到血：越满越接近「崩决」，与四阶段色阶共用一套冷暖观
const STEP_COLORS = ['#9fb4c7', '#a9a6bc', '#c9a3b5', '#c98a94', '#b8748a', '#8e2c3f'];

function stepColor(step: number): string {
  return STEP_COLORS[_.clamp(step - 1, 0, STEP_COLORS.length - 1)];
}
</script>

<style scoped>
.desire {
  display: grid;
  gap: 6px;
  padding: 9px 11px;
  border-radius: var(--radius-card);
  background: linear-gradient(135deg, rgba(242, 168, 112, 0.1), rgba(142, 44, 63, 0.12));
  border: 1px solid rgba(242, 168, 112, 0.26);
}

.desire-head {
  display: flex;
  align-items: baseline;
  gap: 7px;
  font-size: 13px;
  letter-spacing: 0.06em;
}

.desire-label {
  color: var(--c-text-muted);
}

.desire-name {
  font-family: var(--font-serif);
  font-size: 14px;
  color: var(--c-primary-soft);
}

.desire-value {
  margin-left: auto;
  color: var(--c-text);
  font-variant-numeric: tabular-nums;
}

.desire-track {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 3px;
  height: 9px;
  border-radius: var(--radius-pill);
  padding: 1px;
  background: var(--c-track);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.desire-cell {
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.05);
  transition:
    background 320ms ease,
    box-shadow 320ms ease;
}

.desire-cell.is-on {
  background: linear-gradient(180deg, color-mix(in srgb, var(--c-step) 78%, #fff), var(--c-step));
  box-shadow: 0 0 6px color-mix(in srgb, var(--c-step) 45%, transparent);
}

.desire-cell.is-last {
  animation: desirePulse 1.8s ease-in-out infinite;
}

.desire-glow {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: var(--radius-pill);
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, var(--c-glow) 100%);
  opacity: 0.14;
  pointer-events: none;
  transition: width 380ms cubic-bezier(0.22, 1, 0.36, 1);
}

.desire-note {
  font-size: 12px;
  line-height: 1.6;
  color: var(--c-text-faint);
  letter-spacing: 0.02em;
}

@keyframes desirePulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.62;
  }
}
</style>
