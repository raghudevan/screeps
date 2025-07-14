import {
  WORK,
  CARRY,
  MOVE,
  OK,
  FIND_STRUCTURES,
  FIND_MY_SPAWNS,
  RESOURCE_ENERGY,
  ATTACK,
  ERR_NOT_ENOUGH_ENERGY,
  ERR_BUSY,
  ERR_INVALID_ARGS,
} from "./constants";

export class SpawnManager {
  /**
   * Calculate optimal body composition based on extension count and available energy
   */
  static getCreepBody(
    role: string,
    extensionCount: number,
    availableEnergy?: number
  ): string[] {
    // Base composition for all roles
    let body: string[] = [];

    switch (role) {
      case "harvester":
        // Calculate maximum affordable body based on available energy
        let maxEnergy = availableEnergy || 300; // Default to 300 if not specified

        if (extensionCount === 0) {
          // Basic harvester: 50 energy
          body = [WORK, CARRY, MOVE];
        } else if (extensionCount === 1) {
          // Enhanced harvester: 100 energy
          if (maxEnergy >= 100) {
            body = [WORK, WORK, CARRY, MOVE];
          } else {
            body = [WORK, CARRY, MOVE];
          }
        } else if (extensionCount >= 2) {
          // Advanced harvester: 150 energy
          if (maxEnergy >= 400) {
            body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
          } else if (maxEnergy >= 300) {
            body = [WORK, WORK, CARRY, MOVE];
          } else {
            body = [WORK, CARRY, MOVE];
          }
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

      case "maintainer":
        if (extensionCount === 0) {
          body = [WORK, CARRY, MOVE];
        } else if (extensionCount === 1) {
          body = [WORK, WORK, CARRY, MOVE];
        } else if (extensionCount >= 2) {
          body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        }
        break;

      case "attacker":
        // Attackers always have 4x MOVE, 2x ATTACK regardless of extensions
        body = [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE];
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
    const maintainers = Object.values(Game.creeps).filter(
      (creep) => creep.memory.role === "maintainer"
    ).length;
    const attackers = Object.values(Game.creeps).filter(
      (creep) => creep.memory.role === "attacker"
    ).length;

    // Spawn logic
    for (const spawnName in Game.spawns) {
      const spawn = Game.spawns[spawnName];

      if (!spawn.spawning) {
        let creepToSpawn = null;

        // Get extension count for this spawn's room
        const extensionCount = this.getExtensionCount(spawn.room);

        // Priority: harvesters first, then upgraders, then builders, then maintainers, then attackers (only with 4+ extensions)
        if (harvesters < 3) {
          creepToSpawn = "harvester";
        } else if (upgraders < 2) {
          creepToSpawn = "upgrader";
        } else if (builders < 4) {
          creepToSpawn = "builder";
        } else if (maintainers < 2) {
          creepToSpawn = "maintainer";
        } else if (extensionCount >= 4 && attackers < 2) {
          creepToSpawn = "attacker";
        }

        if (creepToSpawn) {
          const newName = `${creepToSpawn}_${Game.time}`;

          // Get extension count for this spawn's room
          const extensionCount = this.getExtensionCount(spawn.room);

          // Get available energy for this spawn
          const availableEnergy = spawn.store.energy || 0;
          console.log(`Available energy: ${availableEnergy}`);

          // Get total available energy including extensions
          const totalAvailableEnergy = this.getCurrentEnergy(spawn.room);
          console.log(
            `Total available energy (including extensions): ${totalAvailableEnergy}`
          );

          // Get optimal body composition
          const body = this.getCreepBody(
            creepToSpawn,
            extensionCount,
            totalAvailableEnergy
          );
          const bodyCost = this.calculateBodyCost(body);

          console.log(
            `Attempting to spawn ${creepToSpawn} with body: ${body.join(
              ","
            )} (cost: ${bodyCost})`
          );

          // Check if we have enough energy
          if (totalAvailableEnergy < bodyCost) {
            console.log(
              `Not enough energy to spawn ${creepToSpawn}. Need ${bodyCost}, have ${totalAvailableEnergy}`
            );
            continue; // Skip this spawn and try the next one
          }

          // Set default state based on role
          let defaultState = "harvesting";
          switch (creepToSpawn) {
            case "attacker":
              defaultState = "attacking";
              break;
            default:
              defaultState = "harvesting";
              break;
          }

          const result = spawn.spawnCreep(body, newName, {
            memory: { role: creepToSpawn, state: defaultState },
          });

          if (result === OK) {
            console.log(
              `Spawning new ${creepToSpawn}: ${newName} with body: ${body.join(
                ","
              )} and state: ${defaultState} (energy cost: ${bodyCost})`
            );
          } else {
            const errorMessage = this.getSpawnErrorMessage(result);
            console.log(
              `Failed to spawn ${creepToSpawn}: ${errorMessage} (error code: ${result})`
            );
          }
        }
      }
    }
  }

  /**
   * Calculate the energy cost of a body composition
   */
  static calculateBodyCost(body: string[]): number {
    let cost = 0;
    for (const part of body) {
      switch (part) {
        case WORK:
          cost += 100;
          break;
        case CARRY:
          cost += 50;
          break;
        case MOVE:
          cost += 50;
          break;
        case ATTACK:
          cost += 80;
          break;
        default:
          cost += 50; // Default cost for unknown parts
          break;
      }
    }
    return cost;
  }

  /**
   * Get error message for spawn error codes
   */
  static getSpawnErrorMessage(errorCode: number): string {
    switch (errorCode) {
      case ERR_NOT_ENOUGH_ENERGY:
        return "Not enough energy";
      case ERR_BUSY:
        return "Spawn is busy";
      case ERR_INVALID_ARGS:
        return "Invalid arguments";
      default:
        return `Unknown error (${errorCode})`;
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
