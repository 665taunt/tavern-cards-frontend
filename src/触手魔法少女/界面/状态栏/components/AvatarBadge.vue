<template>
  <div class="avatar-badge">
    <img class="avatar-img" :src="src" :alt="alt">
  </div>
</template>

<script setup lang="ts">
/**
 * 头像徽章。旧实现在这里叠了一个 position:absolute 的首字兜底层，
 * 靠 `onerror="this.remove()"` 收场 —— 但 DOMPurify 默认会剥掉所有 on* 属性，
 * 而且图源已随 bundle 内联，永远不可能加载失败。兜底层已整个删除。
 *
 * 光环渐变与辉光由父级 .character-card[data-accent] 提供的令牌决定。
 */
defineProps<{ src: string; alt: string }>();
</script>

<style scoped>
.avatar-badge {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  padding: 2px;
  flex-shrink: 0;
  background: var(--c-accent-ring, var(--c-primary));
  box-shadow: 0 0 10px var(--c-accent-glow, transparent);
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  object-fit: cover;
  display: block;
  background: var(--c-surface);
}
</style>
