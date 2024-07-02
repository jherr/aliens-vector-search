import fs from "node:fs/promises";
import ollama from "ollama";
import postgres from "postgres";

const sql = postgres({});

const lines = (await fs.readFile("aliens.script.txt", "utf-8")).split("\n");
for (const line of lines) {
  if (line === "") continue;
  const [pos] = line.split(" ");
  const text = line.slice(pos.length + 1);
  const position = parseInt(pos.replace("(", "").replace(")", ""));

  console.log(position, text);

  const response = await ollama.embeddings({
    model: "snowflake-arctic-embed",
    prompt: text,
  });
  await sql`INSERT INTO lines
    (position, text, embedding)
  VALUES
    (${position}, ${text}, ${`[${response.embedding.join(",")}]`})
  `;
}

sql.end();
