<script setup lang="ts">
defineProps<{
  name?: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  description: string;
  nested?: Array<{
    name: string;
    type: string;
    defaultValue?: string;
    description: string;
  }>;
}>();
</script>

<template>
  <ul class="post-parameters-ul">
    <li class="post-parameters-li post-parameters-li-root">
      <template v-if="name != null">
        <span class="post-parameters--name">{{ name }}</span>
      </template>
      <template v-if="Boolean(required)"> <span class="post-parameters--required">required</span> · </template>
      <span class="post-parameters--type">{{ type }}</span>
      <template v-if="defaultValue != null">
        · <span class="post-parameters--default">{{ defaultValue }}</span>
      </template>
      <br />
      <p class="post-parameters--description" v-html="description" />
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
            <p class="post-parameters--description" v-html="n.description" />
          </li>
        </ul>
      </template>
    </li>
  </ul>
</template>
