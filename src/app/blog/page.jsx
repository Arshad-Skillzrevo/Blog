import { supabase } from "@/lib/supabase";
import BlogCard from "@/components/BlogCard";

export default async function BlogPage(){

 const {data}=await supabase
 .from("blog")
 .select("*")
 .eq("status","published")
 .order("created_at",{ascending:false});

 return(
  <div className="max-w-6xl mx-auto p-10 grid md:grid-cols-3 gap-6">

   {data?.map((blog)=>(
    <BlogCard key={blog.id} blog={blog}/>
   ))}

  </div>
 );
}