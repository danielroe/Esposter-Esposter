<script setup lang="ts">
import { useRoomStore } from "@/store/esbabbler/room";

const { $client } = useNuxtApp();
const roomStore = useRoomStore();
const { updateRoom } = roomStore;
const { currentRoomId, currentRoomName } = storeToRefs(roomStore);
const editedRoomName = ref(currentRoomName.value);
const isUpdateMode = ref(false);
const titleRef = ref<HTMLDivElement>();
const titleHovered = ref(false);
const onUpdateRoom = async () => {
  try {
    if (!currentRoomId.value || !editedRoomName.value || editedRoomName.value === currentRoomName.value) return;

    const updatedRoom = await $client.room.updateRoom.mutate({
      id: currentRoomId.value,
      name: editedRoomName.value,
    });
    updateRoom(updatedRoom);
  } finally {
    isUpdateMode.value = false;
    editedRoomName.value = currentRoomName.value;
  }
};

onClickOutside(titleRef, async () => {
  if (isUpdateMode) await onUpdateRoom();
});
</script>

<template>
  <div
    ref="titleRef"
    px-1
    flex
    items-center
    :w="isUpdateMode ? 'full' : ''"
    :b="!isUpdateMode && titleHovered ? '1 solid rd' : '1 solid transparent rd'"
    @mouseenter="titleHovered = true"
    @mouseleave="titleHovered = false"
  >
    <v-text-field
      v-if="isUpdateMode"
      v-model="editedRoomName"
      font-bold
      text-xl
      density="compact"
      hide-details
      autofocus
      @keydown.enter="onUpdateRoom"
    />
    <v-toolbar-title v-else font-bold="!" select="all" @click="isUpdateMode = true">
      {{ currentRoomName }}
    </v-toolbar-title>
  </div>
</template>
