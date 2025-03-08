import { PaymentInfo } from '@/types/payment';
import { Role } from '@/types/role';

export type UserDocument = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  payment_info: PaymentInfo;
  organization_id: string | null;
  chapter_id: string | null;
  invite_code: string | null;
  signup_complete: boolean;
};

export type User = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  paymentInfo: PaymentInfo;
  organizationId: string | null;
  chapterId: string | null;
  inviteCode: string | null;
  signupComplete: boolean;
  organizationName?: string;
  chapterName?: string;
};
