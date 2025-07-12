import { WORK, CARRY, MOVE, OK } from "./constants";
import { CreepManager } from "./creepManager";

// Spawn management
function manageSpawns() {
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
      } else if (builders < 1) {
        creepToSpawn = "builder";
      }

      if (creepToSpawn) {
        const newName = `${creepToSpawn}_${Game.time}`;
        const result = spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
          memory: { role: creepToSpawn },
        });

        if (result === OK) {
          console.log(`Spawning new ${creepToSpawn}: ${newName}`);
        } else {
          console.log(`Failed to spawn ${creepToSpawn}: ${result}`);
        }
      }
    }
  }
}

// Game loop - runs every tick
export function loop() {
  console.log(`Game tick: ${Game.time}`);

  // Your game logic goes here
  // This is where you'll implement your Screeps AI

  // Example: Log CPU usage
  console.log(`CPU used: ${Game.cpu.getUsed()}`);

  // Manage spawns first
  manageSpawns();

  // Run creep management
  CreepManager.run();

  // Example: Basic room management
  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    if (room.controller && room.controller.my) {
      console.log(`Managing room: ${roomName}`);
      // Add your room management logic here
    }
  }
}
