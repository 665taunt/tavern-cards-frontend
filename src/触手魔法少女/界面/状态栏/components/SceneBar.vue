<template>
  <div class="scene-bar">
    <span class="scene-item">
      <span class="k">日期</span>
      <span class="v">{{ date }} {{ time }}</span>
    </span>
    <span class="scene-item">
      <span class="k">地点</span>
      <span class="v">{{ place }}</span>
    </span>
    <span class="scene-item">
      <span class="k">敌人</span>
      <!-- 场上无敌人时用中性色，不要把它塞进危险色胶囊里 —— 那读起来像“有威胁” -->
      <span v-if="enemies.length === 0" class="enemy-tag is-none">无</span>
      <template v-else>
        <span v-for="name in enemies" :key="name" class="enemy-tag">{{ name }}</span>
      </template>
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  date: string;
  time: string;
  place: string;
  enemies: string[];
}>();
</script>

<style scoped>
.scene-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 14px;
  background: var(--c-surface-raised);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-card);
  padding: 8px 12px;
  margin-bottom: 10px;
  font-size: 12px;
}

.scene-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.k {
  color: var(--c-text-muted);
}

.v {
  color: var(--c-text);
  font-variant-numeric: tabular-nums;
}

.enemy-tag {
  display: inline-block;
  background: var(--c-danger-soft);
  border: 1px solid var(--c-danger-border);
  color: var(--c-danger);
  border-radius: 999px;
  padding: 1px 8px;
  font-size: 12px;
}

.enemy-tag.is-none {
  background: rgba(148, 163, 184, 0.12);
  border-color: rgba(148, 163, 184, 0.35);
  color: var(--c-text-muted);
}
</style>
