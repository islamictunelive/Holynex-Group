/**
 * Drizzle ORM Schema definitions for Holynex Group Enterprise Ecosystem
 * Compatible with PostgreSQL and neon/supabase/RDS/Cloud SQL
 */

export interface DbAdminUser {
  id: string;
  username: string;
  passwordHash: string;
  role: 'super_admin' | 'manager' | 'operator';
  createdAt: string;
}

export interface DbDealerApplication {
  id: string; // e.g. HNX-2026-000001
  fullName: string;
  fatherName: string;
  motherName: string;
  mobile: string;
  email?: string;
  occupation: string;
  address: string;
  dealerArea: string;
  photoUrl: string;
  nidUrl?: string;
  tradeLicenseUrl?: string;
  otherDocUrl?: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  agreedToTerms: boolean;
  adminPrivateNotes?: string;
  publicMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbProduct {
  id: string;
  nameBn: string;
  nameEn: string;
  descBn: string;
  descEn: string;
  image: string;
  category: string;
  price: number;
  downPayment: number;
  months: number;
  monthly: number;
  badge?: string;
  featured: boolean;
  inStock: boolean;
  createdAt: string;
}

export interface DbSlider {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  image: string;
  ctaTextBn?: string;
  ctaTextEn?: string;
  ctaLink?: string;
  active: boolean;
  sortOrder: number;
}

export interface DbNews {
  id: string;
  textBn: string;
  textEn: string;
  categoryBn?: string;
  categoryEn?: string;
  published: boolean;
  important: boolean;
  publishedAt: string;
}

export interface DbTeamMember {
  id: string;
  nameBn: string;
  nameEn: string;
  roleBn: string;
  roleEn: string;
  bioBn: string;
  bioEn: string;
  photo: string;
  type: 'chairman' | 'ceo' | 'management' | 'team';
  sortOrder: number;
  active: boolean;
}

export interface DbCustomerBenefit {
  id: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  iconName: string;
  sortOrder: number;
  active: boolean;
}

export interface DbDealerNotification {
  id: string;
  applicationId: string;
  recipientMobile: string;
  type: string;
  channel: 'sms' | 'push' | 'system';
  title: string;
  message: string;
  status: 'sent' | 'pending' | 'failed';
  providerResponse?: string;
  sentAt: string;
}

export interface DbPushSubscription {
  id: string;
  applicationId?: string;
  endpoint: string;
  p256dhKey: string;
  authKey: string;
  createdAt: string;
}

export interface DbAuditLog {
  id: string;
  action: string;
  entity: string;
  details: string;
  adminUser: string;
  createdAt: string;
}

export interface DbSiteSettings {
  id: string;
  companyNameBn: string;
  companyNameEn: string;
  phone: string;
  email: string;
  addressBn: string;
  addressEn: string;
  facebookUrl: string;
  youtubeUrl: string;
  whatsappNumber: string;
  messengerUrl: string;
  updatedAt: string;
}
