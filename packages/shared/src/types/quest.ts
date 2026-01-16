import type { CharacterClass } from "./player";

export type QuestStatus = "available" | "in_progress" | "completed" | "failed";

export type QuestObjectiveType = "kill" | "collect" | "explore" | "talk";

export interface QuestObjective {
  id: string;
  type: QuestObjectiveType;
  description: string;
  target: string;
  targetCount: number;
  currentCount?: number;
}

export interface ItemReward {
  itemId: string;
  quantity: number;
}

export interface QuestDefinition {
  id: string;
  name: string;
  description: string;
  npcId?: string;
  npcMapId?: string;
  npcX?: number;
  npcY?: number;
  requiredLevel: number;
  requiredClass?: CharacterClass;
  prerequisiteQuestId?: string;
  objectives: QuestObjective[];
  experienceReward: number;
  goldReward: number;
  itemRewards: ItemReward[];
  isRepeatable: boolean;
  isMainQuest: boolean;
}

export interface PlayerQuestProgress {
  questId: string;
  status: QuestStatus;
  progress: Record<string, number>;
  startedAt?: string;
  completedAt?: string;
}
