import { readJSON, writeJSON } from "@/lib/filedb";

export async function GET(req, { params }) {
  const blogs = readJSON("blogs.json");

  const blog = blogs.find((b) => b.slug === params.slug);

  return Response.json(blog);
}

export async function DELETE(req, { params }) {
  let blogs = readJSON("blogs.json");

  blogs = blogs.filter((b) => b.slug !== params.slug);

  writeJSON("blogs.json", blogs);

  return Response.json({ success: true });
}