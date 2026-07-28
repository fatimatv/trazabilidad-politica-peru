import { NextResponse } from "next/server";
import { sources } from "@/lib/demo-data";
import { hasWriteRole } from "@/lib/auth";

export function GET() {
  return NextResponse.json({ data: sources });
}

export async function POST(request: Request) {
  if (!hasWriteRole(request)) {
    return NextResponse.json({ error: "x-demo-role ADMIN, ANALYST or REVIEWER is required" }, { status: 403 });
  }
  const body = await request.json();
  if (!body.title || !body.originalText) {
    return NextResponse.json({ error: "title and originalText are required" }, { status: 400 });
  }
  return NextResponse.json({
    data: {
      id: `src-local-${Date.now()}`,
      title: body.title,
      status: "UNVERIFIED",
      isDemo: false,
      queued: true
    }
  }, { status: 201 });
}
