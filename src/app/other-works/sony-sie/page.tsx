'use client';

import { motion } from 'framer-motion';

export default function SonySIEPage() {
  const youtubeUrl = 'https://youtu.be/mkeYKIexlx8';
  const introduction = [
    'In an era of growing Binary Polarization, individual consciousness is torn between absolute Order and Chaos.',
    'This creates an Existential Void, where individuals often seek a fleeting sensory escape through substances like tobacco and alcohol. This project aims to play a role like a cigarette.',
    'We are not looking for harmony or relaxation, but rather confronting this kind of reality in an absurdist way.',
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* 标题 */}
        <motion.div
          className="text-left mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold font-mono mb-8">LCF CC SonySIE Project</h1>
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
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
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
