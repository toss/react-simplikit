<script setup>
import { ref } from 'vue';
defineProps({
  leftTitle: String,
  rightTitle: String,
  widthPerSection: Number,
});

const content = ref(null);

function scrollTo(target) {
  if (target === 'left') {
    content.value.scrollTo({
      left: 0,
      behavior: 'smooth',
    });
  }

  if (target === 'right') {
    console.dir(content.value.children[1].offsetLeft);
    content.value.scrollTo({
      left: content.value.children[1].offsetLeft,
      behavior: 'smooth',
    });
  }
}
</script>
<template>
  <div class="split-view" :style="`--width-per-section: ${widthPerSection ?? 420}px`">
    <div ref="content" class="split-view-content">
      <div class="split-view-section">
        <button class="view-handle" @click="scrollTo('left')">{{ leftTitle }}</button>
        <slot name="left" />
      </div>
      <div class="split-view-section">
        <button class="view-handle" @click="scrollTo('right')">{{ rightTitle }}</button>
        <slot name="right" />
      </div>
      <div class="scroller-element" style="width: 50px; flex-shrink: 0; height: 100%" />
    </div>

    <div
      class="scroller-element rightside-gradient"
      style="position: absolute; top: 0; right: 0; width: 100px; height: 100%; z-index: 10"
    ></div>
  </div>
</template>
<style>
.split-view {
  position: relative;
}

.split-view-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 16px;
  flex-wrap: nowrap;
}

.split-view-section {
  width: 100%;
}

.scroller-element {
  display: none;
}

.rightside-gradient {
  background: linear-gradient(to right, rgba(255, 255, 255, 0), #ffffff);
}

.dark .rightside-gradient {
  background: linear-gradient(to right, rgba(27, 27, 31, 0), #1b1b1f);
}

.view-handle {
  display: none;
  position: sticky;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  margin-top: 12px;
}

@media (min-width: 640px) {
  .split-view {
    margin: 0;
  }

  .split-view-content {
    flex-direction: row;
    overflow-x: scroll;
  }

  .split-view-section {
    min-width: var(--width-per-section);
    width: fit-content;
    flex-shrink: 0;
  }

  .scroller-element {
    display: block;
  }

  .view-handle {
    display: block;
  }
}
</style>
