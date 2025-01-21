import { useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { MessageBubble } from "./MessageBubble";

interface Message {
  role: "user" | "model";
  content: string;
  imageUrl?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  initialModelMessage: Message | null;
}

export function ChatMessages({
  messages,
  isLoading,
  initialModelMessage,
}: ChatMessagesProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      ref={chatContainerRef}
      className="flex-grow overflow-y-auto px-6 pt-8 pb-16 rounded-t-lg"
    >
      {initialModelMessage && (
        <div className="mb-3 flex justify-start mt-2">
          <div className="max-w-sm p-3 rounded-lg shadow-md bg-[#f1f5f9] text-gray-700 text-sm">
            <Markdown>{initialModelMessage.content}</Markdown>
          </div>
        </div>
      )}
      {messages.slice(1).map((message, index) => (
        <MessageBubble key={index} {...message} />
      ))}
      {isLoading && (
        <div className="text-left mb-3">
          <div className="inline-block p-2 rounded-lg bg-[#f1f5f9] text-gray-700 animate-pulse text-sm">
            Thinking...
          </div>
        </div>
      )}
    </div>
  );
}
