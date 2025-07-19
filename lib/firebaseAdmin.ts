import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

const adminApp = getApps().length === 0
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApps()[0];

const adminAuth = getAuth(adminApp);

export { adminApp };

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