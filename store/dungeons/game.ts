import { Game } from "@/models/dungeons/Game";
import { DUNGEONS_STORE } from "@/services/dungeons/constants";

export const useGameStore = defineStore("dungeons/game", () => {
  const { $client } = useNuxtApp();
  const { status } = useAuth();
  const game = ref(new Game());
  const saveGame = async () => {
    if (status.value === "authenticated") await $client.dungeons.saveGame.mutate(game.value);
    else if (status.value === "unauthenticated") localStorage.setItem(DUNGEONS_STORE, game.value.toJSON());
  };
  return { game, saveGame };
});
