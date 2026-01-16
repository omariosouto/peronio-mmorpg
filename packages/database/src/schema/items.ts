import { pgTable, uuid, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { characterClassEnum, itemTypeEnum, itemRarityEnum } from "./enums";

export { itemTypeEnum, itemRarityEnum };

export interface ItemAttributesData {
  attackSpeed?: number;
  critChance?: number;
  lifeSteal?: number;
  manaRegen?: number;
  healthRegen?: number;
  movementSpeed?: number;
  damageType?: string;
}

export const items = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull(),
  description: varchar("description", { length: 512 }),
  spriteId: varchar("sprite_id", { length: 64 }).notNull(),

  type: itemTypeEnum("type").notNull(),
  rarity: itemRarityEnum("rarity").default("common").notNull(),

  // Requirements
  requiredLevel: integer("required_level").default(1).notNull(),
  requiredClass: characterClassEnum("required_class"),

  // Stats
  attack: integer("attack"),
  defense: integer("defense"),
  healthBonus: integer("health_bonus"),
  manaBonus: integer("mana_bonus"),

  // Additional attributes
  attributes: jsonb("attributes").$type<ItemAttributesData>().default({}),

  // Economy
  buyPrice: integer("buy_price"),
  sellPrice: integer("sell_price"),
  isStackable: boolean("is_stackable").default(false).notNull(),
  maxStack: integer("max_stack").default(1),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
