"use client";

import Markdown from "react-markdown";
import { useState } from "react";
import { Modal } from "./Modal";
interface MessageBubbleProps {
  role: "user" | "model";
  content: string;
  imageUrl?: string;
}

export function MessageBubble({ role, content, imageUrl }: MessageBubbleProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div
      className={`mb-3 flex ${
        role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-sm p-3 rounded-lg shadow-md text-sm ${
          role === "user"
            ? "bg-[var(--primary-color)] text-white"
            : "bg-[#f1f5f9] text-gray-700"
        }`}
      >
        <Markdown>{content}</Markdown>
        {imageUrl && (
          <div className="mt-2 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="uploaded image"
              className="max-h-[250px] w-auto rounded-md shadow-md cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <img
                src={imageUrl}
                alt="uploaded image"
                className="w-full max-h-[80vh]  rounded-md shadow-md"
              />
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
}
