"use client";

import { useState } from "react";
import ProtectedRoute from "../../components/common/ProtectedRoute";
import Layout from "../../components/common/Layout";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Send, Bot, User } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI attendance assistant. Ask me anything about attendance tracking, study tips, or academic advice!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await api.post("/chat", { message: userMessage });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.response },
      ]);
    } catch (error) {
      toast.error("Failed to get AI response");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout title="AI Chat Assistant">
        <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] md:h-[calc(100vh-250px)] flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 glass-card rounded-xl p-4 md:p-6 overflow-y-auto mb-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <Bot className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-3 md:p-4 rounded-xl ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white"
                  }`}
                >
                  <p className="text-sm md:text-base">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Bot className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="glass-card rounded-xl p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about attendance, study tips, or academic advice..."
                className="flex-1 glass-input px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm md:text-base"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-primary px-4 md:px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden md:inline">Send</span>
              </button>
            </div>
          </form>

          {/* Quick Suggestions */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "How to improve attendance?",
              "Calculate required classes for 75%",
              "Study tips for exams",
              "Time management advice",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="px-3 py-2 text-xs md:text-sm glass-card rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
