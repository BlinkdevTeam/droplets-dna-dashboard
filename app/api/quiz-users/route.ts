import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
  SELECT id, email, full_name, created_at
  FROM (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) as rn
    FROM quiz_users
  ) t
  WHERE rn = 1
  ORDER BY created_at DESC
`);

    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return Response.json([], { status: 500 });
  }
}