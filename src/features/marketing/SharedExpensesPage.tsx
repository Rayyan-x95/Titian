import { MarketingLayout } from '@/components/MarketingLayout';
import { useSeo } from '@/hooks/useSeo';
import { Users, Handshake, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SharedExpensesPage() {
  useSeo({
    title: 'Shared Expenses & Bill Splitting - Titan for Couples & Friends',
    description:
      'Easily split bills and track group spending with Titan shared expense manager. Perfect for couples, roommates, and travel groups.',
    path: '/shared-expenses',
    breadcrumbs: [
      { name: 'Home', item: '/' },
      { name: 'Features', item: '/features' },
      { name: 'Shared Expenses', item: '/shared-expenses' },
    ],
  });

  return (
    <MarketingLayout>
      <section className="px-6 py-24 text-center sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-5xl font-extrabold tracking-tight sm:text-7xl">
            Shared Finances. <br />
            <span className="text-cyan-500">Solved.</span>
          </h1>
          <p className="mb-12 text-lg text-muted-foreground sm:text-xl">
            Split bills, track group spending, and manage household finances without the friction.
            Titan handles the math, so you can handle the fun.
          </p>
          <div className="flex justify-center">
            <Link
              to="/onboarding"
              className="rounded-xl bg-cyan-600 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-cyan-500"
            >
              Create a Group
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div className="rounded-3xl border border-border/60 bg-card/40 p-8 shadow-2xl">
            <h3 className="mb-6 text-2xl font-bold">The Settlement Engine</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-background/50 p-4 border border-border/40">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">
                    JD
                  </div>
                  <span className="font-medium">John Doe</span>
                </div>
                <span className="text-red-400 font-bold">Owes $45.00</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-background/50 p-4 border border-border/40">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 font-bold">
                    JS
                  </div>
                  <span className="font-medium">Jane Smith</span>
                </div>
                <span className="text-emerald-400 font-bold">Gets $45.00</span>
              </div>
              <div className="pt-4 text-center">
                <button className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
                  Settle Up Now
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold sm:text-4xl">Perfect for every group.</h2>
            <ul className="space-y-6">
              {[
                {
                  title: 'Couples',
                  desc: 'Manage shared household expenses while keeping your personal spending private.',
                  icon: Heart,
                },
                {
                  title: 'Roommates',
                  desc: 'Never argue over the electricity bill again. Simple, transparent splits for everyone.',
                  icon: Users,
                },
                {
                  title: 'Travel Groups',
                  desc: 'Track every meal, ticket, and taxi during your trip. Settle up with one click at the end.',
                  icon: Handshake,
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
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
        </div>
      </section>

      <section className="bg-cyan-500/5 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-8 text-3xl font-bold">Data-Driven Harmony</h2>
          <div className="prose prose-invert max-w-none text-muted-foreground">
            <p className="text-lg">
              Money is often a source of tension in relationships. Transparency is the antidote.
              Titan's <strong>Shared Expenses</strong> engine provides a clear, undeniable record of
              who paid for what, when, and how it was split.
            </p>
            <p>
              Unlike simple split-check apps, Titan integrates these shared costs into your overall
              financial picture. You can see how your portion of shared rent impacts your personal
              monthly budget, giving you a complete view of your financial reality.
            </p>
          </div>
          <div className="mt-12">
            <Link
              to="/expense-tracker"
              className="group inline-flex items-center gap-2 font-semibold text-primary"
            >
              Learn more about Expense Tracking{' '}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
