import { NextResponse } from "next/server";
import { commitments } from "@/lib/demo-data";
import { hasWriteRole } from "@/lib/auth";

export function GET() {
  return NextResponse.json({ data: commitments });
}

export async function POST(request: Request) {
  if (!hasWriteRole(request)) {
    return NextResponse.json({ error: "x-demo-role ADMIN, ANALYST or REVIEWER is required" }, { status: 403 });
  }
  const body = await request.json();
  if (!body.normalizedText || !body.sourceId) {
    return NextResponse.json({ error: "normalizedText and sourceId are required" }, { status: 400 });
  }
  return NextResponse.json({
    data: {
      id: `c-local-${Date.now()}`,
      stableId: body.stableId ?? `LOCAL-${Date.now()}`,
      sourceState: "RECEIVED",
      implementationState: "Por cumplir",
      queuedForReview: true
    }
  }, { status: 201 });
}
