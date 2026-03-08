"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({children}){

 const router=useRouter();

 useEffect(()=>{

  const checkAuth=async()=>{

   const {data}=await supabase.auth.getSession();

   if(!data.session){
    router.push("/login");
   }

  };

  checkAuth();

 },[]);

 return children;
}