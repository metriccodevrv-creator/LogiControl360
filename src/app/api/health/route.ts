import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "LogiControl360",
    timestamp: new Date().toISOString(),
  });
}
