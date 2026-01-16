import type { Position, Entity } from "./common";

export type CharacterClass = "knight" | "paladin" | "sorcerer" | "druid";

export interface PlayerStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
}

export interface PlayerState extends Entity {
  type: "player";
  name: string;
  characterClass: CharacterClass;
  level: number;
  experience: number;
  stats: PlayerStats;
  isAdmin: boolean;
  isGodMode: boolean;
  direction: "up" | "down" | "left" | "right";
  isMoving: boolean;
  isRunning: boolean;
}

export interface PublicPlayerState {
  id: string;
  name: string;
  characterClass: CharacterClass;
  level: number;
  position: Position;
  direction: "up" | "down" | "left" | "right";
  isMoving: boolean;
  health: number;
  maxHealth: number;
}
