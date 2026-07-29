"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Home() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    api.get("/health")
      .then((response) => {
        setMessage(response.data.status);
      })
      .catch(() => {
        setMessage("Backend not reachable");
      });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">
        Backend Status: {message}
      </h1>
    </main>
  );
}
