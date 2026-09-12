<template>
  <div class="tab-bar">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      class="tab-btn"
      :class="[`tab-btn-${tab.id}`, { 'is-active': modelValue === tab.id }]"
      :aria-pressed="modelValue === tab.id"
      @click="emit('update:modelValue', tab.id)"
    >
      <img class="tab-ico" :src="tab.icon" :alt="tab.alt">
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TabId } from '../composables/useRoster';

/**
 * 双页签。
 * 旧实现是「纯 CSS 无 JS」的 radio + <label for>，因为 HTML 会被注入到每一条消息，
 * 同一份 id/name 在文档里重复 N 份，导致点页签时 label 的 for 永远解析到第一层楼，
 * 焦点被移走、视口跳回初始楼层。这里用 v-model 取代整套机制，问题从结构上消失。
 */
defineProps<{
  modelValue: TabId;
  tabs: { id: TabId; label: string; icon: string; alt: string }[];
}>();

const emit = defineEmits<{ 'update:modelValue': [TabId] }>();
</script>

<style scoped>
.tab-bar {
  display: flex;
  gap: 8px;
  margin: 10px 0 12px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: var(--radius-card);
  font-size: 14px;
  font-family: inherit;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  user-select: none;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    filter 180ms ease,
    opacity 180ms ease;
}

.tab-ico {
  width: 44px;
  height: 44px;
  flex: none;
  object-fit: contain;
  display: block;
}

/* 魔法少女：紫底黄字 */
.tab-btn-girls {
  background: linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%);
  color: #fde047;
  border: 1px solid rgba(253, 224, 71, 0.35);
  box-shadow: 0 2px 10px rgba(109, 40, 217, 0.4);
}

/* 触手怪人：白底洋红字 */
.tab-btn-enemies {
  background: linear-gradient(135deg, #ffffff 0%, #fff1f5 100%);
  color: #c30074;
  border: 1px solid rgba(195, 0, 116, 0.3);
  box-shadow: 0 2px 10px rgba(195, 0, 116, 0.15);
}

.tab-btn:active {
  transform: scale(0.97);
}

.tab-btn.is-active {
  transform: translateY(-1px);
  filter: brightness(1.08) saturate(1.05);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.14) inset;
}

.tab-btn:not(.is-active) {
  filter: saturate(0.5) brightness(0.7);
  opacity: 0.72;
}

.tab-btn:focus-visible {
  outline: 2px solid #fde047;
  outline-offset: 2px;
}
</style>
