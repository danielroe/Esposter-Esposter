import { GameScene } from "@/models/dungeons/scenes/GameScene";
import { useGameStore } from "@/store/dungeons/game";
import { GridEngine } from "grid-engine";
import { AUTO, Game, Scale } from "phaser";

export const useLaunchGame = (containerId: string) => {
  const { surface } = useColors();
  const gameStore = useGameStore();
  const { phaserGame } = storeToRefs(gameStore);

  onMounted(() => {
    phaserGame.value = new Game({
      title: "Dungeons",
      type: AUTO,
      parent: containerId,
      mode: Scale.FIT,
      autoCenter: Scale.CENTER_BOTH,
      backgroundColor: surface.value,
      scene: GameScene,
      plugins: {
        scene: [
          {
            key: "gridEngine",
            plugin: GridEngine,
            mapping: "gridEngine",
          },
        ],
      },
      callbacks: {
        postBoot: (game) => {
          if (!game.canvas.parentElement) return;
          // From v3.15 onwards, you have to override Phaser's default styles
          game.canvas.parentElement.style.paddingTop = `-${game.canvas.style.marginTop}`;
        },
      },
    });
  });

  onUnmounted(() => {
    phaserGame.value?.destroy(false);
    phaserGame.value = null;
  });
};
