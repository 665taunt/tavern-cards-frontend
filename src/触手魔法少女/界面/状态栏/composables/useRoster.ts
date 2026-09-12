import { useDataStore } from '../store';
import { avatarUrl } from './useAssets';

/** 角色主题色键。刻意用稳定的角色标识而不是颜色名（技能规定配色变量禁止视觉描述命名）。 */
export type Accent = 'mia' | 'aya' | 'viola' | 'yocho' | 'cecilia' | 'octavia' | 'nox';

/** 两个页签的 id，与 class 后缀 / 数据页一一对应 */
export type TabId = 'girls' | 'enemies';

export interface CharacterMeta {
  name: string;
  /** 女主是称号，敌人是种属，都渲染在姓名右侧的小胶囊里 */
  rank: string;
  accent: Accent;
  avatar: string;
}

function meta(name: string, rank: string, accent: Accent): CharacterMeta {
  return { name, rank, accent, avatar: avatarUrl(accent) };
}

const GIRL_META: Record<string, CharacterMeta> = {
  米娅: meta('米娅', '白莲', 'mia'),
  星野绫: meta('星野绫', '绯星', 'aya'),
  白鸟薇奥拉: meta('白鸟薇奥拉', '银铃', 'viola'),
  夜蝶: meta('夜蝶', '变身形态', 'yocho'),
  塞西莉亚: meta('塞西莉亚', '妈妈', 'cecilia'),
};

const ENEMY_META: Record<string, CharacterMeta> = {
  奥克塔薇娅: meta('奥克塔薇娅', '章鱼型', 'octavia'),
  无月诺克斯: meta('无月诺克斯', '吸血姬型', 'nox'),
};

/** 这些写法都表示「名单为空」，不作为角色名处理 */
const EMPTY_NAMES = new Set(['', '无', '無', 'none', 'null', 'undefined', '暂无', '-']);

/**
 * 把 `系统.当前场景魔法少女` / `当前场景敌人` 这类逗号分隔名单切成名字数组。
 * 半角/全角逗号、顿号、分号、空白都当分隔符 —— 更新规则里出现过多种写法。
 */
export function splitNames(raw: unknown): string[] {
  if (typeof raw !== 'string') return [];
  return _(raw.split(/[,，、;；\s]+/))
    .map(s => s.trim())
    .filter(s => !EMPTY_NAMES.has(s.toLowerCase()))
    .uniq()
    .value();
}

export type RosterEntry =
  | { variant: 'girl'; meta: CharacterMeta; name: string }
  | { variant: 'enemy'; meta: CharacterMeta; name: string }
  /** 出现在名单里、但 schema 没有独立字段、却存在于「其他魔法少女」记录中的临时 NPC */
  | { variant: 'guest'; meta: CharacterMeta; name: string };

function resolveGirl(name: string): RosterEntry | null {
  const known = GIRL_META[name];
  if (known) return { variant: 'girl', meta: known, name };
  return null;
}

export function useRoster() {
  const store = useDataStore();

  const girls = computed<RosterEntry[]>(() =>
    splitNames(store.data.系统.当前场景魔法少女).flatMap(name => {
      const hit = resolveGirl(name);
      if (hit) return [hit];
      // 「其他魔法少女」是 schema 里唯一合法的临时 NPC 位置，字段集是固定的精简集
      if (_(store.data.其他魔法少女).has(name)) {
        return [{ variant: 'guest' as const, meta: meta(name, '临时', 'viola'), name }];
      }
      // 既不认识、也没有数据：不渲染任何东西，但要说明原因而不是静默吞掉。
      // （旧版纯 CSS 实现也是渲染不出东西，但它连原因都不告诉你。）
      console.warn(`[状态栏] 未知魔法少女「${name}」：schema 无独立字段、也不在「其他魔法少女」中，已跳过`);
      return [];
    }),
  );

  const enemies = computed<RosterEntry[]>(() =>
    splitNames(store.data.系统.当前场景敌人).flatMap(name => {
      const known = ENEMY_META[name];
      if (known) return [{ variant: 'enemy' as const, meta: known, name }];
      console.warn(`[状态栏] 未知敌人「${name}」：schema 无对应字段，已跳过`);
      return [];
    }),
  );

  const hasGirls = computed(() => girls.value.length > 0);
  const hasEnemies = computed(() => enemies.value.length > 0);

  return { store, girls, enemies, hasGirls, hasEnemies };
}
