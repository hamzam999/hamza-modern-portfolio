'use client'

import { slideInFromLeft, slideInFromRight, slideInFromTop } from '@/utils/motion'
import { SparklesIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const HeroSection = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-row items-center justify-center px-20 mt-40 w-full z-[20]"
      id='about-me'
    >
      <div className="h-full w-full flex flex-col gap-5 justify-center m-auto text-start ">
        <motion.div
          className="welcome-box py-[15px] px-[7px] border border-[#7042f88b] opacity-[0.9]"
          variants={slideInFromTop}
        >
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <h1 className="welcome-text text-[13px]">Frontend Developer</h1>
        </motion.div>

        <motion.div
          className="flex flex-col gap-6 text-6xl text-bold text-white max-w-[600px] w-auto h-auto"
          variants={slideInFromLeft(0.5)}
        >
          <span>
         Transforming Concepts into <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">Seamless User Experiences</span>.
          </span>
        </motion.div>
        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-lg text-gray-400 my-5 max-w-[600px]"
        >
          Results-driven Frontend Developer with 2+ years of experience specializing in decentralized applications (DApps), blockchain integration, and Web3 technologies. Skilled in React.js, Next.js, TypeScript, Web3.js, Redux, and smart contract integrations. Proven work experience in developing
          NFT marketplaces, Web3 gaming platforms, multi-signature wallets, and dApps.
        </motion.p>

        <motion.a
          variants={slideInFromLeft(1)}
          className="py-2 button-primary text-center text-white cursor-pointer rounded-lg max-w-[200px]"
        >
          Learn more
        </motion.a>
      </div>
      <motion.div
        variants={slideInFromRight(0.8)}
        className="w-full h-full flex justify-center items-center"
      >
        <Image
          src="/hero-bg.svg"
          alt="work icons"
          height={650}
          width={650}
          draggable={false}
          className="select-none"
        />
      </motion.div>
    </motion.div>
  )
}

export default HeroSection
