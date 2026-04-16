import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM seminar_feedback_responses
      ORDER BY created_at DESC
    `);

    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return Response.json([], { status: 500 });
  }
}