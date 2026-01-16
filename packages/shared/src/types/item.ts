import type { CharacterClass } from "./player";
import type { DamageType } from "./map";

export type ItemType =
  | "weapon"
  | "armor"
  | "helmet"
  | "shield"
  | "boots"
  | "ring"
  | "amulet"
  | "consumable"
  | "material"
  | "quest";

export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface ItemAttributes {
  attackSpeed?: number;
  critChance?: number;
  lifeSteal?: number;
  manaRegen?: number;
  healthRegen?: number;
  movementSpeed?: number;
  damageType?: DamageType;
}

export interface ItemDefinition {
  id: string;
  name: string;
  description: string;
  spriteId: string;
  type: ItemType;
  rarity: ItemRarity;
  requiredLevel: number;
  requiredClass?: CharacterClass;
  attack?: number;
  defense?: number;
  healthBonus?: number;
  manaBonus?: number;
  attributes: ItemAttributes;
  buyPrice?: number;
  sellPrice?: number;
  isStackable: boolean;
  maxStack: number;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  slot: number;
  metadata?: Record<string, unknown>;
}

export type EquipmentSlot =
  | "weapon"
  | "shield"
  | "helmet"
  | "armor"
  | "boots"
  | "ring1"
  | "ring2"
  | "amulet";

export type EquipmentSlots = Partial<Record<EquipmentSlot, string>>;
