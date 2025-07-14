import { ERR_NOT_IN_RANGE } from "./constants";
import { CreepUtilities } from "./utilities";

export class MaintainerManager {
  static run(creep: any) {
    if (!creep.room) return;

    console.log(
      `${
        creep.name
      } maintainer - store: ${creep.store.getUsedCapacity()}/${creep.store.getCapacity()}, state: ${
        creep.memory.state
      }`
    );

    if (creep.memory.state === "harvesting") {
      if (creep.store.getFreeCapacity() === 0) {
        // Check if there are structures that need repair
        if (CreepUtilities.hasStructuresNeedingRepair(creep.room)) {
          // Structures need repair, switch to repairing
          creep.memory.state = "repairing";
          console.log(`${creep.name} switching to repairing state`);
        } else {
          // No structures need repair, switch to upgrading
          creep.memory.state = "upgrading";
          console.log(
            `${creep.name} switching to upgrading state (no structures need repair)`
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
    } else if (creep.memory.state === "repairing") {
      if (creep.store.getUsedCapacity() === 0) {
        // Empty, switch back to harvesting
        creep.memory.state = "harvesting";
        console.log(`${creep.name} switching to harvesting state`);
        return;
      }

      // Check if there are still structures that need repair
      if (!CreepUtilities.hasStructuresNeedingRepair(creep.room)) {
        // No structures need repair, switch to upgrading
        creep.memory.state = "upgrading";
        console.log(
          `${creep.name} switching to upgrading state (no structures need repair while repairing)`
        );
        return;
      }

      // Find structures to repair
      const structure = CreepUtilities.findStructureNeedingRepair(
        creep.room,
        creep
      );
      if (structure) {
        const repairResult = CreepUtilities.repairStructure(creep, structure);
        if (repairResult === ERR_NOT_IN_RANGE) {
          CreepUtilities.moveToTarget(creep, structure, "#ff0000");
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
