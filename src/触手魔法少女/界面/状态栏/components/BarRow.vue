<template>
  <div class="bar-row">
    <KvRow :label="label">
      <span v-if="tag" class="magic-tag">{{ value }}/{{ safeMax }}</span>
      <template v-else>{{ value }}/{{ safeMax }}</template>
    </KvRow>
    <div class="bar">
      <div class="bar-fill" :class="kind" :style="{ width: pct + '%' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import KvRow from './KvRow.vue';

const props = withDefaults(
  defineProps<{
    label: string;
    value: number;
    /** 决定进度条配色：羁绊 / 改造度 / 魔力 */
    kind: 'bond' | 'corruption' | 'magic';
    /** 满格对应的值：羁绊与改造度用默认的 100，魔力行传该角色的「魔力上限」 */
    max?: number;
    /** 魔力用胶囊标签展示；羁绊与改造度是纯文本 */
    tag?: boolean;
  }>(),
  { max: 100 },
);

// schema 已 clamp 过，这里再兜一层：值和上限都可能被 AI 写坏，
// 此时宁可条走满，也不要 NaN 宽度或除零
const safeMax = computed(() => {
  const m = Number(props.max);
  return Number.isFinite(m) && m > 0 ? m : 100;
});
const pct = computed(() => _.clamp(((Number(props.value) || 0) / safeMax.value) * 100, 0, 100));
</script>

<style scoped>
.bar {
  height: 6px;
  border-radius: 3px;
  background: var(--c-track);
  overflow: hidden;
  margin-top: 6px;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}

.bar-fill.bond {
  background: var(--c-progress-bond);
  box-shadow: 0 0 8px rgba(124, 58, 237, 0.35);
}

.bar-fill.corruption {
  background: var(--c-progress-corruption);
  box-shadow: 0 0 8px rgba(236, 72, 153, 0.35);
}

.bar-fill.magic {
  background: var(--c-progress-magic);
  box-shadow: 0 0 8px rgba(244, 63, 94, 0.35);
}

.magic-tag {
  display: inline-block;
  background: var(--c-danger-soft);
  border: 1px solid var(--c-danger-border);
  color: var(--c-danger);
  border-radius: 999px;
  padding: 1px 8px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
</style>
