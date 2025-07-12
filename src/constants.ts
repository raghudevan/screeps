// Screeps Constants from official API documentation
// https://docs.screeps.com/api/#Constants

// Find constants
export const FIND_EXIT_TOP = 1;
export const FIND_EXIT_RIGHT = 3;
export const FIND_EXIT_BOTTOM = 5;
export const FIND_EXIT_LEFT = 7;
export const FIND_EXIT = 10;
export const FIND_CREEPS = 101;
export const FIND_MY_CREEPS = 102;
export const FIND_HOSTILE_CREEPS = 103;
export const FIND_SOURCES_ACTIVE = 104;
export const FIND_SOURCES = 105;
export const FIND_DROPPED_RESOURCES = 106;
export const FIND_STRUCTURES = 107;
export const FIND_MY_STRUCTURES = 108;
export const FIND_HOSTILE_STRUCTURES = 109;
export const FIND_FLAGS = 110;
export const FIND_CONSTRUCTION_SITES = 111;
export const FIND_MY_SPAWNS = 112;
export const FIND_HOSTILE_SPAWNS = 113;
export const FIND_MY_CONSTRUCTION_SITES = 114;
export const FIND_HOSTILE_CONSTRUCTION_SITES = 115;
export const FIND_MINERALS = 116;
export const FIND_NUKES = 117;
export const FIND_TOMBSTONES = 118;
export const FIND_POWER_CREEPS = 119;
export const FIND_MY_POWER_CREEPS = 120;
export const FIND_HOSTILE_POWER_CREEPS = 121;
export const FIND_DEPOSITS = 122;
export const FIND_RUINS = 123;

// Direction constants
export const TOP = 1;
export const TOP_RIGHT = 2;
export const RIGHT = 3;
export const BOTTOM_RIGHT = 4;
export const BOTTOM = 5;
export const BOTTOM_LEFT = 6;
export const LEFT = 7;
export const TOP_LEFT = 8;

// Color constants
export const COLOR_RED = 1;
export const COLOR_PURPLE = 2;
export const COLOR_BLUE = 3;
export const COLOR_CYAN = 4;
export const COLOR_GREEN = 5;
export const COLOR_YELLOW = 6;
export const COLOR_ORANGE = 7;
export const COLOR_BROWN = 8;
export const COLOR_GREY = 9;
export const COLOR_WHITE = 10;

// Look constants
export const LOOK_CREEPS = "creep";
export const LOOK_ENERGY = "energy";
export const LOOK_RESOURCES = "resource";
export const LOOK_SOURCES = "source";
export const LOOK_MINERALS = "mineral";
export const LOOK_DROPPED_RESOURCES = "droppedResource";
export const LOOK_DROPPED_ENERGY = "droppedEnergy";
export const LOOK_STRUCTURES = "structure";
export const LOOK_FLAGS = "flag";
export const LOOK_CONSTRUCTION_SITES = "constructionSite";
export const LOOK_NUKES = "nuke";
export const LOOK_TERRAIN = "terrain";
export const LOOK_TOMBSTONES = "tombstone";
export const LOOK_POWER_CREEPS = "powerCreep";
export const LOOK_DEPOSITS = "deposit";
export const LOOK_RUINS = "ruin";

// Structure constants
export const STRUCTURE_EXTENSION = "extension";
export const STRUCTURE_RAMPART = "rampart";
export const STRUCTURE_ROAD = "road";
export const STRUCTURE_SPAWN = "spawn";
export const STRUCTURE_LINK = "link";
export const STRUCTURE_WALL = "wall";
export const STRUCTURE_KEEPER_LAIR = "keeperLair";
export const STRUCTURE_CONTROLLER = "controller";
export const STRUCTURE_STORAGE = "storage";
export const STRUCTURE_TOWER = "tower";
export const STRUCTURE_OBSERVER = "observer";
export const STRUCTURE_POWER_BANK = "powerBank";
export const STRUCTURE_POWER_SPAWN = "powerSpawn";
export const STRUCTURE_EXTRACTOR = "extractor";
export const STRUCTURE_LAB = "lab";
export const STRUCTURE_TERMINAL = "terminal";
export const STRUCTURE_CONTAINER = "container";
export const STRUCTURE_NUKER = "nuker";
export const STRUCTURE_FACTORY = "factory";
export const STRUCTURE_INVADER_CORE = "invaderCore";

// Resource constants
export const RESOURCE_ENERGY = "energy";
export const RESOURCE_POWER = "power";
export const RESOURCE_HYDROGEN = "H";
export const RESOURCE_OXYGEN = "O";
export const RESOURCE_UTRIUM = "U";
export const RESOURCE_LEMERGIUM = "L";
export const RESOURCE_KEANIUM = "K";
export const RESOURCE_ZYNTHIUM = "Z";
export const RESOURCE_CATALYST = "X";
export const RESOURCE_GHODIUM = "G";
export const RESOURCE_HYDROXIDE = "OH";
export const RESOURCE_ZYNTHIUM_KEANITE = "ZK";
export const RESOURCE_UTRIUM_LEMERGITE = "UL";
export const RESOURCE_UTRIUM_HYDRIDE = "UH";
export const RESOURCE_UTRIUM_OXIDE = "UO";
export const RESOURCE_KEANIUM_HYDRIDE = "KH";
export const RESOURCE_KEANIUM_OXIDE = "KO";
export const RESOURCE_LEMERGIUM_HYDRIDE = "LH";
export const RESOURCE_LEMERGIUM_OXIDE = "LO";
export const RESOURCE_ZYNTHIUM_HYDRIDE = "ZH";
export const RESOURCE_ZYNTHIUM_OXIDE = "ZO";
export const RESOURCE_GHODIUM_HYDRIDE = "GH";
export const RESOURCE_GHODIUM_OXIDE = "GO";
export const RESOURCE_UTRIUM_ACID = "UH2O";
export const RESOURCE_UTRIUM_ALKALIDE = "UHO2";
export const RESOURCE_KEANIUM_ACID = "KH2O";
export const RESOURCE_KEANIUM_ALKALIDE = "KHO2";
export const RESOURCE_LEMERGIUM_ACID = "LH2O";
export const RESOURCE_LEMERGIUM_ALKALIDE = "LHO2";
export const RESOURCE_ZYNTHIUM_ACID = "ZH2O";
export const RESOURCE_ZYNTHIUM_ALKALIDE = "ZHO2";
export const RESOURCE_GHODIUM_ACID = "GH2O";
export const RESOURCE_GHODIUM_ALKALIDE = "GHO2";
export const RESOURCE_CATALYZED_UTRIUM_ACID = "XUH2O";
export const RESOURCE_CATALYZED_UTRIUM_ALKALIDE = "XUHO2";
export const RESOURCE_CATALYZED_KEANIUM_ACID = "XKH2O";
export const RESOURCE_CATALYZED_KEANIUM_ALKALIDE = "XKHO2";
export const RESOURCE_CATALYZED_LEMERGIUM_ACID = "XLH2O";
export const RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE = "XLHO2";
export const RESOURCE_CATALYZED_ZYNTHIUM_ACID = "XZH2O";
export const RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE = "XZHO2";
export const RESOURCE_CATALYZED_GHODIUM_ACID = "XGH2O";
export const RESOURCE_CATALYZED_GHODIUM_ALKALIDE = "XGHO2";

// Body part constants
export const MOVE = "move";
export const WORK = "work";
export const CARRY = "carry";
export const ATTACK = "attack";
export const RANGED_ATTACK = "ranged_attack";
export const TOUGH = "tough";
export const HEAL = "heal";
export const CLAIM = "claim";

// Error constants
export const OK = 0;
export const ERR_NOT_OWNER = -1;
export const ERR_NO_PATH = -2;
export const ERR_NAME_EXISTS = -3;
export const ERR_BUSY = -4;
export const ERR_NOT_FOUND = -5;
export const ERR_NOT_ENOUGH_ENERGY = -6;
export const ERR_NOT_ENOUGH_RESOURCES = -6;
export const ERR_INVALID_TARGET = -7;
export const ERR_FULL = -8;
export const ERR_NOT_IN_RANGE = -9;
export const ERR_INVALID_ARGS = -10;
export const ERR_TIRED = -11;
export const ERR_NO_BODYPART = -12;
export const ERR_NOT_ENOUGH_EXTENSIONS = -6;
export const ERR_RCL_NOT_ENOUGH = -14;
export const ERR_GCL_NOT_ENOUGH = -15;

// Power constants
export const PWR_GENERATE_OPS = 1;
export const PWR_OPERATE_SPAWN = 2;
export const PWR_OPERATE_TOWER = 3;
export const PWR_OPERATE_STORAGE = 4;
export const PWR_OPERATE_LAB = 5;
export const PWR_OPERATE_EXTENSION = 6;
export const PWR_OPERATE_OBSERVER = 7;
export const PWR_OPERATE_TERMINAL = 8;
export const PWR_DISRUPT_SPAWN = 9;
export const PWR_DISRUPT_TOWER = 10;
export const PWR_DISRUPT_SOURCE = 11;
export const PWR_SHIELD = 12;
export const PWR_REGEN_SOURCE = 13;
export const PWR_REGEN_MINERAL = 14;
export const PWR_DISRUPT_TERMINAL = 15;
export const PWR_OPERATE_POWER = 16;
export const PWR_FORTIFY = 17;
export const PWR_OPERATE_CONTROLLER = 18;
export const PWR_OPERATE_FACTORY = 19;

// Event constants
export const EVENT_ATTACK = 1;
export const EVENT_OBJECT_DAMAGED = 2;
export const EVENT_OBJECT_DESTROYED = 3;
export const EVENT_ATTACK_CONTROLLER = 4;
export const EVENT_BUILD = 5;
export const EVENT_HARVEST = 6;
export const EVENT_HEAL = 7;
export const EVENT_REPAIR = 8;
export const EVENT_RESERVE_CONTROLLER = 9;
export const EVENT_UPGRADE_CONTROLLER = 10;
export const EVENT_EXIT = 11;
export const EVENT_POWER = 12;
export const EVENT_TRANSFER = 13;
