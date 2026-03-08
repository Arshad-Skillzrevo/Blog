import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">

        <Link href="/">
          <span className="text-2xl font-bold heading-font uppercase text-[var(--skillz-blue)]">
            SkillzRevo Blog
          </span>
        </Link>

        <div className="flex gap-6">
          <Link href="/blog">Blog</Link>
          <Link href="/admin">Admin</Link>
        </div>

      </div>
    </nav>
  );
}