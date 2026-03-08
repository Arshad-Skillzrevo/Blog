import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

export default function Admin(){

 return(
  <ProtectedRoute>

   <div className="p-10">

    <h1 className="heading text-4xl text-[var(--skillz-blue)]">
     Admin Dashboard
    </h1>

    <Link
     href="/admin/blogs/create"
     className="bg-[var(--skillz-orange)] text-white px-6 py-3 mt-6 inline-block"
    >
     Create Blog
    </Link>

   </div>

  </ProtectedRoute>
 );
}