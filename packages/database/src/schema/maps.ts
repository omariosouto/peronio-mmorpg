import { pgTable, uuid, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export interface TileLayerData {
  name: string;
  zIndex: number;
  tiles: (string | null)[][];
  visible: boolean;
}

export interface SpawnPointData {
  id: string;
  x: number;
  y: number;
  type: "player" | "creature";
  creatureTemplateId?: string;
  respawnTime?: number;
}

export interface PortalData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  targetMapId: string;
  targetX: number;
  targetY: number;
}

export interface LootEntry {
  itemId: string;
  chance: number;
  minQuantity: number;
  maxQuantity: number;
}

export const maps = pgTable("maps", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 128 }).notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),

  // Map data
  tileData: jsonb("tile_data").$type<TileLayerData[]>().notNull(),
  collisionData: jsonb("collision_data").$type<boolean[][]>().notNull(),

  // Metadata
  spawnPoints: jsonb("spawn_points").$type<SpawnPointData[]>().default([]),
  portals: jsonb("portals").$type<PortalData[]>().default([]),

  // Flags
  isPublished: boolean("is_published").default(false).notNull(),
  isPvpEnabled: boolean("is_pvp_enabled").default(false).notNull(),

  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const creatureTemplates = pgTable("creature_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull(),
  spriteId: varchar("sprite_id", { length: 64 }).notNull(),

  level: integer("level").default(1).notNull(),
  health: integer("health").notNull(),
  mana: integer("mana").default(0).notNull(),

  attack: integer("attack").notNull(),
  defense: integer("defense").notNull(),
  speed: integer("speed").default(100).notNull(),

  experienceReward: integer("experience_reward").notNull(),
  lootTable: jsonb("loot_table").$type<LootEntry[]>().default([]),

  abilities: jsonb("abilities").$type<string[]>().default([]),
  isAggressive: boolean("is_aggressive").default(true).notNull(),
  aggroRange: integer("aggro_range").default(5),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mapCreatures = pgTable("map_creatures", {
  id: uuid("id").primaryKey().defaultRandom(),
  mapId: uuid("map_id")
    .references(() => maps.id, { onDelete: "cascade" })
    .notNull(),
  creatureTemplateId: uuid("creature_template_id")
    .references(() => creatureTemplates.id)
    .notNull(),
  spawnX: integer("spawn_x").notNull(),
  spawnY: integer("spawn_y").notNull(),
  respawnTime: integer("respawn_time").default(60).notNull(),
  wanderRadius: integer("wander_radius").default(5),
});

// Relations
export const mapsRelations = relations(maps, ({ many }) => ({
  creatures: many(mapCreatures),
}));

export const mapCreaturesRelations = relations(mapCreatures, ({ one }) => ({
  map: one(maps, {
    fields: [mapCreatures.mapId],
    references: [maps.id],
  }),
  template: one(creatureTemplates, {
    fields: [mapCreatures.creatureTemplateId],
    references: [creatureTemplates.id],
  }),
}));
