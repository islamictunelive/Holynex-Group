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

// Master Network People Hierarchy:
// Admin -> Dealer -> Sub-Dealer -> Worker -> Representative -> Customer
export type PersonRole = 'dealer' | 'sub_dealer' | 'worker' | 'representative' | 'customer';

export interface NetworkPerson {
  id: string; // e.g. DLR-000123, SUB-000201, WRK-000301, REP-000401, CUS-000501
  role: PersonRole;
  name: string;
  mobile: string;
  email?: string;
  address: string;
  area: string;
  parentDealerId?: string;
  parentSubDealerId?: string;
  parentWorkerId?: string;
  parentRepresentativeId?: string;
  status: 'active' | 'suspended' | 'pending';
  photoUrl?: string;
  nid?: string;
  tradeLicense?: string;
  joinedDate: string;
  commissionBalance: number;
  totalCommissionEarned: number;
  password?: string;
  passwordHash?: string;
  lastLogin?: string;
  loginAttempts?: number;
}

export interface PortalUserSession {
  id: string;
  role: PersonRole;
  name: string;
  mobile: string;
  email?: string;
  area?: string;
  photoUrl?: string;
  token: string;
  loginTime: string;
}

export interface CustomerPaymentRecord {
  id: string;
  customerId: string;
  cardNumber: string;
  amount: number;
  type: 'card_fee' | 'installment' | 'product_staple';
  method: 'bKash' | 'Nagad' | 'Bank Deposit' | 'Cash at Counter';
  transactionReference: string;
  status: 'verified' | 'pending' | 'rejected';
  date: string;
  notes?: string;
}

export interface FairPriceCardRecord {
  id: string;
  cardNumber: string; // e.g. FPC-2026-8899
  customerId: string;
  customerName: string;
  customerMobile: string;
  representativeId: string;
  representativeName: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'blocked' | 'expired' | 'pending_payment';
  cardFee: number;
  paidFee: number;
  remainingFee: number;
  monthlyQuotaKg: number;
}

export interface ProductScheduleItem {
  id: string;
  scheduleCode: string; // e.g. SCH-2026-101
  customerId: string;
  customerName: string;
  customerMobile: string;
  cardNumber: string;
  productNameBn: string;
  productNameEn: string;
  quantity: string; // e.g. ১০ কেজি
  allocatedPrice: number; // e.g. 700
  retailPrice: number; // e.g. 950
  subsidySavings: number; // e.g. 250
  scheduledDate: string; // e.g. 2026-10-10
  status: 'Scheduled' | 'Ready for Pickup' | 'Delivered' | 'Skipped';
  deliveryPoint: string;
  representativeId: string;
}

export interface OrderRecord {
  id: string; // e.g. ORD-1002
  type: 'fair_price_staple' | 'installment_appliance';
  customerName: string;
  customerMobile: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  date: string;
  deliveryPerson: string;
}

export interface DeliveryRecord {
  id: string; // e.g. DEL-501
  orderId: string;
  recipientName: string;
  recipientMobile: string;
  address: string;
  productDetails: string;
  deliveryDate: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  assignedRepresentative: string;
  otpVerified: boolean;
}

export interface CommissionRecord {
  id: string; // e.g. COM-770
  recipientId: string;
  recipientName: string;
  recipientRole: 'dealer' | 'sub_dealer' | 'worker' | 'representative';
  sourceEvent: string;
  sourceReferenceId: string;
  amount: number;
  ratePercentage?: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  createdAt: string;
  paidAt?: string;
}

export interface WithdrawalRequest {
  id: string; // e.g. WTH-330
  requesterId: string;
  requesterName: string;
  requesterRole: 'dealer' | 'sub_dealer' | 'worker' | 'representative';
  amount: number;
  payoutMethod: 'bKash' | 'Nagad' | 'Bank Transfer';
  payoutDetails: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  adminNote?: string;
}

export interface CommissionRule {
  id: string;
  role: 'dealer' | 'sub_dealer' | 'worker' | 'representative';
  eventName: string;
  rewardType: 'flat' | 'percentage';
  amount: number;
  description: string;
  active: boolean;
}

export interface SmsCampaign {
  id: string;
  title: string;
  targetGroup: 'all_dealers' | 'all_reps' | 'all_customers' | 'selected';
  message: string;
  recipientsCount: number;
  channel: 'sms' | 'push' | 'in_app';
  status: 'sent' | 'scheduled' | 'draft';
  sentAt: string;
}

export interface AIKnowledgeItem {
  id: string;
  category: 'general' | 'fair_price_card' | 'installments' | 'dealer' | 'products' | 'contact' | 'policy';
  questionBn: string;
  questionEn: string;
  answerBn: string;
  answerEn: string;
  keywords: string[];
  active: boolean;
  priority?: number;
  updatedAt: string;
}

export interface AISettings {
  enabled: boolean;
  assistantNameBn: string;
  assistantNameEn: string;
  welcomeMessageBn: string;
  welcomeMessageEn: string;
  tone: 'professional' | 'friendly' | 'concise';
  systemPersonaBn?: string;
  systemPersonaEn?: string;
  fallbackMessageBn: string;
  fallbackMessageEn: string;
  supportPhone: string;
  supportWhatsapp: string;
  supportEmail: string;
  supportHoursBn: string;
  supportHoursEn: string;
  enableCustomerLookup: boolean;
  enableDealerLookup: boolean;
  maxDailyRequestsPerIp: number;
}

export interface AIChatQueryLog {
  id: string;
  timestamp: string;
  query: string;
  replySnippet: string;
  lang: 'bn' | 'en';
  status: 'answered_ai' | 'answered_kb' | 'lookup_success' | 'escalated' | 'fallback';
  confidence?: 'high' | 'medium' | 'low';
  category?: string;
  ip?: string;
  hasLookup?: boolean;
}

export interface AIChatAnalytics {
  totalConversations: number;
  totalMessages: number;
  answeredByAI: number;
  answeredByKnowledgeBase: number;
  escalatedToHuman: number;
  banglaPercentage: number;
  englishPercentage: number;
  topQueries: { query: string; count: number; category: string }[];
  recentLogs: AIChatQueryLog[];
}

