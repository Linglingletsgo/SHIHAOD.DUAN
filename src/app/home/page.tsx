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
        {/* Portfolio 标题 - 调整此处mb-8来改变PORTFOLIO和子项目之间的间距 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <DecryptedText
            text="PORTFOLIO"
            speed={100}
            maxIterations={15}
            className="text-2xl md:text-3xl font-bold text-zinc-100 font-mono text-left"
            animateOn="view"
            revealDirection="center"
          />
        </motion.div>

        {/* Portfolio 子项目 */}
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
              onClick={() => handleNavigation('/other-works/work-1')}
            >
              <DecryptedText
                text="WaveSync"
                speed={100}
                maxIterations={12}
                className="text-base text-zinc-300 hover:text-white transition-colors font-mono text-left"
                animateOn="view"
                revealDirection="right"
              />
            </motion.div>

            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation('/other-works/sony-sie')}
            >
              <DecryptedText
                text="LCF CC SonySIE Project"
                speed={100}
                maxIterations={12}
                className="text-base text-zinc-300 hover:text-white transition-colors font-mono text-left"
                animateOn="view"
                revealDirection="right"
              />
            </motion.div>

            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'https://digitalalchemy.dominicduan.com'}
            >
              <DecryptedText
                text="Digital Alchemy"
                speed={100}
                maxIterations={12}
                className="text-base text-zinc-300 hover:text-white transition-colors font-mono text-left"
                animateOn="view"
                revealDirection="right"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Fashion Lab 标题 - 调整此处mb-8来改变FASHION LAB和Project A之间的间距 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <DecryptedText
            text="FASHION LAB"
            speed={100}
            maxIterations={15}
            className="text-2xl md:text-3xl font-bold text-zinc-100 cursor-pointer font-mono text-left"
            animateOn="view"
            revealDirection="center"
          />
        </motion.div>

        {/* Fashion Lab 子项目 */}
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
              onClick={() => handleNavigation('/projects/project-a')}
            >
              <DecryptedText
                text="幻"
                speed={100}
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
                speed={100}
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
                speed={100}
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
                speed={100}
                maxIterations={12}
                className="text-base text-zinc-300 hover:text-white transition-colors font-mono text-left"
                animateOn="view"
                revealDirection="left"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}