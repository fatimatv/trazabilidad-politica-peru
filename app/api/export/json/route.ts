import { NextResponse } from "next/server";
import { actions, commitments, comparisons, sources } from "@/lib/demo-data";

export function GET() {
  return NextResponse.json({ sources, commitments, comparisons, actions, mode: "UNVERIFIED_INPUTS" });
}
