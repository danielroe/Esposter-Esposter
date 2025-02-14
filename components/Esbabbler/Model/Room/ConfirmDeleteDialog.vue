<script setup lang="ts">
import type { StyledDialogActivatorSlotProps } from "@/components/Styled/Dialog.vue";
import { useRoomStore } from "@/store/esbabbler/room";

interface RoomConfirmDeleteDialogProps {
  roomId: string;
  creatorId: string;
}

defineSlots<{
  default: (props: StyledDialogActivatorSlotProps & { tooltipProps: Record<string, unknown> }) => unknown;
}>();
const { roomId, creatorId } = defineProps<RoomConfirmDeleteDialogProps>();
const { $client } = useNuxtApp();
const { session } = useAuth();
const isCreator = computed(() => session.value?.user.id === creatorId);
const roomStore = useRoomStore();
const { deleteRoom } = roomStore;
</script>

<template>
  <StyledDeleteDialog
    :card-props="
      isCreator
        ? { title: 'Delete Room', text: 'Are you sure you want to delete this room?' }
        : { title: 'Leave Room', text: 'Are you sure you want to leave this room?' }
    "
    @delete="
      async (onComplete) => {
        try {
          deleteRoom(roomId);
          isCreator ? await $client.room.deleteRoom.mutate(roomId) : await $client.room.leaveRoom.mutate(roomId);
        } finally {
          onComplete();
        }
      }
    "
  >
    <template #activator="activatorProps">
      <v-tooltip :text="isCreator ? 'Delete Room' : 'Leave Room'">
        <template #activator="{ props: tooltipProps }">
          <slot :="{ ...activatorProps, tooltipProps }" />
        </template>
      </v-tooltip>
    </template>
  </StyledDeleteDialog>
</template>
