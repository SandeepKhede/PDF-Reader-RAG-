export default function MessageBubble({ type, text }) {
  return (
    <div
      className={`mb-2 p-3 rounded-lg max-w-[80%] ${
        type === "user"
          ? "bg-blue-500 text-white ml-auto"
          : "bg-gray-200 text-gray-800"
      }`}
    >
      {text}
    </div>
  );
}
