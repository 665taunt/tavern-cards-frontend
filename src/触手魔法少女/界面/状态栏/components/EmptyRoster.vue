<template>
  <div class="empty-roster">{{ text }}</div>
</template>

<script setup lang="ts">
/**
 * 名单为空时的占位提示。
 * 旧实现里，如果两个页签的 radio 都没被选中（跨楼层串组时会真实发生），
 * 两页都是 display:none —— 面板直接变白板且不给任何解释。这里保证永远有内容。
 */
defineProps<{ text: string }>();
</script>

<style scoped>
.empty-roster {
  padding: 18px 12px;
  text-align: center;
  font-size: 12.5px;
  color: var(--c-text-muted);
  background: var(--c-surface-inset);
  border: 1px dashed var(--c-border);
  border-radius: var(--radius-card);
}
</style>
