'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const youtubeUrl = 'https://youtu.be/5CudZJwybjg';

const introduction = [
  'Imagine a world… beyond the body. Where flesh is no longer a boundary, and identity is no longer your own..',
  'We come from a time after the human form reached its peak and then… chose to abandon itself…',
  'A world where consciousness flows freely, but freedom comes at a cost..',
  'Where privacy is a myth, death is a decision, and to be human… is a question no one can answer anymore.',
  'A story of showing… and hiding. Of emotion… and rebellion. Of what remains… when the body disappears.',
  '“And what emerges… when it returns.”',
];

const credits = [
  ['DIRECTED BY', 'Shihao Duan'],
  ['WRITTEN BY', 'Shihao Duan & Larissa Lorenzi'],
  ['CAST', 'Anupreet & Shihao Duan'],
  ['DIRECTORS OF PHOTOGRAPHY', 'Qi Zhang & Shihao Duan'],
  ['COSTUME DESIGN', 'Qi Zhang, Anupreet & Larissa Lorenzi'],
  ['EDITED BY', 'Shihao Duan & Anupreet'],
  ['MUSIC & SOUND', 'Shihao Duan'],
  ['POST-PRODUCTION', 'Shihao Duan'],
];

const footageImages = [
  '01.png',
  '02.png',
  '03.png',
  '04.png',
  '05.png',
  '06.png',
  '07.png',
  '08.png',
  '09.png',
  '10.png',
  '11.png',
  '12.png',
];

export default function GlitchInTheHivePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold font-mono mb-8">
            GLITCH IN THE HIVE
          </h1>
        </motion.div>

        <motion.div
          className="mb-12 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {introduction.map((paragraph) => (
            <p
              key={paragraph}
              className="text-zinc-300 text-lg leading-relaxed font-mono"
            >
              {paragraph}
            </p>
          ))}
        </motion.div>

        <motion.div
          className="mb-12 border-t border-zinc-800 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="mb-6 text-xl font-bold font-mono text-zinc-100">
            FOOTAGE
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {footageImages.map((imageName, index) => (
              <div
                key={imageName}
                className="relative aspect-video overflow-hidden border border-zinc-800 bg-zinc-900"
              >
                <Image
                  src={`/images/footage_GIH/${imageName}`}
                  alt={`GLITCH IN THE HIVE footage ${index + 1}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mb-12 space-y-3 border-t border-zinc-800 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {credits.map(([role, name]) => (
            <div
              key={role}
              className="grid grid-cols-1 gap-1 font-mono sm:grid-cols-[220px_1fr] sm:gap-8"
            >
              <span className="text-sm tracking-wide text-zinc-500">{role}</span>
              <span className="text-zinc-200">{name}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 border border-zinc-800 bg-zinc-900/50 rounded-full hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white text-sm hover:scale-105"
          >
            在 YouTube 上观看 →
          </a>
        </motion.div>
      </div>
    </div>
  );
}
