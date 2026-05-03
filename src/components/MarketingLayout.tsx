import { ReactNode } from 'react';
import { MarketingNav } from '@/components/MarketingNav';
import { Link } from 'react-router-dom';

interface MarketingLayoutProps {
  children: ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <MarketingNav />
      <main className="flex-1 pt-24 sm:pt-28">{children}</main>
      <footer className="border-t border-border/40 bg-card/20 py-12">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <img src="/icons/falcon.png" alt="Titan logo" className="h-8 w-8" />
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">Titan</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
                    Beta
                  </span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground">
                The professional personal life operating system. Built for clarity, speed, and
                privacy.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                Product
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/features" className="hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/ai-task-manager" className="hover:text-primary">
                    AI Task Manager
                  </Link>
                </li>
                <li>
                  <Link to="/expense-tracker" className="hover:text-primary">
                    Expense Tracker
                  </Link>
                </li>
                <li>
                  <Link to="/life-timeline" className="hover:text-primary">
                    Life Timeline
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                Resources
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/blog" className="hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/install-titan" className="hover:text-primary">
                    Installation Guide
                  </Link>
                </li>
                <li>
                  <a href="https://github.com/Rayyan-x95/Titan" className="hover:text-primary">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                Legal
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/privacy" className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border/40 pt-8 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Titan. All rights reserved. Built with precision.
          </div>
        </div>
      </footer>
    </div>
  );
}
