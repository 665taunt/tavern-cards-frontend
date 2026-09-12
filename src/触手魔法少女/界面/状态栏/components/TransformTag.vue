<template>
  <span class="transform-tag" :class="active ? 'on' : 'off'">{{ active ? onLabel : offLabel }}</span>
</template>

<script setup lang="ts">
/**
 * 变身 / 伪装状态标签。
 * 旧实现靠 `[data-trans]` 属性 + 两条 CSS 规则切换，且敌人的激活色要单独打补丁；
 * 组件化后由 prop 决定，配色统一走 --c-transform-* 令牌（敌人卡片会覆盖这三个令牌）。
 *
 * 注意两个字段的键不同：女主是「是否变身」，敌人是「是否伪装人类」。
 */
defineProps<{
  active: boolean;
  onLabel: string;
  offLabel: string;
}>();
</script>

<style scoped>
.transform-tag {
  display: inline-block;
  border-radius: 999px;
  padding: 1px 8px;
  font-size: 12px;
}

.transform-tag.on {
  background: var(--c-transform-on-bg);
  border: 1px solid var(--c-transform-on-border);
  color: var(--c-transform-on-text);
}

.transform-tag.off {
  background: var(--c-transform-off-bg);
  border: 1px solid var(--c-transform-off-border);
  color: var(--c-transform-off-text);
}
</style>
