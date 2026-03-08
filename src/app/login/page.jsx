"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Login(){

 const router=useRouter();
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");

 const login=async(e)=>{
  e.preventDefault();

  const {error}=await supabase.auth.signInWithPassword({
   email,
   password
  });

  if(!error){
   router.push("/admin");
  }else{
   alert(error.message);
  }
 };

 return(
  <div className="flex justify-center items-center h-screen">

   <form onSubmit={login} className="bg-white p-10 shadow rounded w-96">

    <h2 className="text-2xl heading text-[var(--skillz-blue)] mb-6">
     Admin Login
    </h2>

    <input
     className="border w-full p-3 mb-4"
     placeholder="Email"
     onChange={(e)=>setEmail(e.target.value)}
    />

    <input
     type="password"
     className="border w-full p-3 mb-4"
     placeholder="Password"
     onChange={(e)=>setPassword(e.target.value)}
    />

    <button className="bg-[var(--skillz-orange)] text-white w-full p-3">
     Login
    </button>

   </form>
  </div>
 );
}