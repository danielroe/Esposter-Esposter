<script setup lang="ts">
import type { Card } from "@/models/visual/Card";

interface BaseCardProps {
  card: Card;
}

const { card } = defineProps<BaseCardProps>();
const { xs, sm } = useDisplay();
</script>

<template>
  <StyledCard
    :class="xs ? 'text-h6' : sm ? 'text-h5' : 'text-h4'"
    p-4
    min-height="200"
    flex="!"
    justify-center
    items-center
    text-center
    font="Montserrat!"
    font-bold
    break-word
  >
    {{ card.text }}
  </StyledCard>
</template>
