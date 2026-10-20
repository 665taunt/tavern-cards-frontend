<template>
  <section class="attire">
    <header class="attire-head">
      <span class="attire-title">今日穿着</span>
      <span class="attire-hint">{{ activeSlot ? '再点一次收起' : '点一件看成衣上的改动' }}</span>
    </header>

    <div class="attire-row">
      <button
        v-for="slot in ATTIRE_SLOTS"
        :key="slot"
        type="button"
        class="attire-chip"
        :class="{ 'is-open': activeSlot === slot, 'is-flagged': isFlagged(slot) }"
        :aria-expanded="activeSlot === slot"
        @click="toggle(slot)"
      >
        <span class="attire-label">{{ slot }}</span>
        <span class="attire-value">{{ valueOf(slot) || '—' }}</span>
      </button>
    </div>

    <Transition name="attire-card">
      <div v-if="activeSlot" class="attire-card">
        <div class="attire-card-top">
          <span class="attire-card-slot">{{ activeSlot }}</span>
          <span class="attire-card-value">{{ valueOf(activeSlot) || '—' }}</span>
        </div>
        <p class="attire-card-line">
          <span class="attire-card-key">成衣上的改动</span>
          {{ noteOf(activeSlot) }}
        </p>
        <p v-if="clothingHint" class="attire-card-line is-warn">
          <span class="attire-card-key">便意 {{ desireLevel }} 阶</span>
          {{ clothingHint }}
        </p>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { ATTIRE_NOTES, ATTIRE_SLOTS, DESIRE_CLOTHING_HINTS, type AttireSlot } from '../composables/useLore';

const props = withDefaults(
  defineProps<{
    outfit: Record<string, string>;
    character: string;
    desireLevel?: number;
  }>(),
  { desireLevel: 0 },
);

const activeSlot = ref<AttireSlot | ''>('');

// 便意到三阶以上，衣服上「为排出留的那一手」才开始碍事
const clothingHint = computed(() => {
  if (props.desireLevel < 3) return '';
  return DESIRE_CLOTHING_HINTS[props.character] ?? '';
});

function valueOf(slot: AttireSlot): string {
  return props.outfit?.[slot] ?? '';
}

function noteOf(slot: AttireSlot): string {
  return ATTIRE_NOTES[props.character]?.[slot] ?? '这件没写改动';
}

/** 便意高时，最要紧的那两件点一个小灯 */
function isFlagged(slot: AttireSlot): boolean {
  return props.desireLevel >= 3 && (slot === '下装' || slot === '袜子');
}

function toggle(slot: AttireSlot) {
  activeSlot.value = activeSlot.value === slot ? '' : slot;
}
</script>

<style scoped>
.attire {
  display: grid;
  gap: 6px;
}

.attire-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 13px;
  letter-spacing: 0.06em;
}

.attire-title {
  color: var(--c-text-muted);
}

.attire-hint {
  margin-left: auto;
  font-size: 11px;
  color: var(--c-text-faint);
}

.attire-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 6px;
}

.attire-chip {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  max-width: 100%;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: var(--c-text-muted);
  font-family: var(--font-sans);
  font-size: 12px;
  cursor: pointer;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.attire-chip:hover {
  transform: translateY(-1px);
  border-color: var(--c-border-strong);
}

.attire-chip.is-open {
  background: linear-gradient(180deg, rgba(242, 168, 112, 0.26), rgba(242, 168, 112, 0.1));
  border-color: var(--c-border-strong);
  color: #fdece0;
  box-shadow:
    0 0 10px rgba(242, 168, 112, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.attire-chip.is-flagged::after {
  content: '';
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #f2a870;
  box-shadow: 0 0 6px rgba(242, 168, 112, 0.9);
  align-self: center;
}

.attire-label {
  color: var(--c-text-faint);
  letter-spacing: 0.06em;
  flex: none;
}

.attire-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.attire-card {
  display: grid;
  gap: 5px;
  padding: 8px 10px;
  border-radius: var(--radius-card);
  background: linear-gradient(135deg, rgba(242, 168, 112, 0.12), rgba(142, 44, 63, 0.1));
  border: 1px solid rgba(242, 168, 112, 0.3);
}

.attire-card-top {
  display: flex;
  align-items: baseline;
  gap: 7px;
}

.attire-card-slot {
  font-family: var(--font-serif);
  font-size: 13px;
  color: var(--c-primary-soft);
  letter-spacing: 0.08em;
}

.attire-card-value {
  margin-left: auto;
  font-size: 12px;
  color: var(--c-text);
}

.attire-card-line {
  display: flex;
  gap: 6px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--c-text-muted);
}

.attire-card-line.is-warn {
  color: #f0c7c4;
}

.attire-card-key {
  flex: none;
  color: var(--c-text-faint);
  letter-spacing: 0.06em;
}

.attire-card-enter-active,
.attire-card-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.attire-card-enter-from,
.attire-card-leave-to {
  opacity: 0;
  transform: translateY(-3px) scaleY(0.96);
}
</style>
