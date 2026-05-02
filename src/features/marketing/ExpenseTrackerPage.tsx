import { MarketingLayout } from '@/components/MarketingLayout';
import { useSeo } from '@/seo';
import { Wallet, TrendingUp, ShieldCheck, PieChart, ArrowRight, Zap, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnswerBlock } from '@/components/AnswerBlock';

export function ExpenseTrackerPage() {
  useSeo({
    title: 'Expense Tracker - Master Your Finances with Titan',
    description: 'Precision financial tracking in one unified system. Manage expenses, budgets, and shared spending with Titan high-performance finance tools.',
    path: '/expense-tracker',
    breadcrumbs: [{ name: 'Home', item: '/home' }, { name: 'Features', item: '/features' }, { name: 'Finance', item: '/expense-tracker' }],
    faqs: [
      { question: 'What is an expense tracker?', answer: "An expense tracker is a digital tool that helps individuals record and categorize their spending. Titan's expense tracker goes further by storing all amounts in integer cents to ensure zero precision loss and linking transactions directly to your daily tasks." },
      { question: 'How does Titan help with financial tracking?', answer: "Titan helps with financial tracking by providing real-time category breakdowns, budget alerts, and a unified view of your net worth. It eliminates the 'Silo Problem' by connecting your spending data with your personal notes and productivity goals." },
      { question: 'Is my financial data private in Titan?', answer: 'Yes. Titan is an offline-first application, meaning all your financial data is stored locally on your device and is never sent to a cloud server without your explicit action (like a manual backup).' }
    ]
  });

  return (
    <MarketingLayout>
      <section className="px-6 py-24 text-center sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-5xl font-extrabold tracking-tight sm:text-7xl">Financial Clarity. <br /><span className="text-emerald-500">Cents-Precision.</span></h1>
          <p className="mb-12 text-lg text-muted-foreground sm:text-xl">Stop guessing where your money goes. Titan provides a high-fidelity view of your finances, built for speed and absolute accuracy.</p>
          <div className="flex justify-center">
            <Link to="/onboarding" className="rounded-xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-emerald-500">Track Your First Expense</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 space-y-10">
        <AnswerBlock 
          question="What is an expense tracker?"
          answer="An expense tracker is a digital tool that helps individuals record and categorize their spending. Titan's expense tracker goes further by storing all amounts in integer cents to ensure zero precision loss and linking transactions directly to your daily tasks."
        />

        <AnswerBlock 
          question="How does Titan help with financial tracking?"
          answer="Titan helps with financial tracking by providing real-time category breakdowns, budget alerts, and a unified view of your net worth. It eliminates the 'Silo Problem' by connecting your spending data with your personal notes and productivity goals."
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {[
            { title: 'Zero Precision Loss', desc: 'We store all amounts as integer cents. No floating point errors, just perfect math.', icon: Coins },
            { title: 'Visual Insights', desc: 'Automatic category breakdowns and spending trends help you visualize your cash flow.', icon: PieChart },
            { title: 'Budget Control', desc: 'Set monthly limits for categories and track your usage in real-time.', icon: TrendingUp }
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center">
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card/20 py-24">
        <div className="mx-auto max-w-4xl px-6 sm:px-10">
          <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
            <h2 className="text-center text-3xl font-bold text-foreground">Why Financial Tracking Matters</h2>
            <p className="text-lg text-center max-w-2xl mx-auto">
              Financial stress is one of the leading causes of anxiety. Titan solves this by making entry fast (under 3 seconds) and visualization intuitive.
            </p>
            
            <div className="rounded-2xl border border-border/40 bg-background/50 p-8 shadow-inner">
              <h4 className="mb-4 text-center font-bold text-foreground uppercase tracking-widest text-xs">A Smarter Workflow</h4>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1 space-y-2">
                  <div className="h-2 w-full rounded-full bg-border/40 overflow-hidden">
                    <div className="h-full w-3/4 bg-emerald-500" />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>DINING OUT</span>
                    <span className="text-emerald-500">75% USED</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-2 w-full rounded-full bg-border/40 overflow-hidden">
                    <div className="h-full w-1/4 bg-blue-500" />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>SUBSCRIPTIONS</span>
                    <span className="text-blue-500">25% USED</span>
                  </div>
                </div>
              </div>
            </div>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0">
              <li className="flex gap-4 items-start p-6 rounded-2xl bg-background/40 border border-border/40">
                <Zap className="h-5 w-5 text-emerald-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground">Fast Input</h4>
                  <p className="text-xs">Natural language parsing for quick expense entry on the go.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start p-6 rounded-2xl bg-background/40 border border-border/40">
                <ShieldCheck className="h-5 w-5 text-emerald-500 mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-foreground">Offline Security</h4>
                  <p className="text-xs">All financial data stays on your device for absolute privacy.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
