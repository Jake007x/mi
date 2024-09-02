import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection manager that only connects if not already connected
async function dbConnect() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();
  return client;
}

// Handle POST requests to store the RGB command
export async function POST(req) {
  let client;
  try {
    // Connect to the database
    client = await dbConnect();

    // Insert the RGB control command into the database
    await client.query(`
      INSERT INTO "S078" ("command", "date")
      VALUES ($1, NOW())
    `, ['RGB_ON']);

    console.log("RGB control command stored in the database");

    // Fetch the latest command from the database
    const result = await client.query(`
      SELECT "command", "date"
      FROM "S078"
      ORDER BY "date" DESC
      LIMIT 1
    `);

    // Return the latest data
    return new Response(JSON.stringify({
      message: 'RGB control command stored successfully',
      latestCommand: result.rows[0], // The most recent command
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error storing RGB command:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    if (client) {
      await client.end(); // Close the connection
    }
  }
}
