import FakeCheckout from '../components/FakeCheckout';

export const metadata = {
  title: 'Practice Checkout Simulator | Canopy',
};

export default function FakeCheckoutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <FakeCheckout />
    </main>
  );
}
