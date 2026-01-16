import type { BaseMessage, ServerMessageType, ChatChannel } from "./messages";
import type { Position, Direction } from "../types/common";
import type { PlayerState, PublicPlayerState } from "../types/player";
import type { DamageType, MapData } from "../types/map";
import type { InventoryItem, EquipmentSlots } from "../types/item";

export interface ServerMessage extends BaseMessage {
  type: ServerMessageType;
}

export interface AuthSuccessMessage extends ServerMessage {
  type: ServerMessageType.AUTH_SUCCESS;
  player: PlayerState;
}

export interface AuthFailureMessage extends ServerMessage {
  type: ServerMessageType.AUTH_FAILURE;
  reason: string;
}

export interface WorldStateMessage extends ServerMessage {
  type: ServerMessageType.WORLD_STATE;
  player: PlayerState;
  nearbyPlayers: PublicPlayerState[];
  creatures: CreatureState[];
  groundItems: GroundItemState[];
  mapId: string;
}

export interface CreatureState {
  id: string;
  templateId: string;
  name: string;
  position: Position;
  direction: Direction;
  health: number;
  maxHealth: number;
  isMoving: boolean;
}

export interface GroundItemState {
  id: string;
  itemId: string;
  position: Position;
  quantity: number;
}

export interface PlayerMovedMessage extends ServerMessage {
  type: ServerMessageType.PLAYER_MOVED;
  playerId: string;
  position: Position;
  direction: Direction;
  isRunning: boolean;
  sequenceNumber?: number;
}

export interface PlayerJoinedMessage extends ServerMessage {
  type: ServerMessageType.PLAYER_JOINED;
  player: PublicPlayerState;
}

export interface PlayerLeftMessage extends ServerMessage {
  type: ServerMessageType.PLAYER_LEFT;
  playerId: string;
}

export interface CombatDamageMessage extends ServerMessage {
  type: ServerMessageType.COMBAT_DAMAGE;
  attackerId: string;
  targetId: string;
  damage: number;
  damageType: DamageType;
  isCritical: boolean;
  targetCurrentHealth: number;
}

export interface MapDataMessage extends ServerMessage {
  type: ServerMessageType.MAP_DATA;
  map: MapData;
}

export interface InventoryUpdateMessage extends ServerMessage {
  type: ServerMessageType.INVENTORY_UPDATE;
  inventory: InventoryItem[];
}

export interface EquipmentUpdateMessage extends ServerMessage {
  type: ServerMessageType.EQUIPMENT_UPDATE;
  equipment: EquipmentSlots;
}

export interface ChatMessageResponse extends ServerMessage {
  type: ServerMessageType.CHAT_MESSAGE;
  channel: ChatChannel;
  senderId: string;
  senderName: string;
  content: string;
}

export interface SystemMessageResponse extends ServerMessage {
  type: ServerMessageType.SYSTEM_MESSAGE;
  content: string;
  level: "info" | "warning" | "error";
}

export interface PongMessage extends ServerMessage {
  type: ServerMessageType.PONG;
}

export interface ErrorMessage extends ServerMessage {
  type: ServerMessageType.ERROR;
  code: string;
  message: string;
}

export interface GodModeEnabledMessage extends ServerMessage {
  type: ServerMessageType.GOD_MODE_ENABLED;
}

export interface GodModeDisabledMessage extends ServerMessage {
  type: ServerMessageType.GOD_MODE_DISABLED;
}

export type AnyServerMessage =
  | AuthSuccessMessage
  | AuthFailureMessage
  | WorldStateMessage
  | PlayerMovedMessage
  | PlayerJoinedMessage
  | PlayerLeftMessage
  | CombatDamageMessage
  | MapDataMessage
  | InventoryUpdateMessage
  | EquipmentUpdateMessage
  | ChatMessageResponse
  | SystemMessageResponse
  | PongMessage
  | ErrorMessage
  | GodModeEnabledMessage
  | GodModeDisabledMessage;
