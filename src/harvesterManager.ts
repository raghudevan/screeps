import { ERR_NOT_IN_RANGE } from "./constants";
import { CreepUtilities } from "./utilities";

export class HarvesterManager {
  static run(creep: any) {
    if (!creep.room) {
      console.log(`${creep.name} has no room`);
      return;
    }

    console.log(
      `${
        creep.name
      } harvester - store: ${creep.store.getUsedCapacity()}/${creep.store.getCapacity()}, state: ${
        creep.memory.state
      }`
    );

    if (creep.memory.state === "harvesting") {
      if (creep.store.getFreeCapacity() === 0) {
        // Check if there are structures that need energy
        if (CreepUtilities.structuresNeedEnergy(creep.room)) {
          // Structures need energy, switch to delivering
          creep.memory.state = "delivering";
          console.log(`${creep.name} switching to delivering state`);
        } else {
          // No structures need energy, switch to upgrading
          creep.memory.state = "upgrading";
          console.log(
            `${creep.name} switching to upgrading state (no structures need energy)`
          );
        }
        return;
      }

      // Find sources and harvest
      const source = CreepUtilities.findSource(creep);
      console.log(`${creep.name} found source: ${source ? "yes" : "no"}`);
      if (source) {
        const harvestResult = CreepUtilities.harvestFromSource(creep, source);
        if (harvestResult === ERR_NOT_IN_RANGE) {
          CreepUtilities.moveToTarget(creep, source, "#ffaa00");
        }
      }
    } else if (creep.memory.state === "delivering") {
      if (creep.store.getUsedCapacity() === 0) {
        // Empty, switch back to harvesting
        creep.memory.state = "harvesting";
        console.log(`${creep.name} switching to harvesting state`);
        return;
      }

      // Check if there are structures that need energy
      if (!CreepUtilities.structuresNeedEnergy(creep.room)) {
        // No structures need energy, switch to upgrading
        creep.memory.state = "upgrading";
        console.log(
          `${creep.name} switching to upgrading state (no structures need energy while delivering)`
        );
        return;
      }

      // Find structures to transfer energy to
      console.log(`${creep.name} looking for structures to transfer to`);
      const structure = CreepUtilities.findStructureNeedingEnergy(creep.room);
      if (structure) {
        const transferResult = CreepUtilities.transferEnergyToStructure(
          creep,
          structure
        );
        if (transferResult === ERR_NOT_IN_RANGE) {
          CreepUtilities.moveToTarget(creep, structure, "#ffffff");
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
