import { NextRequest, NextResponse } from "next/server";
import { appendAttendance } from "@/lib/sheets";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validation
    if (!data.namaPeserta || data.namaPeserta.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Nama peserta wajib diisi" },
        { status: 400 }
      );
    }

    if (!data.noIC || !/^\d{12}$/.test(data.noIC)) {
      return NextResponse.json(
        { success: false, error: "No. IC mesti 12 digit nombor" },
        { status: 400 }
      );
    }

    if (!data.noTelefon || !/^[\d\s+-]{10,15}$/.test(data.noTelefon)) {
      return NextResponse.json(
        { success: false, error: "Format nombor telefon tidak sah" },
        { status: 400 }
      );
    }

    await appendAttendance({
      namaProgram: data.namaProgram || "Tidak Dinyatakan",
      namaPeserta: data.namaPeserta.trim(),
      noIC: data.noIC,
      noTelefon: data.noTelefon,
      syarikat: data.syarikat?.trim() || "Individu",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Sistem sibuk, sila cuba sebentar lagi",
      },
      { status: 500 }
    );
  }
}
