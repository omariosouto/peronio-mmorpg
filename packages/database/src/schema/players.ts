import { pgTable, uuid, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { characterClassEnum } from "./enums";
import { maps } from "./maps";
import { items } from "./items";

export { characterClassEnum };

export const players = pgTable("players", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 32 }).unique().notNull(),
  characterClass: characterClassEnum("character_class").notNull(),

  // Stats
  level: integer("level").default(1).notNull(),
  experience: integer("experience").default(0).notNull(),
  health: integer("health").default(100).notNull(),
  maxHealth: integer("max_health").default(100).notNull(),
  mana: integer("mana").default(50).notNull(),
  maxMana: integer("max_mana").default(50).notNull(),

  // Attributes
  strength: integer("strength").default(10).notNull(),
  dexterity: integer("dexterity").default(10).notNull(),
  intelligence: integer("intelligence").default(10).notNull(),
  vitality: integer("vitality").default(10).notNull(),

  // Position
  mapId: uuid("map_id").references(() => maps.id),
  positionX: integer("position_x").default(100).notNull(),
  positionY: integer("position_y").default(100).notNull(),

  // Flags
  isAdmin: boolean("is_admin").default(false).notNull(),
  isGodMode: boolean("is_god_mode").default(false).notNull(),
  isBanned: boolean("is_banned").default(false).notNull(),

  // Equipment
  equipment: jsonb("equipment").$type<Record<string, string>>().default({}),

  // Gold
  gold: integer("gold").default(0).notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});

export const playerInventory = pgTable("player_inventory", {
  id: uuid("id").primaryKey().defaultRandom(),
  playerId: uuid("player_id")
    .references(() => players.id, { onDelete: "cascade" })
    .notNull(),
  itemId: uuid("item_id")
    .references(() => items.id)
    .notNull(),
  quantity: integer("quantity").default(1).notNull(),
  slot: integer("slot").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
});

export const playerSkills = pgTable("player_skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  playerId: uuid("player_id")
    .references(() => players.id, { onDelete: "cascade" })
    .notNull(),
  skillId: varchar("skill_id", { length: 64 }).notNull(),
  level: integer("level").default(1).notNull(),
  experience: integer("experience").default(0).notNull(),
});

// Relations
export const playersRelations = relations(players, ({ many, one }) => ({
  inventory: many(playerInventory),
  skills: many(playerSkills),
  currentMap: one(maps, {
    fields: [players.mapId],
    references: [maps.id],
  }),
}));

export const playerInventoryRelations = relations(playerInventory, ({ one }) => ({
  player: one(players, {
    fields: [playerInventory.playerId],
    references: [players.id],
  }),
  item: one(items, {
    fields: [playerInventory.itemId],
    references: [items.id],
  }),
}));

export const playerSkillsRelations = relations(playerSkills, ({ one }) => ({
  player: one(players, {
    fields: [playerSkills.playerId],
    references: [players.id],
  }),
}));
