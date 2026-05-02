import { MarketingLayout } from '@/components/MarketingLayout';
import { useSeo } from '@/seo';
import { Clock, History, Layout, Activity, ArrowRight, Zap, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LifeTimelinePage() {
  useSeo({
    title: 'Life Timeline - Visualize Your Productivity with Titan',
    description: 'Track your daily journey with the Titan Life Timeline. A unified view of your tasks, notes, and spending in one historical record.',
    path: '/life-timeline',
    breadcrumbs: [{ name: 'Home', item: '/' }, { name: 'Features', item: '/features' }, { name: 'Timeline', item: '/life-timeline' }]
  });

  return (
    <MarketingLayout>
      <section className="px-6 py-24 text-center sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-5xl font-extrabold tracking-tight sm:text-7xl">Your Life. <br /><span className="text-primary">In Chronology.</span></h1>
          <p className="mb-12 text-lg text-muted-foreground sm:text-xl">The Life Timeline is a powerful historical record that unifies your productivity and finances into one intuitive daily snapshot.</p>
          <div className="flex justify-center">
            <Link to="/onboarding" className="rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white transition-all hover:bg-primary/90">Start Your Journey</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold sm:text-4xl">Context is everything.</h2>
            <p className="text-lg text-muted-foreground">Traditional productivity apps show you what to do. Titan shows you what you've <em>done</em> and how it affected your day. By seeing your spending alongside your completed tasks, you gain a new level of self-awareness.</p>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                { title: 'Daily Snapshots', desc: 'A clean scrollable view of every action you took today.', icon: Activity },
                { title: 'Historical Records', desc: 'Look back weeks or months to identify patterns and growth.', icon: History },
                { title: 'Integrated View', desc: 'Tasks, expenses, and notes side-by-side in real-time.', icon: Layout },
                { title: 'Data Sovereignty', desc: 'Your history is stored locally. No cloud, no tracking.', icon: Calendar }
              ].map((item) => (
                <div key={item.title} className="space-y-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-primary/20 to-accent/20 blur-2xl" />
            <div className="relative space-y-4 rounded-2xl border border-border/60 bg-card/40 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold">Tuesday, May 12</span>
                <span className="text-xs text-muted-foreground">Today</span>
              </div>
              
              <div className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-border/60">
                <div className="relative mb-6">
                  <div className="absolute -left-[1.375rem] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                  <p className="text-xs font-bold text-primary uppercase">09:00 AM</p>
                  <p className="text-sm font-medium">Completed: Quarterly Review</p>
                </div>
                
                <div className="relative mb-6">
                  <div className="absolute -left-[1.375rem] top-1 h-3 w-3 rounded-full border-2 border-emerald-500 bg-background" />
                  <p className="text-xs font-bold text-emerald-500 uppercase">12:30 PM</p>
                  <p className="text-sm font-medium">Expense: $18.50 - Business Lunch</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[1.375rem] top-1 h-3 w-3 rounded-full border-2 border-purple-500 bg-background" />
                  <p className="text-xs font-bold text-purple-500 uppercase">03:45 PM</p>
                  <p className="text-sm font-medium">Added Note: Project Phoenix Strategy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card/20 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-8 text-3xl font-bold">The Power of Reflection</h2>
          <div className="prose prose-invert max-w-none text-muted-foreground">
            <p className="text-lg">
              Self-improvement requires data. The <strong>Life Timeline</strong> provides the raw material for meaningful self-reflection. By seeing your day in chronology, you can ask better questions: <em>"Why do my highest expenses happen on my least productive days?"</em> or <em>"How does writing a note in the morning affect my task completion in the afternoon?"</em>
            </p>
            <p>
              This isn't just a log; it's a mirror for your habits. In Titan, we believe that clarity comes from seeing the whole picture—not just the disconnected pieces.
            </p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
