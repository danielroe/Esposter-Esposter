<script setup lang="ts">
import type { FileRendererProps } from "@/models/esbabbler/file/FileRendererProps";
import { TypeRendererMap } from "@/models/esbabbler/file/TypeRendererMap";
import { getLanguageForFileUrl } from "@/services/file/code";
import type { Component } from "vue";

const { url, mimetype } = defineProps<FileRendererProps>();
const defaultRenderer = defineAsyncComponent(() => import("@/components/Esbabbler/FileRenderer/Default.vue"));
const rendererProps = ref<FileRendererProps & Record<string, string>>({ url, mimetype });
const renderer = computed<Component>(() => {
  const result =
    TypeRendererMap[mimetype] || TypeRendererMap[mimetype.substring(0, mimetype.indexOf("/"))] || defaultRenderer;
  if (result !== defaultRenderer) return result;

  const language = getLanguageForFileUrl(url);
  if (!language) return result;

  rendererProps.value.language = language;
  return defineAsyncComponent(() => import("@/components/Esbabbler/FileRenderer/Code.vue"));
});
</script>

<template>
  <component :is="renderer" :="rendererProps" />
</template>
