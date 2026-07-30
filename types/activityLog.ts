export type ActivityType = "received" | "added" | "dispatched" | "created";

export interface ActivityEntry {
  id: string;
  actorName: string;
  actionText: string;
  timestamp: string;
  type: ActivityType;
}