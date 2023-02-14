import { useEmojiStore } from "@/store/chat/useEmojiStore";
import { useMessageStore } from "@/store/chat/useMessageStore";
import { useRoomStore } from "@/store/chat/useRoomStore";

export const useReadMessages = async () => {
  const { $client } = useNuxtApp();
  const roomStore = useRoomStore();
  const { currentRoomId } = $(storeToRefs(roomStore));
  const messageStore = useMessageStore();
  const { pushMessageList, updateMessageListNextCursor, initialiseMessageList } = messageStore;
  const { messageListNextCursor } = $(storeToRefs(messageStore));
  const emojiStore = useEmojiStore();
  const { pushEmojiMap } = emojiStore;
  const readMoreMessages = async (onComplete: () => void) => {
    try {
      if (!currentRoomId) return;

      const { messages, nextCursor } = await $client.message.readMessages.query({
        roomId: currentRoomId,
        cursor: messageListNextCursor,
      });
      pushMessageList(messages);
      updateMessageListNextCursor(nextCursor);

      const emojis = await $client.emoji.readEmojis.query({
        roomId: currentRoomId,
        messages: messages.map((m) => ({ rowKey: m.rowKey })),
      });
      pushEmojiMap(emojis);
    } finally {
      onComplete();
    }
  };

  if (currentRoomId) {
    const { messages, nextCursor } = await $client.message.readMessages.query({
      roomId: currentRoomId,
      cursor: null,
    });
    initialiseMessageList(messages);
    updateMessageListNextCursor(nextCursor);

    const emojis = await $client.emoji.readEmojis.query({
      roomId: currentRoomId,
      messages: messages.map((m) => ({ rowKey: m.rowKey })),
    });
    pushEmojiMap(emojis);
  }

  return { readMoreMessages };
};