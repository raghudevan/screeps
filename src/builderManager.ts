import { ERR_NOT_IN_RANGE } from "./constants";
import { CreepUtilities } from "./utilities";

export class BuilderManager {
  static run(creep: any) {
    if (!creep.room) return;

    console.log(
      `${
        creep.name
      } builder - store: ${creep.store.getUsedCapacity()}/${creep.store.getCapacity()}, state: ${
        creep.memory.state
      }`
    );

    if (creep.memory.state === "harvesting") {
      if (creep.store.getFreeCapacity() === 0) {
        // Check if there are construction sites to build
        if (CreepUtilities.hasConstructionSites(creep.room)) {
          // Construction sites exist, switch to building
          creep.memory.state = "building";
          console.log(`${creep.name} switching to building state`);
        } else {
          // No construction sites, switch to upgrading
          creep.memory.state = "upgrading";
          console.log(
            `${creep.name} switching to upgrading state (no construction sites)`
          );
        }
        return;
      }

      // Find sources and harvest
      const source = CreepUtilities.findSource(creep);
      if (source) {
        const harvestResult = CreepUtilities.harvestFromSource(creep, source);
        if (harvestResult === ERR_NOT_IN_RANGE) {
          CreepUtilities.moveToTarget(creep, source, "#ffaa00");
        }
      }
    } else if (creep.memory.state === "building") {
      if (creep.store.getUsedCapacity() === 0) {
        // Empty, switch back to harvesting
        creep.memory.state = "harvesting";
        console.log(`${creep.name} switching to harvesting state`);
        return;
      }

      // Check if there are still construction sites to build
      if (!CreepUtilities.hasConstructionSites(creep.room)) {
        // No construction sites left, switch to upgrading
        creep.memory.state = "upgrading";
        console.log(
          `${creep.name} switching to upgrading state (no construction sites while building)`
        );
        return;
      }

      // Find construction sites to build
      const site = CreepUtilities.findConstructionSite(creep.room, creep);
      if (site) {
        const buildResult = CreepUtilities.buildConstructionSite(creep, site);
        if (buildResult === ERR_NOT_IN_RANGE) {
          CreepUtilities.moveToTarget(creep, site, "#ffffff");
        }
      }
    } else if (creep.memory.state === "upgrading") {
      if (creep.store.getUsedCapacity() === 0) {
        // Empty, switch back to harvesting
        creep.memory.state = "harvesting";
        console.log(`${creep.name} switching to harvesting state`);
        return;
      }

      // Upgrade controller
      if (creep.room.controller) {
        const upgradeResult = CreepUtilities.upgradeController(
          creep,
          creep.room.controller
        );
        if (upgradeResult === ERR_NOT_IN_RANGE) {
          CreepUtilities.moveToTarget(creep, creep.room.controller, "#ffffff");
        }
      }
    }
  }
}
