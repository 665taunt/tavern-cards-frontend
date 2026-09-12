<template>
  <div class="status-card" :class="{ wide }">
    <div class="card-label">{{ label }}</div>
    <slot />
  </div>
</template>

<script setup lang="ts">
/** wide 的卡片横跨整个网格（孔穴/拟态/异常这类长内容） */
defineProps<{ label: string; wide?: boolean }>();
</script>

<style scoped>
.status-card {
  background: var(--c-surface-inset);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-card);
  padding: 9px 11px;
}

.status-card.wide {
  grid-column: 1 / -1;
}

.card-label {
  font-size: 11px;
  color: var(--c-text-muted);
  margin-bottom: 6px;
  letter-spacing: 0.05em;
}
</style>
