import {
  FIND_SOURCES,
  FIND_STRUCTURES,
  FIND_CONSTRUCTION_SITES,
  RESOURCE_ENERGY,
  STRUCTURE_EXTENSION,
  STRUCTURE_SPAWN,
  STRUCTURE_TOWER,
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
  static findConstructionSite(room: any): any {
    const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    if (constructionSites.length > 0) {
      return constructionSites[0];
    }
    return null;
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
}
