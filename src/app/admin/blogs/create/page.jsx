"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import slugify from "slugify";

export default function CreateBlog(){

 const [form,setForm]=useState({
  title:"",
  excerpt:"",
  content:"",
  category:"",
  tags:"",
  author:"",
  seo_title:"",
  seo_description:"",
  status:"published"
 });

 const [image,setImage]=useState(null);

 const uploadImage=async()=>{

  if(!image) return "";

  const fileName=Date.now()+"-"+image.name;

  const {data}=await supabase.storage
   .from("blog-images")
   .upload(fileName,image);

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${fileName}`;

 };

 const submit=async(e)=>{
  e.preventDefault();

  const imageUrl=await uploadImage();

  const slug=slugify(form.title,{lower:true});

  await supabase.from("blogs").insert({
   ...form,
   slug,
   featured_image:imageUrl,
   tags:form.tags.split(",")
  });

  alert("Blog Published");
 };

 return(

  <div className="max-w-3xl mx-auto p-10">

   <h1 className="heading text-3xl mb-6 text-[var(--skillz-blue)]">
    Create Blog
   </h1>

   <form onSubmit={submit} className="space-y-4">

    <input
     placeholder="Title"
     className="border w-full p-3"
     onChange={(e)=>setForm({...form,title:e.target.value})}
    />

    <textarea
     placeholder="Excerpt"
     className="border w-full p-3"
     onChange={(e)=>setForm({...form,excerpt:e.target.value})}
    />

    <textarea
     placeholder="Content (HTML allowed)"
     className="border w-full p-3 h-40"
     onChange={(e)=>setForm({...form,content:e.target.value})}
    />

    <input
     placeholder="Category"
     className="border w-full p-3"
     onChange={(e)=>setForm({...form,category:e.target.value})}
    />

    <input
     placeholder="Tags (comma separated)"
     className="border w-full p-3"
     onChange={(e)=>setForm({...form,tags:e.target.value})}
    />

    <input
     placeholder="Author"
     className="border w-full p-3"
     onChange={(e)=>setForm({...form,author:e.target.value})}
    />

    <input
     type="file"
     onChange={(e)=>setImage(e.target.files[0])}
    />

    <input
     placeholder="SEO Title"
     className="border w-full p-3"
     onChange={(e)=>setForm({...form,seo_title:e.target.value})}
    />

    <textarea
     placeholder="SEO Description"
     className="border w-full p-3"
     onChange={(e)=>setForm({...form,seo_description:e.target.value})}
    />

    <button className="bg-[var(--skillz-orange)] text-white px-6 py-3">
     Publish Blog
    </button>

   </form>

  </div>

 );
}