import type { DamageType } from "./map";

export type TargetType = "self" | "single" | "area" | "line" | "cone";

export interface AbilityEffect {
  type: "dot" | "slow" | "stun" | "heal_over_time" | "buff" | "debuff";
  damageType?: DamageType;
  damagePerTick?: number;
  duration: number;
  tickRate?: number;
  value?: number;
}

export interface AbilityDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  targetType: TargetType;
  range: number;
  areaRadius?: number;
  manaCost: number;
  cooldown: number;
  castTime: number;
  baseDamage: number;
  damageType: DamageType | "healing";
  strengthScaling: number;
  dexterityScaling: number;
  intelligenceScaling: number;
  effects: AbilityEffect[];
  castAnimation: string;
  projectileSprite?: string;
  impactEffect: string;
}

export interface CombatResult {
  success: boolean;
  damage?: number;
  isCritical?: boolean;
  reason?: string;
}
