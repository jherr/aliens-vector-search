import ollama from "ollama";
import postgres from "postgres";
import clsx from "clsx";

import { Input } from "@/components/ui/input";
import SearchForm from "./SearchForm";

const sql = postgres({});

export default async function Home({
  searchParams,
}: {
  searchParams: {
    q?: string;
  };
}) {
  const prompt = searchParams.q || "wake up to your face";
  const response = await ollama.embeddings({
    model: "snowflake-arctic-embed",
    prompt,
  });

  const query = (await sql`SELECT position, text FROM
  lines
ORDER BY
  embedding <#> ${`[${response.embedding.join(",")}]`} 
LIMIT 10`) as { position: number; text: string }[];

  const found: {
    position: number;
    text: string;
    context: { position: number; text: string }[];
  }[] = [];
  for (const row of query) {
    const context = (await sql`SELECT
  position, text
FROM
  lines
WHERE
  position > ${row.position - 3} AND position < ${row.position + 3}
ORDER BY position`) as { position: number; text: string }[];
    found.push({
      ...row,
      context,
    });
  }

  return (
    <main className="m-4">
      <SearchForm value={prompt} />
      <div className="flex flex-wrap">
        {found.map((row) => (
          <ul key={row.position} className="w-1/2 my-2">
            {row.context.map((context) => (
              <li
                key={context.position}
                className={clsx({
                  "font-bold text-xl": context.position === row.position,
                  "italic ml-2 text-gray-700":
                    context.position !== row.position,
                })}
              >
                {context.text}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </main>
  );
}
