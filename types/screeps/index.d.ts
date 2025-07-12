// Screeps Type Definitions
// Based on https://docs.screeps.com/api/

declare global {
  // Global Objects
  var Game: Game;
  var Memory: Memory;
  var RawMemory: RawMemory;
  var PathFinder: PathFinder;
  var InterShardMemory: InterShardMemory;

  // Global function that runs every tick
  function loop(): void;
}

interface Game {
  // Global game state
  time: number;
  shard: Shard;

  // Game objects
  creeps: { [name: string]: Creep };
  rooms: { [name: string]: Room };
  spawns: { [name: string]: StructureSpawn };
  structures: { [name: string]: Structure };
  constructionSites: { [name: string]: ConstructionSite };
  flags: { [name: string]: Flag };
  powerCreeps: { [name: string]: PowerCreep };
  resources: { [name: string]: Resource };

  // Game features
  cpu: CPU;
  map: GameMap;
  market: Market;
  gcl: GCL;
  gpl: GPL;

  // Utility methods
  getObjectById<T extends RoomObject>(id: string): T | null;
  notify(message: string, groupInterval?: number): void;
}

interface CPU {
  limit: number;
  tickLimit: number;
  bucket: number;
  shardLimits: { [shard: string]: number };

  getUsed(): number;
  getHeapStatistics(): HeapStatistics;
  halt(): void;
  setShardLimits(limits: { [shard: string]: number }): void;
  unlock(): void;
  generatePixel(): number;
}

interface HeapStatistics {
  total_heap_size: number;
  total_heap_size_executable: number;
  total_physical_size: number;
  total_available_size: number;
  used_heap_size: number;
  heap_size_limit: number;
  malloced_memory: number;
  peak_malloced_memory: number;
  does_zap_garbage: number;
  externally_allocated_size: number;
  number_of_native_contexts: number;
  number_of_detached_contexts: number;
  total_global_handles_size: number;
  used_global_handles_size: number;
  used_heap_size: number;
  heap_size_limit: number;
  malloced_memory: number;
  peak_malloced_memory: number;
  does_zap_garbage: number;
  externally_allocated_size: number;
  number_of_native_contexts: number;
  number_of_detached_contexts: number;
  total_global_handles_size: number;
  used_global_handles_size: number;
}

interface GameMap {
  describeExits(roomName: string): { [direction: string]: string };
  findExit(
    fromRoom: string,
    toRoom: string,
    opts?: FindRouteOpts
  ): number | string;
  findRoute(
    fromRoom: string,
    toRoom: string,
    opts?: FindRouteOpts
  ): FindRouteResult[];
  getRoomLinearDistance(
    roomName1: string,
    roomName2: string,
    continuous?: boolean
  ): number;
  getRoomTerrain(roomName: string): RoomTerrain;
  getTerrainAt(x: number, y: number, roomName: string): string;
  getWorldSize(): number;
  isRoomAvailable(roomName: string): boolean;
  getRoomStatus(roomName: string): RoomStatus;
  visual: RoomVisual;
}

interface FindRouteOpts {
  routeCallback?: (roomName: string, fromRoomName: string) => number;
}

interface FindRouteResult {
  exit: ExitConstant;
  room: string;
}

interface RoomStatus {
  status: string;
  timestamp: number;
}

interface GCL {
  level: number;
  progress: number;
  progressTotal: number;
}

interface GPL {
  level: number;
  progress: number;
  progressTotal: number;
}

interface Market {
  credits: number;
  incomingTransactions: Transaction[];
  outgoingTransactions: Transaction[];
  orders: { [id: string]: Order };

  calcTransactionCost(
    amount: number,
    roomName1: string,
    roomName2: string
  ): number;
  cancelOrder(orderId: string): number;
  changeOrderPrice(orderId: string, newPrice: number): number;
  createOrder(
    type: string,
    resourceType: ResourceConstant,
    price: number,
    totalAmount: number,
    roomName?: string
  ): number;
  deal(orderId: string, amount: number, targetRoomName?: string): number;
  extendOrder(orderId: string, addAmount: number): number;
  getAllOrders(filter?: OrderFilter): { [id: string]: Order };
  getHistory(shard?: string): Transaction[];
  getOrderById(id: string): Order | null;
}

interface Transaction {
  transactionId: string;
  time: number;
  sender?: { username: string };
  recipient?: { username: string };
  resourceType: ResourceConstant;
  amount: number;
  from: string;
  to: string;
  description: string;
  order?: TransactionOrder;
}

interface TransactionOrder {
  id: string;
  type: string;
  price: number;
}

interface Order {
  id: string;
  created: number;
  amount: number;
  remainingAmount: number;
  resourceType: ResourceConstant;
  price: number;
  roomName: string;
  type: string;
}

interface OrderFilter {
  id?: string;
  created?: number;
  type?: string;
  resourceType?: ResourceConstant;
  priceMin?: number;
  priceMax?: number;
  amountMin?: number;
  amountMax?: number;
  roomName?: string;
}

interface Memory {
  [key: string]: any;
}

interface RawMemory {
  segments: { [id: number]: string };
  foreignSegment: string;
  interShardSegment: string;

  get(): string;
  set(value: string): void;
  setActiveSegments(ids: number[]): void;
  setActiveForeignSegment(username: string, id: number): void;
  setDefaultPublicSegment(id: number): void;
  setPublicSegments(ids: number[]): void;
}

interface InterShardMemory {
  getLocal(key: string): any;
  setLocal(key: string, value: any): void;
  getRemote(shard: string, key: string): any;
}

interface PathFinder {
  search(
    origin: RoomPosition | { pos: RoomPosition },
    goal:
      | RoomPosition
      | { pos: RoomPosition }
      | RoomPosition[]
      | { pos: RoomPosition }[],
    opts?: PathFinderOpts
  ): PathFinderPath;
  use(isEnabled: boolean): void;
  CostMatrix: typeof PathFinderCostMatrix;
}

interface PathFinderOpts {
  plainCost?: number;
  swampCost?: number;
  flee?: boolean;
  costCallback?: (
    roomName: string,
    costMatrix: CostMatrix
  ) => boolean | CostMatrix;
  maxOps?: number;
  maxRooms?: number;
  maxCost?: number;
  heuristicWeight?: number;
}

interface PathFinderPath {
  path: RoomPosition[];
  ops: number;
  cost: number;
  incomplete: boolean;
}

class PathFinderCostMatrix {
  constructor();
  set(x: number, y: number, cost: number): void;
  get(x: number, y: number): number;
  clone(): CostMatrix;
  serialize(): number[];
  static deserialize(val: number[]): CostMatrix;
}

// Basic room object interface
interface RoomObject {
  effects?: Effect[];
  pos: RoomPosition;
  room?: Room;
}

interface Effect {
  effect: number;
  level?: number;
  ticksRemaining: number;
}

interface RoomPosition {
  x: number;
  y: number;
  roomName: string;

  createConstructionSite(
    structureType: BuildableStructureConstant,
    name?: string
  ): number;
  createFlag(
    name?: string,
    color?: ColorConstant,
    secondaryColor?: ColorConstant
  ): number;
  findClosestByPath<T extends RoomObject>(
    objects: T[],
    opts?: FindClosestByPathOpts
  ): T | null;
  findClosestByRange<T extends RoomObject>(objects: T[]): T | null;
  findInRange<T extends RoomObject>(
    objects: T[],
    range: number,
    opts?: FindInRangeOpts
  ): T[];
  findPathTo(x: number, y: number, opts?: FindPathOpts): PathStep[];
  findPathTo(
    target: RoomPosition | { pos: RoomPosition },
    opts?: FindPathOpts
  ): PathStep[];
  getDirectionTo(x: number, y: number): DirectionConstant;
  getDirectionTo(
    target: RoomPosition | { pos: RoomPosition }
  ): DirectionConstant;
  getRangeTo(x: number, y: number): number;
  getRangeTo(target: RoomPosition | { pos: RoomPosition }): number;
  inRangeTo(x: number, y: number, range: number): boolean;
  inRangeTo(
    target: RoomPosition | { pos: RoomPosition },
    range: number
  ): boolean;
  isEqualTo(x: number, y: number): boolean;
  isEqualTo(target: RoomPosition | { pos: RoomPosition }): boolean;
  isNearTo(x: number, y: number): boolean;
  isNearTo(target: RoomPosition | { pos: RoomPosition }): boolean;
  look(): LookAtResult[];
  lookFor<T extends keyof AllLookAtTypes>(type: T): AllLookAtTypes[T][];
}

interface FindClosestByPathOpts {
  algorithm?: string;
  maxOps?: number;
  maxCost?: number;
  plainCost?: number;
  swampCost?: number;
  flee?: boolean;
  costCallback?: (
    roomName: string,
    costMatrix: CostMatrix
  ) => boolean | CostMatrix;
  heuristicWeight?: number;
}

interface FindInRangeOpts {
  algorithm?: string;
  maxOps?: number;
  maxCost?: number;
  plainCost?: number;
  swampCost?: number;
  flee?: boolean;
  costCallback?: (
    roomName: string,
    costMatrix: CostMatrix
  ) => boolean | CostMatrix;
  heuristicWeight?: number;
}

interface FindPathOpts {
  ignoreCreeps?: boolean;
  ignoreDestructibleStructures?: boolean;
  ignore?: (object: RoomObject) => boolean;
  avoid?: (object: RoomObject) => boolean;
  maxOps?: number;
  heuristicWeight?: number;
  serialize?: boolean;
  maxRooms?: number;
  reusePath?: number;
  plainCost?: number;
  swampCost?: number;
  flee?: boolean;
  costCallback?: (
    roomName: string,
    costMatrix: CostMatrix
  ) => boolean | CostMatrix;
}

interface PathStep {
  x: number;
  dx: number;
  y: number;
  dy: number;
  direction: DirectionConstant;
}

interface LookAtResult {
  type: keyof AllLookAtTypes;
  [key: string]: any;
}

interface AllLookAtTypes {
  constructionSite: ConstructionSite;
  creep: Creep;
  exit: any;
  flag: Flag;
  mineral: Mineral;
  nuke: Nuke;
  resource: Resource;
  source: Source;
  structure: Structure;
  terrain: Terrain;
  tombstone: Tombstone;
}

interface Terrain {
  terrain: string;
}

// Basic structure interface
interface Structure extends RoomObject {
  hits: number;
  hitsMax: number;
  id: string;
  structureType: StructureConstant;
  store?: Store;

  destroy(): number;
  isActive(): boolean;
  notifyWhenAttacked(enabled: boolean): number;
}

// Basic creep interface
interface Creep extends RoomObject {
  body: BodyPartDefinition[];
  carry: StoreDefinition;
  carryCapacity: number;
  fatigue: number;
  hits: number;
  hitsMax: number;
  id: string;
  memory: CreepMemory;
  my: boolean;
  name: string;
  owner: Owner;
  saying: string;
  spawning: boolean;
  store: Store;
  ticksToLive?: number;

  attack(target: Creep | Structure): number;
  attackController(controller: StructureController): number;
  build(target: ConstructionSite): number;
  cancelOrder(methodName: string): number;
  claimController(controller: StructureController): number;
  dismantle(target: Structure): number;
  drop(resourceType: ResourceConstant, amount?: number): number;
  generateSafeMode(controller: StructureController): number;
  getActiveBodyparts(type: BodyPartConstant): number;
  harvest(target: Source | Mineral | Deposit): number;
  heal(target: Creep): number;
  move(direction: DirectionConstant): number;
  moveByPath(path: PathStep[] | RoomPosition[] | string): number;
  moveTo(x: number, y: number, opts?: MoveToOpts): number;
  moveTo(
    target: RoomPosition | { pos: RoomPosition },
    opts?: MoveToOpts
  ): number;
  notifyWhenAttacked(enabled: boolean): number;
  pickup(target: Resource): number;
  pull(target: Creep): number;
  rangedAttack(target: Creep | Structure): number;
  rangedHeal(target: Creep): number;
  rangedMassAttack(): number;
  repair(target: Structure): number;
  reserveController(controller: StructureController): number;
  say(message: string, public?: boolean): number;
  signController(controller: StructureController, text: string): number;
  suicide(): number;
  transfer(
    target: Creep | Structure,
    resourceType: ResourceConstant,
    amount?: number
  ): number;
  upgradeController(controller: StructureController): number;
  withdraw(
    target: Structure | Tombstone,
    resourceType: ResourceConstant,
    amount?: number
  ): number;
}

interface BodyPartDefinition {
  boost?: string;
  type: BodyPartConstant;
  hits?: number;
}

interface StoreDefinition {
  [resourceType: string]: number;
}

interface Store {
  getCapacity(resourceType?: ResourceConstant): number;
  getFreeCapacity(resourceType?: ResourceConstant): number;
  getUsedCapacity(resourceType?: ResourceConstant): number;
}

interface CreepMemory {
  role?: string;
  [key: string]: any;
}

interface Owner {
  username: string;
}

interface MoveToOpts {
  reusePath?: number;
  serializeMemory?: boolean;
  noPathFinding?: boolean;
  visualizePathStyle?: any;
}

// Basic room interface
interface Room {
  controller?: StructureController;
  energyAvailable: number;
  energyCapacityAvailable: number;
  memory: RoomMemory;
  name: string;
  storage?: StructureStorage;
  terminal?: StructureTerminal;
  visual: RoomVisual;

  serializePath(path: RoomPosition[]): string;
  deserializePath(path: string): RoomPosition[];
  createConstructionSite(
    x: number,
    y: number,
    structureType: BuildableStructureConstant,
    name?: string
  ): number;
  createConstructionSite(
    pos: RoomPosition,
    structureType: BuildableStructureConstant,
    name?: string
  ): number;
  createFlag(
    x: number,
    y: number,
    name?: string,
    color?: ColorConstant,
    secondaryColor?: ColorConstant
  ): number;
  createFlag(
    pos: RoomPosition,
    name?: string,
    color?: ColorConstant,
    secondaryColor?: ColorConstant
  ): number;
  find(type: FindConstant, opts?: FilterOptions<RoomObject>): RoomObject[];
  findExitTo(room: string | Room): number | string;
  findPath(
    fromPos: RoomPosition,
    toPos: RoomPosition,
    opts?: FindPathOpts
  ): PathStep[];
  getEventLog(raw?: boolean): EventItem[];
  getPositionAt(x: number, y: number): RoomPosition;
  getTerrain(): RoomTerrain;
  lookAt(x: number, y: number): LookAtResult[];
  lookAt(pos: RoomPosition): LookAtResult[];
  lookAtArea(
    top: number,
    left: number,
    bottom: number,
    right: number,
    asArray?: boolean
  ): LookAtResultMatrix | LookAtResult[];
  lookForAt<T extends keyof AllLookAtTypes>(
    type: T,
    x: number,
    y: number
  ): AllLookAtTypes[T][];
  lookForAt<T extends keyof AllLookAtTypes>(
    type: T,
    target: RoomPosition | { pos: RoomPosition }
  ): AllLookAtTypes[T][];
  lookForAtArea<T extends keyof AllLookAtTypes>(
    type: T,
    top: number,
    left: number,
    bottom: number,
    right: number,
    asArray?: boolean
  ): LookAtResultMatrix | AllLookAtTypes[T][];
}

interface RoomMemory {
  [key: string]: any;
}

interface RoomVisual {
  roomName: string;

  line(from: RoomPosition, to: RoomPosition, style?: LineStyle): RoomVisual;
  line(from: RoomPosition, to: RoomPosition, color?: string): RoomVisual;
  line(from: RoomPosition, to: RoomPosition, style?: LineStyle): RoomVisual;
  circle(pos: RoomPosition, style?: CircleStyle): RoomVisual;
  circle(pos: RoomPosition, color?: string): RoomVisual;
  rect(
    topLeftPos: RoomPosition,
    width: number,
    height: number,
    style?: RectStyle
  ): RoomVisual;
  rect(
    topLeftPos: RoomPosition,
    width: number,
    height: number,
    color?: string
  ): RoomVisual;
  poly(points: RoomPosition[], style?: PolyStyle): RoomVisual;
  poly(points: RoomPosition[], color?: string): RoomVisual;
  text(text: string, pos: RoomPosition, style?: TextStyle): RoomVisual;
  text(text: string, pos: RoomPosition, color?: string): RoomVisual;
  clear(): RoomVisual;
  getSize(): { width: number; height: number };
  export(): string;
  import(data: string): RoomVisual;
}

interface LineStyle {
  width?: number;
  color?: string;
  opacity?: number;
  lineStyle?: string;
}

interface CircleStyle {
  radius?: number;
  fill?: string;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
  lineStyle?: string;
}

interface RectStyle {
  fill?: string;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
  lineStyle?: string;
}

interface PolyStyle {
  fill?: string;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
  lineStyle?: string;
}

interface TextStyle {
  color?: string;
  font?: string;
  fontSize?: number;
  fontFamily?: string;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  backgroundPadding?: number;
  align?: string;
}

interface RoomTerrain {
  get(x: number, y: number): string;
  getRawBuffer(): Uint8Array;
}

interface LookAtResultMatrix {
  [y: number]: { [x: number]: LookAtResult[] };
}

interface EventItem {
  event: string;
  objectId?: string;
  data?: any;
  [key: string]: any;
}

interface FilterOptions<T> {
  filter?: string | ((object: T) => boolean);
}

// Additional interfaces for other game objects
interface ConstructionSite extends RoomObject {
  id: string;
  my: boolean;
  owner: Owner;
  progress: number;
  progressTotal: number;
  structureType: BuildableStructureConstant;

  remove(): number;
}

interface Flag extends RoomObject {
  color: ColorConstant;
  memory: FlagMemory;
  name: string;
  secondaryColor: ColorConstant;

  remove(): number;
  setColor(color: ColorConstant, secondaryColor?: ColorConstant): number;
  setPosition(x: number, y: number, roomName?: string): number;
  setPosition(pos: RoomPosition): number;
}

interface FlagMemory {
  [key: string]: any;
}

interface PowerCreep extends RoomObject {
  carry: StoreDefinition;
  carryCapacity: number;
  className: PowerClassConstant;
  deleteTime?: number;
  hits: number;
  hitsMax: number;
  id: string;
  level: number;
  memory: PowerCreepMemory;
  my: boolean;
  name: string;
  owner: Owner;
  store: StoreDefinition;
  powers: { [powerId: string]: PowerInfo };
  saying: string;
  shard: string;
  spawnCooldownTime?: number;
  ticksToLive?: number;

  cancelOrder(methodName: string): number;
  delete(): number;
  drop(resourceType: ResourceConstant, amount?: number): number;
  enableRoom(controller: StructureController): number;
  move(direction: DirectionConstant): number;
  moveByPath(path: PathStep[] | RoomPosition[] | string): number;
  moveTo(x: number, y: number, opts?: MoveToOpts): number;
  moveTo(
    target: RoomPosition | { pos: RoomPosition },
    opts?: MoveToOpts
  ): number;
  notifyWhenAttacked(enabled: boolean): number;
  pickup(target: Resource): number;
  rename(name: string): number;
  renew(target: StructureSpawn): number;
  say(message: string, public?: boolean): number;
  spawn(spawn: StructureSpawn): number;
  suicide(): number;
  transfer(
    target: Creep | Structure,
    resourceType: ResourceConstant,
    amount?: number
  ): number;
  upgrade(target: PowerCreep): number;
  usePower(power: PowerConstant, target?: RoomObject): number;
  withdraw(
    target: Structure | Tombstone,
    resourceType: ResourceConstant,
    amount?: number
  ): number;
}

interface PowerCreepMemory {
  [key: string]: any;
}

interface PowerInfo {
  level: number;
  cooldown: number;
}

interface Resource extends RoomObject {
  amount: number;
  id: string;
  resourceType: ResourceConstant;
}

interface Source extends RoomObject {
  energy: number;
  energyCapacity: number;
  id: string;
  ticksToRegeneration: number;
}

interface Mineral extends RoomObject {
  density: number;
  mineralAmount: number;
  mineralType: MineralConstant;
  id: string;
  ticksToRegeneration: number;
}

interface Deposit extends RoomObject {
  cooldown: number;
  depositType: DepositConstant;
  id: string;
  lastCooldown: number;
  ticksToDecay: number;
}

interface Nuke extends RoomObject {
  id: string;
  launchRoomName: string;
  timeToLand: number;
}

interface Tombstone extends RoomObject {
  creep: Creep | PowerCreep;
  deathTime: number;
  id: string;
  store: StoreDefinition;
  ticksToDecay: number;
}

// Structure interfaces
interface StructureSpawn extends OwnedStructure {
  energy: number;
  energyCapacity: number;
  memory: SpawnMemory;
  name: string;
  spawning: Spawning | null;
  store: StoreDefinition;

  canCreateCreep(body: BodyPartConstant[], name?: string): number;
  createCreep(
    body: BodyPartConstant[],
    name?: string,
    memory?: CreepMemory
  ): number;
  spawnCreep(
    body: BodyPartConstant[],
    name?: string,
    opts?: SpawnOptions
  ): number;
  recycleCreep(target: Creep): number;
  renewCreep(target: Creep): number;
}

interface SpawnMemory {
  [key: string]: any;
}

interface Spawning {
  name: string;
  needTime: number;
  remainingTime: number;
  spawn: StructureSpawn;
  directions: DirectionConstant[];
}

interface SpawnOptions {
  memory?: CreepMemory;
  energyStructures?: StructureSpawn[];
  dryRun?: boolean;
}

interface OwnedStructure extends Structure {
  my: boolean;
  owner: Owner;
}

interface StructureController extends OwnedStructure {
  isPowerEnabled: boolean;
  level: number;
  progress: number;
  progressTotal: number;
  reservation: ReservationDefinition;
  safeMode: number;
  safeModeAvailable: number;
  safeModeCooldown: number;
  sign: SignDefinition;
  ticksToDowngrade: number;
  upgradeBlocked: number;

  activateSafeMode(): number;
  unclaim(): number;
}

interface ReservationDefinition {
  username: string;
  ticksToEnd: number;
}

interface SignDefinition {
  datetime: Date;
  time: number;
  user: string;
  text: string;
  message: string;
}

interface StructureStorage extends OwnedStructure {
  store: StoreDefinition;
  storeCapacity: number;
}

interface StructureTerminal extends OwnedStructure {
  cooldown: number;
  store: StoreDefinition;
  storeCapacity: number;

  send(
    resourceType: ResourceConstant,
    amount: number,
    destination: string,
    description?: string
  ): number;
}

// Constants
type DirectionConstant =
  | TOP
  | TOP_RIGHT
  | RIGHT
  | BOTTOM_RIGHT
  | BOTTOM
  | BOTTOM_LEFT
  | LEFT
  | TOP_LEFT;
type ExitConstant =
  | FIND_EXIT_TOP
  | FIND_EXIT_RIGHT
  | FIND_EXIT_BOTTOM
  | FIND_EXIT_LEFT
  | FIND_EXIT;
type FindConstant =
  | FIND_EXIT_TOP
  | FIND_EXIT_RIGHT
  | FIND_EXIT_BOTTOM
  | FIND_EXIT_LEFT
  | FIND_EXIT
  | FIND_CREEPS
  | FIND_MY_CREEPS
  | FIND_HOSTILE_CREEPS
  | FIND_SOURCES_ACTIVE
  | FIND_SOURCES
  | FIND_DROPPED_RESOURCES
  | FIND_STRUCTURES
  | FIND_MY_STRUCTURES
  | FIND_HOSTILE_STRUCTURES
  | FIND_FLAGS
  | FIND_CONSTRUCTION_SITES
  | FIND_MY_SPAWNS
  | FIND_HOSTILE_SPAWNS
  | FIND_MY_POWER_CREEPS
  | FIND_HOSTILE_POWER_CREEPS
  | FIND_DEPOSITS
  | FIND_TOMBSTONES
  | FIND_RUINS;
type ResourceConstant =
  | RESOURCE_ENERGY
  | RESOURCE_POWER
  | MineralConstant
  | DepositConstant;
type MineralConstant =
  | RESOURCE_HYDROGEN
  | RESOURCE_OXYGEN
  | RESOURCE_UTRIUM
  | RESOURCE_LEMERGIUM
  | RESOURCE_KEANIUM
  | RESOURCE_ZYNTHIUM
  | RESOURCE_CATALYST
  | RESOURCE_GHODIUM
  | RESOURCE_SILICON
  | RESOURCE_METAL
  | RESOURCE_BIOMASS
  | RESOURCE_MIST;
type DepositConstant =
  | RESOURCE_METAL
  | RESOURCE_SILICON
  | RESOURCE_BIOMASS
  | RESOURCE_MIST;
type StructureConstant =
  | STRUCTURE_EXTENSION
  | STRUCTURE_RAMPART
  | STRUCTURE_ROAD
  | STRUCTURE_SPAWN
  | STRUCTURE_LINK
  | STRUCTURE_WALL
  | STRUCTURE_KEEPER_LAIR
  | STRUCTURE_CONTROLLER
  | STRUCTURE_STORAGE
  | STRUCTURE_TOWER
  | STRUCTURE_OBSERVER
  | STRUCTURE_POWER_BANK
  | STRUCTURE_POWER_SPAWN
  | STRUCTURE_EXTRACTOR
  | STRUCTURE_LAB
  | STRUCTURE_TERMINAL
  | STRUCTURE_CONTAINER
  | STRUCTURE_NUKER
  | STRUCTURE_FACTORY
  | STRUCTURE_INVADER_CORE;
type BuildableStructureConstant =
  | STRUCTURE_EXTENSION
  | STRUCTURE_RAMPART
  | STRUCTURE_ROAD
  | STRUCTURE_SPAWN
  | STRUCTURE_LINK
  | STRUCTURE_WALL
  | STRUCTURE_TOWER
  | STRUCTURE_OBSERVER
  | STRUCTURE_POWER_SPAWN
  | STRUCTURE_EXTRACTOR
  | STRUCTURE_LAB
  | STRUCTURE_TERMINAL
  | STRUCTURE_CONTAINER
  | STRUCTURE_NUKER
  | STRUCTURE_FACTORY;
type BodyPartConstant =
  | MOVE
  | WORK
  | CARRY
  | ATTACK
  | RANGED_ATTACK
  | TOUGH
  | HEAL
  | CLAIM
  | RANGED_HEAL;
type ColorConstant =
  | COLOR_RED
  | COLOR_PURPLE
  | COLOR_BLUE
  | COLOR_CYAN
  | COLOR_GREEN
  | COLOR_YELLOW
  | COLOR_ORANGE
  | COLOR_BROWN
  | COLOR_GREY
  | COLOR_WHITE;
type PowerClassConstant = OPERATOR;
type PowerConstant =
  | PWR_GENERATE_OPS
  | PWR_OPERATE_SPAWN
  | PWR_OPERATE_TOWER
  | PWR_OPERATE_STORAGE
  | PWR_OPERATE_LAB
  | PWR_OPERATE_EXTENSION
  | PWR_OPERATE_OBSERVER
  | PWR_OPERATE_TERMINAL
  | PWR_DISRUPT_SPAWN
  | PWR_DISRUPT_TOWER
  | PWR_DISRUPT_SOURCE
  | PWR_SHIELD
  | PWR_REGEN_SOURCE
  | PWR_REGEN_MINERAL
  | PWR_DISRUPT_TERMINAL
  | PWR_OPERATE_POWER
  | PWR_FORTIFY
  | PWR_OPERATE_CONTROLLER
  | PWR_OPERATE_FACTORY;

// Direction constants
declare const TOP: 1;
declare const TOP_RIGHT: 2;
declare const RIGHT: 3;
declare const BOTTOM_RIGHT: 4;
declare const BOTTOM: 5;
declare const BOTTOM_LEFT: 6;
declare const LEFT: 7;
declare const TOP_LEFT: 8;

// Exit constants
declare const FIND_EXIT_TOP: 1;
declare const FIND_EXIT_RIGHT: 3;
declare const FIND_EXIT_BOTTOM: 5;
declare const FIND_EXIT_LEFT: 7;
declare const FIND_EXIT: 10;

// Find constants
declare const FIND_CREEPS: 101;
declare const FIND_MY_CREEPS: 102;
declare const FIND_HOSTILE_CREEPS: 103;
declare const FIND_SOURCES_ACTIVE: 104;
declare const FIND_SOURCES: 105;
declare const FIND_DROPPED_RESOURCES: 106;
declare const FIND_STRUCTURES: 107;
declare const FIND_MY_STRUCTURES: 108;
declare const FIND_HOSTILE_STRUCTURES: 109;
declare const FIND_FLAGS: 110;
declare const FIND_CONSTRUCTION_SITES: 111;
declare const FIND_MY_SPAWNS: 112;
declare const FIND_HOSTILE_SPAWNS: 113;
declare const FIND_MY_POWER_CREEPS: 114;
declare const FIND_HOSTILE_POWER_CREEPS: 115;
declare const FIND_DEPOSITS: 116;
declare const FIND_TOMBSTONES: 117;
declare const FIND_RUINS: 118;

// Resource constants
declare const RESOURCE_ENERGY: "energy";
declare const RESOURCE_POWER: "power";
declare const RESOURCE_HYDROGEN: "H";
declare const RESOURCE_OXYGEN: "O";
declare const RESOURCE_UTRIUM: "U";
declare const RESOURCE_LEMERGIUM: "L";
declare const RESOURCE_KEANIUM: "K";
declare const RESOURCE_ZYNTHIUM: "Z";
declare const RESOURCE_CATALYST: "X";
declare const RESOURCE_GHODIUM: "G";
declare const RESOURCE_SILICON: "silicon";
declare const RESOURCE_METAL: "metal";
declare const RESOURCE_BIOMASS: "biomass";
declare const RESOURCE_MIST: "mist";

// Structure constants
declare const STRUCTURE_EXTENSION: "extension";
declare const STRUCTURE_RAMPART: "rampart";
declare const STRUCTURE_ROAD: "road";
declare const STRUCTURE_SPAWN: "spawn";
declare const STRUCTURE_LINK: "link";
declare const STRUCTURE_WALL: "constructedWall";
declare const STRUCTURE_KEEPER_LAIR: "keeperLair";
declare const STRUCTURE_CONTROLLER: "controller";
declare const STRUCTURE_STORAGE: "storage";
declare const STRUCTURE_TOWER: "tower";
declare const STRUCTURE_OBSERVER: "observer";
declare const STRUCTURE_POWER_BANK: "powerBank";
declare const STRUCTURE_POWER_SPAWN: "powerSpawn";
declare const STRUCTURE_EXTRACTOR: "extractor";
declare const STRUCTURE_LAB: "lab";
declare const STRUCTURE_TERMINAL: "terminal";
declare const STRUCTURE_CONTAINER: "container";
declare const STRUCTURE_NUKER: "nuker";
declare const STRUCTURE_FACTORY: "factory";
declare const STRUCTURE_INVADER_CORE: "invaderCore";

// Body part constants
declare const MOVE: "move";
declare const WORK: "work";
declare const CARRY: "carry";
declare const ATTACK: "attack";
declare const RANGED_ATTACK: "ranged_attack";
declare const TOUGH: "tough";
declare const HEAL: "heal";
declare const CLAIM: "claim";
declare const RANGED_HEAL: "ranged_heal";

// Color constants
declare const COLOR_RED: 1;
declare const COLOR_PURPLE: 2;
declare const COLOR_BLUE: 3;
declare const COLOR_CYAN: 4;
declare const COLOR_GREEN: 5;
declare const COLOR_YELLOW: 6;
declare const COLOR_ORANGE: 7;
declare const COLOR_BROWN: 8;
declare const COLOR_GREY: 9;
declare const COLOR_WHITE: 10;

// Power class constants
declare const OPERATOR: "operator";

// Power constants
declare const PWR_GENERATE_OPS: "generateOps";
declare const PWR_OPERATE_SPAWN: "operateSpawn";
declare const PWR_OPERATE_TOWER: "operateTower";
declare const PWR_OPERATE_STORAGE: "operateStorage";
declare const PWR_OPERATE_LAB: "operateLab";
declare const PWR_OPERATE_EXTENSION: "operateExtension";
declare const PWR_OPERATE_OBSERVER: "operateObserver";
declare const PWR_OPERATE_TERMINAL: "operateTerminal";
declare const PWR_DISRUPT_SPAWN: "disruptSpawn";
declare const PWR_DISRUPT_TOWER: "disruptTower";
declare const PWR_DISRUPT_SOURCE: "disruptSource";
declare const PWR_SHIELD: "shield";
declare const PWR_REGEN_SOURCE: "regenSource";
declare const PWR_REGEN_MINERAL: "regenMineral";
declare const PWR_DISRUPT_TERMINAL: "disruptTerminal";
declare const PWR_OPERATE_POWER: "operatePower";
declare const PWR_FORTIFY: "fortify";
declare const PWR_OPERATE_CONTROLLER: "operateController";
declare const PWR_OPERATE_FACTORY: "operateFactory";

// Error codes
declare const OK: 0;
declare const ERR_NOT_OWNER: -1;
declare const ERR_NO_PATH: -2;
declare const ERR_NAME_EXISTS: -3;
declare const ERR_BUSY: -4;
declare const ERR_NOT_FOUND: -5;
declare const ERR_NOT_ENOUGH_ENERGY: -6;
declare const ERR_NOT_ENOUGH_RESOURCES: -6;
declare const ERR_INVALID_TARGET: -7;
declare const ERR_FULL: -8;
declare const ERR_NOT_IN_RANGE: -9;
declare const ERR_INVALID_ARGS: -10;
declare const ERR_TIRED: -11;
declare const ERR_NO_BODYPART: -12;
declare const ERR_NOT_ENOUGH_EXTENSIONS: -6;
declare const ERR_RCL_NOT_ENOUGH: -14;
declare const ERR_GCL_NOT_ENOUGH: -15;

// Shard interface
interface Shard {
  name: string;
  type: string;
  ptr: boolean;
}

// Missing constants that are used in the example code
declare const FIND_SOURCES: 105;
declare const FIND_STRUCTURES: 107;
declare const FIND_CONSTRUCTION_SITES: 111;
declare const ERR_NOT_IN_RANGE: -9;
declare const RESOURCE_ENERGY: "energy";
declare const STRUCTURE_EXTENSION: "extension";
declare const STRUCTURE_SPAWN: "spawn";
declare const STRUCTURE_TOWER: "tower";

// Export constants for use in other modules
export {
  FIND_SOURCES,
  FIND_STRUCTURES,
  FIND_CONSTRUCTION_SITES,
  ERR_NOT_IN_RANGE,
  RESOURCE_ENERGY,
  STRUCTURE_EXTENSION,
  STRUCTURE_SPAWN,
  STRUCTURE_TOWER,
};

// Export all the types for use in other modules
export type {
  Game,
  Creep,
  Structure,
  Room,
  RoomObject,
  RoomPosition,
  Store,
  CreepMemory,
  StructureController,
  ConstructionSite,
  Flag,
  PowerCreep,
  Resource,
  Source,
  Mineral,
  Deposit,
  Nuke,
  Tombstone,
  StructureSpawn,
  OwnedStructure,
  StructureStorage,
  StructureTerminal,
  CPU,
  Memory,
  RawMemory,
  PathFinder,
  InterShardMemory,
  GameMap,
  Market,
  GCL,
  GPL,
  Shard,
};

export {};
