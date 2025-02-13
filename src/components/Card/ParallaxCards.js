'use client'
import Image from 'next/image'
import { useTransform, motion, useScroll } from 'framer-motion'
import { useRef } from 'react'

const ParallaxCards = ({ i, title, description, image, progress, range, targetScale }) => {
  const container = useRef(null)

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div
      ref={container}
      className="h-screen flex items-center justify-center sticky top-[20px]"
    >
      <motion.div
        style={{ scale, top: `calc(-5vh + ${i * 25}px)` }}
        className="flex flex-col relative justify-between h-[70vh] w-[90%] max-w-[90%] rounded-lg shadow-lg shadow-[#8449FD]/40 border border-[#8449FD]/20 p-[70px] bg-grey/50 backdrop-blur-md"
      >
        <div className="flex h-full justify-between items-center gap-10">
          {/* Description Section */}
          <div className="w-1/2">
            <h2 className="text-left text-[35px] pb-4 font-medium">{title}</h2>
            <p className="text-[22px] opacity-80 mt-4">{description}</p>
          </div>
          {/* Image Section */}
          <div className="w-1/2 relative rounded-[25px] overflow-hidden">
            <motion.div className="flex justify-center">
              <Image
                src={image}
                alt="image"
                height={1000}
                width={700}
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ParallaxCards
