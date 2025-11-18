# Firebase Auth Production Setup Guide

## ✅ Completed Steps

1. **Environment Variables**: Added Firebase config to `/client/.env`
2. **Firebase Config**: Updated to use environment variables
3. **Git Configuration**: `.env` file is now tracked (Firebase keys are public-safe)

## 🔧 Firebase Console Configuration Required

You need to configure your Firebase project to allow authentication from your production domains:

### Step 1: Add Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **elevare-1881d**
3. Navigate to: **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain** and add:
   - Your Azure Static Web App domain (e.g., `your-app.azurestaticapps.net`)
   - Your custom domain if you have one (e.g., `elevare.jangir.me`)
   - Keep `localhost` for local development

### Step 2: Configure OAuth Redirect URIs (for Google Sign-In)

1. In Firebase Console: **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Verify the OAuth redirect URIs include your production domain
4. The redirect URI format: `https://your-domain.com/__/auth/handler`

### Step 3: Update Google Cloud Console (if using Google OAuth)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to: **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID (linked to Firebase)
5. Under **Authorized JavaScript origins**, add:
   - `https://your-app.azurestaticapps.net`
   - `https://elevare.jangir.me` (if custom domain)
6. Under **Authorized redirect URIs**, add:
   - `https://your-app.azurestaticapps.net/__/auth/handler`
   - `https://elevare.jangir.me/__/auth/handler`

## 🚀 Deployment Checklist

### Azure Static Web Apps Configuration

When deploying to Azure, the `.env` file variables are automatically picked up by Vite during build time.

**No additional Azure configuration needed** because:
- Firebase API keys are public (designed to be exposed in client-side code)
- The `.env` file is committed to your repository
- Vite will bundle these values during `npm run build`

### CORS Configuration on Backend

Make sure your backend server allows requests from your production frontend:

```javascript
// server/src/index.js
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-app.azurestaticapps.net',
    'https://elevare.jangir.me'
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

## 🔒 Security Notes

### Why Firebase Keys Can Be Public

- **API Key**: Not a security secret - Firebase uses it for routing
- **Auth Domain**: Public by design
- **Project ID**: Public identifier
- **Security Rules**: Enforced on the backend by Firebase Security Rules

### What Should Stay Secret

- Server-side Firebase Admin SDK keys (if you use them)
- Database connection strings (MongoDB)
- API keys for third-party services (Gemini AI, etc.)

These should be in `server/.env` (which is gitignored).

## 🧪 Testing Production Build Locally

Before deploying, test your production build:

```bash
cd client
npm run build
npm run preview
```

This will:
1. Build using the `.env` file
2. Serve the production build locally
3. Verify Firebase Auth works with environment variables

## 📝 Environment Files Summary

- **`client/.env`**: Production config (committed to Git)
- **`client/.env.local`**: Local development overrides (gitignored)
- **`server/.env`**: Server secrets (gitignored, never commit!)

## 🎯 Next Steps

1. ✅ Commit the updated `.env` and `.gitignore` files
2. 🔧 Configure Firebase Console authorized domains
3. 🔧 Update Google Cloud Console OAuth settings
4. 🚀 Deploy to Azure Static Web Apps
5. 🧪 Test authentication on production domain

## 🆘 Troubleshooting

### Error: "auth/unauthorized-domain"
- **Cause**: Domain not added to Firebase authorized domains
- **Fix**: Add your production domain in Firebase Console → Authentication → Settings

### Error: "redirect_uri_mismatch" (Google OAuth)
- **Cause**: Redirect URI not configured in Google Cloud Console
- **Fix**: Add `https://your-domain.com/__/auth/handler` to OAuth client

### Firebase not initializing
- **Cause**: Environment variables not loaded
- **Fix**: Verify `.env` file exists and variables start with `VITE_`
