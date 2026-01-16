import { z } from "zod";
import { ClientMessageType } from "../protocol/messages";

// Base message schema
const baseMessageSchema = z.object({
  type: z.string(),
  timestamp: z.number(),
  correlationId: z.string().optional(),
});

// Direction enum
const directionSchema = z.enum(["up", "down", "left", "right"]);

// Position schema
const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

// Chat channel enum
const chatChannelSchema = z.enum(["global", "local", "party", "guild", "private", "system"]);

// Individual message schemas
export const authLoginSchema = baseMessageSchema.extend({
  type: z.literal(ClientMessageType.AUTH_LOGIN),
  token: z.string().min(1),
});

export const moveSchema = baseMessageSchema.extend({
  type: z.literal(ClientMessageType.MOVE),
  direction: directionSchema,
  running: z.boolean(),
});

export const stopSchema = baseMessageSchema.extend({
  type: z.literal(ClientMessageType.STOP),
});

export const attackSchema = baseMessageSchema.extend({
  type: z.literal(ClientMessageType.ATTACK),
  targetId: z.string().uuid(),
  targetType: z.enum(["player", "creature"]),
});

export const useSkillSchema = baseMessageSchema.extend({
  type: z.literal(ClientMessageType.USE_SKILL),
  skillId: z.string().min(1),
  targetId: z.string().uuid().optional(),
  targetPosition: positionSchema.optional(),
});

export const chatMessageSchema = baseMessageSchema.extend({
  type: z.literal(ClientMessageType.CHAT_MESSAGE),
  channel: chatChannelSchema,
  content: z.string().min(1).max(500),
  targetPlayerId: z.string().uuid().optional(),
});

export const pickupItemSchema = baseMessageSchema.extend({
  type: z.literal(ClientMessageType.PICKUP_ITEM),
  itemId: z.string().uuid(),
});

export const dropItemSchema = baseMessageSchema.extend({
  type: z.literal(ClientMessageType.DROP_ITEM),
  slot: z.number().int().min(0),
  quantity: z.number().int().min(1),
});

export const godToggleSchema = baseMessageSchema.extend({
  type: z.literal(ClientMessageType.GOD_TOGGLE),
  enabled: z.boolean(),
});

export const godTeleportSchema = baseMessageSchema.extend({
  type: z.literal(ClientMessageType.GOD_TELEPORT),
  mapId: z.string().uuid(),
  x: z.number().int(),
  y: z.number().int(),
});

export const pingSchema = baseMessageSchema.extend({
  type: z.literal(ClientMessageType.PING),
});

// Union of all client messages
export const clientMessageSchema = z.discriminatedUnion("type", [
  authLoginSchema,
  moveSchema,
  stopSchema,
  attackSchema,
  useSkillSchema,
  chatMessageSchema,
  pickupItemSchema,
  dropItemSchema,
  godToggleSchema,
  godTeleportSchema,
  pingSchema,
]);

// Type inference
export type ValidatedClientMessage = z.infer<typeof clientMessageSchema>;

// Validation function
export function parseClientMessage(data: unknown): ValidatedClientMessage {
  return clientMessageSchema.parse(data);
}

// Safe validation (returns result object)
export function safeParseClientMessage(data: unknown) {
  return clientMessageSchema.safeParse(data);
}
