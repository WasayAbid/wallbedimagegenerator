"use client";
import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem("loggedIn");
  }, [router]);
  useEffect(() => {
    const loggedIn = sessionStorage.getItem("loggedIn") === "true";
    if (loggedIn) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (password === "wallbedz.com") {
      sessionStorage.setItem("loggedIn", "true");
      router.push("/");
    } else {
      setError("Invalid password. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center bg-white`}
    >
      <div className="flex flex-col w-full max-w-md h-auto bg-white rounded-xl shadow-2xl overflow-hidden relative p-6 ">
        <h1
          className="text-2xl font-bold text-gray-800 mb-6 text-center"
          style={{ color: "var(--primary-color)" }}
        >
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Murphy Al-Saham Staff"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-gray-700 bg-[#f8fafc] shadow-sm text-sm"
              disabled
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-gray-700 bg-[#f8fafc] shadow-sm text-sm"
              required
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-[var(--primary-color)] hover:bg-[#c4135b] text-white font-semibold py-3 px-5 rounded-md focus:outline-none focus:shadow-outline shadow-lg text-sm w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
      <footer className="mt-4 text-center text-xs text-[#9ca3af]">
        A creation of Murphy Al-Saham
      </footer>
    </main>
  );
};

export default LoginPage;
