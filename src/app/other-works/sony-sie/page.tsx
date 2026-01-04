'use client';

import { motion } from 'framer-motion';

export default function SonySIEPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* 标题 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold font-mono mb-8">LCF CC SonySIE Project</h1>
        </motion.div>

        {/* 视频 */}
        <motion.div
          className="relative w-full aspect-video mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <iframe 
            src="https://www.youtube.com/embed/mkeYKIexlx8?si=eQiLjIL50RJi7PE5" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
            className="w-full h-full rounded-lg shadow-2xl"
          ></iframe>
        </motion.div>

        <motion.div 
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
            <p className="text-zinc-500 text-sm mb-3">
                如果视频无法播放 (Refused to connect)，请点击下方链接查看
            </p>
            <a 
                href="https://youtu.be/mkeYKIexlx8" 
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
