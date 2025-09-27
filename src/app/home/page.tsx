'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import DecryptedText from '@/components/DecryptedText';

export default function HomePage() {
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-black flex items-start justify-center pt-32">
      <div className="max-w-2xl mx-auto px-8">
        {/* 主标题 - 调整此处mb-2来改变FASHION LAB和Project A之间的间距 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <DecryptedText
            text="FASHION LAB"
            speed={180}
            maxIterations={15}
            className="text-2xl md:text-3xl font-bold text-zinc-100 cursor-pointer font-mono text-left"
            animateOn="view"
            revealDirection="center"
          />
        </motion.div>

        {/* Fashion Lab 子项目 */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="space-y-3">
            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation('/projects/project-a')}
            >
              <DecryptedText
                text="幻"
                speed={200}
                maxIterations={12}
                className="text-base text-zinc-300 hover:text-white transition-colors font-mono text-left"
                animateOn="view"
                revealDirection="left"
              />
            </motion.div>
            
            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation('/projects/project-b')}
            >
              <DecryptedText
                text="墙"
                speed={220}
                maxIterations={12}
                className="text-base text-zinc-300 hover:text-white transition-colors font-mono text-left"
                animateOn="view"
                revealDirection="left"
              />
            </motion.div>
            
            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation('/projects/project-c')}
            >
              <DecryptedText
                text="灵"
                speed={280}
                maxIterations={12}
                className="text-base text-zinc-300 hover:text-white transition-colors font-mono text-left"
                animateOn="view"
                revealDirection="left"
              />
            </motion.div>
            
            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation('/projects/project-d')}
            >
              <DecryptedText
                text="根"
                speed={320}
                maxIterations={12}
                className="text-base text-zinc-300 hover:text-white transition-colors font-mono text-left"
                animateOn="view"
                revealDirection="left"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Other Works 标题 - 调整此处mb-10来改变OTHER WORKS和Work 1之间的间距 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <DecryptedText
            text="OTHER WORKS"
            speed={240}
            maxIterations={15}
            className="text-2xl md:text-3xl font-bold text-zinc-100 font-mono text-left"
            animateOn="view"
            revealDirection="center"
          />
        </motion.div>

        {/* Other Works 子项目 */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="space-y-3">
            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation('/other-works/work-1')}
            >
              <DecryptedText
                text="WaveSync"
                speed={400}
                maxIterations={12}
                className="text-base text-zinc-300 hover:text-white transition-colors font-mono text-left"
                animateOn="view"
                revealDirection="right"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}