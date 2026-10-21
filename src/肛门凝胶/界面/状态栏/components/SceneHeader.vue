<template>
  <header class="scene">
    <div class="scene-line">
      <span class="scene-date">{{ date }}</span>
      <span class="scene-time">{{ time }}</span>
      <span class="scene-progress">{{ progress }}</span>
    </div>
    <div class="scene-line scene-line-main">
      <span class="scene-place">{{ place }}</span>
      <span class="scene-tag" :class="isPublic ? 'is-public' : 'is-private'">
        {{ isPublic ? '公开' : '私密' }}
      </span>
      <span v-if="target !== '无'" class="scene-tag is-target">清算 · {{ target }}</span>
    </div>
    <div class="scene-line scene-line-sub">
      <span class="scene-onstage">在场 {{ onstage || '无' }}</span>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  date: string;
  time: string;
  place: string;
  scene: string;
  target: string;
  onstage: string;
  progress: string;
}>();

// 当前场合是枚举「公开 / 私密」，但场景字符串里出现学生会室、体育馆一类
// 人多的地方时，AI 有时会漏更新场合 —— 这里只做兜底提示，不覆盖变量。
const isPublic = computed(() => props.scene === '公开');
</script>

<style scoped>
.scene {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 9px 11px;
  border-radius: var(--radius-card);
  background: var(--glass-specular), var(--c-surface-raised);
  border: 1px solid var(--c-border);
  box-shadow: var(--glass-inner);
}

.scene-line {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  letter-spacing: 0.06em;
  color: var(--c-text-faint);
  font-variant-numeric: tabular-nums;
}

.scene-line-main {
  gap: 7px;
}

.scene-date {
  font-family: var(--font-serif);
}

.scene-time {
  padding: 0 6px;
  border-radius: var(--radius-pill);
  background: rgba(242, 168, 112, 0.16);
  border: 1px solid var(--c-border);
  color: var(--c-primary-soft);
}

.scene-progress {
  margin-left: auto;
  color: var(--c-text-muted);
}

.scene-place {
  font-family: var(--font-serif);
  font-size: 16px;
  letter-spacing: 0.05em;
  color: var(--c-text);
}

.scene-tag {
  padding: 0 6px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  line-height: 1.6;
  letter-spacing: 0.08em;
}

.scene-tag.is-public {
  background: rgba(242, 168, 112, 0.18);
  border: 1px solid var(--c-border-strong);
  color: var(--c-primary-soft);
}

.scene-tag.is-private {
  background: rgba(142, 44, 63, 0.22);
  border: 1px solid rgba(214, 154, 150, 0.45);
  color: #f0c7c4;
}

.scene-tag.is-target {
  margin-left: auto;
  background: rgba(63, 91, 168, 0.24);
  border: 1px solid rgba(63, 91, 168, 0.6);
  color: #c8d4f0;
}

.scene-onstage {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
