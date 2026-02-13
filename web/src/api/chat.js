import axios from "axios";

export const askQuestionStream = async (question, onChunk) => {
  console.log("Starting stream for:", question);
  
  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  console.log("Response status:", response.status);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    
    if (done) {
      console.log("Stream complete");
      break;
    }

    const chunk = decoder.decode(value, { stream: true });
    console.log("Received chunk:", chunk); // ← Check this in browser console
    
    if (chunk) {
      onChunk(chunk);
    }
  }
};