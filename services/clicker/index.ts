import type { BuildingWithStats, Upgrade } from "@/models/clicker";
import { UpgradeTarget, UpgradeType } from "@/models/clicker";

export const applyBuildingUpgrades = (
  basePower: number,
  boughtUpgrades: Upgrade[],
  boughtBuildings: BuildingWithStats[]
) => {
  let resultPower = basePower;
  for (const boughtBuilding of boughtBuildings) {
    const buildingUpgrades = boughtUpgrades.filter((u) => u.upgradeTargets.includes(boughtBuilding.name));
    resultPower += applyUpgrades(boughtBuilding.baseValue * boughtBuilding.level, buildingUpgrades, boughtBuildings);
  }
  return resultPower;
};

export const applyMouseUpgrades = (basePower: number, boughtUpgrades: Upgrade[]) => {
  const mouseUpgrades = boughtUpgrades.filter((u) => u.upgradeTargets.includes(UpgradeTarget.Mouse));
  return applyUpgrades(basePower, mouseUpgrades);
};

const applyAdditiveUpgrades = (basePower: number, upgrades: Upgrade[]) => {
  let resultPower = basePower;

  const additiveUpgrades = upgrades.filter((u) => u.upgradeConfiguration.upgradeType === UpgradeType.Additive);
  for (const additiveUpgrade of additiveUpgrades) resultPower += additiveUpgrade.value;

  return resultPower;
};

const applyMultiplicativeUpgrades = (basePower: number, upgrades: Upgrade[]) => {
  let resultPower = basePower;

  const multiplicativeUpgrades = upgrades.filter(
    (u) => u.upgradeConfiguration.upgradeType === UpgradeType.Multiplicative
  );
  for (const multiplicativeUpgrade of multiplicativeUpgrades) resultPower *= multiplicativeUpgrade.value;

  return resultPower;
};

const applyBuildingAdditiveUpgrades = (
  basePower: number,
  upgrades: Upgrade[],
  boughtBuildings: BuildingWithStats[] = []
) => {
  let resultPower = basePower;

  const buildingAdditiveUpgrades = upgrades.filter(
    (u) => u.upgradeConfiguration.upgradeType === UpgradeType.BuildingAdditive
  );
  for (const buildingAdditiveUpgrade of buildingAdditiveUpgrades) {
    for (const affectedUpgradeTarget of buildingAdditiveUpgrade.upgradeConfiguration.affectedUpgradeTargets ?? []) {
      const foundBuilding = boughtBuildings.find((b) => b.name === affectedUpgradeTarget);
      if (!foundBuilding) break;

      resultPower += buildingAdditiveUpgrade.value * foundBuilding.level;
    }
  }

  return resultPower;
};

const applyBuildingAdditiveNorUpgrades = (
  basePower: number,
  upgrades: Upgrade[],
  boughtBuildings: BuildingWithStats[] = []
) => {
  let resultPower = basePower;

  const buildingAdditiveNorUpgrades = upgrades.filter(
    (u) => u.upgradeConfiguration.upgradeType === UpgradeType.BuildingAdditive
  );
  for (const buildingAdditiveNorUpgrade of buildingAdditiveNorUpgrades) {
    const affectedUpgradeTargets = buildingAdditiveNorUpgrade.upgradeConfiguration.affectedUpgradeTargets ?? [];

    for (const boughtBuilding of boughtBuildings) {
      if (!affectedUpgradeTargets.includes(boughtBuilding.name))
        resultPower += buildingAdditiveNorUpgrade.value * boughtBuilding.level;
    }
  }

  return resultPower;
};

// Apply all upgrade multipliers to their specified upgrades
const applyUpgradeMultiplierUpgrades = (upgrades: Upgrade[]) => {
  const resultBoughtUpgrades: Upgrade[] = [];

  for (const boughtUpgrade of upgrades) {
    let resultPower = boughtUpgrade.value;

    const upgradeMultiplierUpgrades = upgrades.filter(
      (u) =>
        u.upgradeConfiguration.upgradeType === UpgradeType.UpgradeMultiplier &&
        u.upgradeTargets.includes(boughtUpgrade.name)
    );
    for (const upgradeMultiplierUpgrade of upgradeMultiplierUpgrades) resultPower *= upgradeMultiplierUpgrade.value;

    resultBoughtUpgrades.push({ ...boughtUpgrade, value: resultPower });
  }

  return resultBoughtUpgrades;
};

export const applyUpgrades = (basePower: number, upgrades: Upgrade[], boughtBuildings: BuildingWithStats[] = []) => {
  let resultUpgrades = upgrades;
  resultUpgrades = applyUpgradeMultiplierUpgrades(resultUpgrades);

  let resultPower = basePower;
  resultPower = applyAdditiveUpgrades(resultPower, resultUpgrades);
  resultPower = applyMultiplicativeUpgrades(resultPower, resultUpgrades);
  resultPower = applyBuildingAdditiveUpgrades(resultPower, resultUpgrades, boughtBuildings);
  resultPower = applyBuildingAdditiveNorUpgrades(resultPower, resultUpgrades, boughtBuildings);
  return resultPower;
};
