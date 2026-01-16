import type { Position, Rectangle } from "./common";

export interface TileDefinition {
  id: string;
  name: string;
  spriteId: string;
  walkable: boolean;
  swimable: boolean;
  speedModifier: number;
  damagePerSecond: number;
  damageType: DamageType | null;
  isAnimated: boolean;
  animationFrames: number;
  animationSpeed: number;
  lightRadius: number;
  lightColor: string;
}

export type DamageType = "physical" | "fire" | "ice" | "lightning" | "poison" | "holy" | "nature";

export interface TileLayer {
  name: string;
  zIndex: number;
  tiles: (string | null)[][];
  visible: boolean;
}

export interface SpawnPoint {
  id: string;
  x: number;
  y: number;
  type: "player" | "creature";
  creatureTemplateId?: string;
  respawnTime?: number;
}

export interface Portal {
  id: string;
  sourceRect: Rectangle;
  targetMapId: string;
  targetX: number;
  targetY: number;
}

export interface MapData {
  id: string;
  name: string;
  width: number;
  height: number;
  layers: TileLayer[];
  collisions: boolean[][];
  spawnPoints: SpawnPoint[];
  portals: Portal[];
  pvpZones: Rectangle[];
  safeZones: Rectangle[];
}
