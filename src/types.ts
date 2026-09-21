export type Language = 'bn' | 'en';

export interface SlideItem {
  id: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  image: string;
  ctaTextEn?: string;
  ctaTextBn?: string;
  ctaLink?: string;
  active?: boolean;
  order?: number;
}

export interface NewsItem {
  id: string;
  textEn: string;
  textBn: string;
  category?: string;
  categoryEn?: string;
  categoryBn?: string;
  date?: string;
  published?: boolean;
  important?: boolean;
}

export interface ProductItem {
  id: string;
  nameEn: string;
  nameBn: string;
  descEn: string;
  descBn: string;
  image: string;
  category: 'electronics' | 'appliances' | 'motorcycle' | 'mobile' | 'furniture' | 'essentials' | 'consumer' | string;
  price: number;
  downPayment: number;
  months: number;
  monthly: number;
  badge?: string;
  featured?: boolean;
  inStock?: boolean;
  specificationsEn?: string[];
  specificationsBn?: string[];
}

export interface CustomerBenefitItem {
  id: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  iconName: string;
  order: number;
  active: boolean;
}

export interface TeamMemberItem {
  id: string;
  nameEn: string;
  nameBn: string;
  roleEn: string;
  roleBn: string;
  bioEn: string;
  bioBn: string;
  photo: string;
  type: 'chairman' | 'ceo' | 'management' | 'team';
  order: number;
  active: boolean;
}

export type DealerApplicationStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected';

export interface DealerApplication {
  id: string; // e.g. HNX-2026-000001
  fullName: string;
  fatherName: string;
  motherName: string;
  mobile: string;
  email?: string;
  occupation: string;
  address: string;
  dealerArea: string;
  photoUrl: string; // Mandatory
  nidUrl?: string;
  tradeLicenseUrl?: string;
  otherDocUrl?: string;
  status: DealerApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  agreedToTerms: boolean;
  adminNote?: string;
  adminPrivateNotes?: string; // Hidden from applicant
  publicMessage?: string; // Visible on status tracking
  smsNotified?: boolean;
  pushNotified?: boolean;
}

export interface DealerNotification {
  id: string;
  applicationId: string;
  recipientMobile: string;
  type: 'application_received' | 'under_review' | 'approved' | 'rejected' | 'doc_requested' | 'general';
  channel: 'sms' | 'push' | 'system';
  title: string;
  message: string;
  sentAt: string;
  status: 'sent' | 'pending' | 'failed';
  providerResponse?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  details: string;
  adminUser: string;
  timestamp: string;
}

export interface SiteSettings {
  companyNameBn: string;
  companyNameEn: string;
  taglineBn: string;
  taglineEn: string;
  phone: string;
  email: string;
  addressBn: string;
  addressEn: string;
  logoUrl?: string;
  facebookUrl: string;
  youtubeUrl: string;
  whatsappNumber: string;
  messengerUrl: string;
  fairPriceCardInfoBn: string;
  fairPriceCardInfoEn: string;
  installmentInfoBn: string;
  installmentInfoEn: string;
  dealerAgreementBn: string;
  dealerAgreementEn: string;
  dealerRulesBn: string;
  dealerRulesEn: string;
}

export type AdminRole = 'super_admin' | 'sub_admin';

export interface AdminPermissions {
  canManageApplications: boolean;
  canManageProducts: boolean;
  canManageNews: boolean;
  canManageSlides: boolean;
  canManageSettings: boolean;
  canManageAdmins: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: AdminRole;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive';
  permissions: AdminPermissions;
  createdAt: string;
  lastLogin?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}
