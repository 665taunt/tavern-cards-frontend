<template>
  <div class="kv">
    <span class="k">{{ label }}</span>
    <span class="v"><slot /></span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<style scoped>
.kv {
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 2px 0;
}

.k {
  color: var(--c-text-muted);
  flex-shrink: 0;
}

.v {
  color: var(--c-text);
  font-variant-numeric: tabular-nums;
  text-align: right;
  word-break: break-word;
}
</style>
