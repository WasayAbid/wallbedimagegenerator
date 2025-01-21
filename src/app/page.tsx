"use client";

import React, { useState, useEffect } from "react";
import "./globals.css"; // Import the CSS module
import openai from "openai";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import { useRouter } from "next/navigation";
interface Message {
  role: "user" | "model";
  content: string;
  imageUrl?: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "user", content: "" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [initialModelMessage, setInitialModelMessage] =
    useState<Message | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const openaiClient = apiKey
    ? new openai.OpenAI({ apiKey, dangerouslyAllowBrowser: true })
    : null;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("loggedIn") === "true";
    if (!loggedIn) {
      sessionStorage.removeItem("loggedIn"); // Clear on redirect
      router.push("/login");
    }
    setIsLoggedIn(loggedIn);
  }, [router]);

  // System role prompt
  const systemPrompt = `You are a helpful assistant that will help the user design any type of furniture including wallbeds. You are an expert in wallbed designs, and will try to help the user create a very innovative and creative wallbed, while you can still create images and give information regarding other types of furniture. You will try to generate a picture of the furniture if the user asks for it. If the user provides some information about the furniture such as color, size, style, material, lights, or cabinets you will try to incorportate that information in the image that you create. If the user asks for a picture, but does not provide any details you will create a generic furniture design. After you create a furniture you will tell the user that the image is a basic version, and to get the exact furniture they want, they should provide you with more specific information. You will provide advice on furniture design, answer questions about material, size, style, and other related questions. You will never engage in topics that are not related to wallbeds or furniture. Ensure that the generated images do not have any text, words, or writings on them. Keep your responses detailed but consise.`;

  useEffect(() => {
    if (messages.length === 1 && isFirstRender) {
      setTimeout(() => {
        setInitialModelMessage({
          role: "model",
          content:
            "Hi there! I'm a custom wallbed generator. How can I help you with your wallbed design today?",
        });
        setIsFirstRender(false);
      }, 500);
    }
  }, [messages, isFirstRender]);

  async function sendMessage(newMessage: string) {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      role: "user" as const,
      content: newMessage,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    if (!openaiClient) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "model" as const,
          content:
            "OpenAI API key not found. Please ensure NEXT_PUBLIC_OPENAI_API_KEY is set in .env.local",
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const chatMessages = [
        {
          role: "system" as const,
          content: systemPrompt,
        },
        ...messages.slice(1).map((message) => ({
          role:
            message.role === "user"
              ? ("user" as const)
              : ("assistant" as const),
          content: message.content,
        })),
        {
          role: "user" as const,
          content: newMessage,
        },
      ];

      const chatResponse = await openaiClient.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: chatMessages,
      });

      let modelMessage = chatResponse.choices[0].message.content;
      let imageUrls: string[] = [];
      if (
        modelMessage &&
        (modelMessage.toLowerCase().includes("image") ||
          modelMessage.toLowerCase().includes("picture") ||
          newMessage.toLowerCase().includes("image") ||
          newMessage.toLowerCase().includes("picture") ||
          newMessage.toLowerCase().includes("show me") ||
          modelMessage.toLowerCase().includes("wallbed") ||
          newMessage.toLowerCase().includes("wallbed"))
      ) {
        try {
          const imageResponse = await openaiClient.images.generate({
            prompt: `${systemPrompt} ${newMessage} , Ensure that the generated images do not have any text, words, or writings on them.`,
            size: "1024x1024",
            quality: "standard",
            n: 1,
            model: "dall-e-3",
          });
          imageUrls = imageResponse.data
            .map((item) => item?.url)
            .filter(Boolean) as string[];
        } catch (imageError: unknown) {
          console.error("Image generation failed", imageError);
          modelMessage = "I'm unable to generate images at the moment.";
        }
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "model" as const,
            content: modelMessage
              ? modelMessage
              : "I'm unable to generate images at the moment.",
            imageUrl: imageUrls[0],
          },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "model" as const,
            content: modelMessage
              ? modelMessage
              : "I am unable to process your request",
          },
        ]);
      }
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "model" as const,
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setInitialModelMessage(null);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !isLoading) {
      sendMessage(input);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoading) {
      sendMessage(input);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <main
      className={` min-h-screen flex flex-col items-center justify-center  bg-white`}
    >
      <ChatHeader />
      <div className="flex flex-col w-full max-w-3xl h-[80vh] bg-white rounded-b-xl shadow-2xl overflow-hidden relative">
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          initialModelMessage={initialModelMessage}
        />
        <ChatInput
          input={input}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onSubmit={handleSubmit}
        />
      </div>
      <footer className="mt-4 text-center text-xs text-[#9ca3af]">
        A creation of Murphy Al-Saham
      </footer>
    </main>
  );
}
