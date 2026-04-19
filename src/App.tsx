import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/app/Layout';
import { DashboardPage } from '@/modules/dashboard/DashboardPage';
import { FinancePage } from '@/modules/finance/FinancePage';
import { NotesPage } from '@/modules/notes/NotesPage';
import { SettingsPage } from '@/modules/settings/SettingsPage';
import { TasksPage } from '@/modules/tasks/TasksPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}