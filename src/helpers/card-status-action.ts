import { CardStatus, PreferenceAction } from "@/src/types/entities";

export const actionToStatus: Record<PreferenceAction, CardStatus> = {
  archive: "archived",
  reactivate: "active",
  ban: "banned",
  love: "loved",
};

export const statusToAction: Record<CardStatus, PreferenceAction> = {
  active: "reactivate",
  archived: "archive",
  loved: "love",
  banned: "ban",
};

// Helper functions to convert between them
export function getStatusFromAction(action: PreferenceAction): CardStatus {
  return actionToStatus[action];
}

export function getActionFromStatus(status: CardStatus): PreferenceAction {
  return statusToAction[status];
}
