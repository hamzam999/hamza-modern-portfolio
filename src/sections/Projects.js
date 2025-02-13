"use client";
import ParallaxCards from "@/components/Card/ParallaxCards";
import { ProjectCard } from "@/components/ProjectCard";
import { PROJECTS } from "@/constants";
import { useScroll } from "framer-motion";
import { useRef } from "react";

export const Projects = () => {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  return (
    <section
      id="projects"
      // className="flex flex-col items-center justify-center py-20"
      className="h-full flex flex-col items-center justify-center"
      ref={sectionRef}
    >
      <h1 className="text-[40px] text-align-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
        My Projects
      </h1>
      {/* <div className="h-full w-full flex flex-col md:flex-row gap-10 px-10">
        {PROJECTS.map((project) => (
          <ProjectCard
            key={project.title}
            src={project.image}
            title={project.title}
            description={project.description}
            link={project.link}
          />
        ))}
      </div> */}
         {PROJECTS.map((project, i) => {
        const targetScale = 1 - (PROJECTS.length - i) * 0.05
        return (
          <ParallaxCards
            key={`p_${i}`}
            i={i}
            {...project}
            progress={scrollYProgress}
            range={[i * 0.25, 1]}
            targetScale={targetScale}
          />
        )
      })}
    </section>
  );
};
