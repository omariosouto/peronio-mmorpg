export interface BaseMessage {
  type: string;
  timestamp: number;
  correlationId?: string;
}

export enum ClientMessageType {
  // Authentication
  AUTH_LOGIN = "auth:login",
  AUTH_LOGOUT = "auth:logout",

  // Movement
  MOVE = "player:move",
  STOP = "player:stop",

  // Combat
  ATTACK = "combat:attack",
  USE_SKILL = "combat:use_skill",

  // Inventory
  PICKUP_ITEM = "inventory:pickup",
  DROP_ITEM = "inventory:drop",
  USE_ITEM = "inventory:use",
  EQUIP_ITEM = "inventory:equip",
  UNEQUIP_ITEM = "inventory:unequip",

  // Chat
  CHAT_MESSAGE = "chat:message",

  // Interaction
  INTERACT_NPC = "interact:npc",
  ACCEPT_QUEST = "quest:accept",
  COMPLETE_QUEST = "quest:complete",

  // Editor (Admin only)
  EDITOR_SAVE_MAP = "editor:save_map",
  EDITOR_PLACE_TILE = "editor:place_tile",
  EDITOR_PLACE_CREATURE = "editor:place_creature",

  // God Mode
  GOD_TELEPORT = "god:teleport",
  GOD_SPAWN_ITEM = "god:spawn_item",
  GOD_KILL_ALL = "god:kill_all",
  GOD_TOGGLE = "god:toggle",

  // System
  PING = "system:ping",
  REQUEST_SYNC = "system:request_sync",
}

export enum ServerMessageType {
  // Authentication
  AUTH_SUCCESS = "auth:success",
  AUTH_FAILURE = "auth:failure",

  // World state
  WORLD_STATE = "world:state",
  WORLD_UPDATE = "world:update",

  // Player updates
  PLAYER_JOINED = "player:joined",
  PLAYER_LEFT = "player:left",
  PLAYER_MOVED = "player:moved",
  PLAYER_STATS_UPDATE = "player:stats_update",

  // Creature updates
  CREATURE_SPAWNED = "creature:spawned",
  CREATURE_MOVED = "creature:moved",
  CREATURE_DIED = "creature:died",
  CREATURE_ATTACKED = "creature:attacked",

  // Combat
  COMBAT_DAMAGE = "combat:damage",
  COMBAT_HEAL = "combat:heal",
  COMBAT_EFFECT = "combat:effect",
  COMBAT_DEATH = "combat:death",

  // Items
  ITEM_DROPPED = "item:dropped",
  ITEM_PICKED_UP = "item:picked_up",
  ITEM_DESPAWNED = "item:despawned",

  // Inventory
  INVENTORY_UPDATE = "inventory:update",
  EQUIPMENT_UPDATE = "equipment:update",

  // Chat
  CHAT_MESSAGE = "chat:message",
  SYSTEM_MESSAGE = "system:message",

  // Quest
  QUEST_UPDATE = "quest:update",
  QUEST_COMPLETED = "quest:completed",

  // Map
  MAP_CHANGE = "map:change",
  MAP_DATA = "map:data",

  // System
  PONG = "system:pong",
  ERROR = "system:error",

  // God Mode
  GOD_MODE_ENABLED = "god:enabled",
  GOD_MODE_DISABLED = "god:disabled",
}

export type ChatChannel = "global" | "local" | "party" | "guild" | "private" | "system";
