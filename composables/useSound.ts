import type { HowlOptions } from "howler";
import { Howl } from "howler";

const cache: Record<string, Howl | null> = {};

export const useSound = (
  url: MaybeRef<string>,
  {
    volume = 1,
    playbackRate = 1,
    soundEnabled = true,
    interrupt = false,
    autoplay = false,
    onload,
    ...rest
  }: ComposableOptions = {},
) => {
  const sound = ref<Howl | null>(null);
  const duration = ref<number | null>(null);
  const isPlaying = ref<boolean>(false);

  function handleLoad(this: ComposableOptions) {
    if (typeof onload === "function") onload.call(this);

    duration.value = (duration.value || sound.value?.duration() || 0) * 1000;

    if (autoplay === true) isPlaying.value = true;
  }

  onMounted(async () => {
    const src = unref(url);
    let howl = cache[src];
    if (howl) {
      sound.value = howl;
      return;
    }

    howl = new Howl({
      src,
      volume: unref(volume),
      rate: unref(playbackRate),
      onload: handleLoad,
      ...rest,
    });
    cache[src] = sound.value = howl;
  });

  watch(
    () => unref(url),
    ([src]) => {
      let howl = cache[src];
      if (howl) {
        sound.value = howl;
        return;
      }

      howl = new Howl({
        src,
        volume: unref(volume),
        rate: unref(playbackRate),
        onload: handleLoad,
        ...rest,
      });
      cache[src] = sound.value = howl;
    },
  );

  watch(
    () => [unref(volume), unref(playbackRate)],
    ([newVolume, newPlaybackRate]) => {
      if (!sound.value) return;

      sound.value.volume(newVolume);
      sound.value.rate(newPlaybackRate);
    },
  );

  const play = (options: PlayOptions = {}) => {
    if (!sound.value || !(soundEnabled || options.forceSoundEnabled)) return;

    if (interrupt) sound.value.stop();

    if (options.playbackRate) sound.value.rate(options.playbackRate);

    sound.value.play(options.id);

    sound.value.once("end", () => {
      if (sound.value && !sound.value.playing()) isPlaying.value = false;
    });

    isPlaying.value = true;
  };

  const stop = (id?: number) => {
    if (!sound.value) return;

    sound.value.stop(id);

    isPlaying.value = false;
  };

  const pause = (id?: number) => {
    if (!sound.value) return;

    sound.value.pause(id);

    isPlaying.value = false;
  };

  return {
    sound,
    duration,
    isPlaying,
    play,
    pause,
    stop,
  };
};

interface PlayOptions {
  id?: number;
  forceSoundEnabled?: boolean;
  playbackRate?: number;
}

interface SpriteMap {
  [key: string]: [number, number];
}

type ComposableOptions = {
  volume?: MaybeRef<number>;
  playbackRate?: MaybeRef<number>;
  interrupt?: boolean;
  soundEnabled?: boolean;
  autoplay?: boolean;
  sprite?: SpriteMap;
  onload?: () => void;
} & Omit<HowlOptions, "src" | "onload">;
