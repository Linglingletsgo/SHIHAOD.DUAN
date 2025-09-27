'use client';

import { motion } from 'framer-motion';

export default function WaveSyncPage() {
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
          <h1 className="text-4xl md:text-6xl font-bold font-mono mb-8">WaveSync</h1>
        </motion.div>

        {/* 视频 */}
        <motion.div
          className="relative w-full max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <video
            controls
            controlsList="nodownload nofullscreen noremoteplayback"
            className="w-full rounded-lg shadow-2xl"
            poster="/images/wavesync-poster.jpg"
          >
            <source src="/videos/WaveSync.mov" type="video/mov" />
            您的浏览器不支持视频播放。
          </video>
        </motion.div>
      </div>
    </div>
  );
}
