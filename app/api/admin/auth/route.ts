import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const adminSecret = process.env.ADMIN_SECRET_KEY || "refa-admin-2026";

    if (!body.secretKey || body.secretKey !== adminSecret) {
      return NextResponse.json({ error: "Kunci Admin tidak valid" }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: "Autentikasi berhasil" });
  } catch (err: any) {
    return NextResponse.json({ error: "Autentikasi gagal" }, { status: 400 });
  }
}
