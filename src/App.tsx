import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/app/Layout';

const DashboardPage = lazy(() =>
  import('@/modules/dashboard/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);
const TasksPage = lazy(() =>
  import('@/modules/tasks/TasksPage').then((module) => ({ default: module.TasksPage })),
);
const NotesPage = lazy(() =>
  import('@/modules/notes/NotesPage').then((module) => ({ default: module.NotesPage })),
);
const FinancePage = lazy(() =>
  import('@/modules/finance/FinancePage').then((module) => ({ default: module.FinancePage })),
);
const SettingsPage = lazy(() =>
  import('@/modules/settings/SettingsPage').then((module) => ({ default: module.SettingsPage })),
);
const ShareTargetPage = lazy(() =>
  import('@/modules/share/ShareTargetPage').then((module) => ({ default: module.ShareTargetPage })),
);

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
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
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
