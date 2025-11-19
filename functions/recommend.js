import { Client } from "@neondatabase/serverless";

export async function handler(event, context) {
  try {
    // Parse body sent from frontend
    const body = JSON.parse(event.body);

    // Connect to Neon database
    const client = new Client({
      connectionString: process.env.NEON_CONNECTION_STRING,
    });

    await client.connect();

    // Store user submission into Neon DB
    const insert = `
      INSERT INTO pc4u_submissions (
        categories,
        q2,
        usage_intensity,
        multitasking_level,
        performance_importance,
        issues,
        budget
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id;
    `;

    const result = await client.query(insert, [
      body.categories,
      body.q2,
      body.usageIntensity,
      body.multitaskingLevel,
      body.performanceImportance,
      body.issues,
      body.budget
    ]);

    await client.end();

    // Respond back to frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Data stored successfully!",
        id: result.rows[0].id
      })
    };

  } catch (err) {
    console.error("ERROR:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message
      })
    };
  }
}
