import type { CharacterClass } from "../types/player";

export interface ClassDefinition {
  id: CharacterClass;
  name: string;
  description: string;
  baseStats: {
    health: number;
    mana: number;
    strength: number;
    dexterity: number;
    intelligence: number;
    vitality: number;
  };
  statsPerLevel: {
    health: number;
    mana: number;
    strength: number;
    dexterity: number;
    intelligence: number;
    vitality: number;
  };
  meleeMultiplier: number;
  rangedMultiplier: number;
  magicMultiplier: number;
  startingAbilities: string[];
}

export const CLASS_DEFINITIONS: Record<CharacterClass, ClassDefinition> = {
  knight: {
    id: "knight",
    name: "Knight",
    description: "Masters of melee combat with heavy armor and swords.",
    baseStats: {
      health: 150,
      mana: 30,
      strength: 15,
      dexterity: 8,
      intelligence: 5,
      vitality: 12,
    },
    statsPerLevel: {
      health: 15,
      mana: 3,
      strength: 3,
      dexterity: 1,
      intelligence: 0,
      vitality: 2,
    },
    meleeMultiplier: 1.5,
    rangedMultiplier: 0.8,
    magicMultiplier: 0.5,
    startingAbilities: ["basic_attack", "block"],
  },

  paladin: {
    id: "paladin",
    name: "Paladin",
    description: "Holy warriors who combine combat skills with healing magic.",
    baseStats: {
      health: 120,
      mana: 60,
      strength: 12,
      dexterity: 10,
      intelligence: 8,
      vitality: 10,
    },
    statsPerLevel: {
      health: 12,
      mana: 6,
      strength: 2,
      dexterity: 2,
      intelligence: 1,
      vitality: 2,
    },
    meleeMultiplier: 1.2,
    rangedMultiplier: 1.0,
    magicMultiplier: 0.8,
    startingAbilities: ["basic_attack", "divine_heal"],
  },

  sorcerer: {
    id: "sorcerer",
    name: "Sorcerer",
    description: "Powerful mages specializing in destructive elemental magic.",
    baseStats: {
      health: 80,
      mana: 150,
      strength: 5,
      dexterity: 8,
      intelligence: 18,
      vitality: 6,
    },
    statsPerLevel: {
      health: 6,
      mana: 15,
      strength: 0,
      dexterity: 1,
      intelligence: 4,
      vitality: 1,
    },
    meleeMultiplier: 0.5,
    rangedMultiplier: 0.7,
    magicMultiplier: 1.5,
    startingAbilities: ["magic_missile", "fire_bolt"],
  },

  druid: {
    id: "druid",
    name: "Druid",
    description: "Nature mages with powerful healing and support abilities.",
    baseStats: {
      health: 100,
      mana: 120,
      strength: 6,
      dexterity: 10,
      intelligence: 15,
      vitality: 8,
    },
    statsPerLevel: {
      health: 8,
      mana: 12,
      strength: 0,
      dexterity: 2,
      intelligence: 3,
      vitality: 2,
    },
    meleeMultiplier: 0.6,
    rangedMultiplier: 0.8,
    magicMultiplier: 1.3,
    startingAbilities: ["nature_touch", "healing_wave"],
  },
};
