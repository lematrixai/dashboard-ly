# Firebase Authentication Setup Guide

## 🔐 Security Implementation

This dashboard now uses **enhanced security** with:
- **Middleware-based route protection**
- **Server actions** for authentication
- **Secure HTTP-only cookies**
- **Firebase Admin SDK** for server-side verification

## 📋 Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Firebase Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDes1sTdhL-MvFkpwdTTWzZN0udMZjy9Yo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=auth-441720.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=auth-441720
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=auth-441720.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=750264092727
NEXT_PUBLIC_FIREBASE_APP_ID=1:750264092727:web:d33fa34d0b81cd625497b2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-950H8ZTPBC

# Firebase Admin SDK (Private - Get from Firebase Console)
FIREBASE_PROJECT_ID=auth-441720
FIREBASE_CLIENT_EMAIL=your-service-account-email@auth-441720.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

## 🔧 Firebase Admin SDK Setup

### 1. Get Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `auth-441720`
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate new private key**
5. Download the JSON file

### 2. Extract Credentials
From the downloaded JSON file, extract:
- `client_email` → `FIREBASE_CLIENT_EMAIL`
- `private_key` → `FIREBASE_PRIVATE_KEY`

### 3. Update Environment Variables
Replace the placeholder values in `.env.local` with your actual credentials.

## 🛡️ Security Features

### Middleware Protection
- **Route-level security** at the server level
- **Automatic redirects** for unauthenticated users
- **Cookie-based authentication** verification

### Server Actions
- **Server-side authentication** handling
- **Secure cookie management**
- **Firebase Admin SDK** integration

### Cookie Security
- **HTTP-only cookies** (not accessible via JavaScript)
- **Secure flag** in production
- **SameSite protection**
- **Automatic expiration** (7 days)

## 🔄 Authentication Flow

1. **User signs in** → Firebase Auth handles authentication
2. **Server action** → Sets secure HTTP-only cookie
3. **Middleware** → Verifies cookie on each request
4. **Protected routes** → Only accessible with valid cookie
5. **Logout** → Clears cookie and redirects to sign-in

## 🚀 Usage

### Protected Routes
All routes under `/Dashboard`, `/destinations`, `/bookings`, `/posts`, `/users` are automatically protected.

### Authentication Context
```tsx
import { useAuth } from '@/contexts/auth-context'

function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Please sign in</div>
  }
  
  return <div>Welcome, {user?.displayName}!</div>
}
```

### Server Actions
```tsx
import { signOutAction } from '@/lib/auth-actions'

// In a server component or form action
await signOutAction()
```

## 🔒 Security Best Practices

1. **Never expose** Firebase Admin credentials in client code
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** in production
4. **Regular security audits** of your Firebase rules
5. **Monitor authentication** logs in Firebase Console

## 🐛 Troubleshooting

### Common Issues
1. **"Cannot find module 'firebase-admin'"** → Run `pnpm add firebase-admin`
2. **"Invalid private key"** → Ensure private key includes `\n` characters
3. **"Service account not found"** → Verify client email in Firebase Console

### Development vs Production
- **Development**: Uses HTTP cookies
- **Production**: Uses HTTPS-only cookies
- **Environment detection**: Automatic based on `NODE_ENV`

## 📚 Additional Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) 