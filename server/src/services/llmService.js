import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function streamAnswer(contextChunks, question, reply) {
  const context = contextChunks.join("\n\n");
  const prompt = `
You are a helpful assistant. Use ONLY the provided context to answer the question. If the answer is not in the context, say: "Answer not found in document."

Context:
${context}

Question: ${question}
`;

  // Hijack to prevent Fastify buffering
  reply.hijack();
  
  const res = reply.raw;
  
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Transfer-Encoding': 'chunked',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': 'http://localhost:5173',  
    'Access-Control-Allow-Credentials': 'true'                
  });

  try {
    const response = await axios({
      method: "post",
      url: `${process.env.OLLAMA_URL}/api/generate`,
      data: {
        model: "llama3",
        prompt,
        stream: true,
      },
      responseType: "stream",
    });

    let ended = false;

    const endStream = () => {
      if (!ended) {
        ended = true;
        if (!res.writableEnded) {
          res.end();
        }
      }
    };

    response.data.on("data", (chunk) => {
      if (ended) return;

      const lines = chunk.toString().split("\n").filter(Boolean);

      for (const line of lines) {
        if (ended) break;

        try {
          const parsed = JSON.parse(line);

          if (parsed.done) {
            endStream();
            break;
          }

          if (parsed.response && !ended && !res.writableEnded) {
            res.write(parsed.response);
          }
        } catch (err) {
          // Ignore malformed JSON
        }
      }
    });

    response.data.on("end", () => {
      endStream();
    });

    response.data.on("error", (err) => {
      console.error("Stream error:", err);
      endStream();
    });

    res.on("close", () => {
      ended = true;
      if (response.data && !response.data.destroyed) {
        response.data.destroy();
      }
    });

    res.on("error", (err) => {
      console.error("Response stream error:", err);
      ended = true;
      if (response.data && !response.data.destroyed) {
        response.data.destroy();
      }
    });

  } catch (error) {
    console.error("Axios request error:", error);
    
    if (!res.writableEnded) {
      res.write("Error: Unable to process request");
      res.end();
    }
  }
}