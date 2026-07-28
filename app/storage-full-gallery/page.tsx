import StorageFullGallery from '../components/StorageFullGallery';

export const metadata = {
  title: 'Practice Photo Gallery | Canopy',
};

export default function StorageFullGalleryPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <StorageFullGallery />
    </main>
  );
}
