<template>
  <blockquote v-if="text" class="thought">
    <span class="thought-quote">“</span>
    <span class="thought-text">{{ text }}</span>
  </blockquote>
</template>

<script setup lang="ts">
defineProps<{ text: string }>();
</script>

<style scoped>
.thought {
  position: relative;
  display: flex;
  gap: 5px;
  padding: 7px 10px 7px 12px;
  border-radius: var(--radius-card);
  background: linear-gradient(135deg, rgba(214, 154, 150, 0.14), rgba(142, 44, 63, 0.1));
  border: 1px solid rgba(214, 154, 150, 0.28);
  font-family: var(--font-serif);
  font-size: 13px;
  line-height: 1.68;
  color: #ecd8d3;
  font-style: italic;
}

.thought-quote {
  font-size: 21px;
  line-height: 1;
  color: rgba(214, 154, 150, 0.7);
  font-style: normal;
}

.thought-text {
  flex: 1;
}
</style>
