"use client"

import { Fade, Scale } from "./animation"
import ImageCarousel from "./ImageCarousel"

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <ImageCarousel />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center z-10">
          <Fade direction="up" duration={500} className="text-5xl md:text-7xl font-bold mb-4 text-white">
            Bem-vindo à <span className="text-blue-500">Auto Care</span>
          </Fade>
          <Fade direction="down" duration={500} delay={200} className="text-xl md:text-2xl mb-8 text-white">
            Experimente o futuro da estética automotiva
          </Fade>
          <Scale scale={0.5} duration={500} delay={400} className="inline-block">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors">
              Comece Agora
            </button>
          </Scale>
        </div>
      </div>
    </section>
  )
}
