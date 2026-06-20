"use client";

import Image from "next/image";
import { useEffect, useState } from "react";


export default function SplashScreen() {
 const [animateOut, setAnimateOut] = useState(false); // to animate out splash screen
 const [visible, setVisible] = useState(true); // to control when splash screen is visible
 const SPLASH_DURATION = 1000;


 useEffect(() => {
   // Start animation to transition out
   const timer = setTimeout(() => setAnimateOut(true), SPLASH_DURATION);
   return () => clearTimeout(timer);
 }, []);


// Remove the splash screen
 useEffect(() => {
   if (animateOut) {
     const timer = setTimeout(() => setVisible(false), SPLASH_DURATION);
     return () => clearTimeout(timer);
   }
 }, [animateOut]);


 if (!visible) return null;


 return (
   <div
       className={`fixed inset-0 flex items-center justify-center bg-[rgb(24,24,27)] z-50 transition-all duration-[1000ms] ease-in-out ${
           animateOut ? "-translate-y-[150vh] opacity-0" : "translate-y-0 opacity-100"
       }`}
   >
       <div
       className={`transition-opacity duration-[1000ms] ease-in-out ${
         animateOut ? "opacity-0" : "opacity-100"
       }`}
     >
       <Image
         src="/api/media/file/logo-3.png"
         alt="Renopilot Logo"
         width={250} 
         height={250} 
         priority
       />
     </div>

   </div>
 );
}




