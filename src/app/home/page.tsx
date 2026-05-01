'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import DecryptedText from '@/components/DecryptedText';

type HomeLinkItem = {
  text: string;
  href: string;
  revealDirection: 'left' | 'right';
  external?: boolean;
};

const portfolioItems: HomeLinkItem[] = [
  { text: 'WaveSync', href: '/other-works/work-1', revealDirection: 'right' },
  { text: 'LCF CC SonySIE Project', href: '/other-works/sony-sie', revealDirection: 'right' },
  { text: 'GLITCH IN THE HIVE', href: '/other-works/glitch-in-the-hive', revealDirection: 'right' },
  { text: 'Digital Alchemy', href: 'https://digitalalchemy.dominicduan.com', revealDirection: 'right', external: true },
];

const fashionLabItems: HomeLinkItem[] = [
  { text: '幻', href: '/projects/project-a', revealDirection: 'left' },
  { text: '墙', href: '/projects/project-b', revealDirection: 'left' },
  { text: '灵', href: '/projects/project-c', revealDirection: 'left' },
  { text: '根', href: '/projects/project-d', revealDirection: 'left' },
];

function HomeLink({
  item,
  onNavigate,
}: {
  item: HomeLinkItem;
  onNavigate: (item: HomeLinkItem) => void;
}) {
  return (
    <motion.div
      className="cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onNavigate(item)}
    >
      <DecryptedText
        text={item.text}
        speed={100}
        maxIterations={12}
        className="text-base text-zinc-300 hover:text-white transition-colors font-mono text-left"
        animateOn="view"
        revealDirection={item.revealDirection}
      />
    </motion.div>
  );
}

export default function HomePage() {
  const router = useRouter();

  const handleNavigation = (item: HomeLinkItem) => {
    if (item.external) {
      window.location.href = item.href;
      return;
    }

    router.push(item.href);
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
            {portfolioItems.map((item) => (
              <HomeLink key={item.href} item={item} onNavigate={handleNavigation} />
            ))}
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
            {fashionLabItems.map((item) => (
              <HomeLink key={item.href} item={item} onNavigate={handleNavigation} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
