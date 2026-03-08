import { readJSON, writeJSON } from "@/lib/filedb";
import { slugify } from "@/lib/slugify";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  let blogs = readJSON("blogs.json");

  if (category) {
    blogs = blogs.filter((b) => b.category === category);
  }

  return Response.json(blogs);
}

export async function POST(req) {
  const body = await req.json();

  const blogs = readJSON("blogs.json");

  const slug = slugify(body.title);

  const blog = {
    id: Date.now().toString(),
    ...body,
    slug,
    date: new Date().toISOString(),
  };

  blogs.push(blog);

  writeJSON("blogs.json", blogs);

  return Response.json(blog);
}