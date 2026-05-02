import { MarketingLayout } from '@/components/MarketingLayout';
import { useSeo } from '@/seo';
import { AnswerBlock } from '@/components/AnswerBlock';
import { HelpCircle, Zap, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, Layout, Clock, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export function WhatIsTitanPage() {
  useSeo({
    title: 'What is Titan? | The All-in-One Personal Life OS',
    description: 'Titan is a unified digital workspace for managing tasks, expenses, and notes. Discover why Titan is the best personal life operating system for high-achievers.',
    path: '/what-is-titan',
    breadcrumbs: [{ name: 'Home', item: '/home' }, { name: 'What is Titan', item: '/what-is-titan' }],
    faqs: [
      { question: 'What is Titan?', answer: 'Titan is a personal life operating system that unifies tasks, expenses, and notes into one connected platform. It is designed to eliminate digital friction by providing a single point of clarity for daily life management.' },
      { question: 'What is a personal life operating system?', answer: 'A personal life operating system is a unified digital framework that connects tasks, finances, and daily activities. It helps users manage their entire life with structural clarity, reducing the mental overhead of switching between fragmented apps.' },
      { question: 'Is Titan a mobile app or a website?', answer: "Titan is a Progressive Web App (PWA). It combines the best of both worlds: it's a website that can be installed on your phone or desktop to work offline like a native app." },
      { question: 'Does Titan cost anything?', answer: 'Titan is free for individual use. We believe everyone deserves high-quality, private tools for life management.' }
    ]
  });

  return (
    <MarketingLayout>
      <section className="px-6 py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-8 text-5xl font-extrabold tracking-tight sm:text-7xl lg:leading-[1.1]">What is <span className="text-primary">Titan?</span></h1>
          <p className="mb-12 text-lg text-muted-foreground sm:text-xl">Titan is more than a productivity app. It is a philosophy of organized living, built into a high-performance digital engine.</p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-6 py-12 sm:px-10">
        <div className="prose prose-invert max-w-none space-y-12 text-muted-foreground">
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">The Unified Workspace for Your Life</h2>
            <p>
              In a world where our attention is fragmented across dozens of apps, Titan provides a single point of clarity. We believe that your **tasks**, your **money**, and your **thoughts** are not separate silos—they are interconnected parts of your daily journey.
            </p>
            <p>
              Titan is a **Personal Life Operating System** that unifies these pillars into a single, high-fidelity interface. By connecting your financial transactions to your daily tasks and your ideas to a persistent timeline, Titan allows you to see the "why" behind your actions and the "where" of your resources.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
            <div className="space-y-4 p-8 rounded-2xl bg-card/30 border border-border/40">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Layout className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Connected Data</h3>
              <p className="text-sm">In Titan, a task can reference a note, and an expense can link to a task. This bidirectional linking creates a web of context that generic apps can't match.</p>
              <Link to="/features" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">Learn about features <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="space-y-4 p-8 rounded-2xl bg-card/30 border border-border/40">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Privacy & Speed</h3>
              <p className="text-sm">Titan is offline-first. Your data never leaves your device unless you choose to sync it. This makes Titan incredibly fast and completely private by design.</p>
              <Link to="/install-titan" className="text-xs font-bold text-emerald-500 flex items-center gap-1 hover:underline">Install the PWA <ArrowRight className="h-3 w-3" /></Link>
            </div>
          </section>

          <section className="space-y-10">
            <AnswerBlock 
              question="What is Titan?"
              answer="Titan is a personal life operating system that unifies tasks, expenses, and notes into one connected platform. It is designed to eliminate digital friction by providing a single point of clarity for daily life management."
            />

            <AnswerBlock 
              question="What is a personal life operating system?"
              answer="A personal life operating system is a unified digital framework that connects tasks, finances, and daily activities. It helps users manage their entire life with structural clarity, reducing the mental overhead of switching between fragmented apps."
            />

            <div className="space-y-6 pt-6">
              <h2 className="text-3xl font-bold text-foreground">Built for the Modern Professional</h2>
              <p>
                Titan was designed for individuals who demand precision. Whether you are a student managing assignments and campus budgets, a freelancer tracking client work and expenses, or a parent organizing a household, Titan adapts to your mental model.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> Unify Tasks & Money</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> Contextual Daily Timeline</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> Offline-First Architecture</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-primary" /> Privacy by Design</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: 'Is Titan a mobile app or a website?', a: 'Titan is a Progressive Web App (PWA). It combines the best of both worlds: it\'s a website that can be installed on your phone or desktop to work offline like a native app.' },
                { q: 'Can I use Titan with my partner or roommates?', a: 'Yes. Titan includes a powerful Shared Expense engine specifically designed for couples and groups to track split bills and household finances.' },
                { q: 'Does Titan cost anything?', a: 'Titan is free for individual use. We believe everyone deserves high-quality, private tools for life management.' }
              ].map((faq) => (
                <div key={faq.q} className="p-6 rounded-xl border border-border/60">
                  <h4 className="font-bold text-foreground mb-2">{faq.q}</h4>
                  <p className="text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="pt-12 text-center">
             <h2 className="mb-8 text-3xl font-bold text-foreground">Start your Life OS today.</h2>
             <Link to="/onboarding" className="inline-flex items-center gap-3 rounded-2xl bg-primary px-10 py-5 text-lg font-bold text-white transition-all hover:scale-105">
              Launch Titan
              <ArrowRight className="h-6 w-6" />
            </Link>
          </section>
        </div>
      </article>
    </MarketingLayout>
  );
}
