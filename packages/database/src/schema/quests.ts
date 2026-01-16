import { pgTable, uuid, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { characterClassEnum, questStatusEnum } from "./enums";
import { players } from "./players";
import { maps } from "./maps";

export { questStatusEnum };

export interface QuestObjectiveData {
  id: string;
  type: "kill" | "collect" | "explore" | "talk";
  description: string;
  target: string;
  targetCount: number;
}

export interface ItemRewardData {
  itemId: string;
  quantity: number;
}

export const quests = pgTable("quests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 128 }).notNull(),
  description: varchar("description", { length: 2048 }).notNull(),

  // Quest giver NPC
  npcId: uuid("npc_id"),
  npcMapId: uuid("npc_map_id").references(() => maps.id),
  npcX: integer("npc_x"),
  npcY: integer("npc_y"),

  // Requirements
  requiredLevel: integer("required_level").default(1).notNull(),
  requiredClass: characterClassEnum("required_class"),
  prerequisiteQuestId: uuid("prerequisite_quest_id"),

  // Objectives
  objectives: jsonb("objectives").$type<QuestObjectiveData[]>().notNull(),

  // Rewards
  experienceReward: integer("experience_reward").default(0).notNull(),
  goldReward: integer("gold_reward").default(0).notNull(),
  itemRewards: jsonb("item_rewards").$type<ItemRewardData[]>().default([]),

  // Flags
  isRepeatable: boolean("is_repeatable").default(false).notNull(),
  isMainQuest: boolean("is_main_quest").default(false).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),

  createdBy: uuid("created_by").references(() => players.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const playerQuests = pgTable("player_quests", {
  id: uuid("id").primaryKey().defaultRandom(),
  playerId: uuid("player_id")
    .references(() => players.id, { onDelete: "cascade" })
    .notNull(),
  questId: uuid("quest_id")
    .references(() => quests.id)
    .notNull(),
  status: questStatusEnum("status").default("available").notNull(),

  // Progress tracking
  progress: jsonb("progress").$type<Record<string, number>>().default({}),

  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

// Relations
export const questsRelations = relations(quests, ({ one, many }) => ({
  npcMap: one(maps, {
    fields: [quests.npcMapId],
    references: [maps.id],
  }),
  creator: one(players, {
    fields: [quests.createdBy],
    references: [players.id],
  }),
  playerQuests: many(playerQuests),
}));

export const playerQuestsRelations = relations(playerQuests, ({ one }) => ({
  player: one(players, {
    fields: [playerQuests.playerId],
    references: [players.id],
  }),
  quest: one(quests, {
    fields: [playerQuests.questId],
    references: [quests.id],
  }),
}));
