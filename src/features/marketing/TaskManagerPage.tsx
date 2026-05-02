import { MarketingLayout } from '@/components/MarketingLayout';
import { useSeo } from '@/seo';
import { CheckCircle2, Zap, Clock, List, Layout, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnswerBlock } from '@/components/AnswerBlock';

export function TaskManagerPage() {
  useSeo({
    title: 'AI Task Manager - Organize Your Life with Titan',
    description: 'Master your schedule with Titan AI-powered task management. Features include recurring tasks, priority levels, and deep context linking.',
    path: '/ai-task-manager',
    breadcrumbs: [{ name: 'Home', item: '/home' }, { name: 'Features', item: '/features' }, { name: 'Tasks', item: '/ai-task-manager' }],
    faqs: [
      { question: 'What is an AI task manager?', answer: "An AI task manager is a digital productivity tool that uses smart parsing and contextual linking to help users organize their goals. Titan's task manager unifies your to-do list with your financial data, providing a complete overview of your daily responsibilities." },
      { question: 'How does Titan improve task management?', answer: 'Titan improves task management by connecting every task to relevant notes and expenses. This deep context linking ensures you have all the information needed to execute a task, while our smart priority matrix helps you focus on what truly matters.' },
      { question: 'Can I use Titan for team task management?', answer: 'Titan is currently optimized for personal use and shared household management through its Groups feature, which allows for shared task lists and expense splitting.' }
    ]
  });

  return (
    <MarketingLayout>
      <section className="px-6 py-24 text-center sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-5xl font-extrabold tracking-tight sm:text-7xl">Smart Tasks. <br /><span className="text-primary">Zero Overhead.</span></h1>
          <p className="mb-12 text-lg text-muted-foreground sm:text-xl">Titan task manager is designed for high-performers who need precision without the clutter of traditional to-do lists.</p>
          <div className="flex justify-center">
            <Link to="/onboarding" className="rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white transition-all hover:bg-primary/90">Get Started Now</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 space-y-10">
        <AnswerBlock 
          question="What is an AI task manager?"
          answer="An AI task manager is a digital productivity tool that uses smart parsing and contextual linking to help users organize their goals. Titan's task manager unifies your to-do list with your financial data, providing a complete overview of your daily responsibilities."
        />

        <AnswerBlock 
          question="How does Titan improve task management?"
          answer="Titan improves task management by connecting every task to relevant notes and expenses. This deep context linking ensures you have all the information needed to execute a task, while our smart priority matrix helps you focus on what truly matters."
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold sm:text-4xl">Built for absolute clarity.</h2>
            <p className="text-lg text-muted-foreground">Most task managers fail because they become a dumping ground for ideas. Titan forces clarity through a deliberate hierarchy and powerful organization tools.</p>
            
            <ul className="space-y-6">
              {[
                { title: 'Intelligent Recurrence', desc: 'Set complex schedules with ease. Monthly reviews, bi-weekly payments, or daily habits.', icon: Clock },
                { title: 'Priority Matrix', desc: 'Focus on what matters. Use our high, medium, and low priority system to filter the noise.', icon: List },
                { title: 'Deep Context Linking', desc: 'Attach notes and expenses directly to tasks. Everything you need is one click away.', icon: Sparkles }
              ].map((item) => (
                <li key={item.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="rounded-3xl border border-border/60 bg-card/40 p-1">
            <div className="overflow-hidden rounded-2xl bg-background p-6 shadow-2xl">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="font-bold">Today's Focus</h3>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">4 Tasks</span>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Finalize SEO Strategy', priority: 'High', color: 'bg-red-500' },
                  { title: 'Review Q2 Budget', priority: 'Medium', color: 'bg-yellow-500' },
                  { title: 'Prepare for Sprint Demo', priority: 'High', color: 'bg-red-500' },
                  { title: 'Email potential partners', priority: 'Low', color: 'bg-blue-500' }
                ].map((t) => (
                  <div key={t.title} className="flex items-center justify-between rounded-xl border border-border/40 bg-card/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-md border-2 border-primary/40" />
                      <span className="text-sm font-medium">{t.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${t.color}`} />
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{t.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-8 text-3xl font-bold">The Science of Productivity</h2>
          <div className="prose prose-invert max-w-none text-muted-foreground">
            <p className="text-lg">
              The Titan task manager is based on the <strong>GTD (Getting Things Done)</strong> methodology, enhanced by modern AI-ready structures. By offloading your mental load into a reliable external system, you free up your brain for creative work and decision making. 
            </p>
            <p>
              Our system emphasizes <strong>Atomic Tasks</strong>—the idea that every task should be a single, actionable item. If a task is too big, it belongs in a Note or a Project. This philosophy prevents procrastination by making the "next step" obvious and easy to start.
            </p>
          </div>
          <div className="mt-12 flex justify-center gap-4">
            <Link to="/expense-tracker" className="group flex items-center gap-2 font-semibold text-primary">
              View Expense Tracker <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
