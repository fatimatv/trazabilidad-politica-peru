import type { Commitment } from "./types";

export const SESSION_COMMITMENTS_KEY = "ialaw.sessionCommitments.v1";
export const SESSION_COMMITMENTS_EVENT = "ialaw-session-commitments";

export function readSessionCommitments(): Commitment[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(SESSION_COMMITMENTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is Commitment => Boolean(item?.id && item?.stableId && item?.normalizedText));
  } catch {
    return [];
  }
}

export function appendSessionCommitments(items: Commitment[]) {
  if (typeof window === "undefined") return;
  const existing = readSessionCommitments();
  const merged = new Map(existing.map((item) => [item.id, item]));
  items.forEach((item) => merged.set(item.id, item));
  window.localStorage.setItem(SESSION_COMMITMENTS_KEY, JSON.stringify(Array.from(merged.values())));
  window.dispatchEvent(new Event(SESSION_COMMITMENTS_EVENT));
}
