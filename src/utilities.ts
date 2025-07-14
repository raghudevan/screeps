import {
  FIND_SOURCES,
  FIND_STRUCTURES,
  FIND_CONSTRUCTION_SITES,
  FIND_HOSTILE_CREEPS,
  RESOURCE_ENERGY,
  STRUCTURE_EXTENSION,
  STRUCTURE_SPAWN,
  STRUCTURE_TOWER,
  STRUCTURE_ROAD,
  LOOK_CREEPS,
  LOOK_STRUCTURES,
} from "./constants";

export class CreepUtilities {
  /**
   * Find the closest source in a room
   */
  static findClosestSource(creep: any): any {
    const sources = creep.room.find(FIND_SOURCES);
    if (sources.length > 0) {
      return creep.pos.findClosestByPath(sources);
    }
    return null;
  }

  /**
   * Find a source in a room (nearest available)
   */
  static findSource(creep: any): any {
    const sources = creep.room.find(FIND_SOURCES);
    if (sources.length === 0) {
      return null;
    }

    // Find sources that have available positions around them
    const availableSources = sources.filter((source: any) => {
      // Get all positions adjacent to the source
      const adjacentPositions = [];
      for (let x = source.pos.x - 1; x <= source.pos.x + 1; x++) {
        for (let y = source.pos.y - 1; y <= source.pos.y + 1; y++) {
          if (x >= 0 && x < 50 && y >= 0 && y < 50) {
            adjacentPositions.push({ x, y, roomName: source.pos.roomName });
          }
        }
      }

      // Check if any adjacent position is available (not a wall and not occupied)
      const availablePositions = adjacentPositions.filter((pos) => {
        // Check if position is walkable (not a wall)
        const terrain = source.room.getTerrain().get(pos.x, pos.y);
        if (terrain === "wall") {
          return false;
        }

        // Check if position is occupied by a creep
        const creepsAtPos = source.room.lookForAt(LOOK_CREEPS, pos.x, pos.y);
        if (creepsAtPos.length > 0) {
          return false;
        }

        // Check if position is occupied by a structure
        const structuresAtPos = source.room.lookForAt(
          LOOK_STRUCTURES,
          pos.x,
          pos.y
        );
        if (structuresAtPos.length > 0) {
          return false;
        }

        return true;
      });

      // Source is available if there's at least one free position
      return availablePositions.length > 0;
    });

    if (availableSources.length === 0) {
      // No sources have available positions, just pick the nearest one
      return creep.pos.findClosestByPath(sources);
    }

    // Return the nearest available source
    return creep.pos.findClosestByPath(availableSources);
  }

  /**
   * Check if any structures need energy
   */
  static structuresNeedEnergy(room: any): boolean {
    const targets = room.find(FIND_STRUCTURES);

    for (const target of targets) {
      const structure = target;
      if (
        (structure.structureType === STRUCTURE_EXTENSION ||
          structure.structureType === STRUCTURE_SPAWN ||
          structure.structureType === STRUCTURE_TOWER) &&
        structure.store &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Find a structure that needs energy
   */
  static findStructureNeedingEnergy(room: any): any {
    const targets = room.find(FIND_STRUCTURES);

    for (const target of targets) {
      const structure = target;
      if (
        (structure.structureType === STRUCTURE_EXTENSION ||
          structure.structureType === STRUCTURE_SPAWN ||
          structure.structureType === STRUCTURE_TOWER) &&
        structure.store &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      ) {
        return structure;
      }
    }
    return null;
  }

  /**
   * Check if there are construction sites in a room
   */
  static hasConstructionSites(room: any): boolean {
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    return constructionSites.length > 0;
  }

  /**
   * Find a construction site in a room
   */
  static findConstructionSite(room: any, creep: any): any {
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    if (constructionSites.length === 0) {
      return null;
    }

    // Sort construction sites by distance from the creep
    const sortedSites = constructionSites.sort((a: any, b: any) => {
      const distanceA = creep.pos.getRangeTo(a);
      const distanceB = creep.pos.getRangeTo(b);
      return distanceA - distanceB;
    });

    // Check if there's already at least one built extension
    const builtExtensions = room
      .find(FIND_STRUCTURES)
      .filter(
        (structure: any) => structure.structureType === STRUCTURE_EXTENSION
      );
    const hasBuiltExtension = builtExtensions.length > 0;

    // If we have a built extension, prioritize roads over new extensions
    if (hasBuiltExtension) {
      // Priority 1: Road (nearest first)
      const roadSite = sortedSites.find(
        (site: any) => site.structureType === STRUCTURE_ROAD
      );
      if (roadSite) {
        return roadSite;
      }
      // Priority 2: Extension (nearest first)
      const extensionSite = sortedSites.find(
        (site: any) => site.structureType === STRUCTURE_EXTENSION
      );
      if (extensionSite) {
        return extensionSite;
      }
    } else {
      // No built extensions yet, prioritize extensions first
      // Priority 1: Extension (nearest first)
      const extensionSite = sortedSites.find(
        (site: any) => site.structureType === STRUCTURE_EXTENSION
      );
      if (extensionSite) {
        return extensionSite;
      }
      // Priority 2: Road (nearest first)
      const roadSite = sortedSites.find(
        (site: any) => site.structureType === STRUCTURE_ROAD
      );
      if (roadSite) {
        return roadSite;
      }
    }

    // Fallback: nearest site
    return sortedSites[0];
  }

  /**
   * Harvest from a source
   */
  static harvestFromSource(creep: any, source: any): number {
    const harvestResult = creep.harvest(source);
    console.log(`${creep.name} harvest result: ${harvestResult}`);
    return harvestResult;
  }

  /**
   * Move to a target with visualization
   */
  static moveToTarget(
    creep: any,
    target: any,
    color: string = "#ffffff"
  ): void {
    creep.moveTo(target, {
      visualizePathStyle: { stroke: color },
    });
    console.log(`${creep.name} moving to target`);
  }

  /**
   * Transfer energy to a structure
   */
  static transferEnergyToStructure(creep: any, structure: any): number {
    const transferResult = creep.transfer(structure, RESOURCE_ENERGY);
    console.log(`${creep.name} transfer result: ${transferResult}`);
    return transferResult;
  }

  /**
   * Upgrade controller
   */
  static upgradeController(creep: any, controller: any): number {
    const upgradeResult = creep.upgradeController(controller);
    console.log(`${creep.name} upgrade result: ${upgradeResult}`);
    return upgradeResult;
  }

  /**
   * Build construction site
   */
  static buildConstructionSite(creep: any, site: any): number {
    const buildResult = creep.build(site);
    console.log(`${creep.name} build result: ${buildResult}`);
    return buildResult;
  }

  /**
   * Check if any structures need repair (including roads)
   */
  static hasStructuresNeedingRepair(room: any): boolean {
    const structures = room.find(FIND_STRUCTURES);
    console.log(`Found ${structures.length} structures in room ${room.name}`);

    for (const structure of structures) {
      // Check if it's a structure we can repair
      if (structure.my && structure.hits < structure.hitsMax) {
        console.log(
          `Structure ${structure.id} (${structure.structureType}) needs repair: ${structure.hits}/${structure.hitsMax}`
        );
        return true;
      }
      // For roads, only repair when below 30% health
      if (
        structure.structureType === STRUCTURE_ROAD &&
        structure.hits < structure.hitsMax * 0.3
      ) {
        console.log(
          `Road ${structure.id} needs repair: ${structure.hits}/${
            structure.hitsMax
          } (${Math.round((structure.hits / structure.hitsMax) * 100)}%)`
        );
        return true;
      }
    }
    return false;
  }

  /**
   * Find a structure that needs repair (including roads)
   */
  static findStructureNeedingRepair(room: any, creep: any): any {
    const structures = room.find(FIND_STRUCTURES);
    console.log(
      `Maintainer ${creep.name} checking ${structures.length} structures for repair`
    );

    const damagedStructures = structures.filter((structure: any) => {
      // My structures can be repaired at any damage level
      if (structure.my && structure.hits < structure.hitsMax) {
        return true;
      }
      // Roads only when below 30% health
      if (
        structure.structureType === STRUCTURE_ROAD &&
        structure.hits < structure.hitsMax * 0.3
      ) {
        return true;
      }
      return false;
    });

    console.log(
      `Found ${damagedStructures.length} damaged repairable structures`
    );

    if (damagedStructures.length === 0) {
      return null;
    }

    // Sort by damage percentage (most damaged first) and distance from creep
    const sortedStructures = damagedStructures.sort((a: any, b: any) => {
      const damagePercentA = a.hits / a.hitsMax;
      const damagePercentB = b.hits / b.hitsMax;
      const distanceA = creep.pos.getRangeTo(a);
      const distanceB = creep.pos.getRangeTo(b);

      // Prioritize most damaged structures, then nearest
      if (Math.abs(damagePercentA - damagePercentB) > 0.1) {
        return damagePercentA - damagePercentB;
      }
      return distanceA - distanceB;
    });

    const target = sortedStructures[0];
    console.log(
      `Maintainer ${creep.name} targeting ${target.structureType} (${target.id}) for repair`
    );
    return target;
  }

  /**
   * Repair a structure
   */
  static repairStructure(creep: any, structure: any): number {
    const repairResult = creep.repair(structure);
    console.log(`${creep.name} repair result: ${repairResult}`);
    return repairResult;
  }

  /**
   * Check if there are hostile creeps in a room
   */
  static hasHostileCreeps(room: any): boolean {
    const hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
    return hostileCreeps.length > 0;
  }

  /**
   * Find a hostile creep to attack
   */
  static findHostileCreep(room: any, creep: any): any {
    const hostileCreeps = room.find(FIND_HOSTILE_CREEPS);

    if (hostileCreeps.length === 0) {
      return null;
    }

    // Sort by distance from the attacker (nearest first)
    const sortedCreeps = hostileCreeps.sort((a: any, b: any) => {
      const distanceA = creep.pos.getRangeTo(a);
      const distanceB = creep.pos.getRangeTo(b);
      return distanceA - distanceB;
    });

    return sortedCreeps[0];
  }

  /**
   * Attack a target
   */
  static attackTarget(creep: any, target: any): number {
    const attackResult = creep.attack(target);
    console.log(`${creep.name} attack result: ${attackResult}`);

    // Add debugging for structure attacks
    if (target.structureType) {
      // Calculate expected damage based on creep's attack parts
      const attackParts = creep.body.filter(
        (part: any) => part.type === "attack"
      ).length;
      const expectedDamage = attackParts * 30; // Each ATTACK part does 30 damage

      console.log(
        `${creep.name} attacking ${target.structureType} (${target.id})`
      );
      console.log(`Target hits: ${target.hits}/${target.hitsMax}`);
      console.log(
        `Expected damage this tick: ${expectedDamage} (${attackParts} ATTACK parts)`
      );
      console.log(
        `Damage percentage: ${((expectedDamage / target.hitsMax) * 100).toFixed(
          4
        )}%`
      );

      // Calculate how many ticks to destroy
      if (expectedDamage > 0) {
        const ticksToDestroy = Math.ceil(target.hits / expectedDamage);
        const secondsToDestroy = ticksToDestroy / 20; // 20 ticks per second
        const minutesToDestroy = secondsToDestroy / 60;
        const hoursToDestroy = minutesToDestroy / 60;

        let timeString = "";
        if (hoursToDestroy >= 1) {
          timeString = `${hoursToDestroy.toFixed(1)} hours`;
        } else if (minutesToDestroy >= 1) {
          timeString = `${minutesToDestroy.toFixed(1)} minutes`;
        } else {
          timeString = `${secondsToDestroy.toFixed(1)} seconds`;
        }

        console.log(`Ticks to destroy: ${ticksToDestroy} (${timeString})`);
      }
    }

    return attackResult;
  }
}
