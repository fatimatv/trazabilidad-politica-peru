import { NextResponse } from "next/server";
import { commitments } from "@/lib/demo-data";
import { toCsv } from "@/lib/metrics";

export function GET() {
  return new NextResponse(toCsv(commitments), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=compromisos-demo.csv"
    }
  });
}
