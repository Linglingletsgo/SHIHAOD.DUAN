'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

// TODO: 用户可以在这里编辑夜月沉入我的海的内容
const nightMoonWritings = [
  {
    id: 1,
    title: '我的自由像是烟和水 2023.3.7',
    content: `最近想了些自由之类的。
疫情以来，自由的呼声越来越高了，越往上走，身边人也越渴望自由了。
我好像从来没呼喊过自由，我好像觉得我是自由的，非常。

但回看我的原生环境，三线城市，父亲是工程师，母亲是会计，与大多数中国家庭一样，我的成长就是围绕学习成绩，高中的时候老师说学习好的不用考虑艺考。
我不知道什么是艺术，什么是自由，好在兴趣驱使我读了一些书，诱出我一点表达欲，尝试摆弄一些文字，之后才算是与艺术沾了点边。
说到这里，我发觉在我心里自由和艺术是在一块的。

客观讲是谈不上多自由的。

人们想要自由，想要四处冲撞无拘无束，而我的自由，是随风而去。
是在家庭和社会的条条框框中如风中之烟雾，顺风而行又不被束缚，又如山间之流水顺势而为。
每个人是不一样的，我恰恰容易安时顺命。

也不能忽视，我的人生是顺利的。初中的语文老师在我升入高中后，送我一本《牧羊少年奇幻之旅》，封皮上有一句话，大概是“当你全心全意想要实现某件事时，整个宇宙都会合力帮你实现愿望”，我一度把这句话当作一种信念，它也常常灵验。
我当然是个无神论者，但直到如今我也认为我命好，我是被眷顾的，很多事都是命运使然。
最近看宗教研究类的书籍，发觉我似乎是个泛神论者。
神不是远处的一座丰碑，神性像一抔盐，掺入世界这杯水中，掺入人的血液里，看不见摸不着，却时有察觉。
我认为我的行迹既是个人选择，也是某种超自然力量的指引，我更不必挣扎着自由，只看这缕风会把我带向何方。
`
  },
  {
    id: 2,
    title: '贪婪者理应付出与碰壁 2023.3.28',
    content: `酒后乱述，不成文法。
最近“孔乙己”文学被热议，我多说无益，且说说我自己。
也许我也是“孔乙己”之一，但我始终是没法把自己下沉到最广泛群众当中。
艺术是感性的。但我一直认为，艺术家应该是冷静冷漠的旁观者，经验而不入局过深。
大概是我自以为是、自命不凡所得片面之解。但我思考与阐述问题时，并不容易把自己当作受害者。即使是我的原生环境，我也以一种抽离的视角去看，我把它写出来，但离它越来越远。或者说，我列出所经历的问题，但并不共情。

苦难当然不是人生必须，但这永远是比上不足比下有余。而我愿意，也常常为了一些没有回报的目标付出很多努力。例如我写字，我做音乐，甚至我半路出家学服装设计。

文字是我最自信的东西。

我早期写浮华的文字，用各种修辞手法写眼花缭乱的情景描写。其实是因为笔下没有一点内容，只能写一些虚无的东西凑字。至于现在，很久以来，我认为最牛逼的手法永远是白描，简洁有力为上。不知何为文章好坏，但我手写我心，有什么可挑剔。而有些文艺青年的文字，不知是否故弄玄虚，看上去极为繁复，落笔似乎既是天才又是疯子。我是看不出什么好坏，也懒得看的。

而音乐美术，我从小就一点不懂。

音乐其实也是我的文字表达工具，但我还是在编曲、混音、录音等方面学习了很多，至少让我在审视别人时有些底气，至少让我能做出一些像样的东西。尽管受到的认可寥寥，我还是收获了蛮多乐趣。至少我做出了自己满意，乃至一些朋友也喜欢的作品。
我曾经甚至认真思考过要不要投入音乐行业，尽管很可能吃不上饭。但我看中的上海音乐学院的一个文化类专业叫艺术与科学，那年恰好在山东没有招生，而我后来也恰好录上了感兴趣的，跟设计沾点边的工科专业服装设计与工程，也便把音乐放在一边取悦自己而已了。

我们专业是工科，但我想往艺术靠，干脆学点画画吧，干脆多学点吧，干脆出国吧。

于是我就系统学习艺术设计准备出国了，这也就是最近的事。我几乎每天都在调研、拼贴、手绘。我的选题思路很多，对人文社科有一些深入的认知，资料检索能力也不错，但我的视觉作业还是过于稚嫩，漏洞百出，但我很欣慰我能清楚地知道我做的哪些东西是不够好的。  
我不确定我是否在这方面有天赋，相比很多搞艺术的，我似乎有些过于冷静，不够抽象。直观的穿着上我也越来越从简，我不想故弄玄虚，我觉得我的思想输出远比我看起来是谁更重要。所以我还是暂且不想什么天赋不天赋的，认准自己总是没错，既然面前有条路就一直走下去，至少两年后会有个是否被所谓权威认可的答案。

我总是觉得自己做的还不够，并且越来越觉得自己渺小，也许我做的越多越会发现自己的浅薄，而贪婪者理应付出与碰壁，故无论什么结果一笑置之。
我现在也只是平平无奇的庸众之一，我很开心的是，回看上一年的自己我都觉得差的太多，也就是每一年我都在某些方面有长足的进步。而我无所事事一段时间却会让我觉得极度空虚，所以还是继续努力吧。
`
  },
  {
    id: 3,
    title: '2023.10.27',
    content: `我知道二十岁会在今天到来，但真到的时候又好像没意识到。十九岁时说“这次不会躲在楼上观景观”，这一年，我的确逼迫自己入了很多局，不停的学习巩固我的欲望，但只有在忙碌到麻木之后，到站千岛湖时雨幕中感叹美好，玉龙雪山上一边大口吸氧，一边跟家人视频，回到山东跟朋友短暂地喝几场酒，我似乎意识到我是谁，我想要什么。我分享的东西越来越少，把衣服都换成实用极简无溢价的，把歌单里曾经收藏的歌一个个删除，把戒指项链收进首饰盒，再把首饰盒扔在家里，对一切重新思考与祛魅。

Floatin’ on a silver lining.我不再在乎我是什么。`
  },
  {
    id: 4,
    title: '2024.10.27',
    content: `去年这个时候不知不觉到来的20岁，好像带来了我人生中感官上最漫长的一年，这是最不是某种关键节点的两年，我好像在两年前把我十几二十年想说的全说完了。But we‘ll see. 
清晰明快`
  }
];

// 标题&文本框组件
const TitleContentCard = ({ writing, isExpanded, onToggle, index }: {
  writing: { id: number; title: string; content: string };
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
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
        {/* 标题 */}
        <h3 className="text-xl font-semibold text-zinc-100 mb-4">{writing.title}</h3>
        
        {/* 内容 */}
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

export default function NightMoonPage() {
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
        {/* 返回按钮 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            href="/misc"
            className="text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回杂
          </Link>
        </motion.div>

        {/* 错落标题&文本框列表 */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {nightMoonWritings.map((writing, index) => (
            <TitleContentCard
              key={writing.id}
              writing={writing}
              isExpanded={expandedItems.includes(writing.id)}
              onToggle={() => toggleExpanded(writing.id)}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
