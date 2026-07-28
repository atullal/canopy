import AppPermissions from '../components/AppPermissions';

export const metadata = {
  title: 'Practice App Install | Canopy',
};

export default function AppPermissionsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <AppPermissions />
    </main>
  );
}
