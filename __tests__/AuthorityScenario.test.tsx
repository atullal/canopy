import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthorityScenario from '../app/components/AuthorityScenario';

const mockData = {
  id: "test",
  title: "Test Title",
  description: "Test Description",
  actions: [
    { id: "manipulation", label: "Danger", type: "danger" as const },
    { id: "safe", label: "Safe", type: "primary" as const }
  ],
  challenges: [
    {
      id: "c1",
      sender: "Test Sender",
      body: "Test Body",
      isManipulation: true,
      manipulationType: "Test",
      justInTimeHint: "Test Hint"
    }
  ],
  feedback: {
    gentleFailureMissedManipulation: { title: "Fail1", message: "M1" },
    gentleFailureFlaggedSafe: { title: "Fail2", message: "M2" },
    success: { title: "Success", message: "M3" }
  }
};

describe('AuthorityScenario', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly', () => {
    render(<AuthorityScenario data={mockData} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Message from: Test Sender')).toBeInTheDocument();
    expect(screen.getByText(/"Test Body"/)).toBeInTheDocument();
  });

  it('shows success feedback on correct manipulation flag', () => {
    render(<AuthorityScenario data={mockData} />);
    fireEvent.click(screen.getByText('Danger'));
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('shows failure feedback on incorrect safe flag', () => {
    render(<AuthorityScenario data={mockData} />);
    fireEvent.click(screen.getByText('Safe'));
    expect(screen.getByText('Fail1')).toBeInTheDocument();
  });

  it('shows hint after idle time', () => {
    render(<AuthorityScenario data={mockData} />);
    
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(screen.getByText("Stuck? Here's a hint:")).toBeInTheDocument();
    expect(screen.getByText('Test Hint')).toBeInTheDocument();
  });
});
