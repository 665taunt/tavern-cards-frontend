<template>
  <div class="status-panel">
    <div class="status-title">触手魔法少女 · 状态</div>

    <SceneBar
      :date="store.data.系统.当前日期"
      :time="store.data.系统.当前时间段"
      :place="store.data.系统.当前场景"
      :enemies="enemyNames"
    />

    <TabBar v-model="activeTab" :tabs="tabs" />

    <!-- 页签页用 v-show 而非 v-if：两页都留在 DOM 里，
         切换页签时角色卡展开(<details open>)的状态才不会被销毁。 -->
    <div v-show="activeTab === 'girls'" class="tab-page">
      <div v-if="girls.length" class="card-list">
        <CharacterCard v-for="entry in girls" :key="entry.name" :entry="entry" />
      </div>
      <EmptyRoster v-else text="当前场景没有魔法少女在场" />
    </div>

    <div v-show="activeTab === 'enemies'" class="tab-page">
      <div v-if="enemies.length" class="card-list">
        <CharacterCard v-for="entry in enemies" :key="entry.name" :entry="entry" />
      </div>
      <EmptyRoster v-else text="当前场景没有触手怪人在场" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CharacterCard from './components/CharacterCard.vue';
import EmptyRoster from './components/EmptyRoster.vue';
import SceneBar from './components/SceneBar.vue';
import TabBar from './components/TabBar.vue';
import { splitNames, useRoster, type TabId } from './composables/useRoster';
import { tabIconUrl } from './composables/useAssets';

const { store, girls, enemies, hasGirls, hasEnemies } = useRoster();

const enemyNames = computed(() => splitNames(store.data.系统.当前场景敌人));

const tabs = computed(() => [
  { id: 'girls' as const, label: '魔法少女', icon: tabIconUrl('girls'), alt: '魔法少女', empty: !hasGirls.value },
  { id: 'enemies' as const, label: '触手怪人', icon: tabIconUrl('enemies'), alt: '触手怪人', empty: !hasEnemies.value },
]);

const activeTab = ref<TabId>('girls');

// 当前页签变空（AI 把人都移出场景）时自动切到还有人那边；两边都空则停在魔法少女页
// 并显示占位提示，绝不留下白板。
watchEffect(() => {
  if (!hasGirls.value && hasEnemies.value) activeTab.value = 'enemies';
  else if (hasGirls.value && !hasEnemies.value) activeTab.value = 'girls';
});
</script>

<style scoped>
/* 面板根。旧实现这层是 <div class="status-panel">，
   迁到 iframe 后 radio 与 <form> 都不需要了 —— iframe 是独立文档，
   原本靠 form owner 隔离的 radio group 问题从结构上不再存在。 */
.status-panel {
  background: var(--c-surface);
  color: var(--c-text);
  padding: 14px;
  border-radius: var(--radius-panel);
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.5;
}

.status-title {
  font-family: var(--font-serif);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--c-text-muted);
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-title::before {
  content: '✦';
  color: var(--c-danger);
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
