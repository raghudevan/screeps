import { ERR_NOT_IN_RANGE } from "./constants";
import { CreepUtilities } from "./utilities";

export class UpgraderManager {
  static run(creep: any) {
    if (!creep.room) return;

    console.log(
      `${
        creep.name
      } upgrader - store: ${creep.store.getUsedCapacity()}/${creep.store.getCapacity()}, state: ${
        creep.memory.state
      }`
    );

    if (creep.memory.state === "harvesting") {
      if (creep.store.getFreeCapacity() === 0) {
        // Full, switch to upgrading
        creep.memory.state = "upgrading";
        console.log(`${creep.name} switching to upgrading state`);
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
