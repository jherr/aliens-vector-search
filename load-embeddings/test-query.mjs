import ollama from "ollama";
import postgres from "postgres";

const sql = postgres({});

const response = await ollama.embeddings({
  model: "snowflake-arctic-embed",
  prompt: "food",
});

const query = await sql`SELECT
  position, text
FROM
  lines
ORDER BY
  embedding <#> ${`[${response.embedding.join(",")}]`} 
LIMIT 10`;

console.log(query.map((row) => `${row.position} ${row.text}`).join("\n"));

sql.end();
