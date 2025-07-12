# Screeps Game Code

This repository contains my Screeps game code with TypeScript support and custom type definitions based on the [official Screeps API documentation](https://docs.screeps.com/api/).

## Features

- **TypeScript Support**: Full TypeScript compilation with strict type checking
- **Custom Type Definitions**: Complete type definitions based on the official Screeps API
- **Development Tools**: Watch mode, build scripts, and development utilities
- **Modern Development**: Using Yarn for package management
- **Modular Architecture**: Separate managers for each creep type
- **Smart Source Finding**: Advanced source selection with position checking

## Project Structure

```
screeps/
├── src/
│   ├── main.ts              # Main game loop entry point
│   ├── creepManager.ts      # Main creep management (delegates to specific managers)
│   ├── harvesterManager.ts  # Harvester-specific logic
│   ├── upgraderManager.ts   # Upgrader-specific logic
│   ├── builderManager.ts    # Builder-specific logic
│   ├── utilities.ts         # Common utility functions
│   └── constants.ts         # Screeps constants
├── dist/                    # Compiled JavaScript output
├── scripts/
│   └── deploy.js           # Deployment script
├── package.json             # Project configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Yarn package manager
- Screeps game client installed locally

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   yarn install
   ```

### Environment Setup

Create a `.env` file in the project root with your Screeps scripts directory path:

```bash
# Create .env file
echo "SCREEPS_SCRIPTS_PATH=C:\Users\raghu\AppData\Local\Screeps\scripts\screeps.com\default" > .env
```

**Note**: Update the path to match your local Screeps installation. The `.env` file is ignored by git to keep your local paths private.

### Development

- **Build the project**:
  ```bash
  yarn build
  ```

- **Build and deploy to Screeps**:
  ```bash
  yarn build:deploy
  ```

- **Watch for changes** (automatically rebuilds on file changes):
  ```bash
  yarn watch
  ```

- **Watch and auto-deploy** (automatically builds and deploys on file changes):
  ```bash
  yarn watch:deploy
  ```

- **Development mode** (with nodemon for auto-restart):
  ```bash
  yarn dev
  ```

- **Clean build output**:
  ```bash
  yarn clean
  ```

## Usage

1. Write your Screeps game logic in the appropriate manager files
2. Build and deploy with `yarn build:deploy` (automatically copies to Screeps)
3. Or use `yarn watch:deploy` for automatic building and deploying during development
4. The compiled code will run in the Screeps game environment

**Note**: The deploy script automatically cleans the destination directory and copies all compiled files from the `dist` directory to your Screeps scripts directory specified in the `.env` file.

## Architecture

### Creep Management

The codebase uses a modular architecture with separate managers for each creep type:

- **`CreepManager`**: Main entry point that delegates to specific managers
- **`HarvesterManager`**: Handles harvesters (harvest → deliver → upgrade)
- **`UpgraderManager`**: Handles upgraders (harvest → upgrade)
- **`BuilderManager`**: Handles builders (harvest → build → upgrade)

### Smart Features

- **State Management**: Each creep has states (harvesting, delivering, upgrading, building)
- **Source Selection**: Finds nearest available source with position checking
- **Adaptive Behavior**: Creeps pivot to upgrading when primary tasks aren't needed
- **Utility Functions**: Common operations centralized in `CreepUtilities`

## Type Definitions

This project uses custom type definitions based on the [official Screeps API documentation](https://docs.screeps.com/api/). The types are located in `src/constants.ts` and include:

- All game constants (FIND_*, LOOK_*, etc.)
- All structure types and resource types
- All error codes and return values

## Example Code

The `src/main.ts` file contains a basic example:

```typescript
export function loop(): void {
    console.log(`Game tick: ${Game.time}`);
    
    // Your game logic goes here
    // This is where you'll implement your Screeps AI
    
    // Example: Log CPU usage
    console.log(`CPU used: ${Game.cpu.getUsed()}`);
    
    // Example: Basic room management
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (room.controller && room.controller.my) {
            console.log(`Managing room: ${roomName}`);
            // Add your room management logic here
        }
    }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Build and test your code
5. Submit a pull request

## License

MIT License - see LICENSE file for details