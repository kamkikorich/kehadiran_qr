import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { passcode } = await request.json();

    if (passcode === process.env.ADMIN_PASSCODE) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Kod akses tidak sah" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Ralat server" },
      { status: 500 }
    );
  }
}
