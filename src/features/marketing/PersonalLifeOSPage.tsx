import { ShieldCheck, Zap, Clock, Layout, Sparkles, ArrowRight, CheckCircle2, Wallet, Users, Globe, Smartphone, Lock, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnswerBlock } from '@/components/AnswerBlock';
import { useSeo } from '@/seo';
import { MarketingLayout } from '@/components/MarketingLayout';

export function PersonalLifeOSPage() {
  useSeo({
    title: 'What is a Personal Life Operating System? | Titan Life OS',
    description: 'Learn how a Personal Life Operating System can unify your tasks, finances, and notes. Discover the benefits of a connected digital ecosystem with Titan.',
    path: '/personal-life-os',
    breadcrumbs: [{ name: 'Home', item: '/home' }, { name: 'Personal Life OS', item: '/personal-life-os' }],
    faqs: [
      { question: 'What is a personal life operating system?', answer: 'A personal life operating system (Life OS) is a centralized digital framework that integrates tasks, finances, notes, and habits into one unified system. It is designed to reduce cognitive load and improve decision-making by eliminating information silos.' },
      { question: 'Why do most productivity systems fail?', answer: 'Most systems fail due to the "Silo Problem"—where tasks are disconnected from financial reality and creative notes. A unified Life OS bridges these gaps, ensuring that every action you take is informed by your total available resources and long-term goals.' },
      { question: 'Is a Life OS different from a Productivity App?', answer: 'Yes. While productivity apps usually focus on one vertical like tasks, a Life OS focuses on the horizontal connection between all aspects of your life—time, money, and thoughts.' },
      { question: 'Can I use Titan for work and personal life?', answer: 'Titan is perfect for both. Its hierarchical structure and category-based systems allow you to manage work projects and personal finances in one private environment.' }
    ]
  });

  return (
    <MarketingLayout>
      <section className="px-6 py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-8 text-5xl font-extrabold tracking-tight sm:text-7xl lg:leading-[1.1]">The Guide to <br /><span className="text-primary">Personal Life Operating Systems</span></h1>
          <p className="mb-12 text-lg text-muted-foreground sm:text-xl">Discover how unifying your digital life can lead to unprecedented clarity, focus, and productivity.</p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-6 py-12 sm:px-10">
        <div className="prose prose-invert max-w-none space-y-16 text-muted-foreground">
          <section className="space-y-10">
            <AnswerBlock 
              question="What is a personal life operating system?"
              answer="A personal life operating system (Life OS) is a centralized digital framework that integrates tasks, finances, notes, and habits into one unified system. It is designed to reduce cognitive load and improve decision-making by eliminating information silos."
            />

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">The Solution to Digital Friction</h2>
              <p>
                In the modern era, we are bombarded with information. We track our work in a task manager, our budgets in a spreadsheet, and our ideas in a notes app. This fragmentation is the primary cause of <strong>digital friction</strong>—the mental energy lost when context-switching between different interfaces.
              </p>
              <p>
                A <strong>Life OS</strong> is the antidote. It treats your entire life as a single, integrated project. By connecting your tasks to your finances and your thoughts to your timeline, you create a feedback loop that allows you to see the "big picture" of your life in real-time.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">The Three Pillars of a Unified Life OS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Layout className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-foreground">1. Integration</h4>
                <p className="text-sm">Your tasks must know about your money. Integration eliminates data silos and provides holistic context.</p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Zap className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-foreground">2. Automation</h4>
                <p className="text-sm">Handle recurring tasks and smart parsing automatically to save hours of manual entry every week.</p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Activity className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-foreground">3. Reflection</h4>
                <p className="text-sm">Gain data-driven insights to reflect on your habits, spending patterns, and productivity cycles.</p>
              </div>
            </div>
          </section>

          <AnswerBlock 
            question="Why do most productivity systems fail?"
            answer="Most systems fail due to the 'Silo Problem'—where tasks are disconnected from financial reality and creative notes. A unified Life OS bridges these gaps, ensuring that every action you take is informed by your total available resources and long-term goals."
          />

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">How to Implement Your Own Life OS</h2>
            <ul className="space-y-4 list-none p-0">
              <li className="flex gap-4 items-start p-6 rounded-2xl bg-card/30 border border-border/40">
                <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground">Centralize Your Capture</h4>
                  <p className="text-sm">Choose a single entry point for every thought, bill, and task to avoid fragmentation.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start p-6 rounded-2xl bg-card/30 border border-border/40">
                <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground">Connect Your Data</h4>
                  <p className="text-sm">Link expenses to projects and tasks to notes to create a contextual personal network.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start p-6 rounded-2xl bg-card/30 border border-border/40">
                <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground">Conduct Weekly Reviews</h4>
                  <p className="text-sm">Use a unified timeline to review if your spending and time allocation align with your values.</p>
                </div>
              </li>
            </ul>
          </section>

          <section className="pt-12 text-center">
            <h2 className="mb-8 text-3xl font-bold text-foreground">Ready to start your journey?</h2>
            <p className="mb-10 text-lg">Titan is the easiest way to implement a full Personal Life Operating System today. No complex setup, no subscription—just clarity.</p>
            <Link to="/onboarding" className="inline-flex items-center gap-3 rounded-2xl bg-primary px-10 py-5 text-lg font-bold text-white transition-all hover:scale-105">
              Build Your Life OS Now
              <ArrowRight className="h-6 w-6" />
            </Link>
          </section>
        </div>
      </article>

      {/* FAQ Section for AI SEO */}
      <section className="bg-card/20 py-24 sm:py-32 border-t border-border/40">
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
          <h2 className="mb-12 text-center text-3xl font-bold">Life OS Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: 'Is a Life OS different from a Productivity App?', a: 'Yes. While productivity apps usually focus on one vertical like tasks, a Life OS focuses on the horizontal connection between all aspects of your life—time, money, and thoughts.' },
              { q: 'Can I use Titan for work and personal life?', a: 'Titan is perfect for both. Its hierarchical structure and category-based systems allow you to manage work projects and personal finances in one private environment.' },
              { q: 'Do I need to be an expert to use a Life OS?', a: 'No. Titan is designed for intuitive growth. Start by tracking tasks, and naturally expand into financial tracking and note-taking as you build your system.' }
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border/60 bg-background/50 p-6">
                <h3 className="mb-3 font-bold text-foreground">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
