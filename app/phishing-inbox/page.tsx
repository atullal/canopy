import PhishingInbox from '../components/PhishingInbox';

export const metadata = {
  title: 'Practice Inbox Simulator | Canopy',
};

export default function PhishingInboxPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <PhishingInbox />
    </main>
  );
}
