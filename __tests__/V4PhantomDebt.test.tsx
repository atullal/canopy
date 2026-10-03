import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import V4PhantomDebt from '../app/components/V4PhantomDebt';

// Mock posthog relative to this test file
jest.mock('../utils/posthog', () => ({
  capture: jest.fn(),
}));

// Mock scenarioData relative to this test file
jest.mock('../scenarios/v4-inoculation-phantom-debt.json', () => ({
  id: "v4-inoculation-phantom-debt",
  title: "Practice Spotting Fake Bills",
  description: "Bad actors sometimes try to confuse you",
  actions: [
    { id: "manipulation", label: "🚨 This is a fake bill", type: "danger" },
    { id: "safe", label: "✅ Normal receipt", type: "primary" }
  ],
  challenges: [
    {
      id: "challenge-1",
      sender: "Geek Squad Support",
      body: "Thank you for your renewal",
      isManipulation: true,
      manipulationType: "Phantom Debt & Urgency",
      justInTimeHint: "Did you actually buy a tech support plan?"
    },
    {
      id: "challenge-2",
      sender: "Global Marketplace",
      body: "Order Confirmation",
      isManipulation: true,
      manipulationType: "Phantom Debt & Fear",
      justInTimeHint: "A huge purchase you didn't make"
    },
    {
      id: "challenge-3",
      sender: "Local Grocery Delivery",
      body: "Your groceries have been delivered",
      isManipulation: false,
      manipulationType: "None",
      justInTimeHint: "This looks like a standard receipt"
    }
  ],
  feedback: {
    gentleFailureMissedManipulation: { title: "A Perfect Learning Moment!", message: "Missed manipulation" },
    gentleFailureFlaggedSafe: { title: "Wonderful Caution!", message: "Flagged safe" },
    success: { title: "Brilliantly Done!", message: "Success" }
  }
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, ...rest }, ref) => {
        const props = { ...rest };
        delete props.initial;
        delete props.animate;
        delete props.exit;
        delete props.transition;
        return <div ref={ref} {...props}>{children}</div>;
      }),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

describe('V4PhantomDebt', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly', () => {
    render(<V4PhantomDebt />);
    expect(screen.getByText('Practice Spotting Fake Bills')).toBeInTheDocument();
    expect(screen.getByText(/Bad actors sometimes try to confuse you/)).toBeInTheDocument();
    expect(screen.getByText(/Geek Squad Support/)).toBeInTheDocument();
  });

  it('shows success feedback on correct manipulation flag', () => {
    render(<V4PhantomDebt />);
    fireEvent.click(screen.getByText('🚨 This is a fake bill'));
    expect(screen.getByText('Brilliantly Done!')).toBeInTheDocument();
  });

  it('shows failure feedback on incorrect safe flag', () => {
    render(<V4PhantomDebt />);
    fireEvent.click(screen.getByText('✅ Normal receipt'));
    expect(screen.getByText('A Perfect Learning Moment!')).toBeInTheDocument();
  });

  it('progresses to next challenge', () => {
    render(<V4PhantomDebt />);
    fireEvent.click(screen.getByText('🚨 This is a fake bill'));
    fireEvent.click(screen.getByText('Continue'));
    expect(screen.getByText(/Global Marketplace/)).toBeInTheDocument();
  });
});
