import pkg from "pg";
const { Client } = pkg;

export async function handler(event, context) {
  const client = new Client({
    connectionString: process.env.NEON_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const model = event.queryStringParameters.model || "";

    const result = await client.query(
      "SELECT * FROM gpus WHERE LOWER(model) = LOWER($1);",
      [model]
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.toString()
    };
  } finally {
    await client.end();
  }
}