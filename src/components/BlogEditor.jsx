"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function BlogEditor() {
  const [blog, setBlog] = useState({
    title: "",
    category: "training",
    description: "",
    content: "",
    image: "",
  });

  async function save() {
    await fetch("/api/blogs", {
      method: "POST",
      body: JSON.stringify(blog),
    });

    alert("Blog Added");
  }

  return (
    <div className="space-y-4 border p-6 rounded-xl">
      <h2 className="text-xl font-bold">Add Blog</h2>

      <input
        className="border p-2 w-full"
        placeholder="Title"
        onChange={(e) => setBlog({ ...blog, title: e.target.value })}
      />

      <input
        className="border p-2 w-full"
        placeholder="Image URL"
        onChange={(e) => setBlog({ ...blog, image: e.target.value })}
      />

      <textarea
        className="border p-2 w-full"
        rows={8}
        placeholder="Content"
        onChange={(e) => setBlog({ ...blog, content: e.target.value })}
      />

      <button
        onClick={save}
        className="bg-blue-600 text-white px-4 py-2 flex gap-2"
      >
        <Plus size={16} />
        Publish
      </button>
    </div>
  );
}