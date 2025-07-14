import {
  ERR_NOT_IN_RANGE,
  FIND_MY_SPAWNS,
  FIND_FLAGS,
  LOOK_STRUCTURES,
} from "./constants";
import { CreepUtilities } from "./utilities";

export class AttackerManager {
  static run(creep: any) {
    if (!creep.room) return;

    console.log(`${creep.name} attacker - state: ${creep.memory.state}`);

    // Initialize state if not set
    if (!creep.memory.state) {
      creep.memory.state = "attacking";
    }

    if (creep.memory.state === "attacking") {
      // Check if there are hostile creeps to attack first
      if (CreepUtilities.hasHostileCreeps(creep.room)) {
        // Find hostile creeps to attack
        const target = CreepUtilities.findHostileCreep(creep.room, creep);
        if (target) {
          const attackResult = CreepUtilities.attackTarget(creep, target);
          if (attackResult === ERR_NOT_IN_RANGE) {
            CreepUtilities.moveToTarget(creep, target, "#ff0000");
          }
        }
        return;
      }

      // Check for attack flags second
      const attackFlag = creep.room
        .find(FIND_FLAGS)
        .find((flag: any) => flag.name === "attack");

      if (attackFlag) {
        // Attack the structure at the flag position
        const lookResult = creep.room.lookAt(attackFlag.pos);
        const structures = lookResult.filter(
          (obj: any) => obj.type === LOOK_STRUCTURES
        );
        if (structures.length > 0) {
          const target = structures[0].structure;
          const attackResult = CreepUtilities.attackTarget(creep, target);
          if (attackResult === ERR_NOT_IN_RANGE) {
            CreepUtilities.moveToTarget(creep, target, "#ff0000");
          }
        } else {
          // No structure at flag position, move to flag
          CreepUtilities.moveToTarget(creep, attackFlag, "#ff0000");
        }
        return;
      }

      // No hostile creeps or attack flags, wait near spawn
      creep.memory.state = "waiting";
      console.log(`${creep.name} switching to waiting state (no targets)`);
    } else if (creep.memory.state === "waiting") {
      // Check if hostile creeps or attack flags have appeared
      if (CreepUtilities.hasHostileCreeps(creep.room)) {
        creep.memory.state = "attacking";
        console.log(
          `${creep.name} switching to attacking state (hostile creeps detected)`
        );
        return;
      }

      const attackFlag = creep.room
        .find(FIND_FLAGS)
        .find((flag: any) => flag.name === "attack");
      if (attackFlag) {
        creep.memory.state = "attacking";
        console.log(
          `${creep.name} switching to attacking state (attack flag detected)`
        );
        return;
      }

      // Wait near spawn for enemies
      const spawns = creep.room.find(FIND_MY_SPAWNS);
      if (spawns.length > 0) {
        const spawn = spawns[0];
        if (creep.pos.getRangeTo(spawn) > 3) {
          CreepUtilities.moveToTarget(creep, spawn, "#ffffff");
        }
      }
    }
  }
}
