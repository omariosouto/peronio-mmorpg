export interface Position {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Direction = "up" | "down" | "left" | "right";

export type EntityType = "player" | "creature" | "npc" | "item";

export interface Entity {
  id: string;
  type: EntityType;
  position: Position;
}
