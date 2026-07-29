'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import DecryptedText from '@/components/DecryptedText';
import disciplineData from '@/data/skills/disciplines.json';
import toolData from '@/data/skills/tools.json';

type HomeLinkItem = {
  text: string;
  href: string;
  revealDirection: 'left' | 'right';
  labels: readonly string[];
  external?: boolean;
};

const disciplineNameById = new Map(
  disciplineData.map((discipline) => [discipline.id, discipline.name.en]),
);
const toolNameById = new Map(toolData.map((tool) => [tool.id, tool.name]));

const portfolioItems: HomeLinkItem[] = [
  { text: 'Obfuscation Identity Archive', href: 'https://archive.dominicduan.com/', revealDirection: 'right', labels: ['3D Web Interaction', 'AIGC Automated Archiving'], external: true },
  { text: 'GLITCH IN THE HIVE', href: '/other-works/glitch-in-the-hive', revealDirection: 'right', labels: [disciplineNameById.get('film-photography')!, disciplineNameById.get('music-sound')!] },
  { text: 'LCF CC SonySIE Project', href: '/other-works/sony-sie', revealDirection: 'right', labels: [disciplineNameById.get('creative-technology')!, disciplineNameById.get('music-sound')!, toolNameById.get('touchdesigner')!] },
  { text: 'Digital Alchemy', href: 'https://digitalalchemy.dominicduan.com', revealDirection: 'right', labels: ['AIGC Film & Post-production', 'Web Design', 'Speculative Design'], external: true },
  { text: 'WaveSync', href: '/other-works/work-1', revealDirection: 'right', labels: [disciplineNameById.get('music-sound')!, toolNameById.get('touchdesigner')!, 'Interaction & Creative Technology'] },
];

const fashionLabItems: HomeLinkItem[] = [
  { text: '幻', href: '/projects/project-a', revealDirection: 'left', labels: [toolNameById.get('blender')!, '3D Design & Modelling', 'Materials & Rendering'] },
  { text: '墙', href: '/projects/project-b', revealDirection: 'left', labels: [disciplineNameById.get('fashion-textiles')!, '3D Printing', toolNameById.get('touchdesigner')!, 'Arduino & Interactive Design', 'Photography'] },
  { text: '灵', href: '/projects/project-c', revealDirection: 'left', labels: [disciplineNameById.get('fashion-textiles')!, 'Knitting', 'Cultural Research', 'Sustainability'] },
  { text: '根', href: '/projects/project-d', revealDirection: 'left', labels: [disciplineNameById.get('fashion-textiles')!, 'Knitting', 'Cultural Research', 'Photography'] },
];

function HomeLink({
  item,
  onNavigate,
}: {
  item: HomeLinkItem;
  onNavigate: (item: HomeLinkItem) => void;
}) {
  return (
    <motion.button
      type="button"
      className="group relative block w-fit cursor-pointer p-0 text-left"
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
      <span className="pointer-events-none absolute left-full top-1/2 ml-5 hidden -translate-y-1/2 flex-col items-start gap-1 whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:flex">
        {item.labels.map((label) => (
          <span
            key={label}
            className="rounded-full border border-zinc-700/80 bg-black/90 px-2 py-0.5 font-mono text-[10px] leading-4 tracking-wide text-zinc-400"
          >
            {label}
          </span>
        ))}
      </span>
    </motion.button>
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
