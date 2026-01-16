import type { Position, Direction } from "../types/common";

export function calculateDistance(a: Position, b: Position): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function manhattanDistance(a: Position, b: Position): number {
  return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
}

export function getAdjacentPosition(position: Position, direction: Direction): Position {
  switch (direction) {
    case "up":
      return { x: position.x, y: position.y - 1 };
    case "down":
      return { x: position.x, y: position.y + 1 };
    case "left":
      return { x: position.x - 1, y: position.y };
    case "right":
      return { x: position.x + 1, y: position.y };
  }
}

export function getDirectionToTarget(from: Position, to: Position): Direction | null {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (dx === 0 && dy === 0) return null;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "right" : "left";
  } else {
    return dy > 0 ? "down" : "up";
  }
}

export function isPositionEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}
