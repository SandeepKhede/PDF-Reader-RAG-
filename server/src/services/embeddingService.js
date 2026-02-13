import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function generateEmbedding(text) {
  const response = await axios.post(
    `${process.env.OLLAMA_URL}/api/embeddings`,
    {
      model: "nomic-embed-text",
      prompt: text,
    }
  );

  return response.data.embedding;
}
