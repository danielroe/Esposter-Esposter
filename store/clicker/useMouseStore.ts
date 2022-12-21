import { applyMouseUpgrades } from "@/services/clicker";
import { useGameStore } from "@/store/clicker/useGameStore";
import { defineStore } from "pinia";

export const useMouseStore = defineStore("clicker/mouse", () => {
  const gameStore = useGameStore();
  const mousePower = computed(() => {
    if (!gameStore.game) return 0;
    return applyMouseUpgrades(1, gameStore.game.boughtUpgrades);
  });
  return { mousePower };
});
