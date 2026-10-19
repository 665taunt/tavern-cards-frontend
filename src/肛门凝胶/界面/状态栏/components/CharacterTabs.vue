<template>
  <nav class="tabs" role="tablist" aria-label="选择角色">
    <button
      v-for="name in names"
      :key="name"
      type="button"
      role="tab"
      class="tab"
      :class="{ 'is-active': name === modelValue, 'is-onstage': onstage.includes(name) }"
      :aria-selected="name === modelValue"
      @click="emit('update:modelValue', name)"
    >
      {{ name }}
    </button>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  names: readonly string[];
  modelValue: string;
  /** 当前在场角色，用来给页签点一个“在场”亮点 */
  onstage: string;
}>();

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<style scoped>
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 9px 0 8px;
}

.tab {
  position: relative;
  padding: 3px 9px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  color: var(--c-text-muted);
  font-family: var(--font-serif);
  font-size: 11.5px;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition:
    color 180ms ease,
    border-color 180ms ease,
    background 180ms ease,
    transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tab:hover {
  transform: translateY(-1px);
  border-color: var(--c-border-strong);
  color: var(--c-primary-soft);
}

.tab.is-active {
  background: linear-gradient(180deg, rgba(242, 168, 112, 0.3), rgba(242, 168, 112, 0.12));
  border-color: var(--c-border-strong);
  color: #fdece0;
  box-shadow:
    0 0 10px rgba(242, 168, 112, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.tab.is-onstage::after {
  content: '';
  position: absolute;
  top: 2px;
  right: 3px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #8ee6b0;
  box-shadow: 0 0 5px rgba(142, 230, 176, 0.9);
}
</style>
