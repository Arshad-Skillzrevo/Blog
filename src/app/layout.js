import { Oswald } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const oswald = Oswald({
 subsets:["latin"],
 variable:"--font-oswald"
});

export const metadata={
 title:"SkillzRevo CMS",
 description:"Centralized Blog CMS"
};

export default function RootLayout({children}){
 return(
  <html lang="en" className={oswald.variable}>
   <body>
    <Navbar/>
    {children}
   </body>
  </html>
 );
}