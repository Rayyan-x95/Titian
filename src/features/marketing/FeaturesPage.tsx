import { MarketingLayout } from '@/components/MarketingLayout';
import { useSeo } from '@/hooks/useSeo';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
  Clock,
  Users,
  Smartphone,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function FeaturesPage() {
  useSeo({
    title: 'Titan Features - The All-In-One Productivity Powerhouse',
    description:
      'Explore the powerful features of Titan: Task management, expense tracking, shared spending, and Notion-style notes.',
    path: '/features',
    breadcrumbs: [
      { name: 'Home', item: '/home' },
      { name: 'Features', item: '/features' },
    ],
    faqs: [
      {
        question: 'What features does Titan include?',
        answer:
          'Titan includes an AI-powered task manager, precision expense tracking, rich-text note taking, shared expense groups, and a unified life timeline.',
      },
      {
        question: 'Does Titan work offline?',
        answer:
          'Yes. Titan is built as a Progressive Web App (PWA) with an offline-first architecture, allowing you to manage your tasks, money, and notes without an internet connection.',
      },
      {
        question: 'How does Titan keep my data private?',
        answer:
          'Titan stores all your data locally on your device using IndexedDB. We do not have access to your data, and it is never uploaded to the cloud without your explicit permission.',
      },
    ],
  });

  const features = [
    {
      title: 'AI Task Management',
      icon: CheckCircle2,
      desc: 'Prioritize, schedule, and automate tasks with our intelligent recurrence engine.',
      link: '/ai-task-manager',
    },
    {
      title: 'Financial Clarity',
      icon: Wallet,
      desc: 'Track expenses, manage budgets, and visualize your spending in real-time.',
      link: '/expense-tracker',
    },
    {
      title: 'Connected Notes',
      icon: Sparkles,
      desc: 'Rich-text editing, backlinks, and powerful search for your digital brain.',
      link: '/notes',
    },
    {
      title: 'Life Timeline',
      icon: Clock,
      desc: 'See a daily snapshot of everything you did and spent.',
      link: '/life-timeline',
    },
    {
      title: 'Shared Spending',
      icon: Users,
      desc: 'Split bills and track group expenses without the awkwardness.',
      link: '/shared-expenses',
    },
    {
      title: 'Offline First',
      icon: ShieldCheck,
      desc: 'Full functionality without internet. Your data is yours.',
      link: '/',
    },
    {
      title: 'Cross-Platform PWA',
      icon: Smartphone,
      desc: 'Install on any device. Mobile, tablet, or desktop.',
      link: '/install-titan',
    },
    {
      title: 'Privacy Focused',
      icon: Lock,
      desc: 'Local storage means your data never leaves your device.',
      link: '/',
    },
    {
      title: 'High Performance',
      icon: Zap,
      desc: 'Optimized for speed. No loading screens, just action.',
      link: '/',
    },
  ];

  return (
    <MarketingLayout>
      <section className="px-6 py-20 text-center sm:px-10">
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
          Powerful features, <span className="text-primary">zero friction.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Every tool in Titan is built to be the best-in-class, then connected to everything else.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border/60 bg-card/40 p-8">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">{f.title}</h3>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              {f.link !== '/' && (
                <Link
                  to={f.link}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  Explore <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card/20 py-24">
        <div className="mx-auto max-w-4xl px-6 sm:px-10">
          <h2 className="mb-12 text-center text-3xl font-bold">A Unified Ecosystem</h2>
          <div className="space-y-12">
            <div className="flex flex-col gap-8 md:flex-row md:items-center">
              <div className="flex-1">
                <h3 className="mb-4 text-2xl font-bold">Inter-connected by design</h3>
                <p className="text-muted-foreground">
                  In Titan, a task isn't just a to-do item. It's a node in your life. You can link a
                  task to a specific note for context, and attach an expense to it to track its
                  cost. This level of integration is what makes Titan a true{' '}
                  <strong>Life Operating System</strong>.
                </p>
              </div>
              <div className="flex-1 rounded-2xl border border-border/60 bg-background p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg bg-card/50 p-3 border border-primary/20">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Buy new laptop</span>
                  </div>
                  <div className="ml-6 flex items-center gap-3 rounded-lg bg-card/50 p-3 border border-emerald-500/20">
                    <Wallet className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium">$1,299.00 - Tech Budget</span>
                  </div>
                  <div className="ml-6 flex items-center gap-3 rounded-lg bg-card/50 p-3 border border-purple-500/20">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Specs comparison note</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
