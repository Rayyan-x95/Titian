import { MarketingLayout } from '@/components/MarketingLayout';
import { useSeo } from '@/seo';
import { Sparkles, Zap, ShieldCheck, ArrowRight, CheckCircle2, Layout, Clock, Globe, Smartphone, Lock, Activity, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LifeManagementAppPage() {
  useSeo({
    title: 'The Best Life Management App for High-Achievers | Titan',
    description: 'Looking for the best life management app? Titan is a unified system for tasks, finances, and notes. Organize your entire life in one high-performance PWA.',
    path: '/life-management-app',
    breadcrumbs: [{ name: 'Home', item: '/' }, { name: 'Life Management App', item: '/life-management-app' }]
  });

  return (
    <MarketingLayout>
      <section className="px-6 py-20 lg:py-32 bg-gradient-to-b from-purple-500/5 to-transparent">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-8 text-5xl font-extrabold tracking-tight sm:text-7xl lg:leading-[1.1]">The Professional <br /><span className="text-purple-500">Life Management App</span></h1>
          <p className="mb-12 text-lg text-muted-foreground sm:text-xl">Stop juggling 10 different apps. Titan is the unified system that connects your time, your money, and your mind.</p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-6 py-12 sm:px-10">
        <div className="prose prose-invert max-w-none space-y-12 text-muted-foreground">
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Why you need a Life Management System</h2>
            <p>
              In the age of information overload, a simple to-do list is no longer enough. We are managing complex projects, global financial accounts, shared household responsibilities, and a constant stream of new ideas. 
            </p>
            <p>
              A <strong>life management app</strong> isn't just about getting things done; it's about knowing <em>what</em> to do and <em>why</em> you're doing it. It's about having a "second brain" that keeps your finances in check while you focus on your career, and your tasks organized while you focus on your health.
            </p>
            <p>
              Titan was built to be this system. By treating your tasks, expenses, and notes as a single, integrated dataset, Titan provides clarity that vertical-specific apps simply cannot offer.
            </p>
          </section>

          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-foreground text-center">Key Pillars of Total Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card/30 p-8 rounded-2xl border border-border/40">
                <Zap className="h-8 w-8 text-purple-400 mb-4" />
                <h4 className="text-lg font-bold text-foreground mb-2">Task Integrity</h4>
                <p className="text-sm">Manage complex hierarchies of tasks and subtasks with precision recurrence. Your to-do list finally feels professional.</p>
                <Link to="/ai-task-manager" className="text-xs font-bold text-primary mt-4 inline-flex items-center gap-1">Explore Task Manager <ArrowRight className="h-3 w-3" /></Link>
              </div>
              <div className="bg-card/30 p-8 rounded-2xl border border-border/40">
                <Wallet className="h-8 w-8 text-emerald-400 mb-4" />
                <h4 className="text-lg font-bold text-foreground mb-2">Financial Clarity</h4>
                <p className="text-sm">Track every cent with professional precision. Integrated with your timeline so you see the context of every expense.</p>
                <Link to="/expense-tracker" className="text-xs font-bold text-primary mt-4 inline-flex items-center gap-1">Explore Expense Tracker <ArrowRight className="h-3 w-3" /></Link>
              </div>
              <div className="bg-card/30 p-8 rounded-2xl border border-border/40">
                <BookOpen className="h-8 w-8 text-blue-400 mb-4" />
                <h4 className="text-lg font-bold text-foreground mb-2">Knowledge Storage</h4>
                <p className="text-sm">Capture ideas, project details, and meeting notes with Notion-style blocks that link to your tasks.</p>
                <Link to="/personal-life-os" className="text-xs font-bold text-primary mt-4 inline-flex items-center gap-1">Explore Notes & Life OS <ArrowRight className="h-3 w-3" /></Link>
              </div>
              <div className="bg-card/30 p-8 rounded-2xl border border-border/40">
                <Clock className="h-8 w-8 text-orange-400 mb-4" />
                <h4 className="text-lg font-bold text-foreground mb-2">Unified Timeline</h4>
                <p className="text-sm">Visualize your daily, weekly, and monthly rhythm in a single, beautiful chronology of events.</p>
                <Link to="/life-timeline" className="text-xs font-bold text-primary mt-4 inline-flex items-center gap-1">Explore Timeline <ArrowRight className="h-3 w-3" /></Link>
              </div>
            </div>
          </section>

          <section className="space-y-6 bg-purple-500/5 rounded-3xl p-10 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-foreground">AI Search Answer Block</h2>
            <div className="space-y-4">
              <p><strong>What is a life management app?</strong> A life management app is a comprehensive digital platform designed to help users organize all aspects of their daily lives, including tasks, finances, notes, and habits. These apps provide a unified interface to reduce mental clutter and improve personal productivity through data integration and smart tracking.</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none pl-0">
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                  Consolidated Task Tracking
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                  Personal Expense Budgeting
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                  Contextual Note Taking
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                  Progressive Web App (PWA) Offline Access
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Titan: The Future of Organized Living</h2>
            <p>
              Titan represents the pinnacle of <strong>modern life management</strong>. By prioritizing privacy through an offline-first architecture and performance through a lightweight React-based engine, we have created a tool that feels like a native extension of your digital self.
            </p>
            <p>
              Unlike subscription-heavy SaaS tools that lock your data in the cloud, Titan keeps your information where it belongs: with you. Our PWA can be installed on iOS, Android, and Desktop, ensuring you have a professional-grade Life OS available at any moment, even without an internet connection.
            </p>
          </section>

          <section className="pt-12 text-center">
            <h2 className="mb-8 text-3xl font-bold text-foreground">Take control of your life.</h2>
            <p className="mb-10 text-lg">Join the thousands of users who have upgraded to Titan. The best life management app is the one that stays out of your way and unifies your world.</p>
            <Link to="/onboarding" className="inline-flex items-center gap-3 rounded-2xl bg-primary px-10 py-5 text-lg font-bold text-white transition-all hover:scale-105">
              Get Started with Titan
              <ArrowRight className="h-6 w-6" />
            </Link>
          </section>
        </div>
      </article>

      <section className="bg-card/20 py-24 border-t border-border/40">
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
          <h2 className="mb-12 text-center text-3xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: 'Is Titan secure?', a: 'Yes. Titan is built with a security-first, offline-first philosophy. Your tasks, notes, and finances stay on your device and are never uploaded to a central server unless you explicitly enable sync features.' },
              { q: 'Can I import my data from other apps?', a: 'Titan supports standard data formats for importing your tasks and expenses, making it easy to migrate from simpler tools like Todoist or Splitwise.' },
              { q: 'Does Titan work on my phone?', a: 'Absolutely. Titan is a Progressive Web App (PWA), which means you can install it on any mobile device directly from your browser, gaining a full-screen, offline-capable experience.' }
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
const Wallet = Globe; // Fallback
