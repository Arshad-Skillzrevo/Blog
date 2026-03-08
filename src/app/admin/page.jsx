"use client";

import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import BlogEditor from "@/components/BlogEditor";
import BlogTable from "@/components/BlogTable";

export default function AdminPage() {
  const [token, setToken] = useState(null);

  if (!token) return <LoginForm setToken={setToken} />;

  return (
    <div className="p-10 space-y-10">
      <BlogEditor token={token} />
      <BlogTable token={token} />
    </div>
  );
}