import Link from "next/link";

export default function BlogCard({ blog }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow">

      <h2 className="text-xl heading-font uppercase text-[var(--skillz-blue)]">
        {blog.title}
      </h2>

      <p className="mt-2 text-gray-600">
        {blog.excerpt}
      </p>

      <Link
        href={`/blog/${blog.slug}`}
        className="text-[var(--skillz-orange)] mt-4 inline-block"
      >
        Read More →
      </Link>

    </div>
  );
}