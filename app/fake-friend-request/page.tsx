import FakeFriendRequest from '../components/FakeFriendRequest';

export const metadata = {
  title: 'Practice Friend Requests | Canopy',
};

export default function FakeFriendRequestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <FakeFriendRequest />
    </div>
  );
}
