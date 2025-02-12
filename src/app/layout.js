import "./globals.css";
import { Inter, Calistoga } from "next/font/google";
import { StarsCanvas } from "@/components/StarBackground";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { cn } from "@/utils";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const calistoga = Calistoga({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ['400'],
});

export const metadata = {
  title: "Er. Hamza",
  description: "Front end developer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn(inter.variable, calistoga.variable, 'bg-[#030014] text-white font-sans overflow-y-scroll overflow-x-hidden')}
      >
        <StarsCanvas/>
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
