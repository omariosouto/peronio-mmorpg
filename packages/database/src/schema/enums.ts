import { pgEnum } from "drizzle-orm/pg-core";

export const characterClassEnum = pgEnum("character_class", [
  "knight",
  "paladin",
  "sorcerer",
  "druid",
]);

export const itemTypeEnum = pgEnum("item_type", [
  "weapon",
  "armor",
  "helmet",
  "shield",
  "boots",
  "ring",
  "amulet",
  "consumable",
  "material",
  "quest",
]);

export const itemRarityEnum = pgEnum("item_rarity", [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
]);

export const questStatusEnum = pgEnum("quest_status", [
  "available",
  "in_progress",
  "completed",
  "failed",
]);
