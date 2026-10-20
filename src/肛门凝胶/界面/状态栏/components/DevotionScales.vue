<template>
  <section class="scales">
    <header class="scales-head">
      <span class="scales-label">私下里的两张脸</span>
      <span class="scales-meta">由灵魂改造度推出 · {{ reform }}</span>
    </header>

    <div class="scale">
      <div class="scale-row">
        <span class="scale-name">嫌恶 · 同伴</span>
        <span class="scale-tier">{{ tier }}</span>
        <span class="scale-pct">{{ Math.round(aversion) }}%</span>
      </div>
      <div class="scale-track">
        <div class="scale-fill is-aversion" :style="{ width: aversion + '%' }" />
      </div>
      <p class="scale-note">{{ aversionNote }}</p>
    </div>

    <div class="scale">
      <div class="scale-row">
        <span class="scale-name">争宠 · 哥哥</span>
        <span class="scale-tier">{{ tier }}</span>
        <span class="scale-pct">{{ Math.round(courting) }}%</span>
      </div>
      <div class="scale-track">
        <div class="scale-fill is-courting" :style="{ width: courting + '%' }" />
      </div>
      <p class="scale-note">{{ courtingNote }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { AVERSION_NOTES, COURTING_NOTES, devoTier } from '../composables/useLore';

const props = defineProps<{ reform: number; character: string }>();

const reform = computed(() => _.clamp(Number(props.reform) || 0, 0, 1000));
const tier = computed(() => devoTier(reform.value));

// 两条刻度不同曲线：嫌恶起得早、争宠起得晚（先烦同伴，才轮到争）
const aversion = computed(() => _.clamp((reform.value / 500) * 100, 0, 100));
const courting = computed(() => _.clamp(((reform.value - 100) / 400) * 100, 0, 100));

const aversionNote = computed(() => AVERSION_NOTES[tier.value]);
const courtingNote = computed(() => COURTING_NOTES[props.character]?.[tier.value] ?? '还没有自己的争宠手法');
</script>

<style scoped>
.scales {
  display: grid;
  gap: 8px;
  padding: 9px 11px;
  border-radius: var(--radius-card);
  background: var(--c-surface-inset);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.scales-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.06em;
}

.scales-label {
  color: var(--c-text-muted);
}

.scales-meta {
  margin-left: auto;
  color: var(--c-text-faint);
  font-variant-numeric: tabular-nums;
}

.scale {
  display: grid;
  gap: 4px;
}

.scale-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 10.5px;
}

.scale-name {
  font-family: var(--font-serif);
  color: var(--c-text);
  letter-spacing: 0.04em;
}

.scale-tier {
  padding: 0 6px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 9.5px;
  color: var(--c-text-muted);
}

.scale-pct {
  margin-left: auto;
  color: var(--c-text-muted);
  font-variant-numeric: tabular-nums;
}

.scale-track {
  height: 4px;
  border-radius: var(--radius-pill);
  background: var(--c-track);
  overflow: hidden;
}

.scale-fill {
  height: 100%;
  border-radius: var(--radius-pill);
  transition: width 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.scale-fill.is-aversion {
  background: linear-gradient(90deg, rgba(95, 115, 137, 0.7), #5f7389);
  box-shadow: 0 0 8px rgba(95, 115, 137, 0.45);
}

.scale-fill.is-courting {
  background: linear-gradient(90deg, rgba(214, 154, 150, 0.6), #d69a96);
  box-shadow: 0 0 8px rgba(214, 154, 150, 0.45);
}

.scale-note {
  font-size: 10px;
  line-height: 1.6;
  color: var(--c-text-faint);
}
</style>
