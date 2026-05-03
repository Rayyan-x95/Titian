import { MarketingLayout } from '@/components/MarketingLayout';
import { useSeo } from '@/hooks/useSeo';
import { CheckCircle2, ArrowRight, Heart, Home, Plane, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SplitExpensesAppPage() {
  useSeo({
    title: 'Best App to Split Expenses with Friends & Couples | Titan',
    description:
      'Looking for a better way to split bills? Titan shared expense manager is the perfect solution for roommates, couples, and travel groups. Offline-first and private.',
    path: '/split-expenses-app',
    breadcrumbs: [
      { name: 'Home', item: '/' },
      { name: 'Split Expenses', item: '/split-expenses-app' },
    ],
  });

  return (
    <MarketingLayout>
      <section className="px-6 py-20 lg:py-32 bg-gradient-to-b from-cyan-500/5 to-transparent">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-8 text-5xl font-extrabold tracking-tight sm:text-7xl lg:leading-[1.1]">
            The Ultimate <br />
            <span className="text-cyan-500">Bill Splitting Experience</span>
          </h1>
          <p className="mb-12 text-lg text-muted-foreground sm:text-xl">
            Manage shared household expenses, travel budgets, and couple finances with absolute
            transparency and zero friction.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-6 py-12 sm:px-10">
        <div className="prose prose-invert max-w-none space-y-12 text-muted-foreground">
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              Why you need a dedicated shared expense manager
            </h2>
            <p>
              Splitting expenses is more than just dividing a bill by two. It's about maintaining a
              fair and transparent record of your shared life. Whether you are living with
              roommates, traveling with friends, or managing a household with a partner, the way you
              handle money impacts your relationships.
            </p>
            <p>
              Most "bill splitting apps" are standalone tools. You enter a cost, it tells you what
              someone owes, and that's it. But money doesn't exist in a vacuum. A shared expense is
              often part of a larger project, a recurring bill, or a specific life event.
            </p>
            <p>
              Titan's <strong>Shared Expense Engine</strong> is built into a larger Life Operating
              System. This means when you split a rent payment, it doesn't just show up as a debt—it
              integrates into your personal financial history, your budget categories, and your
              daily timeline.
            </p>
          </section>

          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-foreground text-center">
              Perfect for every scenario
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card/30 p-8 rounded-2xl border border-border/40">
                <Heart className="h-8 w-8 text-pink-400 mb-4" />
                <h4 className="text-lg font-bold text-foreground mb-2">Couples</h4>
                <p className="text-sm">
                  Manage joint accounts, household bills, and date nights while keeping your
                  personal spending private. The ultimate tool for financial harmony.
                </p>
              </div>
              <div className="bg-card/30 p-8 rounded-2xl border border-border/40">
                <Home className="h-8 w-8 text-blue-400 mb-4" />
                <h4 className="text-lg font-bold text-foreground mb-2">Roommates</h4>
                <p className="text-sm">
                  Stop arguing over the electricity bill or cleaning supplies. Set up a household
                  group and track shared costs with ease.
                </p>
              </div>
              <div className="bg-card/30 p-8 rounded-2xl border border-border/40">
                <Plane className="h-8 w-8 text-emerald-400 mb-4" />
                <h4 className="text-lg font-bold text-foreground mb-2">Travel Groups</h4>
                <p className="text-sm">
                  Track every hotel, meal, and activity during your trip. Settle up with one click
                  at the end of the journey.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">How Titan splits expenses better</h2>
            <p>
              Traditional apps rely on constant internet connectivity and centralized servers.
              Titan's <strong>offline-first</strong> architecture means you can log an expense while
              you're deep in a subway station or on a remote mountain trail. Your data is synced
              locally and settled precisely.
            </p>
            <ul className="space-y-6 list-none pl-0">
              <li className="flex gap-4 p-6 rounded-xl bg-background/50 border border-border/40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Lightning-Fast Entry</h4>
                  <p className="text-sm leading-relaxed">
                    Log a shared expense in under 3 seconds. Select the group, enter the amount, and
                    choose who paid. It's that simple.
                  </p>
                </div>
              </li>
              <li className="flex gap-4 p-6 rounded-xl bg-background/50 border border-border/40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Privacy by Default</h4>
                  <p className="text-sm leading-relaxed">
                    Your group members only see what you share. Your personal finances, private
                    tasks, and secret notes stay on your device, always private.
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <section className="space-y-6 bg-cyan-500/5 rounded-3xl p-10 border border-cyan-500/20">
            <h2 className="text-2xl font-bold text-foreground">
              The "What is a split expenses app?" Answer Block
            </h2>
            <div className="space-y-4">
              <p>
                A <strong>split expenses app</strong> is a digital tool that allows multiple people
                to track and divide shared costs. These apps calculate the balance between group
                members, showing who owes money and who is owed, simplifying the process of settling
                debts for households, trips, or group events.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none pl-0">
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-cyan-500" />
                  Real-time balance tracking
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-cyan-500" />
                  Multi-currency support
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-cyan-500" />
                  Automatic settlement calculation
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-cyan-500" />
                  Shared history and receipts
                </li>
              </ul>
            </div>
          </section>

          <section className="pt-12 text-center">
            <h2 className="mb-8 text-3xl font-bold text-foreground">
              Ready to end the "who owes what" debate?
            </h2>
            <p className="mb-10 text-lg">
              Titan is the most precise and private way to manage shared money. Join thousands of
              groups who have simplified their finances.
            </p>
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-3 rounded-2xl bg-cyan-600 px-10 py-5 text-lg font-bold text-white transition-all hover:scale-105"
            >
              Get Started with Groups
              <ArrowRight className="h-6 w-6" />
            </Link>
          </section>
        </div>
      </article>
    </MarketingLayout>
  );
}
