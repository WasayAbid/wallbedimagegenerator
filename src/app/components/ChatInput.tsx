"use client";

import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function ChatInput({
  input,
  isLoading,
  onInputChange,
  onKeyDown,
  onSubmit,
}: ChatInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center border-t-2 border-[#e2e8f0] pt-4 bg-white p-4 absolute bottom-0 left-0 w-full"
    >
      <input
        type="text"
        value={input}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        placeholder="Type your message..."
        className="flex-grow border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-gray-700 bg-[#f8fafc] shadow-sm text-sm"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="ml-2 bg-[var(--primary-color)] hover:bg-[#c4135b] text-white font-semibold py-3 px-5 rounded-md focus:outline-none focus:shadow-outline shadow-lg disabled:bg-gray-500 text-sm"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <Send size={18} />
        )}
      </button>
    </form>
  );
}
