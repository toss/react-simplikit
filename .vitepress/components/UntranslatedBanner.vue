<script setup lang="ts">
import { useData } from 'vitepress';

import { untranslatedNoticeByLang } from '../locales.mts';

const { frontmatter, lang } = useData();
</script>

<template>
  <p v-if="frontmatter.untranslated === true" class="untranslated-banner">{{ untranslatedNoticeByLang[lang] }}</p>
</template>
