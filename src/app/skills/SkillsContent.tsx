import Link from 'next/link';
import { domains, experienceById, knowledgeById, skillById, skillEvidenceBySkillId, skills, toolById } from '@/data/skills';
import type { BilingualText, Experience, SkillEvidence } from '@/data/skills/types';

function LocalizedText({ text }: { text: BilingualText }) {
  return <><span data-content-locale="zh">{text.zh}</span><span data-content-locale="en">{text.en}</span></>;
}

function EvidenceLink({ evidence, experience }: { evidence: SkillEvidence; experience?: Experience }) {
  const content = <LocalizedText text={evidence.description} />;
  if (!experience?.href) return <span>{content}</span>;
  const className = 'underline decoration-zinc-600 underline-offset-4 hover:decoration-zinc-200';
  if (experience.href.startsWith('/')) return <Link href={experience.href} className={className}>{content}</Link>;
  return <a href={experience.href} target="_blank" rel="noreferrer" className={className}>{content}</a>;
}

export default function SkillsContent() {
  return (
    <div>
      <header className="mb-16 max-w-3xl">
        <h1 className="mb-5 font-mono text-4xl font-bold tracking-tight text-white md:text-6xl">SKILLS</h1>
        <p className="text-base leading-8 text-zinc-300 md:text-lg">
          <span data-content-locale="zh">一套连接技能、知识、工具与实践经历的跨学科能力索引。</span>
          <span data-content-locale="en">An interdisciplinary capability index connecting skills, knowledge, tools and evidence.</span>
        </p>
      </header>

      <nav className="mb-20 border-y border-zinc-800 py-6" aria-label="Skill domains">
        <ol className="grid gap-x-8 gap-y-3 font-mono text-sm text-zinc-400 sm:grid-cols-2 lg:grid-cols-4">
          {domains.map((domain, index) => (
            <li key={domain.id}><a href={`#${domain.id}`} className="transition-colors hover:text-white"><span className="mr-2 text-zinc-600">{String(index + 1).padStart(2, '0')}</span><LocalizedText text={domain.name} /></a></li>
          ))}
        </ol>
      </nav>

      <div className="space-y-24">
        {domains.map((domain, domainIndex) => {
          const domainSkills = skills.filter((skill) => skill.domainId === domain.id);
          return (
            <section key={domain.id} id={domain.id} className="scroll-mt-24">
              <div className="mb-10 grid gap-3 border-b border-zinc-800 pb-6 md:grid-cols-[5rem_1fr_2fr]">
                <span className="font-mono text-sm text-zinc-600">{String(domainIndex + 1).padStart(2, '0')}</span>
                <h2 className="font-mono text-2xl font-semibold text-white"><LocalizedText text={domain.name} /></h2>
                <p className="leading-7 text-zinc-400"><LocalizedText text={domain.description} /></p>
              </div>
              <div className="divide-y divide-zinc-800">
                {domainSkills.map((skill) => {
                  const skillKnowledge = skill.knowledgeIds.map((id) => knowledgeById.get(id)).filter(Boolean);
                  const skillTools = skill.toolIds.map((id) => toolById.get(id)).filter(Boolean);
                  const skillEvidence = skillEvidenceBySkillId.get(skill.id);
                  const evidenceExperience = skillEvidence?.experienceId ? experienceById.get(skillEvidence.experienceId) : undefined;
                  const relatedSkills = [...skill.prerequisiteSkillIds, ...skill.relatedSkillIds, ...skill.combinedPracticeIds].map((id) => skillById.get(id)).filter(Boolean);
                  return (
                    <article key={skill.id} className="grid gap-5 py-9 md:grid-cols-[minmax(12rem,1fr)_2fr] xl:grid-cols-[minmax(12rem,1fr)_minmax(24rem,2fr)_minmax(16rem,1fr)]">
                      <div><p className="mb-2 font-mono text-xs uppercase tracking-widest text-zinc-500"><LocalizedText text={skill.subdomain} /></p><h3 className="text-xl font-medium text-zinc-100"><LocalizedText text={skill.name} /></h3></div>
                      <div>
                        <p className="mb-5 leading-7 text-zinc-300"><LocalizedText text={skill.definition} /></p>
                        {(skillKnowledge.length > 0 || skillTools.length > 0) && <div className="mb-4 flex flex-wrap gap-2 text-xs text-zinc-400">
                          {skillKnowledge.map((item) => item && <span key={item.id} className="rounded-full border border-zinc-800 px-3 py-1"><LocalizedText text={item.name} /></span>)}
                          {skillTools.map((item) => item && <span key={item.id} className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-300">{item.name}</span>)}
                        </div>}
                        {relatedSkills.length > 0 && <details className="mt-4 text-sm text-zinc-500"><summary className="cursor-pointer font-mono text-xs uppercase tracking-wider hover:text-zinc-300"><span data-content-locale="zh">关联能力</span><span data-content-locale="en">Related Skills</span></summary><p className="mt-3 leading-6">{relatedSkills.map((item, index) => item && <span key={item.id}>{index > 0 && ' · '}<LocalizedText text={item.name} /></span>)}</p></details>}
                      </div>
                      {skillEvidence && <div className="border-l border-zinc-800 pl-5 text-sm leading-7 text-zinc-400 md:col-start-2 xl:col-start-3"><p><EvidenceLink evidence={skillEvidence} experience={evidenceExperience} /></p></div>}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
