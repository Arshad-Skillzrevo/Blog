"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export default function BlogTable() {
  const [blogs, setBlogs] = useState([]);

  async function loadBlogs() {
    const res = await fetch("/api/blogs");
    const data = await res.json();
    setBlogs(data);
  }

  async function deleteBlog(slug) {
    await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
    loadBlogs();
  }

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <div className="border p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Blogs</h2>

      {blogs.map((blog) => (
        <div
          key={blog.slug}
          className="flex justify-between border-b py-2"
        >
          <span>{blog.title}</span>

          <button onClick={() => deleteBlog(blog.slug)}>
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}