// Backend configuration.
//
// Set EXPO_PUBLIC_API_BASE_URL (e.g. in a `.env` file) to switch the app from
// the built-in mock API to a real backend. Leave it empty to run the demo.
//   EXPO_PUBLIC_API_BASE_URL=https://api.example.com/v1
//
// Optional: EXPO_PUBLIC_MOCK_FAILURE_RATE=0 disables the simulated random
// failures used by the mock API (default 0.2, so error states can be shown).

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

export const USE_MOCK_API = API_BASE_URL === '';

export const REQUEST_TIMEOUT_MS = 10000;

const parsedFailureRate = Number(process.env.EXPO_PUBLIC_MOCK_FAILURE_RATE);

export const MOCK_FAILURE_RATE =
  process.env.EXPO_PUBLIC_MOCK_FAILURE_RATE !== undefined &&
  Number.isFinite(parsedFailureRate) &&
  parsedFailureRate >= 0 &&
  parsedFailureRate <= 1
    ? parsedFailureRate
    : 0.2;
