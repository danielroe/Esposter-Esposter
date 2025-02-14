import type { User } from "@/db/schema/users";
import { useRoomStore } from "@/store/esbabbler/room";

export const useMemberStore = defineStore("esbabbler/member", () => {
  const roomStore = useRoomStore();
  const { currentRoomId } = storeToRefs(roomStore);

  const membersMap = ref<Record<string, User[]>>({});
  const memberList = computed({
    get: () => {
      if (!currentRoomId.value || !membersMap.value[currentRoomId.value]) return [];
      return membersMap.value[currentRoomId.value];
    },
    set: (newMemberList) => {
      if (!currentRoomId.value) return;
      membersMap.value[currentRoomId.value] = newMemberList;
    },
  });
  const pushMemberList = (members: User[]) => {
    memberList.value.push(...members);
  };

  const initialiseMembersList = (members: User[]) => {
    memberList.value = members;
  };
  const createMember = (newMember: User) => {
    memberList.value.push(newMember);
  };
  const updateMember = (updatedMember: User) => {
    const index = memberList.value.findIndex((m) => m.id === updatedMember.id);
    if (index > -1) memberList.value[index] = { ...memberList.value[index], ...updatedMember };
  };

  return {
    memberList,
    pushMemberList,
    initialiseMembersList,
    createMember,
    updateMember,
  };
});
