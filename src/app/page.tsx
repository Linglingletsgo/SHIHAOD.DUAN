'use client';

import { useRouter } from 'next/navigation';
import TextType from "@/components/TextType";
import LiquidEther from "@/components/LiquidEther";

export default function Landing() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/home');
  };

  return (
    <div 
      className="min-h-dvh w-full bg-black cursor-pointer relative overflow-hidden"
      onClick={handleClick}
    >
      {/* LiquidEther 背景效果 */}
      <div className="absolute inset-0 w-full h-full">
        <LiquidEther 
          mouseForce={2}
          cursorSize={40}
          colors={['#C8D8DA', '#F95A6A', '#AA7ABC', '#7A7AAA', '#F9EDD8', '#F97F66']}
          autoDemo={true}
          autoSpeed={0.05}
          autoIntensity={0.3}
          isViscous={false}
          viscous={2}
          resolution={0.1}
          dt={0.002}
          iterationsViscous={2}
          iterationsPoisson={2}
          BFECC={false}
        />
      </div>
      
      {/* TextType 名字 */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <TextType
          text="SHIHAO D. DUAN"
          as="h1"
          className="text-6xl md:text-8xl font-bold text-zinc-100 tracking-tight text-center"
          typingSpeed={100}
          initialDelay={500}
          pauseDuration={3000}
          deletingSpeed={50}
          loop={true}
          showCursor={true}
          cursorCharacter="|"
          cursorBlinkDuration={0.8}
          variableSpeed={{ min: 80, max: 120 }}
          onSentenceComplete={() => {}}
        />
      </div>
    </div>
  );
}