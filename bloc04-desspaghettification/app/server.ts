
import http, { type IncomingMessage } from "node:http";

import pg from "pg";

interface WorkshopRow {
  id: number;
  title: string;
  starts_at: Date;
  capacity: number;
  registered: string;
}

interface RegistrationRow {
  id: number;
  registered_at: Date;
}

const pool = new pg.Pool({
  connectionString:
    process.env.DATABASE_URL ?? "postgres://workshop:workshop@localhost:5434/registrations",
});

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const readBody = async (req: IncomingMessage): Promise<Record<string, unknown>> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk);
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {};
};

const server = http.createServer(async (req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  const url = new URL(req.url ?? "/", "http://localhost");

  try {
    if (req.method === "GET" && url.pathname === "/workshops") {
      const result = await pool.query<WorkshopRow>(
        `SELECT w.id, w.title, w.starts_at, w.capacity,
                (SELECT count(*) FROM registrations r
                  WHERE r.workshop_id = w.id AND r.cancelled = FALSE) AS registered
           FROM workshops w
          WHERE w.starts_at > now()
          ORDER BY w.starts_at`,
      );

      const body = result.rows.map((row) => {
        const date = new Date(row.starts_at);
        const remaining = row.capacity - Number(row.registered);
        return {
          id: row.id,
          title: row.title,
          date: `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
          time: `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
          seatsLeft: remaining,
          label:
            remaining <= 0
              ? "Full"
              : remaining === 1
                ? "1 seat left"
                : `${remaining} seats left`,
        };
      });

      res.writeHead(200);
      res.end(JSON.stringify(body));
      return;
    }

    if (req.method === "POST" && url.pathname === "/registrations") {
      const body = await readBody(req);

      if (!body.workshopId || !body.participantId) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "workshopId and participantId are required." }));
        return;
      }

      const workshop = await pool.query<WorkshopRow>(
        `SELECT w.id, w.title, w.starts_at, w.capacity,
                (SELECT count(*) FROM registrations r
                  WHERE r.workshop_id = w.id AND r.cancelled = FALSE) AS registered
           FROM workshops w WHERE w.id = $1`,
        [body.workshopId],
      );

      if (workshop.rows.length === 0) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Workshop not found." }));
        return;
      }

      const row = workshop.rows[0];

      const hoursBefore = (new Date(row.starts_at).getTime() - Date.now()) / 3_600_000;
      if (hoursBefore < 24) {
        res.writeHead(409);
        res.end(JSON.stringify({ error: "Registrations close 24 hours before the workshop." }));
        return;
      }

      if (Number(row.registered) >= row.capacity) {
        res.writeHead(409);
        res.end(JSON.stringify({ error: "This workshop is full." }));
        return;
      }

      const existing = await pool.query(
        `SELECT id FROM registrations
          WHERE workshop_id = $1 AND participant_id = $2 AND cancelled = FALSE`,
        [body.workshopId, body.participantId],
      );

      if (existing.rows.length > 0) {
        res.writeHead(409);
        res.end(JSON.stringify({ error: "This participant is already registered." }));
        return;
      }

      const created = await pool.query<RegistrationRow>(
        `INSERT INTO registrations (workshop_id, participant_id)
              VALUES ($1, $2) RETURNING id, registered_at`,
        [body.workshopId, body.participantId],
      );

      const date = new Date(created.rows[0].registered_at);
      res.writeHead(201);
      res.end(
        JSON.stringify({
          id: created.rows[0].id,
          workshop: row.title,
          registeredAt: `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
        }),
      );
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: "Unknown route." }));
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal error." }));
  }
});

server.listen(4000, () => {
  console.log("[bloc04] API on http://localhost:4000");
});
