"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["700"] });

export function ChatHeader() {
  return (
    <header className="w-full max-w-3xl bg-white rounded-t-xl shadow-2xl p-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="relative w-[100px] h-[100px] mr-2 flex-shrink-0">
          <Image
            src="/images/logo-large.webp"
            alt="Website Icon"
            fill
            sizes="100px"
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col">
          <h1
            className={`text-3xl text-[var(--primary-color)] ${montserrat.className} drop-shadow-md`}
          >
            AI Furniture Designer
          </h1>
          <p className="text-sm text-[#6b7280] mt-1">
            Create your Dream Furniture Item
          </p>
        </div>
      </div>
    </header>
  );
}
