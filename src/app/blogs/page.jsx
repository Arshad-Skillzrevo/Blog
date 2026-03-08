async function getBlogs() {
  const res = await fetch("http://localhost:3000/api/blogs", {
    cache: "no-store",
  });

  return res.json();
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">Blogs</h1>

      {blogs.map((blog) => (
        <a key={blog.slug} href={`/blogs/${blog.slug}`}>
          <div className="border p-5 mb-4 rounded-lg">
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="text-gray-500">{blog.description}</p>
          </div>
        </a>
      ))}
    </div>
  );
}