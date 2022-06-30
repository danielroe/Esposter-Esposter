import { ChatRoom } from "@/components/Chat/types";
import { User } from "@/store/useUserStore";
import { defineStore } from "pinia";

export const useRoomStore = defineStore({
  id: "roomStore",
  state: () => ({
    currentRoomId: null as string | null,
    roomList: [] as ChatRoom[],
    membersMap: {} as Record<string, User[]>,
    messageInputMap: {} as Record<string, string>,
  }),
  getters: {
    title: (state) => {
      if (!state.currentRoomId) return "";

      const currentRoom = state.roomList.find((r) => r.id === state.currentRoomId);
      return currentRoom?.title ?? "";
    },
    members: (state) => {
      if (!state.currentRoomId || !state.membersMap[state.currentRoomId]) return [];
      return state.membersMap[state.currentRoomId];
    },
    messageInput: (state) => {
      if (!state.currentRoomId || !state.messageInputMap[state.currentRoomId]) return "";
      return state.messageInputMap[state.currentRoomId];
    },
  },
  actions: {
    updateMessageInput(newMessageInput: string) {
      if (!this.currentRoomId) return;
      this.messageInputMap[this.currentRoomId] = newMessageInput;
    },
    sendMessage() {
      this.updateMessageInput("");
    },
  },
});
