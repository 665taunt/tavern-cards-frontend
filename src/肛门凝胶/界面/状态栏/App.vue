<template>
  <div class="panel">
    <div class="panel-title">
      <span class="panel-mark" aria-hidden="true">◈</span>
      <span>肛门凝胶 · 状态</span>
      <span class="panel-hint">悬停 / 点击色块看这一段凝胶</span>
    </div>

    <SceneHeader
      :date="system.当前日期"
      :time="system.当前时间段"
      :place="system.当前场景"
      :scene="system.当前场合"
      :target="system.当前清算对象"
      :onstage="system.当前在场女角色"
      :progress="system.复仇进度"
    />

    <CharacterTabs v-model="activeName" :names="CHARACTERS" :onstage="system.当前在场女角色" />

    <GelBar
      :record="profile.肠道内凝胶"
      :capacity="profile.肠道容量"
      :occupy="profile.占据百分比"
      :desire-level="profile.便意等级"
    />

    <DesireBar class="panel-block" :level="profile.便意等级" />

    <div class="badge-row">
      <StageBadge :stage="profile.阶段" :imprinted="profile.淫纹 !== '尚未浮现'" />
      <span class="chip">插入物 {{ profile.菊穴插入物 }}</span>
      <span class="chip">直径 {{ profile.菊穴直径 }} cm</span>
      <span class="chip">敏感 {{ profile.敏感度 }} 阶</span>
      <span class="chip is-tag">{{ dilateTag }}</span>
    </div>

    <div class="meters">
      <StatMeter label="灵魂改造度" :value="profile.灵魂改造度" :max="1000" tone="#8e2c3f" :marks="[5, 20, 50]" />
      <StatMeter label="菊穴扩张度" :value="profile.菊穴扩张度" :max="500" tone="#b8748a" :marks="[20, 40, 60, 80]" />
    </div>

    <DevotionScales class="panel-block" :reform="profile.灵魂改造度" :character="activeName" />

    <div class="foot">
      <AttireList :outfit="profile" :character="activeName" :desire-level="profile.便意等级" />
      <ThoughtCard :text="profile.内心想法" />
      <div class="foot-meta">
        <span>排出累计 {{ Math.round(profile.排出凝胶总量) }} ml</span>
        <span v-if="profile.本次高潮情境 !== '无'">最近情境：{{ profile.本次高潮情境 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AttireList from './components/AttireList.vue';
import CharacterTabs from './components/CharacterTabs.vue';
import DesireBar from './components/DesireBar.vue';
import DevotionScales from './components/DevotionScales.vue';
import GelBar from './components/GelBar.vue';
import SceneHeader from './components/SceneHeader.vue';
import StageBadge from './components/StageBadge.vue';
import StatMeter from './components/StatMeter.vue';
import ThoughtCard from './components/ThoughtCard.vue';
import { DILATE_TAGS, dilateTier } from './composables/useLore';
import { useDataStore } from './store';

/** 五名女角色的槽位同构，页签只是切换读取路径 */
const CHARACTERS = ['沈栖迟', '陆清晏', '傅翎', '温晓棠', '姜叙'] as const;

interface CharState {
  阶段: string;
  灵魂改造度: number;
  菊穴扩张度: number;
  菊穴直径: number;
  敏感度: number;
  肠道容量: number;
  肠道内凝胶: Record<string, number>;
  占据百分比: number;
  便意等级: number;
  菊穴插入物: string;
  排出凝胶总量: number;
  本次高潮情境: string;
  排出姿势: string;
  淫纹: string;
  上装: string;
  下装: string;
  内衣: string;
  袜子: string;
  鞋子: string;
  内心想法: string;
}

const store = useDataStore();
const activeName = ref<string>(CHARACTERS[0]);

const system = computed(() => store.data.系统);

// schema 已给每个槽位兜了 prefault，这里再兜一层：
// 变量被 AI 写坏时宁可显示空壳，也不要整块面板报错消失。
const profile = computed<CharState>(() => {
  const raw = (store.data as unknown as Record<string, CharState>)[activeName.value];
  return (
    raw ?? {
      阶段: '沾染',
      灵魂改造度: 0,
      菊穴扩张度: 0,
      菊穴直径: 2,
      敏感度: 0,
      肠道容量: 500,
      肠道内凝胶: {},
      占据百分比: 0,
      便意等级: 0,
      菊穴插入物: '无',
      排出凝胶总量: 0,
      本次高潮情境: '无',
      排出姿势: '无',
      淫纹: '尚未浮现',
      上装: '',
      下装: '',
      内衣: '',
      袜子: '',
      鞋子: '',
      内心想法: '',
    }
  );
});

/** 扩张度的档位落到一句人话：排出对她是什么 */
const dilateTag = computed(() => DILATE_TAGS[dilateTier(Number(profile.value.菊穴扩张度) || 0)]);
</script>

<style scoped>
.panel {
  position: relative;
  max-width: 828px;
  margin: 0 auto;
  padding: 13px 14px 14px;
  border-radius: var(--radius-panel);
  background:
    radial-gradient(120% 80% at 12% 0%, rgba(242, 168, 112, 0.12), rgba(242, 168, 112, 0) 55%),
    radial-gradient(120% 90% at 88% 100%, rgba(214, 154, 150, 0.12), rgba(214, 154, 150, 0) 58%), var(--c-surface);
  border: 1px solid var(--c-border);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.14);
  color: var(--c-text);
  line-height: 1.5;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-serif);
  font-size: 14px;
  letter-spacing: 0.1em;
  color: var(--c-primary-soft);
  margin-bottom: 9px;
}

.panel-mark {
  color: var(--c-primary);
  text-shadow: 0 0 10px rgba(242, 168, 112, 0.8);
}

.panel-hint {
  margin-left: auto;
  font-family: var(--font-sans);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--c-text-faint);
}

.badge-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  margin: 10px 0 9px;
}

/* 便意条、双刻度这类块级组件与其它区块统一上边距 */
.panel-block {
  margin: 9px 0;
}

.chip {
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.11);
  font-size: 12px;
  letter-spacing: 0.05em;
  color: var(--c-text-muted);
  font-variant-numeric: tabular-nums;
}

/* 扩张度那句「排出对她是什么」，用品牌色点出来 */
.chip.is-tag {
  background: rgba(142, 44, 63, 0.22);
  border-color: rgba(214, 154, 150, 0.42);
  color: #f0c7c4;
}

.meters {
  display: grid;
  gap: 7px;
  padding: 9px 11px;
  border-radius: var(--radius-card);
  background: var(--c-surface-inset);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.foot {
  display: grid;
  gap: 7px;
  margin-top: 9px;
}

.foot-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--c-text-faint);
  font-variant-numeric: tabular-nums;
}
</style>
