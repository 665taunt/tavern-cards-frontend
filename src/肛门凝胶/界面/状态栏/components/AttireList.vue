<template>
  <div class="attire">
    <span v-for="item in items" :key="item.label" class="attire-item">
      <span class="attire-label">{{ item.label }}</span>
      <span class="attire-value">{{ item.value || '—' }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  outfit: {
    上装: string;
    下装: string;
    内衣: string;
    袜子: string;
    鞋子: string;
  };
}>();

const items = computed(() =>
  (['上装', '下装', '内衣', '袜子', '鞋子'] as const).map(label => ({
    label,
    value: props.outfit?.[label] ?? '',
  })),
);
</script>

<style scoped>
.attire {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 6px;
}

.attire-item {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  padding: 2px 7px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 10.5px;
  max-width: 100%;
}

.attire-label {
  color: var(--c-text-faint);
  letter-spacing: 0.08em;
  flex: none;
}

.attire-value {
  color: var(--c-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
