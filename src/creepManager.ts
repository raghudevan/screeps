import { HarvesterManager } from "./harvesterManager";
import { UpgraderManager } from "./upgraderManager";
import { BuilderManager } from "./builderManager";
import { MaintainerManager } from "./maintainerManager";
import { AttackerManager } from "./attackerManager";

// Example Creep Management Module
// This demonstrates how to organize your Screeps code into modules

export class CreepManager {
  /**
   * Manage all creeps in the game
   */
  static run() {
    console.log(`Managing ${Object.keys(Game.creeps).length} creeps`);
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      console.log(
        `Running creep ${name} with role: ${creep.memory.role}, state: ${creep.memory.state}`
      );
      this.runCreep(creep);
    }
  }

  /**
   * Run logic for a single creep
   */
  static runCreep(creep: any) {
    // Initialize creep memory if needed
    if (!creep.memory.role) {
      creep.memory.role = "harvester";
      creep.memory.state = "harvesting";
      console.log(`Set role for ${creep.name} to harvester`);
    }

    // Initialize state if not set (role-specific defaults)
    if (!creep.memory.state) {
      switch (creep.memory.role) {
        case "attacker":
          creep.memory.state = "attacking";
          break;
        default:
          creep.memory.state = "harvesting";
          break;
      }
    }

    // Run role-specific logic
    switch (creep.memory.role) {
      case "harvester":
        HarvesterManager.run(creep);
        break;
      case "upgrader":
        UpgraderManager.run(creep);
        break;
      case "builder":
        BuilderManager.run(creep);
        break;
      case "maintainer":
        MaintainerManager.run(creep);
        break;
      case "attacker":
        AttackerManager.run(creep);
        break;
      default:
        console.log(`Unknown creep role: ${creep.memory.role}`);
    }
  }
}
