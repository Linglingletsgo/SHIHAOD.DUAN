import type { Metadata } from 'next';
import ThesisPdfPreview from './ThesisPdfPreview';

export const metadata: Metadata = {
  title: 'Undergraduate Thesis | Shihao D. Duan',
  description: 'A research record on embodied carbon in China’s textile industry trade.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function UndergraduateThesisPage() {
  return (
    <main className="min-h-screen bg-black px-6 pb-20 pt-20 text-zinc-100 md:px-10 md:pt-28">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 max-w-4xl border-b border-zinc-800 pb-10">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
            Research Record · BEng Undergraduate Thesis
          </p>
          <h1 className="mb-5 text-3xl font-semibold leading-tight text-white md:text-5xl">
            Accounting for Embodied Carbon in China&apos;s Textile Industry Trade and Its Influencing Factors: An Input–Output Approach
          </h1>
          <p className="mb-6 text-lg leading-8 text-zinc-400">
            基于投入产出法的中国纺织产业贸易隐含碳核算与影响因素研究
          </p>
          <p className="max-w-3xl leading-7 text-zinc-300">
            This undergraduate thesis applies input–output analysis to account for embodied carbon associated with China&apos;s textile industry trade and examine its influencing factors. It brings together industry sustainability research, quantitative analysis, data processing and visualisation.
          </p>
          <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
            本科毕业论文使用投入产出分析核算中国纺织产业贸易隐含碳并研究其影响因素，结合了产业可持续研究、定量分析、数据处理与可视化。
          </p>
          <p className="mt-4 font-mono text-sm text-zinc-500">
            Available as the Chinese original and an English translation. / 提供中文原版与英文翻译版。
          </p>
        </header>

        <ThesisPdfPreview />
      </div>
    </main>
  );
}
