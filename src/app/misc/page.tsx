'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

// TODO: 用户可以在这里编辑文本内容
const writings = [
  {
    id: 1,
    content: `你是神
你长在谁的眼里
`
  },
  {
    id: 2,
    content: `翻遍了神的历史
还是找不到你眼里那光的来历——
人创造的神创造了人
——我创造了她
还是她创造了我追逐的信仰
`
  },
  {
    id: 3,
    content: `闲年，
永夜、凉风、厚雪
篝火、银河、北极光
十七、八岁的我和你
`
  },
  {
    id: 4,
    content: `“看。”
“那里有个月亮，
别人都不知道，
只有你知道。”
“这句话说的好好啊。”
（笑）
`
  },
  {
    id: 5,
    content: `高考结束了
我们要离开这个城市了
奶奶要回老家了
她说要去见几个朋友
可能是这辈子最后一面了
`
  },
  {
    id: 6,
    content: `我在两处思念你
    碧落和黄泉
    我没去过人间
    不知道如何爱你
`
  },
  {
    id: 7,
    content: `我想要朋友无需多言，我想要志得意满，我想要过浪漫的生活。
    时也命也，有时终须有。
`
  },
  {
    id: 8,
    content: `保持冷静，保持冷漠，力争上游。`
  },
  {
    id: 9,
    content: `夜月沉入我的海`
  },


];

// 文本框组件
const WritingCard = ({ writing, isExpanded, onToggle, index, isLast }: {
  writing: { id: number; content: string };
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
  isLast: boolean;
}) => {
  // 根据文本长度自适应字体大小
  const getFontSize = (content: string) => {
    const length = content.length;
    if (length < 100) return 'text-lg';
    if (length < 300) return 'text-base';
    if (length < 600) return 'text-sm';
    return 'text-xs';
  };

  // 错落布局 - 第一个左对齐，第二个右对齐，依次错落
  const isLeft = index % 2 === 0;
  const containerClass = isLeft ? 'flex justify-start' : 'flex justify-end';

  // 如果是最后一个文本框，渲染为超链接，居中显示
  if (isLast) {
    return (
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Link href="/misc/night-moon">
          <motion.div
            className="bg-zinc-800/30 rounded-lg p-6 mb-6 cursor-pointer border border-zinc-600/30 hover:border-zinc-500/50 transition-colors max-w-md"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="text-zinc-100 text-lg font-medium text-center">
              {writing.content}
            </div>
          </motion.div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`${containerClass}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div
        className="bg-zinc-800/30 rounded-lg p-6 mb-6 cursor-pointer max-w-md"
        onClick={onToggle}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <motion.div
          initial={false}
          animate={{ 
            height: isExpanded ? 'auto' : 'auto',
            opacity: isExpanded ? 1 : 0.7
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className={`text-zinc-300 leading-relaxed whitespace-pre-line ${getFontSize(writing.content)}`}>
            {writing.content}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default function MiscPage() {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };


  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 错落文本框列表 */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {writings.map((writing, index) => (
            <WritingCard
              key={writing.id}
              writing={writing}
              isExpanded={expandedItems.includes(writing.id)}
              onToggle={() => toggleExpanded(writing.id)}
              index={index}
              isLast={index === writings.length - 1}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
