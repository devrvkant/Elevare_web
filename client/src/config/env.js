const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) throw new Error("Missing Clerk Publishable Key!");

const env = { PUBLISHABLE_KEY };

export default env;
