const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const API_URL = import.meta.env.VITE_BACKEND_URL;

export const config = {
  publishableKey: PUBLISHABLE_KEY,
  apiUrl: API_URL,
}
