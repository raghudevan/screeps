import {
  WORK,
  CARRY,
  MOVE,
  OK,
  FIND_STRUCTURES,
  FIND_MY_SPAWNS,
  RESOURCE_ENERGY,
} from "./constants";

export class SpawnManager {
  /**
   * Calculate optimal body composition based on extension count
   */
  static getCreepBody(role: string, extensionCount: number): string[] {
    // Base composition for all roles
    let body: string[] = [];

    switch (role) {
      case "harvester":
        if (extensionCount === 0) {
          body = [WORK, CARRY, MOVE];
        } else if (extensionCount === 1) {
          body = [WORK, WORK, CARRY, MOVE];
        } else if (extensionCount >= 2) {
          body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        }
        break;

      case "upgrader":
        if (extensionCount === 0) {
          body = [WORK, CARRY, MOVE];
        } else if (extensionCount === 1) {
          body = [WORK, WORK, CARRY, MOVE];
        } else if (extensionCount >= 2) {
          body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        }
        break;

      case "builder":
        if (extensionCount === 0) {
          body = [WORK, CARRY, MOVE];
        } else if (extensionCount === 1) {
          body = [WORK, WORK, CARRY, MOVE];
        } else if (extensionCount >= 2) {
          body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        }
        break;

      default:
        body = [WORK, CARRY, MOVE];
    }

    return body;
  }

  /**
   * Manage all spawns in the game
   */
  static run() {
    console.log(`Managing ${Object.keys(Game.spawns).length} spawns`);

    // Count existing creeps by role
    const harvesters = Object.values(Game.creeps).filter(
      (creep) => creep.memory.role === "harvester"
    ).length;
    const upgraders = Object.values(Game.creeps).filter(
      (creep) => creep.memory.role === "upgrader"
    ).length;
    const builders = Object.values(Game.creeps).filter(
      (creep) => creep.memory.role === "builder"
    ).length;

    // Spawn logic
    for (const spawnName in Game.spawns) {
      const spawn = Game.spawns[spawnName];

      if (!spawn.spawning) {
        let creepToSpawn = null;

        // Priority: harvesters first, then upgraders, then builders
        if (harvesters < 2) {
          creepToSpawn = "harvester";
        } else if (upgraders < 2) {
          creepToSpawn = "upgrader";
        } else if (builders < 4) {
          creepToSpawn = "builder";
        }

        if (creepToSpawn) {
          const newName = `${creepToSpawn}_${Game.time}`;

          // Get extension count for this spawn's room
          const extensionCount = this.getExtensionCount(spawn.room);

          // Get optimal body composition
          const body = this.getCreepBody(creepToSpawn, extensionCount);

          const result = spawn.spawnCreep(body, newName, {
            memory: { role: creepToSpawn },
          });

          if (result === OK) {
            console.log(
              `Spawning new ${creepToSpawn}: ${newName} with body: ${body.join(
                ","
              )}`
            );
          } else {
            console.log(`Failed to spawn ${creepToSpawn}: ${result}`);
          }
        }
      }
    }
  }

  /**
   * Get the number of extensions in a room
   */
  static getExtensionCount(room: any): number {
    const extensions = room
      .find(FIND_STRUCTURES)
      .filter((structure: any) => structure.structureType === "extension");
    return extensions.length;
  }

  /**
   * Get the total energy capacity in a room
   */
  static getTotalEnergyCapacity(room: any): number {
    let totalCapacity = 0;

    // Count spawn energy capacity
    const spawns = room.find(FIND_MY_SPAWNS);
    for (const spawn of spawns) {
      totalCapacity += spawn.store.getCapacity(RESOURCE_ENERGY);
    }

    // Count extension energy capacity
    const extensions = room
      .find(FIND_STRUCTURES)
      .filter((structure: any) => structure.structureType === "extension");
    for (const extension of extensions) {
      totalCapacity += extension.store.getCapacity(RESOURCE_ENERGY);
    }

    return totalCapacity;
  }

  /**
   * Get the current energy in a room
   */
  static getCurrentEnergy(room: any): number {
    let currentEnergy = 0;

    // Count spawn energy
    const spawns = room.find(FIND_MY_SPAWNS);
    for (const spawn of spawns) {
      currentEnergy += spawn.store.getUsedCapacity(RESOURCE_ENERGY);
    }

    // Count extension energy
    const extensions = room
      .find(FIND_STRUCTURES)
      .filter((structure: any) => structure.structureType === "extension");
    for (const extension of extensions) {
      currentEnergy += extension.store.getUsedCapacity(RESOURCE_ENERGY);
    }

    return currentEnergy;
  }
}
