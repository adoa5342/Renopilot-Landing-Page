import type { Metadata } from "next";
import "./styles.css";
import SplashScreen from "./components/SplashScreen";

export const metadata: Metadata = {
  title: "RenoPilot",
  description: "A blank template using Payload in a Next.js app.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#1b1b1d]">
        <SplashScreen />
        <main>{children}</main>
      </body>
    </html>
  );
}
