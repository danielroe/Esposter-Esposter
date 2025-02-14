<script setup lang="ts">
import { SITE_NAME } from "@/services/esposter/constants";
import { toTitleCase } from "@/util/text";
import type { BuiltInProviderType } from "@auth/core/providers";
import type { Component, CSSProperties } from "vue";

interface ProviderProps {
  provider: BuiltInProviderType;
  logo: Component;
  logoStyle?: CSSProperties;
  logoAttrs?: Record<string, unknown>;
  buttonStyle?: CSSProperties;
}

definePageMeta({ middleware: "guest-only" });

const { signIn } = useAuth();
const providerProps = ref<ProviderProps[]>([
  {
    provider: "google",
    logo: markRaw(defineAsyncComponent(() => import(`@/components/Visual/Logo/Google.vue`))),
    logoStyle: {
      padding: ".625rem",
      width: "3rem",
      height: "3rem",
      backgroundColor: "#fff",
      borderRadius: "4px 0 0 4px",
    },
    buttonStyle: { paddingLeft: "0", backgroundColor: "#4285f4" },
  },
  {
    provider: "github",
    logo: markRaw(defineAsyncComponent(() => import(`@/components/Visual/Logo/Github.vue`))),
    logoAttrs: { fill: "#fff" },
    buttonStyle: { backgroundColor: "#252525" },
  },
  {
    provider: "facebook",
    logo: markRaw(defineAsyncComponent(() => import(`@/components/Visual/Logo/Facebook.vue`))),
    buttonStyle: { backgroundColor: "#1877f2" },
  },
]);
</script>

<template>
  <NuxtLayout>
    <template #left>
      <EsposterProductList />
    </template>
    <v-container h-full flex justify-center items-center>
      <StyledCard width="100%" max-width="500">
        <v-container>
          <div class="text-h5" mb-1 text-center>Sign in to</div>
          <div mb-2 flex justify-center items-center>
            <EsposterLogo />
            <span class="text-h6" pl-2>{{ SITE_NAME }}</span>
          </div>
          <div mb-2 text-center>Login and start taking rides with {{ SITE_NAME }}!</div>
          <template v-for="{ provider, logo, logoStyle, logoAttrs, buttonStyle } in providerProps" :key="provider">
            <button
              class="button"
              :style="{ ...buttonStyle }"
              mb-3
              pl-2
              w-full
              h-12
              flex
              items-center
              rd
              @click="signIn(provider)"
            >
              <component :is="logo" :style="{ ...logoStyle }" w-8 :="{ ...logoAttrs }" />
              <span class="text-#fff" mx-auto font-bold>{{ toTitleCase(provider) }}</span>
            </button>
          </template>
        </v-container>
      </StyledCard>
    </v-container>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.button {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  transition:
    box-shadow 0.2s,
    transform 0.2s;

  &:hover {
    box-shadow: 0 2px 10px 2px rgba(0, 0, 0, 0.35);
    transform: translateY(-3px);
  }
}
</style>
