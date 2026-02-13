import { useState } from "react";
import { askQuestionStream } from "../api/chat";
import MessageBubble from "./MessageBubble";

export default function ChatSection() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    // Add user message
    const userMessage = { type: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);

    // Store question before clearing input
    const currentQuestion = question;
    setQuestion("");
    setLoading(true);

    // Add empty bot message placeholder
    setMessages((prev) => [...prev, { type: "bot", text: "" }]);

    try {
      // Stream the response
      await askQuestionStream(currentQuestion, (chunk) => {
        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = {
            ...updated[lastIndex],
            text: updated[lastIndex].text + chunk
          };
          return updated;
        });
      });
    } catch (error) {
      console.error("Error asking question:", error);
      // Update last message with error
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = {
          ...updated[lastIndex],
          text: "Sorry, an error occurred while processing your question."
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-3">Ask Question</h2>

      {/* Messages Container */}
      <div className="h-64 overflow-y-auto border rounded p-4 bg-gray-50 mb-4">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center mt-8">
            No messages yet. Ask a question to get started!
          </p>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={index} type={msg.type} text={msg.text} />
          ))
        )}
      </div>

      {/* Input Section */}
      <div className="flex gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something..."
          disabled={loading}
          className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
        />
        <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>
    </div>
  );
}