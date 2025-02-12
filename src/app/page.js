import Hero from "@/components/Hero";
import { Footer } from "@/sections/Footer";
import { Header } from "@/sections/Header";
import { Projects } from "@/sections/Projects";
import { Skills } from "@/sections/Skills";
import Image from "next/image";

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-20 h-[850px]">
        <Hero />
        <Skills/>
        <Projects/>
        <Footer/>
      </div>
    </main>
  );
}
