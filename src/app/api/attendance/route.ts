import { NextRequest, NextResponse } from "next/server";
import { getAttendanceRecords, getUniquePrograms } from "@/lib/sheets";

export async function GET(request: NextRequest) {
  try {
    // Verify passcode from header
    const passcode = request.headers.get("x-admin-passcode");
    if (passcode !== process.env.ADMIN_PASSCODE) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const program = searchParams.get("program");

    const [records, programs] = await Promise.all([
      getAttendanceRecords(),
      getUniquePrograms(),
    ]);

    // Filter by program if specified
    const filteredRecords = program
      ? records.filter((r) => r.namaProgram === program)
      : records;

    // Sort by timestamp descending (newest first)
    filteredRecords.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return NextResponse.json({
      success: true,
      data: filteredRecords,
      programs,
      total: filteredRecords.length,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mendapatkan data kehadiran" },
      { status: 500 }
    );
  }
}
