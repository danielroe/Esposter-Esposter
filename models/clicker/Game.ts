import type { BuildingWithStats } from "@/models/clicker/BuildingWithStats";
import { buildingWithStatsSchema } from "@/models/clicker/BuildingWithStats";
import type { Upgrade } from "@/models/clicker/Upgrade";
import { createUpgradeSchema } from "@/models/clicker/Upgrade";
import { upgradeNameSchema } from "@/models/clicker/UpgradeName";
import { ApplyItemMetadataMixin, itemMetadataSchema } from "@/models/shared/ItemMetadata";
import { z } from "zod";

class BaseGame {
  id = crypto.randomUUID() as string;
  noPoints = 0;
  boughtUpgrades: Upgrade[] = [];
  boughtBuildings: BuildingWithStats[] = [];

  constructor(init?: Partial<BaseGame>) {
    Object.assign(this, init);
  }

  toJSON() {
    return JSON.stringify({ ...this });
  }
}

export type Game = typeof Game.prototype;
export const Game = ApplyItemMetadataMixin(BaseGame);

export const gameSchema = itemMetadataSchema.merge(
  z.object({
    id: z.string().uuid(),
    noPoints: z.number(),
    boughtUpgrades: z.array(createUpgradeSchema(upgradeNameSchema)),
    boughtBuildings: z.array(buildingWithStatsSchema),
  }),
) satisfies z.ZodType<Omit<Game, "toJSON">>;
