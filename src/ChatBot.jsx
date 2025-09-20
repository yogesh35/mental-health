import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Bot, User, Heart } from "lucide-react";

// ✅ Initialize Gemini (Updated for Create React App)
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

function ChatBot() {
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Debug: Check API key on component mount
  React.useEffect(() => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ REACT_APP_GEMINI_API_KEY is not configured");
      setMessages([{
        role: "model",
        text: "⚠️ Configuration Error: API key is missing. Please contact support."
      }]);
    } else {
      console.log("✅ Gemini API key is configured");
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      let chatInstance = chat;
      if (!chatInstance) {
        // supportive system prompt
        chatInstance = await model.startChat({
          history: [
            {
              role: "user",
              parts: [
                {
                  text: "You are a supportive mental health companion for students. " +
                        "Avoid giving medical diagnosis or prescriptions. " +
                        "Provide coping strategies, encouragement, stress management tips, and suggest contacting a counselor or helpline if needed."
                }
              ]
            }
          ]
        });
        setChat(chatInstance);
      }

      const result = await chatInstance.sendMessage(userMessage);
      const response = result.response.text();

      setMessages((prev) => [...prev, { role: "model", text: response }]);
    } catch (err) {
      console.error("Chat error:", err);
      
      let errorMessage = "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.";
      
      // Provide more specific error messages based on error type
      if (err.message.includes("API key")) {
        errorMessage = "⚠️ API Configuration Error: Please contact support about the API key issue.";
      } else if (err.message.includes("quota")) {
        errorMessage = "⚠️ Service Temporarily Unavailable: API quota exceeded. Please try again later.";
      } else if (err.message.includes("network") || err.message.includes("fetch")) {
        errorMessage = "🌐 Network Error: Please check your internet connection and try again.";
      } else if (err.message.includes("blocked") || err.message.includes("safety")) {
        errorMessage = "🛡️ Content Filtered: Please rephrase your message in a different way.";
      }
      
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: errorMessage
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          AI Assistant
        </h1>
        <p className="text-lg text-gray-600">
          Get help and support from our AI-powered wellness companion
        </p>
      </div>

      <div className="w-full h-[600px] bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Wellness Companion</h2>
              <p className="text-purple-100 text-sm">Your confidential support assistant</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Bot className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Welcome to your AI Assistant</h3>
              <p className="text-gray-500 max-w-md">
                I'm here to help and support you. Feel free to ask me anything or share what's on your mind.
              </p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "model" && (
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-purple-600" />
                </div>
              )}
              
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white rounded-tr-sm"
                    : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>
              </div>
              
              {msg.role === "user" && (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-purple-600" />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-100 bg-white p-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
                disabled={isLoading}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Type your message here..."
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-3 text-xs text-gray-500 text-center">
            <span className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1 rounded-full">
              ⚠️ For crisis support, contact emergency services or a mental health helpline immediately
            </span>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default ChatBot;