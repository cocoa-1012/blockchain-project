export enum SocialVerifService {
  TWITTER = 'TWITTER',
  INSTAGRAM = 'INSTAGRAM',
}

export enum SocialVerifStatus {
  USERNAME_IN_USE = 'USERNAME_IN_USE',
}

export enum ServiceName {
  TWITTER = 'Twitter',
  INSTAGRAM = 'Instagram',
}

export default interface SocialVerification {
  id: string;
  user: string; // MetaMask public key
  socialVerificationURL: string;
  lastCheckedAt: string;
  expiresAt: string;
  updatedAt: string;
  createdAt: string;
  service: SocialVerifService;
  isValid: boolean;
  userId: string; // Twitter/Instagram id that remains the same
  verificationText: string;
  username: string; // Twitter/Instagram username
  failedReason: string;
  status: SocialVerifStatus;
}
