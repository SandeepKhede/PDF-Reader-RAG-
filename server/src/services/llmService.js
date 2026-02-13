import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function generateAnswer(contextChunks, question) {
    const context = contextChunks.join("\n\n");

    const prompt = `
You are a helpful assistant.
Use ONLY the provided context to answer the question.
If the answer is not in the context, say:
"Answer not found in document."

Context:
${context}

Question:
${question}
`;

    const response = await axios.post(
        `${process.env.OLLAMA_URL}/api/generate`,
        {
            model: "llama3",
            prompt,
            stream: false,
        }
    );

    return response.data.response;
}
