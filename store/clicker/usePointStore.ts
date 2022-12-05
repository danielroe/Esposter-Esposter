import { useGameStore } from "@/store/clicker/useGameStore";
import { defineStore } from "pinia";

export const usePointStore = defineStore("clicker/point", () => {
  const gameStore = useGameStore();
  const incrementPoints = (points: number) => {
    if (!gameStore.game) return;
    gameStore.game.noPoints += points;
    gameStore.saveGame();
  };
  const decrementPoints = (points: number) => {
    if (!gameStore.game) return;
    gameStore.game.noPoints -= points;
    gameStore.saveGame();
  };
  return { incrementPoints, decrementPoints };
});