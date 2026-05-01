import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/app/Layout';
import { useStore } from '@/core/store';

const DashboardPage = lazy(() => import('@/features/dashboard').then((m) => ({ default: m.DashboardPage })));
const TasksPage = lazy(() => import('@/features/tasks').then((m) => ({ default: m.TasksPage })));
const NotesPage = lazy(() => import('@/features/notes').then((m) => ({ default: m.NotesPage })));
const FinancePage = lazy(() => import('@/features/finance').then((m) => ({ default: m.FinancePage })));
const SettingsPage = lazy(() => import('@/features/settings').then((m) => ({ default: m.SettingsPage })));
const ShareTargetPage = lazy(() => import('@/features/share').then((m) => ({ default: m.ShareTargetPage })));
const OnboardingPage = lazy(() => import('@/features/onboarding').then((m) => ({ default: m.OnboardingPage })));
const TimelinePage = lazy(() => import('@/features/timeline').then((m) => ({ default: m.TimelineView })));
const SplitPage = lazy(() => import('@/features/split').then((m) => ({ default: m.SplitPage })));
const LandingPage = lazy(() => import('@/features/landing').then((m) => ({ default: m.LandingPage })));

function OnboardingGate() {
  const hydrated = useStore((state) => state.hydrated);
  const onboarding = useStore((state) => state.onboarding);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const hasResolvedOnboarding = Boolean(onboarding.completedAt || onboarding.skippedAt);

  if (!hasResolvedOnboarding) {
    return <Navigate to="/welcome" replace />;
  }

  return <Layout />;
}

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route path="welcome" element={<LandingPage />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route element={<OnboardingGate />}>
          <Route index element={<DashboardPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="splits" element={<SplitPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="share" element={<ShareTargetPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
