/**
 * Client-safe types and constants for the dream-customers CRM.
 * Imported by both server (PB helpers, API routes, page) and client
 * (KanbanBoard, EditDrawer, Card). Must not import anything server-only.
 */

import type { Segment, Confidence } from "./dream-customers-seed";

export const STAGES = [
  "sourced",
  "followed",
  "engaged",
  "acknowledged",
  "outreach_sent",
  "in_conversation",
  "trial",
  "paying",
  "champion",
] as const;

export type Stage = (typeof STAGES)[number];

export const STAGE_LABELS: Record<Stage, string> = {
  sourced: "Sourced",
  followed: "Followed",
  engaged: "Engaged",
  acknowledged: "Acknowledged",
  outreach_sent: "Outreach Sent",
  in_conversation: "In Conversation",
  trial: "Trial Signup",
  paying: "Paying",
  champion: "Champion",
};

export interface DreamCustomer {
  id: string;
  name: string;
  handle: string;
  firm: string;
  role: string;
  url: string;
  segment: Segment | "";
  confidence: Confidence | "";
  stage: Stage;
  comment_count: number;
  notes: string;
  last_engaged_at: string;
  created: string;
  updated: string;
}
