'use client';

import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import SpotlightCard from '@/components/SpotlightCard';

// TODO: 用户可以在这里编辑专辑数据
const albumsData = {
  1: {
    id: 1,
    title: 'OFF THE KEY',
    artist: '张嗣泳',
    cover: '/images/OFF THE KEY.png',
    year: '2022',
    description: 'OFF THE KEY 疏于人群',
    songs: [
        { 
          id: 1, 
          title: 'OFF THE KEY', 
          duration: '3:14',
          src: '/audio/offthekey/OFF THE KEY.mp3',
          lyrics: `不擅长旋律时常也会 OFF THE KEY
I don't pray to god 也会告诉我秘密
我知道只有不停努力才能逃出过去
会在起点起飞 然后在高处落地
不擅长旋律时常也会 OFF THE KEY
I don't pray to god 也会告诉我秘密
我知道只有不停努力才能逃出过去
会在起点起飞 然后在高处落地

OFF THE KEY
不学玩着套路的
不写技术流把没用招数过滤
歌词都是可以拿来抄录的句子
不用去接棒由我自己浇筑火炬
当我在台上睁眼
台下面模糊一片
聚光灯凝聚着当下
所以我不去看过去和未来
过去过不过得去未来会不会来
因为有手有心所以和神明对白
写的东西越多
分享欲就越少
表达欲被满足
而我孤独没被愈好
文字难以阅读
音乐从没学好
也没有别的解药
所以说唱是个借口
所以借我的口
所以牵我的手
I am a revelator
Did they notice
借我的口
所以牵我的手
I am a revelator
Did they know

不擅长旋律时常也会 OFF THE KEY
I don't pray to god 也会告诉我秘密
我知道只有不停努力才能逃出过去
会在起点起飞 然后在高处落地
不擅长旋律时常也会 OFF THE KEY
I don't pray to god 也会告诉我秘密
我知道只有不停努力才能逃出过去
会在起点起飞 然后在高处落地

身边人一个个的走
一个个的留
能不能牵住我的手
好让我不能再回头
我把不信任当做安全感
我的偏见 把我往边缘赶
话到嘴边说不出
那些先前攒的劲
纵使长篇满腹一边写短的信
举目皆是锋芒所以闪和避
不想被污染我才选隔离
我也相信我是水
满则溢
每个热闹的白天也会渐渐疏于人群
不会感到孤独我的面面都是神明
鸡群黄鹤立 蘸着湖去飞行
就像悬崖上的花的艳烈无与伦比
节奏 just kick kick kick 
I don't need melody
总是喜欢走绝路
向往绝处能逢生
I only got one shot
所以绝不等重生` // TODO: 用户可以在这里编辑歌词
        }
    ]
  },
  2: {
    id: 2,
    title: 'Hang out with me',
    artist: '张嗣泳',
    cover: '/images/Hang out with me.png',
    year: '2022',
    description: '出去走走  远离凡俗',
    songs: [
        { 
          id: 2, 
          title: 'Hang out with me', 
          duration: '3:04',
          src: '/audio/hangoutwithme/Hang out with me.mp3',
          lyrics: `So let's go and hang out with me
跟我一起 远离 俗套的规矩
一起追逐山间落日一直到水里
一起靠近春风它会抱紧你
So let's go and hang out with me
跟我一起 远离 俗套的规矩
一起追逐山间落日一直到水里
一起靠近春风它会抱紧你

眼看着白昼变长 日光变暖
我们随着长大变忙 时间变短
I gotta chill all day 让时光渐慢
生活是黑白电影 就用涂料渲染
Lofi 爵士 我们读书和写字
My whole life 都是值得庆祝的节日
悠哉度日 收获精神和物质
We've got no time to lose 
不只屏幕上的数字还有时针 
让鼓点失真 虽没有掀起变革
但埋的伏笔是真 这里没有谷底之人
有足底之声 主笔之神 
放慢脚步来找路看草木和朝露
习惯去思考有好酷的角度
用套路去造物画拷贝的稿图
时代的摧残下保住了少数的…

So let's go and hang out with me
跟我一起 远离 俗套的规矩
一起追逐山间落日一直到水里
一起靠近春风它会抱紧你
So let's go and hang out with me
跟我一起 远离 俗套的规矩
一起追逐山间落日一直到水里
一起靠近春风它会抱紧你

跟我一起去公园留张影
落叶当做是收藏品
忘记所有的惆怅
让我浸泡在溪水的流淌里
带上风筝和折叠椅
我们牵着气球荡秋千
在万物生命的和弦里
松弛自我的放收间
寻找着意义开滤镜的每日
一个人看电影配去冰的美式
观察与表达 聚精又会神
Post with picture写认真的配文
柳叶与草地 湖心与边缘
听风起翩翩时常回想起一年前
打定主意不必被压力奴役灵魂牵着手
回头看过去听起来俗气现在也实现了bro
Let's go let's go hang out right now
跟这个春天 对上了暗号
Could you please hang out with me
在两座孤城间修起的栈道` // TODO: 用户可以在这里编辑歌词
        }
    ]
  },
  3: {
    id: 3,
    title: '夜空独奏艺术家',
    artist: '2022-08-27',
    cover: '/images/yekongduzou.png',
    year: '2022',
    description: ' I\'m trying to figure out. ',
    songs: [
        { 
          id: 3, 
          title: '夜空独奏艺术家', 
          duration: '4:05',
          src: '/audio/yekongduzou/夜空独奏艺术家.mp3',
          lyrics: `采样：《All Alone》——Mal Waldron
夜空下数星星像是在拨弄琴键
看虔诚的人们又双手合十 都想要说动神仙
我诉求都合理 说起来得体
能不能被铭记在时间长河里
能不能信任他们说的
不在乎利欲表现起来随和
是非矛盾中挣扎着向上
算是赢了自己几个回合
只有我面临又脱离困境
内心的声音才能顺应
我不怕闲言和碎语怕无人问津
和庸人成鲜明的对比但没人会听

看人们睁眼和闭眼 朦胧的睡眼
始终保持清醒我们独具慧眼
世间 一切动我灵魂的泪点
几乎 结冰 又几乎接近沸点
“要我拯救他们对吗那谁来放过我”
怕我知难而退不如给我灵魂上个锁
“医者不能自医 给我降个火”
那些自我怀疑永远能够撞的破
独自前行看到前方的破路
由易到难 不需要过渡
也不需要谁来挑我的错误
从来不怕落入自负的境地
自己构建思想的主体
固执的经历是我的病理
如果天上真的会缺个主笔
我投的不是简历是我的病历

见过太多苦与恶
所以内心变得无底色
怕我也会陷入黑暗里
也怕盲目正义的俗笔落
所以保持学习 敏锐的观察
每次发声像起步在山崖
散发光芒 同时把月光掺下

天空中下起了太阳雨
我离我的目标又近了一步
同样的漂浮在骇浪里
不同的是我用最硬的笔触
告诉你能 与上天对话
也能抓住 时间的尾巴
每当我告诉别人
其实是告诉自己
没人会听但自己受益
所以总握着支笔
习惯别人的苦难徒劳的奋斗
我只在夜空中拉一段滚奏
悲剧是时代所激起的人流
是一首歌 刻在我坟头

不要温和地走入那个良夜
我的欲望比以前更强烈
把这丘壑都变成旷野
才能轻松地走入每个行业
不怕场内的气氛降到了冰点 
不怕没人回应我发送的请柬
静看潮水涨退月寒星远
再微弱的声音我也能够听见
听见我策划给自己的演出
表达不习惯 深入后浅出
喜欢在边缘 轻易不显露
Rapper type shit我尽量都免除
也被深空的密度所威胁
固步自封的庇护所
我把他们的太阳都吹灭` // TODO: 用户可以在这里编辑歌词
        },
        { 
          id: 10, 
          title: 'Limited Creativity', 
          duration: '3:05',
          src: '/audio/yekongduzou/Limited Creativity.mp3',
          lyrics: `时而抬头 望向窗外
我的欲念没办法装载
笼中飞鸟 受到伤害
和我的想法一样的荒诞
当我看到优秀的墨笔也会感到羡慕
希望做出一样的作品希望能够有所建树
不知无知产生的崇拜何时像块石头落下
只有看过更多的东西才能不被潜移默化
我知道受到不同力量都会受到影响有模仿欲
不要等作品上了刑场 才能让人说两句
希望我不再自以为是地 喜欢说别人没创意
做的都是一样的市场所以才是你的假想敌
我知道自己的格局不只三丈远
说到艺术也得沾上点
不能闭目等着被安葬独特的灵感我得先撞见
I'm limited confused 何时能参透
是否听着伴奏来决定 输入输出的端口
但我厌倦争论出是非 社会热点不想多应和
身后立个无字碑 如果我把话都说尽了

我好像受到了牵制
创造力被限制
当我无话可说
是不是拨云见日
应该庆幸清醒的人永远比不清醒的多
如果这是真的应该 等我醒了说
感觉我好像受到了牵制
创造力被限制
当我无话可说
是不是拨云见日
应该庆幸清醒的人永远比不清醒的多
如果这是真的应该 等我醒了说

文字是我斑驳的蜡笔
问我在哪我躲进了画里
我的画上没有留白
也再也没有我能探索的话题
这之前要不要加快进度
希望表达能不被禁锢
明明都能够摸的清楚
为何做学舌的鹦鹉
迎合的灵感其实都会来
Want it i got it but sorry i hate that
曲高和寡也惧怕溃败
希望把信念能坚固佩戴
思维常常被框住 我想再把歌词放纸盒里
写歌习惯备忘录 也找不回高中的纸和笔
虽然还记得出发地但常常会缺失掉抒发欲
就让思绪如针都扎进我和他们思想贫富差距
我不想 抓重点 不想蹭热度 生在夹缝里被震慑住
不想发作品 混个数 随便找前人问个路
I'm limited confused 是不是什么都敢说
没有无限的创造力 也许自负是因为浅薄
让世界在我眼中定格 哪怕只有风应和 
哪怕所有的回应都是抨击我直到我把话都说尽了

我好像受到了牵制
创造力被限制
当我无话可说
是不是拨云见日
应该庆幸清醒的人永远比不清醒的多
如果这是真的应该 等我醒了说
感觉我好像受到了牵制
创造力被限制
当我无话可说
是不是拨云见日
应该庆幸清醒的人永远比不清醒的多
如果这是真的应该 等我醒了说` // TODO: 用户可以在这里编辑歌词
        },
        { 
          id: 11, 
          title: 'B Side 1', 
          duration: '2:53',
          src: '/audio/yekongduzou/B Side 1.mp3',
          lyrics: `当我开口 他们都说对味了bro
这种没意思的破歌 我最会了bro
我得控制控制你们退退后
动次 打次嚼的碎碎的bro
如果我是rapper我也叭叭啦啦说不停
可以前喜欢沉默 所以现在说不赢
如何评价市场 我想我怎么都摸不清
如何评价自己 人行歌不行
他说我得加加油 所以我一刻不停
兜兜转转十几年 尘埃永远落不定
喜欢定个小目标不管是终点或途经
Let's boombap boombap
小房间里做录音
现在是深夜的三点半
希望时间时间能再减慢
我在所见所闻里摘选段
因为所有人都瞎了我才开眼看
你知道我求知若渴 要去专升本
因为我太渴了一天要喝三升水
听说我得上台肌肉先绷紧
没人为我喝彩我就敲断观众腿
我也不想孤注一掷前方像个隧道
只是很少会有胃口给我配点胃药
还是尽量玩点跟我配套的花式
你知道我很和蔼像个微笑的鸭子

Boom boom gotta roll roll
要我收手 我说nono
不要 dope flow只要够用
两手空空gotta gogo
Gotta boom boom gotta roll roll
要我收手 我说nono
不要 dope flow只要够用
两手空空 gotta gogo

im da chosen one 他们得留神看
把我的slogan 写进每个flow轮换
Linglingletsgo 跟着我的流程
就像整个世界围着我轴承转
加快速度我看他们迟早亏空
他们喜欢催熟我把我的作品催生
不去寻找命运 命运自己推门
不是我在退步我前进时返璞归真
一个萝卜一个坑我在坑里搞搞卫生
其实我妈早就说过哥们有点慧根
从来不在乎能不能撑到最终
也许我会倒下但永远不会退坑
Write it down write it down不会停下
把新的词曲签约在我名下
瞎写着玩呢 不必惊讶
毕竟已经说过了 如何评价
B side的第一首这名字够不够敷衍
继续低调继续走我戴上口罩露出眼
Boomboom 这hook 够不够敷衍
要是说句违心话那账户给我扣五元
我不需要任何储备点燃我的仓库
就像冷门也不会被火的框住
泼我的脏水也是照亮我的光束
要是艺术有罪老子全身都是脏物

Boom boom gotta roll roll
要我收手 我说nono
不要 dope flow只要够用
两手空空gotta gogo
Gotta boom boom gotta roll roll
要我收手 我说nono
不要 dope flow只要够用
两手空空 gotta gogo` // TODO: 用户可以在这里编辑歌词
        },
        { 
          id: 12, 
          title: '一起面对海浪吧', 
          duration: '3:03',
          src: '/audio/yekongduzou/一起面对海浪吧.mp3',
          lyrics: `阳光照到我的瞳孔
经历过的林林总总
多少次出现在我的梦中
再见才会显得从容
我从来从容对待我生活的变化
我说全都ok我的心情不被践踏
见到你之后的一切都是锦上添花

我还是不成熟还在我的早年
也许距离远了会变得更加耀眼
月光待落日也没能比你更皎洁
因为经过太多事所以才不会了结
要说以后可能从来没有想过
关于我们的一切好像可以办个讲座
认可我的思想大多都是仿作
自以为了解我的都是道听旁说
外面雨下大了 我怎么可能让你去
要是为你写的歌我想要你能唱几句
真的不能替代的又能出现几个
当我忘记一切我想也会思念你的
你是我的伴奏 我才继续贴唱
你是月亮的诗人我是诗人的月亮
根本没有想过山多远路多长
那晚没有星与月但到处都是雾和光

阳光照到我的瞳孔
经历过的林林总总
多少次出现在我的梦中
再见才会显得从容
我从来从容对待我生活的变化
我说全都ok我的心情不被践踏
见到你之后的一切都是锦上添花

我没有胃口你也能合我口味
我是你对手这步棋怎么都能走对
如果你也清醒着不想面对周围
这杯啤酒用我的三分之一勾兑
也许应该其实我不需要soulmate
收好你的收获就等着我来收税
这么多年过去写风起又风停
因为有了风云这世界变得充盈
假装风云无关你
去和他们见一面
风在夜里等着你
我在风里等着夜
周围都是俗人我去哪里采样呢
要是没人想听你来给我买账吧
我想求个安稳但这个世界太晃了
陪我吹着海风一起面对海浪吧

阳光照到我的瞳孔
经历过的林林总总
多少次出现在我的梦中
再见才会显得从容
我从来从容对待我生活的变化
我说全都ok我的心情不被践踏
见到你之后的一切都是锦上添花` // TODO: 用户可以在这里编辑歌词
        }
    ]
  },
  4: {
    id: 4,
    title: '随风百尺楼',
    artist: '张嗣泳',
    cover: '/images/suifengbaichilou.png',
    year: '2022',
    description: '“这次不会继续躲在楼上观景观。”',
    songs: [
        { 
          id: 4, 
          title: '随风百尺楼', 
          duration: '2:25',
          src: '/audio/suifengbaichilou/随风百尺楼.mp3',
          lyrics: `一年又是一年还没看清我的对面
算是心如止水也经过火的淬炼
我知道我在成长但感受不到蜕变
被命运觉得脆弱才瞄准我的泪腺
知道我被眷顾所以才时刻准备
是上天使得骗术让我随风波沉醉
去年还不错卸的卸了背的背
今年平平无奇就别 给我刻个碑
觉得做的还不够 是因为我的贪婪
过了一道关 还有下一座山峦
前方波澜壮阔和我的血液翻缠
安安稳稳掌舵这样才不会翻船
人际关系 比以前 好解决
也许平等像个天平往我这边早点斜
我还是偏激 还是容易讨点嫌
要走就走 来就来 又何必绕点圈

有时感谢家里人尊重我能做决定
记得成年之前遵守一个个协议
想摆脱的太多走过太多的捷径
我知道都是铺垫 满足欲望或野心
什么时候入门 往山顶看 往山顶攀
还有太多路程 才能站在山顶端
习惯当个看客 半梦半醒般
这次我不会继续躲在楼上观景观
得等我碰壁了再说这世界太昏暗
就算剪断一切 我的思绪不忍断
也许变得太多 但心态不准换
继续爱我不太完美像有瑕疵的粉钻
别暴露我的创伤后慌慌张张
迷茫与平静该怎么去抒写
看那久违的雨和弥漫的光
它们做我的笔就流入我的骨血` // TODO: 用户可以在这里编辑歌词
        }
    ]
  },
  5: {
    id: 5,
    title: 'Ego to Ego',
    artist: '张嗣泳',
    cover: '/images/Ego to Ego.png',
    year: '2023',
    description: '“你眼泪滴的彩虹像是和神立的约。”',
    songs: [
        { 
          id: 5, 
          title: 'Ego to Ego', 
          duration: '3:01',
          src: '/audio/egotoego/Ego to Ego.mp3',
          lyrics: `余光散落 但要往前走
上天教会我的一切就是想办法接受
也许这两年过的太顺
我变得太笨
等我回到风口浪尖才能为我开门
问你伤口那么多 到底哪里在疼
你习惯缄口不言 我就没再问
我不想一无所成又承受你的批判
我在意那么多最后成为我的羁绊
我想得到的多少多少就成为遗憾
想到一切未成定数未免又心神迷乱
今年忘记倒数 没听见零点的钟声
但愿洗去尘埃像抖落冬雪的松针
从大寒走到小暑这次像几分钟
我得测定风向才敢放飞我的风筝

经历那么多 爱说苦成甜
奶奶说经历那么多之后才更信古人言
说我装的那么真可以谱成卷
既然装的那么真又干嘛酒后吐真言
说我难写半句虚言
是和真诚过的命
这次不为谁说话
给我自己做着听
夜月沉入我的海
就像是沉入我的心
他们燃烧我的时候
我是陶冶火的金
有时是真的洒脱 总能睡个好觉
又想做济世良医像神农尝百草药
姥姥说你会成才的愿神保佑
走到这一步 也不辜负她为我做的祷告
那一天 过几年后才能实现
回忆里面不妨为我做个纪念
换张底片这次就别再浪费时间
就算我别无所成也算是多了体验
不想与你相争像针尖对麦芒
比起与你相处其他我更不在行
在我的心里能够听到你的赞扬
感受你的温度就像是感受太阳
希望下次出现更干净利落点
待我笔到词穷把我歌词续着写
我比你更爱你请你不要闭着眼
你眼泪滴的彩虹像是和神立的约

开着门窗睡下
风、花瓣和落雨
这季候是个密码
我能够把他破译
保持状态keep going
一整夜都没变
用原相机不修边幅
捕捉生活的碎片
寒风咬紧门窗
跟朋友知会雪落
我心中黯然神伤
什么时候得到解脱
熬到几处晨光
来为我答疑解惑
且放白鹿青崖间
之后我且行且歌` // TODO: 用户可以在这里编辑歌词
        }
    ]
  },
  6: {
    id: 6,
    title: '要进窄门',
    artist: '张嗣泳',
    cover: '/images/zhaimen.png',
    year: '2023',
    description: 'My jesus 提醒我要进窄门',
    songs: [
        { 
          id: 6, 
          title: '要进窄门', 
          duration: '2:16',
          src: '/audio/yaojinzhaimen/要进窄门.mp3',
          lyrics: `闷热的下午 杭州的梅雨季节 
我人生总像变了天 重新翻开了一页
又去和家人见了面 在南京待了一夜
奶奶问我总是在忙 何时能停歇
晚上难得空闲喝点酒 头很涨
音乐上没有追求那就记点流水账
只是关于自己我可以随口唱
贴着伴奏忘我我的感觉没有忘
回想前几次的演出我也挺伤感
即使做了那么多
走到台上还是有紧张感
想要功成名就时或者塞外云游处
怀疑做这些的意义可是没有回头路
也许关于我想做的事
I’m not that talented
现在走的每一步都踩着水坑
也许脱离舒适区后我会失败
希望不会带着悔恨

时间 放缓我的夜晚不会漫长
我想要摆脱那些负罪感让我不会感伤
你知道所有经历在我心中永远不会淡忘
而我逐渐冲淡颜色即便生活是个染缸
我不想有容错率 别怪我太过理智
我曾经错的计划给我教训还有启示
什么才最重要别让我多碰壁几次
有时也得学会去享受日复一日
My family business
I wanna focus more on
他们眼里的明星我不需要包装
我也想要学会自由 跟着伴奏逃亡
跟我父亲打个电话 是在做招商
一个音箱一个麦 一直唱到天黑
一条路走到黑的困难有一百层
周围没人走的路 也许会事与愿违
Oh my jesus 提醒我要进窄门` // TODO: 用户可以在这里编辑歌词
        }
    ]
  },
  7: {
    id: 7,
    title: '五联 Freestyle',
    artist: '张嗣泳',
    cover: '/images/wulian.png',
    year: '2024',
    description: '“我和你没办法分离这情况没办法预演。”',
    songs: [
        { 
          id: 7, 
          title: '五联 Freestyle', 
          duration: '2:17',
          src: '/audio/wulian/五联Freestyle.mp3',
          lyrics: `我和你没办法分离这情况没办法预演
看到机会来了又走我总没办法拒绝
习惯把自己逼得紧我知道没到达极限
有时我也想过放弃给这种生活画句点

妈妈早晚会放心我和他们的差距远
如果就想要走得远没条件留给他去选
告别负罪感把情绪留在那季节
我从此只管走对方向 不再卡细节

我爸爸把我生活费打到我银行卡里面
我不再买些贵的穿 都是些假体验
Major in fashion 别问我咋体现
I am a born artist 都在我bar里见

我为此放弃了太多把我的青春砸里面
如果我能回到现场舞台还能再炸一点
这宏图没办法勾勒每年的目标大一点
问题总不能避免 也只能挂起些

我不敢看那些电影我还是怕离别
我总是不回家把弱点都给留在家里面
我家人会理解我在他心里把我夸几遍
也难免有些圈层看到我就骂起街

我早就开始写诗现在用我画笔写
Be the best writer 不止是在华语届
把我的思想和灵魂都给藏进晚霞里面
来自北边的灵感像南方的大雨泄

大学几年过得快明年就要答起辩
回到日出时的课桌前在纸上划曲线
谁又不想一直生活在这象牙塔里面
谁又不想一直停在草地里的马尾辫

我总是想要人生幻想里面夹体验
我逃离那种虚无感  咬紧牙去面
对待人来人往追名逐利会让他疲倦
只想问问我的朋友明年在哪里见` // TODO: 用户可以在这里编辑歌词
        }
    ]
  },
  8: {
    id: 8,
    title: '我的心骄荣自满',
    artist: '张嗣泳',
    cover: '/images/wodexinjiaorongziman.png',
    year: '2025',
    description: '“不在这敲锣打鼓，以后我漂泊四海，不理解他们的苦痛我的心骄荣自满。”',
    songs: [
        { 
          id: 8, 
          title: '我的心骄荣自满 Intro', 
          duration: '2:28',
          src: '/audio/wodexinjiaorongziman/01 - Mo Ling - 我的心骄荣自满重制.mp3',
          lyrics: `采样：《风神125》-交工乐队

My past was a hard time我时常也会想起
我愈怕不切实际所以剪理想的长羽
If i got a choice i wont take my child back
不会让它回到过去 我老家的躺椅
门口的石狮子有些时日没近在咫尺
我走后的那树花开了一十几次
我已经忘记了约定只能怪春日迟迟
之后也做过一些决定没问他支持不支持
思考非非或是是 选择会货比三家
他们去看我的背影好像是雾里看花
把我家屋后种满山楂 把我的故事穿插
她们最后得听我的 being like 我是专家

家里的矛盾我带不走
他们的意识我太不懂
说我炙手可热
也许更卖不出手
我不再开路出口
我不再卖弄富有
我应该耐得住寂寞
有些事不能诉求
不理你勃然大怒
不管他意志死板
我的心变得麻木后
见不到人穷志短
不在这敲锣打鼓
以后我漂泊四海
不理解他们的苦痛
我的心骄荣自满` // TODO: 用户可以在这里编辑歌词
        },
        { 
          id: 9, 
          title: '长出来', 
          duration: '2:31',
          src: '/audio/wodexinjiaorongziman/02 - Mo Ling - 长出来.mp3',
          lyrics: `采样：《长出来》-野孩子
          
“想起远方的时候 你看它就会长出来”
“豺狼出没的时候 你看它就会长出来”

有些话想说没了字
心里面长出来的刺
风拂过杨柳 垂的是你
雪野湖没能把你治愈
True to yourself
真诚有时像戴脚镣
三月春寒太料峭
冻雨西城外祷告
陈词滥调
知道我能够办到
这染料像是甘草
My blue night刻上蓝调
I got a lot to find out
用纸笔划出栈道
久病患缠不患药
药是你前程曼妙

我的话没法说的浅显
心里面长出来了原野
风与月铺满我的眼睑
灵感是喷发时的泉眼
 被冰冷覆盖
填的是初生时的负债
I solo for my moonlight
36度凝结成固态
从房间生长到户外
我的心灵安根驻寨
生长到云间雾外
Know’in im ready to fly

飞往我的山 飞往我的海
飞往我的河流和云海
飞往我的自由时的喜悦
心里面长出来了一切
我的话 被风吹走
吹展我的眉头
心灵会下雨配松针酒
也无言语也不再回首
挥挥手 我的玫瑰花
风吹走 四海为家
吹我到黄河飞飞沙
终归星宿 我回回家
挥挥手 流年以求
巍巍抖 她点起头
不管我的血脉随谁淌
我在娓娓讲我的水北流` // TODO: 用户可以在这里编辑歌词
        },
        {
          id: 10,
          title: 'Egotism',
          duration: '2:28',
          src: '/audio/wodexinjiaorongziman/03 - Mo Ling - egotism.mp3',
          lyrics: `EGOTISM, Changing Your Life
关了比赛
(The game is off)
这是你犯下的罪过你没办法抵赖
(This is your sin - there is no way to deny)
I can't deny我并不在乎
(I don't really care)
能够主动的表现欲
(The urge to perform, to step forward)
拙劣的卖弄
(The clumsy show-off)
优雅的灵魂
(Elegant soul)
把鲁莽都还给我外公
(Return all the recklessness to my grandpa)
记得Joanna的话
(Remember Joanna's words)
我变得智慧
(I became wise)
I be like 光 我拨动了日晷
(I be like light, moving the sundial)

EGOTISM 我的生命开的花
(EGOTISM - the bloom of my life)
Social darwin 生的根发的芽
(Social Darwinism - the roots and budding shoots)
我有lofi soul 过曝是我的手法
(I've got a lofi soul - overexposure is my expression)
我人声得有噪点 离不开这支SM58
(My vocal needs its noise, can't part with this SM58)
小时候四十平里 我噩梦太久了
(In forty square meters of childhood, the nightmare ran too long)
初高中我想删除 我要rebirth in future
(I wanted to erase my middle and high school - to be reborn in the future)
别怪我说走就走 生命不能有败仗
(Don't blame me for leaving - life can't afford a lost battle)
我必须得先离开 去面对惊涛骇浪
(I had to leave, to face the monstrous waves)
这就是生活 情绪 逼你享受波动
(This is life, emotion, forcing you to enjoy the fluctuation)
我不迷信努力 这是才华的作用
(I don't worship effort - it is my talent working)
The future where I rebirth 明明我是对的
(In the future where I'm reborn, I know I was right)
I will be my lord 宽恕我的罪过
(I will be my lord - forgive my sins)
他说他也想家 想昨日海棠花
(He says he misses home too - past crabapple blossoms)
我不怕被了解 所以我不能说谎话
(I'm not afraid to be known - so I can't lie)
I'd rather be evil 有些事总得放下
(I'd rather be evil - some things must be released)
放下了ego 一瞬间就会长大
(Drop the ego - and you grow in an instant)

EGOTISM, Changing Your Life
关了比赛
(The game is off)
这是你犯下的罪过你没办法抵赖
(This is your sin - there is no way to deny)
I can't deny我并不在乎
(I don't really care)
能够主动的表现欲
(The urge to perform, to step forward)
拙劣的卖弄
(The clumsy show-off)
优雅
(Elegance)
把鲁莽都还给我外公
(Return all the recklessness to my grandpa)
记得Joanna的话
(Remember Joanna's words)
我变得智慧
(I became wise)
I be like 光 我拨动了日晷
(I be like light, moving the sundial)

EGOTISM 我有游戏规则
(EGOTISM - I have rules of my game)
这是我执行的标准化就真的对吗
(Is the standardization I am implementing really correct)
我想要解构自己可自尊像是贝壳
(I want to deconstruct myself, but self-esteem clings like a shell)
迎合patriarch being tough 也会累的
(Catering to the patriarch and being tough also make you tired)
她看清我的窘迫 眼睛里泪光涌落
(She saw my distress; tears welled in my eyes)
总是我没法忍受平静才说 I want a war
(I always say I want a war after I can no longer bear the quiet)
上次我straight outta north 人情没法捅破
(Last time I straight outta North, but I could not pierce the web of favors)
我说我能够原谅他们 EGOTISM
(I said I could forgive them. EGOTISM)
Evolution been ever proven
Forever loved 这是奇谈谬论
('Forever loved' - what an absurd fable)
你想来了就来你想开了就走
(You can come when you want, you can leave when you're done)
我的心也搬不空 It's being stolen
(Anyway, my heart won't empty even if it's being stolen)
My born star Upward 黄金
(My born star. Upward. Golden)
发光之前 你先得学会旁听
(Before you shine, you must first learn to listen)
如果生活是赛场 这是天赐的良机
(If life were an arena, this would be a god-given chance)
但生活不是赛场
(But life is not an arena)
Lord, will you come to me

EGOTISM, Changing Your Life
关了比赛
(The game is off)
这是你犯下的罪过你没办法抵赖
(This is your sin - there is no way to deny)
I can't deny我并不在乎
(I don't really care)
能够主动的表现欲
(The urge to perform, to step forward)
拙劣的卖弄
(The clumsy show-off)
优雅
(Elegance)
把鲁莽都还给我外公
(Return all the recklessness to my grandpa)
记得Joanna的话
(Remember Joanna's words)
我变得智慧
(I became wise)
I be like 光 我拨动了日晷
(I be like light, moving the sundial)` // TODO: 用户可以在这里编辑歌词
        }
    ]
  }
};

// 播放器组件
const AudioPlayer = ({ song, isPlaying, onPlayPause, onSeek, progress, currentTime, duration, formatTime }: {
  song: { id: number; title: string; duration: string; lyrics: string; src: string };
  isPlaying: boolean;
  onPlayPause: (song: { id: number; title: string; duration: string; lyrics: string; src: string }) => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  progress: number;
  currentTime: number;
  duration: number;
  formatTime: (time: number) => string;
}) => (
  <div className="bg-zinc-800/50 rounded-lg p-4 mb-4">
    <div className="flex items-center justify-between mb-3">
      <div>
        <h4 className="text-zinc-100 font-medium">{song.title}</h4>
        <p className="text-zinc-400 text-sm">{song.duration}</p>
      </div>
      <button
        onClick={() => onPlayPause(song)}
        className="w-10 h-10 bg-zinc-700 hover:bg-zinc-600 rounded-full flex items-center justify-center transition-colors"
      >
        {isPlaying ? (
          <svg className="w-5 h-5 text-zinc-100" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-zinc-100 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    </div>
    
    {/* 进度条 */}
    <div 
      className="w-full bg-zinc-700 rounded-full h-2 cursor-pointer"
      onClick={onSeek}
    >
      <div 
        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
    
    {/* 时间显示 */}
    <div className="flex justify-between text-xs text-zinc-400 mt-2">
      <span>{formatTime(currentTime)}</span>
      <span>{formatTime(duration)}</span>
    </div>
  </div>
);

// TODO: 用户可以在这里编辑歌词本组件
const LyricsBook = ({ lyrics }: {
  lyrics: string;
}) => (
  <div className="bg-zinc-800/50 rounded-lg p-6">
    <h3 className="text-zinc-100 font-semibold text-lg mb-4"></h3>
    <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
      {lyrics}
    </div>
  </div>
);

export default function AlbumPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = parseInt(params.id as string);
  const album = albumsData[albumId as keyof typeof albumsData];
  
  const [currentSong, setCurrentSong] = useState(album?.songs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  // 清理音频资源 - 必须在所有条件语句之前
  useEffect(() => {
    return () => {
      if (audioRef) {
        audioRef.pause();
        audioRef.src = '';
      }
    };
  }, [audioRef]);

  if (!album) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4">专辑未找到</h1>
          <button
            onClick={() => router.back()}
            className="text-blue-400 hover:text-blue-300"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  const handlePlayPause = (song: { id: number; title: string; duration: string; lyrics: string; src: string }) => {
    if (currentSong?.id === song.id && audioRef) {
      if (isPlaying) {
        audioRef.pause();
        setIsPlaying(false);
      } else {
        audioRef.play();
        setIsPlaying(true);
      }
    } else {
      // 切换歌曲
      if (audioRef) {
        audioRef.pause();
      }
      
      const newAudio = new Audio(song.src);
      newAudio.addEventListener('loadedmetadata', () => {
        setDuration(newAudio.duration);
      });
      
      newAudio.addEventListener('timeupdate', () => {
        setCurrentTime(newAudio.currentTime);
        setProgress((newAudio.currentTime / newAudio.duration) * 100);
      });
      
      newAudio.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      });
      
      newAudio.play();
      setAudioRef(newAudio);
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      audioRef.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(percent * 100);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };


  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 返回按钮 */}
        <motion.button
          onClick={() => router.back()}
          className="mb-8 text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
                      Back
        </motion.button>

        {/* 专辑信息 */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 专辑封面 */}
          <div className="flex justify-center">
            <div style={{ width: '320px', height: '320px' }}>
              <SpotlightCard 
                className="custom-spotlight-card w-full h-full" 
                spotlightColor="rgba(0, 229, 255, 0.2)"
              >
                <div className="w-full h-full rounded-xl overflow-hidden">
                  {/* 专辑封面 - 纯图片正方形卡片 */}
                  <Image 
                    src={album.cover} 
                    alt={album.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'flex';
                      }
                    }}
                  />
                  <div 
                    className="w-full h-full bg-zinc-700 flex items-center justify-center absolute inset-0" 
                    style={{
                      display: 'none'
                    }}
                  >
                    <span className="text-zinc-400 text-sm">专辑封面</span>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>

          {/* 专辑详情 */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-zinc-100 mb-4">{album.title}</h1>
            <p className="text-xl text-zinc-300 mb-6">{album.artist}</p>
            <p className="text-zinc-400 mb-6">{album.description}</p>
            <div className="text-zinc-500 text-sm">
              {album.songs.length} 首歌曲 • {album.year}
            </div>
          </div>
        </motion.div>

        {/* 播放器和歌词本 */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* 播放器区域 */}
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Player</h2>
            <div className="space-y-4">
              {album.songs.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <AudioPlayer
                    song={song}
                    isPlaying={currentSong?.id === song.id && isPlaying}
                    onPlayPause={handlePlayPause}
                    onSeek={handleSeek}
                    progress={currentSong?.id === song.id ? progress : 0}
                    currentTime={currentSong?.id === song.id ? currentTime : 0}
                    duration={currentSong?.id === song.id ? duration : 0}
                    formatTime={formatTime}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* 歌词本区域 */}
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Lyrics</h2>
            <LyricsBook 
              lyrics={currentSong?.lyrics || '请选择一首歌曲查看歌词'} 
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
