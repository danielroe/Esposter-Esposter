<script setup lang="ts">
const { "primary-lighten-1": primaryLighten1 } = useColors();
</script>

<template>
  <v-app>
    <EsposterAppBar />
    <NuxtLoadingIndicator class="progress" :height="2" :color="primaryLighten1" />
    <NuxtTheme>
      <NuxtSEO>
        <NuxtPage />
      </NuxtSEO>
    </NuxtTheme>
    <VitePwaManifest />
  </v-app>
</template>

<style lang="scss">
// Only show scrollbar when content actually exceeds screen height
html {
  overflow-y: auto;
}

// Maintain height for line breaks as tiptap editor inserts empty <p> tag for newlines
p:empty::before {
  content: "";
  display: inline-block;
}

// Canvas by default is an inline element and can cause vertical scrollbar to appear
// https://stackoverflow.com/questions/37765215/canvas-dimensions-cause-a-vertical-scroll-bar-to-appear
canvas {
  display: block;
}

// Vue transition fade
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style scoped lang="scss">
.progress {
  top: $app-bar-height !important;
  box-shadow: 0 0 5px v-bind(primaryLighten1);
  // Put progress bar just above appbar which has z index of 1000
  // but below menus which have z index of 2000
  z-index: 1500 !important;
}
</style>
