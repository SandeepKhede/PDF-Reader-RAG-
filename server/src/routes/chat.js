import { generateEmbedding } from "../services/embeddingService.js";
import { searchSimilarChunks } from "../services/vectorService.js";
import { streamAnswer } from "../services/llmService.js";

export default async function chatRoutes(fastify, options) {
  fastify.post("/", async (request, reply) => {
    const { question } = request.body;

    if (!question) {
      return reply.status(400).send({ error: "Question required" });
    }

    try {
      const queryEmbedding = await generateEmbedding(question);
      const chunks = await searchSimilarChunks(queryEmbedding, 5);

      if (!chunks.length) {
        return reply.send("No relevant content found.");
      }

      await streamAnswer(chunks, question, reply);

    } catch (error) {
      console.error(error);
      reply.status(500).send("Error generating answer");
    }
  });
}
