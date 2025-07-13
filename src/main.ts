import { CreepManager } from "./creepManager";
import { SpawnManager } from "./spawnManager";

// Game loop - runs every tick
export function loop() {
  console.log(`Game tick: ${Game.time}`);

  // Your game logic goes here
  // This is where you'll implement your Screeps AI

  // Example: Log CPU usage
  console.log(`CPU used: ${Game.cpu.getUsed()}`);

  // Manage spawns first
  SpawnManager.run();

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
