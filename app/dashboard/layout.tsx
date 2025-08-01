import { DashboardNav } from '../components/DashboardNav';
import { ProtectedRoute } from '../components/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
        <DashboardNav />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
