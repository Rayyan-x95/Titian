import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSeo } from '@/hooks/useSeo';

export function LandingPage() {
  useSeo({
    title: 'Titan - Personal Life Operating System',
    description:
      'A premium local-first workspace for tasks, notes, finance, and shared spending in one precise system.',
    path: '/welcome',
  });

  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white selection:bg-blue-500/30">
      {/* Premium Backdrop Blobs */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-blob-morph" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-cyan-600/10 blur-[120px] animate-blob-morph animate-delay-3000" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 sm:py-14">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/icons/falcon.png"
              alt="Titan logo"
              className="h-11 w-11 rounded-2xl object-contain border border-white/10 p-2 shadow-glow"
            />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                Titan
              </p>
              <p className="text-sm font-black tracking-tighter text-white">Life OS</p>
            </div>
          </div>

          <button
            onClick={() => {
              void navigate('/onboarding');
            }}
            className="glass-panel inline-flex items-center gap-3 rounded-2xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-300 transition-all hover:bg-white/5 border-white/5 shadow-glow"
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
            className="glass-panel inline-flex w-fit items-center gap-2 rounded-full px-5 py-2 border-white/10 shadow-glow"
          >
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
              Offline First
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.06 }}
            className="titan-metric mt-8 max-w-4xl text-5xl tracking-tighter text-white sm:text-8xl sm:leading-[0.9]"
          >
            A precise workspace for
            <span className="text-gradient-primary"> tasks, notes, and money</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.12 }}
            className="mt-8 max-w-2xl text-base leading-relaxed text-slate-500 font-bold sm:text-lg"
          >
            Titan helps you operate daily life with structure. Capture what matters, track progress,
            and keep finances clear in one fast interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.18 }}
            className="mt-10"
          >
            <button
              onClick={() => {
                void navigate('/onboarding');
              }}
              className="inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-10 py-5 text-sm font-black uppercase tracking-widest text-white shadow-glow-blue transition-all hover:scale-105 active:scale-95"
            >
              Launch Titan
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        </div>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <article className="glass-panel group rounded-[2.5rem] p-8 transition-all hover:bg-white/5 border-white/5 shadow-glow">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/10 shadow-glow group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-black tracking-tight text-white uppercase tracking-widest">
              Tasks with context
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 font-bold">
              Track work through Today, Upcoming, and Completed without visual clutter.
            </p>
          </article>

          <article className="glass-panel group rounded-[2.5rem] p-8 transition-all hover:bg-white/5 border-white/5 shadow-glow">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/10 shadow-glow group-hover:scale-110 transition-transform">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-black tracking-tight text-white uppercase tracking-widest">
              Digital Brain
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 font-bold">
              Capture ideas quickly, connect notes with backlinks, and retrieve instantly.
            </p>
          </article>

          <article className="glass-panel group rounded-[2.5rem] p-8 transition-all hover:bg-white/5 border-white/5 shadow-glow">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 shadow-glow group-hover:scale-110 transition-transform">
              <Wallet className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-black tracking-tight text-white uppercase tracking-widest">
              Finance Clarity
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 font-bold">
              Big balance, fast actions, and clear transactions to keep decision making calm.
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}
