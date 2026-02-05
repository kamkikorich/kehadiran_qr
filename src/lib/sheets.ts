import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export interface AttendanceData {
  namaProgram: string;
  namaPeserta: string;
  noIC: string;
  noTelefon: string;
  syarikat: string;
}

export async function appendAttendance(data: AttendanceData) {
  const timestamp = new Date().toLocaleString("ms-MY", {
    timeZone: "Asia/Kuala_Lumpur",
  });

  const values = [
    [
      timestamp,
      data.namaProgram,
      data.namaPeserta,
      data.noIC,
      data.noTelefon,
      data.syarikat,
    ],
  ];

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Sheet1!A:F",
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });

  return response.data;
}

export interface AttendanceRecord {
  timestamp: string;
  namaProgram: string;
  namaPeserta: string;
  noIC: string;
  noTelefon: string;
  syarikat: string;
}

export async function getAttendanceRecords(): Promise<AttendanceRecord[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Sheet1!A:F",
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return [];
  }

  // Skip header row if exists, map data
  const dataRows = rows[0][0] === "Timestamp" ? rows.slice(1) : rows;

  return dataRows.map((row) => ({
    timestamp: row[0] || "",
    namaProgram: row[1] || "",
    namaPeserta: row[2] || "",
    noIC: row[3] || "",
    noTelefon: row[4] || "",
    syarikat: row[5] || "",
  }));
}

export async function getUniquePrograms(): Promise<string[]> {
  const records = await getAttendanceRecords();
  const programs = [...new Set(records.map((r) => r.namaProgram))];
  return programs.filter((p) => p);
}
