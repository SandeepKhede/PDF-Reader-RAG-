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

    // Extract text
    const text = await extractText(buffer);

    //Chunk
    const chunks = chunkText(text);

    //create batches for chunk
    const batchSize = 3;  //for local machine

    for (let i=0; i < chunks.length; i += batchSize){
      
      const batch = chunks.slice(i, i + batchSize);
      const embeddings = await Promise.all(
        batch.map(chunk => generateEmbedding(chunk))
      );

      await Promise.all(
        batch.map((chunk, index) => {
          insertChunk(chunk, embeddings[index])
        })
      )
    }

    return {
      message: "PDF processed successfully",
      chunksStored: chunks.length,
    };
  });
}
