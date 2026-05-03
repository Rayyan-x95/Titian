import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation, Sidebar, PwaBanner, CommandPalette, LockScreen } from '@/components';
import { Activity } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useSettings } from '@/core/settings';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useBackgroundNotifications } from '@/hooks/useBackgroundNotifications';
import { cn } from '@/utils/cn';

export function Layout() {
  const { compactMode, animations, pinEnabled, appPin } = useSettings();
  const [isUnlocked, setIsUnlocked] = useState(!pinEnabled || !appPin);
  const [scrollY, setScrollY] = useState(0);
  const scrollDirection = useScrollDirection();
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-primary origin-left transition-transform duration-75 ease-out"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />
      {!isUnlocked && <LockScreen onUnlock={() => setIsUnlocked(true)} />}
      {isUnlocked && <CommandPalette />}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#030303]">
        <div className="mesh-gradient absolute inset-0 opacity-40" />
        <div className="absolute left-[-10%] top-[-10%] h-[40rem] w-[40rem] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[50rem] w-[50rem] rounded-full bg-purple-600/10 blur-[150px] animate-pulse" />
      </div>

      {/* Pull-to-refresh visual cue */}
      <motion.div
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center pt-[calc(0.5rem+var(--safe-area-top))]"
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: scrollY < 10 ? 0.4 : 0,
          y: scrollY < 10 ? 0 : -20,
        }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10">
          <Activity className="h-4 w-4 text-blue-400 animate-pulse" />
        </div>
      </motion.div>

      <Sidebar />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 bg-black/60 backdrop-blur-2xl transition-all duration-500 lg:hidden',
          scrollDirection === 'down' && scrollY > 100 ? '-translate-y-full' : 'translate-y-0',
          scrollY > 20 ? 'border-b border-white/5 shadow-lg' : 'border-b border-transparent'
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/icons/falcon.png"
                alt="Titan logo"
                className="h-8 w-8 rounded-xl object-contain shadow-glow-blue"
              />
              <div className="absolute -inset-1 rounded-xl bg-blue-500/10 blur-sm -z-10" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">Titan</h1>
              <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-[8px] font-bold uppercase tracking-widest text-blue-400">
              <div className="h-1 w-1 rounded-full bg-blue-400 animate-pulse" />
              Ready
            </span>
          </div>
        </div>
      </header>

      <PwaBanner />

      <main
        id="main-content"
        className="relative z-10 px-4 pb-48 pt-28 sm:px-6 lg:pl-80 lg:px-8 lg:pb-12 lg:pt-6"
      >
        <div className="mx-auto max-w-5xl">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
