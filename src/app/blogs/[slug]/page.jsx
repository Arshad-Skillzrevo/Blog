async function getBlog(slug) {
  const res = await fetch(`http://localhost:3000/api/blogs/${slug}`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function BlogPage({ params }) {
  const blog = await getBlog(params.slug);

  if (!blog) return <div>Not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

      <p className="text-gray-500 mb-6">{blog.date}</p>

      <div className="prose">{blog.content}</div>
    </div>
  );
}