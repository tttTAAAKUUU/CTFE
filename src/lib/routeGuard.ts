export function redirectBasedOnUser(user: any) {
  if (!user.emailVerified) {
    window.location.href = '/auth/verify-email';
    return;
  }

  if (!user.kycVerified) {
    window.location.href = '/kyc';
    return;
  }

  window.location.href = '/dashboard';
}
