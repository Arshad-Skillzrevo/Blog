import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-10">

      <h1 className="text-5xl heading-font uppercase text-[var(--skillz-blue)]">
        SkillzRevo Blog CMS
      </h1>

      <p className="mt-4 text-gray-600">
        Centralized blog platform for all SkillzRevo websites.
      </p>

      <Link
        href="/blog"
        className="inline-block mt-6 px-6 py-3 bg-[var(--skillz-orange)] text-white rounded"
      >
        View Blogs
      </Link>

    </main>
  );
}