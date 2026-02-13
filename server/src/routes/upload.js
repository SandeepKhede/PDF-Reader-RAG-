import { extractText } from "../services/pdfService.js";
import { chunkText } from "../services/chunkService.js";
import { generateEmbedding } from "../services/embeddingService.js";
import { insertChunk } from "../services/vectorService.js";

export default async function uploadRoutes(fastify, options) {
  fastify.post("/", async (request, reply) => {


    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: "No file uploaded" });
    }

    const buffer = await data.toBuffer();
    console.log(buffer, "++++++++++++++++++++++++++++++++++++");

    // Extract text
    const text = await extractText(buffer);

    //Chunk
    const chunks = chunkText(text);

    // Embed + Store
    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk);

      await insertChunk(chunk, embedding);
    }

    return {
      message: "PDF processed successfully",
      chunksStored: chunks.length,
    };
  });
}
