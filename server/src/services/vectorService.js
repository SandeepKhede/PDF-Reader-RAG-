import { pool } from "../db.js";

export async function insertChunk(content, embedding) {
await pool.query(
  "INSERT INTO document_chunks (content, embedding) VALUES ($1, $2::vector)",
  [content, JSON.stringify(embedding)]
);
}


export async function searchSimilarChunks(queryEmbedding, limit = 5) {
  const result = await pool.query(
    `
    SELECT content
    FROM document_chunks
    ORDER BY embedding <-> $1::vector
    LIMIT $2
    `,
    [JSON.stringify(queryEmbedding), limit]
  );

  return result.rows.map(row => row.content);
}
