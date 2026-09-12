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
  { id: 'girls' as const, label: '魔法少女', icon: tabIconUrl('girls'), alt: '魔法少女' },
  { id: 'enemies' as const, label: '触手怪人', icon: tabIconUrl('enemies'), alt: '触手怪人' },
]);

const activeTab = ref<TabId>('girls');

// 只在首次拿到名单时挑一次「有内容的那页」，之后一律由用户点击决定。
// 两个页签**永远可点**：某一侧没人时切过去会看到 EmptyRoster 占位提示。
//
// 这里绝不能写成会随名单变化重新赋值的 watchEffect —— 那会在用户切到空页签后
// 立刻把页签拉回去，再加上「空页签禁点」，纯魔法少女场景下两个按钮就都点不动了。
let picked_once = false;
watchEffect(() => {
  if (picked_once) return;
  if (hasGirls.value || hasEnemies.value) {
    picked_once = true;
    if (!hasGirls.value) activeTab.value = 'enemies';
  }
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
