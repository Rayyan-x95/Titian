import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSeo } from '@/seo';

export function LandingPage() {
  useSeo({
    title: 'Titan - Personal Life Operating System',
    description:
      'A premium local-first workspace for tasks, notes, finance, and shared spending in one precise system.',
    path: '/welcome',
  });

  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary/25">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 sm:py-14">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icons/titan-logo.png" alt="Titan logo" className="h-10 w-10 rounded-lg object-contain" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Titan</p>
              <p className="text-sm font-semibold tracking-tight text-foreground">Life OS</p>
            </div>
          </div>

          <button
            onClick={() => { void navigate('/onboarding'); }}
            className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/50 px-4 py-2 text-sm font-semibold transition-colors hover:border-primary/40"
          >
            Start
            <ArrowRight className="h-4 w-4" />
          </button>
        </header>

        <div className="flex flex-1 flex-col justify-center py-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5"
          >
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Offline First</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.06 }}
            className="mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl sm:leading-tight"
          >
            A precise workspace for
            <span className="text-gradient"> tasks, notes, and money</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.12 }}
            className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground"
          >
            Titan helps you operate daily life with structure. Capture what matters, track progress, and keep finances clear in one fast interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.18 }}
            className="mt-8"
          >
            <button
              onClick={() => { void navigate('/onboarding'); }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(22,124,255,0.34)]"
            >
              Launch Titan
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-border/70 bg-card/45 p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Tasks with context</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Track work through Today, Upcoming, and Completed without visual clutter.</p>
          </article>

          <article className="rounded-2xl border border-border/70 bg-card/45 p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Notion-style notes</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Capture ideas quickly, connect notes with backlinks, and retrieve instantly.</p>
          </article>

          <article className="rounded-2xl border border-border/70 bg-card/45 p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
              <Wallet className="h-4 w-4" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Finance clarity</h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Big balance, fast actions, and clear transactions to keep decision making calm.</p>
          </article>
        </section>
      </section>
    </main>
  );
}
