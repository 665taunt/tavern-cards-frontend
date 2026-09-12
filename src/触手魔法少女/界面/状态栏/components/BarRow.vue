<template>
  <div class="bar-row">
    <KvRow :label="label">
      <span v-if="tag" class="magic-tag">{{ value }}%</span>
      <template v-else>{{ value }}/100</template>
    </KvRow>
    <div class="bar">
      <div class="bar-fill" :class="kind" :style="{ width: clamped + '%' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import KvRow from './KvRow.vue';

const props = defineProps<{
  label: string;
  value: number;
  /** 决定进度条配色：羁绊 / 改造度 / 魔力 */
  kind: 'bond' | 'corruption' | 'magic';
  /** 魔力用胶囊标签展示，数值后带 %；羁绊与改造度是 x/100 */
  tag?: boolean;
}>();

// schema 已 clamp 过，这里再兜一层：AI 写坏值时宁可条走满也不要 NaN 宽度
const clamped = computed(() => _.clamp(Number(props.value) || 0, 0, 100));
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
