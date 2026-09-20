<template>
  <details class="character-card" :data-accent="meta.accent">
    <summary>
      <AvatarBadge :src="meta.avatar" :alt="meta.name" />
      <div class="avatar-meta">
        <div class="avatar-name">
          {{ meta.name }}
          <span class="rank-tag" :class="{ 'is-enemy': variant === 'enemy' }">{{ meta.rank }}</span>
        </div>
        <div class="avatar-thought">“{{ thought }}”</div>
      </div>
    </summary>

    <div class="card-body">
      <div class="status-grid">
        <!-- 羁绊：仅女主与临时 NPC 有 -->
        <StatCard v-if="variant !== 'enemy'" label="羁绊">
          <BarRow label="好感度" :value="num('好感度')" kind="bond" />
          <BarRow label="改造度" :value="num('改造度')" kind="corruption" />
        </StatCard>

        <!-- 魔力：女主三条，临时 NPC 无变身行 -->
        <StatCard v-if="variant !== 'enemy'" label="魔力">
          <BarRow
            label="当日消耗魔力"
            :value="num('当日消耗魔力')"
            :max="num('魔力上限')"
            kind="magic"
            tag
          />
          <KvRow label="补魔方式">{{ str('魔力补给方式') }}</KvRow>
          <KvRow v-if="variant === 'girl'" label="是否变身">
            <TransformTag :active="bool('是否变身')" on-label="变身中" off-label="日常形态" />
          </KvRow>
        </StatCard>

        <!-- 身姿：敌人专属 -->
        <StatCard v-if="variant === 'enemy'" label="身姿">
          <KvRow label="是否伪装人类">
            <TransformTag :active="bool('是否伪装人类')" on-label="人类形态" off-label="出战形态" />
          </KvRow>
          <KvRow label="种属">
            <span class="rank-tag is-enemy">{{ meta.rank }}</span>
          </KvRow>
        </StatCard>

        <StatCard wide label="异常状态">
          <div class="anomaly">{{ str('异常状态') }}</div>
        </StatCard>

        <!-- 孔穴状态：临时 NPC 的 schema 里没有这组字段，故只在女主/敌人上出现 -->
        <StatCard v-if="variant !== 'guest'" wide label="孔穴状态">
          <KvRow v-for="hole in HOLES" :key="hole" :label="hole">{{ str(hole) }}</KvRow>
        </StatCard>

        <!-- 触手服拟态：女主专属 -->
        <StatCard v-if="variant === 'girl'" wide label="触手服拟态">
          <KvRow v-for="slot in MIMICRY" :key="slot" :label="slot">{{ str(slot) }}</KvRow>
        </StatCard>

        <!-- 穿搭：敌人专属 -->
        <StatCard v-if="variant === 'enemy'" wide label="穿搭">
          <KvRow v-for="slot in OUTFIT" :key="slot" :label="slot">{{ str(slot) }}</KvRow>
        </StatCard>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import AvatarBadge from './AvatarBadge.vue';
import BarRow from './BarRow.vue';
import KvRow from './KvRow.vue';
import StatCard from './StatCard.vue';
import TransformTag from './TransformTag.vue';
import { useDataStore } from '../store';
import type { RosterEntry } from '../composables/useRoster';

const props = defineProps<{ entry: RosterEntry }>();

// 不要解构 props：解构会丢掉响应性，名单变化时卡片不会跟着更新。
// meta / variant / name 只在模板里通过 props.entry.* 取用。
const meta = computed(() => props.entry.meta);
const variant = computed(() => props.entry.variant);
const name = computed(() => props.entry.name);

const store = useDataStore();

/** 取本角色的数据对象。schema 已对缺失字段 prefault 过，正常路径下拿到的一定是完整对象。 */
const record = computed<Record<string, unknown>>(() => {
  const source = variant.value === 'guest' ? store.data.其他魔法少女 : store.data;
  return ((source as Record<string, unknown>)[name.value] ?? {}) as Record<string, unknown>;
});

const str = (field: string): string => String(record.value[field] ?? '');
const num = (field: string): number => Number(record.value[field] ?? 0);
const bool = (field: string): boolean => record.value[field] === true;

const thought = computed(() => str('内心想法'));

const HOLES = ['吞屌口穴', '过肺鼻穴', '灌脑耳穴', '溢奶乳穴', '储精淫宫', '吸精小穴', '漏电尿穴', '渴精菊穴', '骚淫足穴'] as const;
const MIMICRY = ['上装拟态', '下装拟态', '鞋袜拟态', '作祟触手'] as const;
const OUTFIT = ['上身穿搭', '下身穿搭', '鞋袜穿搭'] as const;
</script>

<style scoped>
.character-card {
  background: var(--c-surface-raised);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-card);
  overflow: hidden;
}

/* 角色主题色：data-accent 是稳定的角色键，不是颜色名。
   旧实现把这些散成 5+2 条 `.girl[data-girl="…"] .avatar-badge/.role-tag/.avatar-thought`
   选择器，这里收敛成每角色一组令牌，由子组件各自消费一次。 */
.character-card[data-accent='mia'] {
  --c-accent-ring: linear-gradient(135deg, #7c3aed, #f43f5e);
  --c-accent-glow: rgba(124, 58, 237, 0.35);
  --c-accent-role-bg: rgba(124, 58, 237, 0.2);
  --c-accent-role-border: rgba(124, 58, 237, 0.45);
  --c-accent-role-text: var(--c-primary-soft);
  --c-accent-thought: var(--c-danger);
}

.character-card[data-accent='aya'] {
  --c-accent-ring: linear-gradient(135deg, #e11d48, #f97316);
  --c-accent-glow: rgba(244, 63, 94, 0.35);
  --c-accent-role-bg: rgba(244, 63, 94, 0.15);
  --c-accent-role-border: rgba(244, 63, 94, 0.45);
  --c-accent-role-text: #fb7185;
  --c-accent-thought: var(--c-danger);
}

.character-card[data-accent='viola'] {
  --c-accent-ring: linear-gradient(135deg, #6366f1, #a78bfa);
  --c-accent-glow: rgba(99, 102, 241, 0.35);
  --c-accent-role-bg: rgba(99, 102, 241, 0.15);
  --c-accent-role-border: rgba(99, 102, 241, 0.45);
  --c-accent-role-text: #a5b4fc;
  --c-accent-thought: #a5b4fc;
}

.character-card[data-accent='yocho'] {
  --c-accent-ring: linear-gradient(135deg, #1e1b4b, #7c3aed);
  --c-accent-glow: rgba(124, 58, 237, 0.5);
  --c-accent-role-bg: rgba(124, 58, 237, 0.25);
  --c-accent-role-border: rgba(124, 58, 237, 0.6);
  --c-accent-role-text: #c4b5fd;
  --c-accent-thought: #c4b5fd;
}

.character-card[data-accent='cecilia'] {
  --c-accent-ring: linear-gradient(135deg, #d97706, #f43f5e);
  --c-accent-glow: rgba(217, 119, 6, 0.35);
  --c-accent-role-bg: rgba(217, 119, 6, 0.15);
  --c-accent-role-border: rgba(217, 119, 6, 0.45);
  --c-accent-role-text: #fcd34d;
  --c-accent-thought: var(--c-danger);
}

/* 敌人：激活态的变身标签用洋红而非紫色 */
.character-card[data-accent='octavia'] {
  --c-accent-ring: linear-gradient(135deg, #a855f7, #6d28d9);
  --c-accent-glow: rgba(168, 85, 247, 0.4);
  --c-transform-on-bg: rgba(244, 114, 182, 0.18);
  --c-transform-on-border: rgba(244, 114, 182, 0.5);
  --c-transform-on-text: #f9a8d4;
}

.character-card[data-accent='nox'] {
  --c-accent-ring: linear-gradient(135deg, #f472b6, #be185d);
  --c-accent-glow: rgba(244, 114, 182, 0.4);
  --c-transform-on-bg: rgba(244, 114, 182, 0.18);
  --c-transform-on-border: rgba(244, 114, 182, 0.5);
  --c-transform-on-text: #f9a8d4;
}

summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  user-select: none;
}

summary::-webkit-details-marker {
  display: none;
}

summary::after {
  content: '▾';
  margin-left: auto;
  color: var(--c-text-muted);
  font-size: 12px;
  transition: transform 0.25s ease;
  flex-shrink: 0;
}

.character-card[open] summary::after {
  transform: rotate(180deg);
}

summary:hover {
  background: rgba(124, 58, 237, 0.08);
}

.avatar-meta {
  min-width: 0;
  flex: 1;
}

.avatar-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-serif);
  font-size: 15px;
  font-weight: 700;
  color: var(--c-text);
}

.rank-tag {
  display: inline-block;
  background: var(--c-accent-role-bg, rgba(124, 58, 237, 0.2));
  border: 1px solid var(--c-accent-role-border, rgba(124, 58, 237, 0.45));
  color: var(--c-accent-role-text, var(--c-primary-soft));
  border-radius: 999px;
  padding: 0 8px;
  font-size: 11px;
  font-family: var(--font-sans);
  font-weight: 500;
}

.rank-tag.is-enemy {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.22), rgba(253, 224, 71, 0.16));
  border-color: rgba(168, 85, 247, 0.5);
  color: #e9d5ff;
  padding: 1px 8px;
  font-size: 12px;
}

.avatar-thought {
  font-size: 12px;
  color: var(--c-accent-thought, var(--c-danger));
  font-style: italic;
  margin-top: 2px;
  word-break: break-all;
}

.card-body {
  padding: 0 12px 12px;
  border-top: 1px dashed var(--c-border);
}

.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding-top: 10px;
}

.anomaly {
  padding: 7px 10px;
  border-radius: 8px;
  background: var(--c-anomaly-surface);
  border-left: 3px solid var(--c-anomaly-border);
  color: var(--c-anomaly-text);
  font-size: 12.5px;
  line-height: 1.5;
  word-break: break-word;
}

@media (max-width: 520px) {
  .status-grid {
    grid-template-columns: 1fr;
  }
}
</style>
