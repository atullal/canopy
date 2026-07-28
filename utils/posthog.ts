import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init('phc_dummy_key_for_now', {
    api_host: 'https://app.posthog.com',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug();
    },
  });
}

export default posthog;
