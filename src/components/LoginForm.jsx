"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";

export default function LoginForm({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const res = await fetch("/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ username, password })
});

    const data = await res.json();

    if (data.token) {
      setToken(data.token);
    } else {
      alert("Login failed");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-40 space-y-4">
      <input
        className="border p-2 w-full"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        className="border p-2 w-full"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="bg-black text-white p-2 w-full flex items-center justify-center gap-2"
      >
        <LogIn size={18} />
        Login
      </button>
    </div>
  );
}