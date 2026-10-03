import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';
import V4PhantomDebt from '../app/components/V4PhantomDebt';
import React from 'react';

expect.extend(toHaveNoViolations);

// Mock posthog
jest.mock('../utils/posthog', () => ({
  capture: jest.fn(),
}));

// Mock scenarioData
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
    }
  ],
  feedback: {
    gentleFailureMissedManipulation: { title: "A Perfect Learning Moment!", message: "Missed manipulation" },
    gentleFailureFlaggedSafe: { title: "Wonderful Caution!", message: "Flagged safe" },
    success: { title: "Brilliantly Done!", message: "Success" }
  }
}));

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, ...rest }: any, ref: any) => {
        const props = { ...rest };
        delete props.initial;
        delete props.animate;
        delete props.exit;
        delete props.transition;
        return <div ref={ref} {...props}>{children}</div>;
      }),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('Phantom Debt A11y', () => {
  it('should have no a11y violations', async () => {
    const { container } = render(<V4PhantomDebt />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
