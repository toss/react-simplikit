<script setup lang="ts">
defineProps<{
  widthPerSection?: number;
}>();
</script>
<template>
  <div class="split-view" :style="`--width-per-section: ${widthPerSection ?? 420}px`">
    <div class="split-view-content">
      <div class="split-view-section">
        <slot name="left" />
      </div>
      <div class="split-view-section">
        <slot name="right" />
      </div>
      <div class="scroller-element" style="width: 100px; flex-shrink: 0; height: 100%" />
    </div>

    <div
      class="scroller-element"
      style="
        position: absolute;
        top: 0;
        right: 0;
        width: 100px;
        height: 100%;
        background: linear-gradient(to right, rgba(255, 255, 255, 0), #ffffff);
        z-index: 10;
      "
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

@media (min-width: 640px) {
  .split-view {
    margin: 0;
  }

  .split-view-content {
    flex-direction: row;
    overflow-x: scroll;
  }

  .split-view-section {
    width: var(--width-per-section);
    flex-shrink: 0;
  }

  .scroller-element {
    display: block;
  }
}
</style>
