import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function BlogDetail({ params }) {

  const { slug } = await params;

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto p-10">

      <h1 className="heading text-4xl text-[var(--skillz-blue)]">
        {data.title}
      </h1>

      {data.featured_image && (
        <img
          src={data.featured_image}
          alt={data.title}
          className="my-6 h-10 w-10 rounded-lg"
        />
      )}

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />

    </article>
  );
}