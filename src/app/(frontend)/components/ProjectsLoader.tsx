"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../Images/box-logo.png" ; // adjust path to your logo

export default function ProjectsLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // 1 second splash
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[rgba(27,27,29,0.5)]">
        <div className="animate-pulse">
          <Image 
            src={logo} 
            alt="Logo" 
            width={200} 
            height={200} 
            className="object-contain"
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
