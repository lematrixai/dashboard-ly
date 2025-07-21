'use server';

import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Check if service account key exists
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required');
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} catch (error: any) {
  throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY: Must be valid JSON');
}

const adminApp = getApps().length === 0
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApps()[0];

const adminAuth = getAuth(adminApp);

// Don't export adminApp from a "use server" file
// export { adminApp };

export async function resetUserPassword(email: string, newPassword: string) {
  try {
    const userRecord = await adminAuth.getUserByEmail(email);
    await adminAuth.updateUser(userRecord.uid, {
      password: newPassword,
    });
    return {
      success: true,
      message: 'Password reset successfully'
    };
  } catch (error: any) {
    console.error('Reset password error:', error);
    return {
      success: false,
      message: error.message || 'Failed to reset password'
    };
  }
}

export async function getUserByEmail(email: string) {
  try {
    const userRecord = await adminAuth.getUserByEmail(email);
    return {
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL
      }
    };
  } catch (error: any) {
    console.error('Get user by email error:', error);
    return {
      success: false,
      message: error.message || 'Failed to get user'
    };
  }
}