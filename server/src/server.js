import Fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart"

import uploadRoutes from "./routes/upload.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true
});

await app.register(multipart)

app.register(uploadRoutes, { prefix: "/upload" });
app.register(chatRoutes, { prefix: "/chat" });

const start = async () => {
  try {
    await app.listen({ port: process.env.PORT });
    console.log("Server running on port", process.env.PORT);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
