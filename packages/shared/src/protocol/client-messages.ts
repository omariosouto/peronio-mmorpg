import type { BaseMessage, ClientMessageType, ChatChannel } from "./messages";
import type { Direction, Position } from "../types/common";

export interface ClientMessage extends BaseMessage {
  type: ClientMessageType;
}

export interface AuthLoginMessage extends ClientMessage {
  type: ClientMessageType.AUTH_LOGIN;
  token: string;
}

export interface MoveMessage extends ClientMessage {
  type: ClientMessageType.MOVE;
  direction: Direction;
  running: boolean;
}

export interface StopMessage extends ClientMessage {
  type: ClientMessageType.STOP;
}

export interface AttackMessage extends ClientMessage {
  type: ClientMessageType.ATTACK;
  targetId: string;
  targetType: "player" | "creature";
}

export interface UseSkillMessage extends ClientMessage {
  type: ClientMessageType.USE_SKILL;
  skillId: string;
  targetId?: string;
  targetPosition?: Position;
}

export interface ChatMessagePayload extends ClientMessage {
  type: ClientMessageType.CHAT_MESSAGE;
  channel: ChatChannel;
  content: string;
  targetPlayerId?: string;
}

export interface PickupItemMessage extends ClientMessage {
  type: ClientMessageType.PICKUP_ITEM;
  itemId: string;
}

export interface DropItemMessage extends ClientMessage {
  type: ClientMessageType.DROP_ITEM;
  slot: number;
  quantity: number;
}

export interface GodToggleMessage extends ClientMessage {
  type: ClientMessageType.GOD_TOGGLE;
  enabled: boolean;
}

export interface GodTeleportMessage extends ClientMessage {
  type: ClientMessageType.GOD_TELEPORT;
  mapId: string;
  x: number;
  y: number;
}

export interface PingMessage extends ClientMessage {
  type: ClientMessageType.PING;
}

export type AnyClientMessage =
  | AuthLoginMessage
  | MoveMessage
  | StopMessage
  | AttackMessage
  | UseSkillMessage
  | ChatMessagePayload
  | PickupItemMessage
  | DropItemMessage
  | GodToggleMessage
  | GodTeleportMessage
  | PingMessage;
