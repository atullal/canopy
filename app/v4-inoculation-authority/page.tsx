import AuthorityScenario from '../components/AuthorityScenario';
import { readFileSync } from 'fs';
import { join } from 'path';

export const metadata = {
  title: 'Practice Spotting Pressure | Canopy',
};

export default function AuthorityScenarioPage() {
  const scenarioPath = join(process.cwd(), 'scenarios', 'v4-inoculation-authority.json');
  const scenarioData = JSON.parse(readFileSync(scenarioPath, 'utf-8'));

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <AuthorityScenario data={scenarioData} />
    </main>
  );
}
