import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation, Sidebar, PwaBanner, CommandPalette, LockScreen } from '@/shared/components';
import { useSettings } from '@/core/settings';
import { APP_VERSION } from '@/core/version';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useBackgroundNotifications } from '@/hooks/useBackgroundNotifications';
import { cn } from '@/utils/cn';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

export function Layout() {
  const { compactMode, animations, pinEnabled, appPin } = useSettings();
  const [isUnlocked, setIsUnlocked] = useState(!pinEnabled || !appPin);
  const scrollDirection = useScrollDirection();
  
  // Background processes
  useBackgroundNotifications();

  // Re-check lock status if settings change
  useEffect(() => {
    if (!pinEnabled || !appPin) {
      setIsUnlocked(true);
    }
  }, [pinEnabled, appPin]);

  // Sync compact mode to root element so CSS can react globally
  useEffect(() => {
    const root = document.documentElement;
    if (compactMode) {
      root.dataset.compact = 'true';
    } else {
      delete root.dataset.compact;
    }
  }, [compactMode]);

  useEffect(() => {
    const root = document.documentElement;
    if (animations) {
      delete root.dataset.animations;
    } else {
      root.dataset.animations = 'off';
    }
  }, [animations]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-foreground">
      {!isUnlocked && <LockScreen onUnlock={() => setIsUnlocked(true)} />}
      {isUnlocked && <CommandPalette />}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-6%] top-[-8%] h-[28rem] w-[28rem] rounded-full bg-primary/7 blur-[120px]" />
        <div className="absolute bottom-[-18%] right-[-12%] h-[30rem] w-[30rem] rounded-full bg-accent/7 blur-[140px]" />
      </div>

      <Sidebar />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>

      <header 
        className={cn(
          "fixed inset-x-4 top-4 z-40 mx-auto max-w-4xl rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xl transition-all duration-300 lg:hidden",
          scrollDirection === 'down' ? "-translate-y-28 opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <img
              src="/icons/titan-logo.png"
              alt="Titan logo"
              className="h-8 w-8 rounded-lg object-contain"
            />
            <div>
              <h1 className="leading-none text-sm font-semibold tracking-tight text-foreground">Titan</h1>
              <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                v{APP_VERSION}
              </p>
            </div>
          </div>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold tracking-wide text-primary">
            Offline Ready
          </span>
        </div>
      </header>

      <PwaBanner />

      <main id="main-content" className="relative z-10 px-4 pb-48 pt-32 sm:px-6 lg:pl-64 lg:px-8 lg:pb-12 lg:pt-12">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>

      <Navigation />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
