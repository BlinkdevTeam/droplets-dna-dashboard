import { db } from "@/lib/db";

const allowedTables = new Set([
  "quiz_users",
  "seminar_feedback_responses",
  "quiz_responses",
]);

export async function GET(
  req: Request,
  context: { params: Promise<{ table: string }> }
) {
  try {
    const { table } = await context.params;

    const cleanTable = table?.trim();

    console.log("TABLE REQUESTED:", cleanTable);

    if (!cleanTable || !allowedTables.has(cleanTable)) {
      return Response.json(
        { error: "Invalid table", table: cleanTable },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      `SELECT * FROM \`${cleanTable}\``
    );

    return Response.json(Array.isArray(rows) ? rows : []);
  } catch (err) {
    console.error(err);
    return Response.json([], { status: 500 });
  }
}