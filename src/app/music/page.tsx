'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import SpotlightCard from '@/components/SpotlightCard';

// TODO: 用户可以在这里编辑专辑数据
const albums = [
  {
    id: 1,
    title: 'OFF THE KEY',
    artist: '2022-03-24',
    cover: '/images/OFF THE KEY.png',
    songs: [
      { id: 1, title: 'OFF THE KEY', duration: '3:14', src: '/audio/offthekey/OFF THE KEY.mp3' }
    ]
  },
  {
    id: 2,
    title: 'Hang out with me',
    artist: '2022-04-14',
    cover: '/images/Hang out with me.png',
    songs: [
      { id: 2, title: 'Hang out with me', duration: '3:04', src: '/audio/hangoutwithme/Hang out with me.mp3' }
    ]
  },
  {
    id: 3,
    title: '夜空独奏艺术家',
    artist: '2022-08-27',
    cover: '/images/yekongduzou.png',
    songs: [
      { id: 3, title: '夜空独奏艺术家', duration: '4:05', src: '/audio/yekongduzou/夜空独奏艺术家.mp3' },
      { id: 10, title: 'Limited Creativity', duration: '3:05', src: '/audio/yekongduzou/Limited Creativity.mp3' },
      { id: 11, title: 'B Side 1', duration: '2:53', src: '/audio/yekongduzou/B Side 1.mp3' },
      { id: 12, title: '一起面对海浪吧', duration: '3:03', src: '/audio/yekongduzou/一起面对海浪吧.mp3' }
    ]
  },
  {
    id: 4,
    title: '随风百尺楼',
    artist: '2022-10-27',
    cover: '/images/suifengbaichilou.png',
    songs: [
      { id: 4, title: '随风百尺楼', duration: '2:25', src: '/audio/suifengbaichilou/随风百尺楼.mp3' }
    ]
  },
  {
    id: 5,
    title: 'Ego to Ego',
    artist: '2023-01-06',
    cover: '/images/Ego to Ego.png',
    songs: [
      { id: 5, title: 'Ego to Ego', duration: '3:01', src: '/audio/egotoego/Ego to Ego.mp3' }
    ]
  },
  {
    id: 6,
    title: '要进窄门',
    artist: '2023-07-26',
    cover: '/images/zhaimen.png',
    songs: [
      { id: 6, title: '要进窄门', duration: '2:16', src: '/audio/yaojinzhaimen/要进窄门.mp3' }
    ]
  },
  {
    id: 7,
    title: '五联 Freestyle',
    artist: '2024-08-13',
    cover: '/images/wulian.png',
    songs: [
      { id: 7, title: '五联 Freestyle', duration: '2:17', src: '/audio/wulian/五联Freestyle.mp3' }
    ]
  },
  {
    id: 8,
    title: '我的心骄荣自满',
    artist: '2025-08-26',
    cover: '/images/wodexinjiaorongziman.png',
    songs: [
      { id: 8, title: '我的心骄荣自满 Intro', duration: '2:28', src: '/audio/wodexinjiaorongziman/01 - Mo Ling - 我的心骄荣自满重制.mp3' },
      { id: 9, title: '长出来', duration: '2:31', src: '/audio/wodexinjiaorongziman/02 - Mo Ling - 长出来.mp3' }
    ]
  }
];

export default function MusicPage() {
  const router = useRouter();

  const handleAlbumClick = (albumId: number) => {
    router.push(`/music/album/${albumId}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-zinc-100 mb-4">张嗣泳</h1>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">

          </p>
        </motion.div>

        {/* 专辑网格 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {albums.map((album, index) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SpotlightCard
                className="custom-spotlight-card aspect-square"
                spotlightColor="rgba(0, 229, 255, 0.2)"
              >
                <div
                  className="w-full h-full bg-zinc-800/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => handleAlbumClick(album.id)}
                >
                  {/* 专辑封面 - 强制正方形显示 */}
                  <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 rounded-lg overflow-hidden bg-zinc-700">
                      <img
                        src={album.cover}
                        alt={album.title}
                        className="w-full h-full object-cover"
                        style={{
                          aspectRatio: '1/1',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="absolute inset-0 w-full h-full bg-zinc-700 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                        <span className="text-zinc-400 text-sm">专辑封面</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-zinc-100 font-semibold text-lg mb-2">{album.title}</h3>
                  <p className="text-zinc-400 text-sm mb-4">{album.artist}</p>
                  <p className="text-zinc-500 text-xs">{album.songs.length} 首歌曲</p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>

        {/* 提示信息 */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-zinc-400 text-lg">

          </p>
        </motion.div>
      </div>
    </div>
  );
}