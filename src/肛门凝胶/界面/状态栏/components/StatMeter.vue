<template>
  <div class="meter">
    <div class="meter-row">
      <span class="meter-label">{{ label }}</span>
      <span class="meter-value">{{ display }}</span>
    </div>
    <div class="meter-track">
      <div class="meter-fill" :style="{ width: pct + '%', '--c-meter': tone }" />
      <div v-if="marks" class="meter-marks">
        <span v-for="mark in marks" :key="mark" :style="{ left: mark + '%' }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string;
    value: number;
    max?: number;
    /** 数值后缀，如「阶」 */
    unit?: string;
    /** 进度条主色 */
    tone?: string;
    /** 分段刻度位置（百分比） */
    marks?: number[];
  }>(),
  { max: 100, unit: '', tone: '#f2a870', marks: () => [] },
);

const safeMax = computed(() => {
  const m = Number(props.max);
  return Number.isFinite(m) && m > 0 ? m : 100;
});

const pct = computed(() => _.clamp(((Number(props.value) || 0) / safeMax.value) * 100, 0, 100));

const display = computed(() => {
  const value = Number(props.value);
  const text = Number.isFinite(value) ? (Number.isInteger(value) ? value : Math.round(value * 10) / 10) : 0;
  return props.unit ? `${text} ${props.unit}` : `${text} / ${safeMax.value}`;
});
</script>

<style scoped>
.meter {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meter-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.06em;
}

.meter-label {
  color: var(--c-text-muted);
}

.meter-value {
  margin-left: auto;
  color: var(--c-text);
  font-variant-numeric: tabular-nums;
}

.meter-track {
  position: relative;
  height: 5px;
  border-radius: var(--radius-pill);
  background: var(--c-track);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  border-radius: var(--radius-pill);
  background: linear-gradient(90deg, color-mix(in srgb, var(--c-meter) 55%, #1a1216), var(--c-meter));
  box-shadow: 0 0 8px color-mix(in srgb, var(--c-meter) 45%, transparent);
  transition: width 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.meter-marks {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.meter-marks span {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(10, 8, 12, 0.55);
}
</style>
