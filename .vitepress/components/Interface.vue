<script setup lang="ts">
const props = defineProps(['name', 'type', 'required', 'defaultValue', 'description', 'nested']);
</script>

<template>
  <ul class="post-parameters-ul">
    <li class="post-parameters-li post-parameters-li-root">
      <span class="post-parameters--name">{{ name }}</span>
      <template v-if="Boolean(required)"> <span class="post-parameters--required">required</span> · </template>
      <span class="post-parameters--type">{{ type }}</span>
      <template v-if="defaultValue != null">
        · <span class="post-parameters--default">{{ defaultValue }}</span>
      </template>
      <br />
      <p class="post-parameters--description">
        {{ description }}
      </p>
      <template v-if="nested">
        <ul class="post-parameters-ul">
          <li class="post-parameters-li" v-for="n in nested" :key="n.name">
            ·
            <span class="post-parameters--name">{{ n.name }}</span>
            <span class="post-parameters--type">{{ n.type }}</span>
            <template v-if="n.defaultValue != null">
              · <span class="post-parameters--default">{{ n.defaultValue }}</span>
            </template>
            <br />
            <p class="post-parameters--description">
              {{ n.description }}
            </p>
          </li>
        </ul>
      </template>
    </li>
  </ul>
</template>
