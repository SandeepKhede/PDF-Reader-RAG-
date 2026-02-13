import { generateEmbedding } from "../services/embeddingService.js";
import { searchSimilarChunks } from "../services/vectorService.js";
import { generateAnswer } from "../services/llmService.js";



export default async function chatRoutes(fastify, options) {
  fastify.post("/", async (request, reply) => {
    const { question } = request.body;

    if (!question) {
      return reply.status(400).send({ error: "Question is required" });
    }

    //Convert question to embedding
    const queryEmbedding = await generateEmbedding(question);

    //Retrieve similar chunks
    const chunks = await searchSimilarChunks(queryEmbedding, 5);

    if (!chunks.length) {
      return { answer: "No relevant content found." };
    }

    //Generate answer
    const answer = await generateAnswer(chunks, question);

    return { answer };
  });
}
