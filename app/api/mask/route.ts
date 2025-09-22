import { NextRequest, NextResponse } from "next/server";
import { encryptUrlToToken } from "@/lib/crypto";

export async function POST(req: NextRequest) {
  try {
    const { url } = (await req.json()) as { url?: string };
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }
    const token = encryptUrlToToken(url);
    return NextResponse.json({ token });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}


