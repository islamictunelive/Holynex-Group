import {
  AdminUser,
  AuditLog,
  CustomerBenefitItem,
  DealerApplication,
  DealerNotification,
  NewsItem,
  ProductItem,
  SiteSettings,
  SlideItem,
  TeamMemberItem,
  NetworkPerson,
  FairPriceCardRecord,
  ProductScheduleItem,
  OrderRecord,
  DeliveryRecord,
  CommissionRecord,
  WithdrawalRequest,
  CommissionRule,
  SmsCampaign,
  AIKnowledgeItem,
  AISettings,
  AIChatAnalytics,
  AIChatQueryLog,
  PortalUserSession,
  CustomerPaymentRecord,
} from '../types';
import {
  initialAdminUsers,
  initialBenefits,
  initialNews,
  initialProducts,
  initialSiteSettings,
  initialSlides,
  initialTeam,
  initialNetworkPeople,
  initialFairPriceCards,
  initialProductSchedules,
  initialOrders,
  initialDeliveries,
  initialCommissions,
  initialWithdrawals,
  initialCommissionRules,
  initialSmsCampaigns,
  initialCustomerPayments,
} from './data';
import {
  initialAISettings,
  initialAIKnowledge,
  initialAIChatAnalytics,
} from './aiData';

// Helper to safely get / set localStorage with SSR guard
function getLocalItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error', e);
  }
}

// Initial demo dealer applications to make the review dashboard and status check immediately rich and verifiable
const sampleApplications: DealerApplication[] = [
  {
    id: 'HNX-2026-000101',
    fullName: 'মোঃ কামাল হোসেন',
    fatherName: 'মরহুম আব্দুল খালেক',
    motherName: 'রাবেয়া বেগম',
    mobile: '01711223344',
    email: 'kamal.dealer@example.com',
    occupation: 'ব্যবসা (ইলেকট্রনিক্স শো-রুম)',
    address: 'দোকান নং ১২, সুপার মার্কেট, সাভার বাসস্ট্যান্ড, ঢাকা',
    dealerArea: 'সাভার ও ধামরাই থানা',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    nidUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    tradeLicenseUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80',
    status: 'Approved',
    submittedAt: '2026-03-10T10:30:00Z',
    updatedAt: '2026-03-12T14:15:00Z',
    agreedToTerms: true,
    adminPrivateNotes: 'ট্রেড লাইসেন্স ও শোরুম ভেরিফিকেশন সম্পন্ন হয়েছে। জামানত ব্যাংক ড্রাফট গৃহীত হয়েছে।',
    publicMessage: 'অভিনন্দন! আপনার ডিলারশিপ আবেদন অনুমোদিত হয়েছে। প্রধান কার্যালয় থেকে শীঘ্রই কিট পাঠানো হবে।',
    smsNotified: true,
    pushNotified: true,
  },
  {
    id: 'HNX-2026-000102',
    fullName: 'মোছাঃ নাসরিন আক্তার',
    fatherName: 'মোঃ গোলাম মোস্তফা',
    motherName: 'জাহানারা বেগম',
    mobile: '01899887766',
    email: 'nasrin.ctg@example.com',
    occupation: 'উদ্যোক্তা (ফার্নিচার প্রস্তুতকারক)',
    address: 'প্লট ৪৪, চকবাজার রোড, কোতোয়ালী, চট্টগ্রাম',
    dealerArea: 'কোতোয়ালী ও পাঁচলাইশ, চট্টগ্রাম',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    status: 'Under Review',
    submittedAt: '2026-03-17T09:10:00Z',
    updatedAt: '2026-03-18T11:20:00Z',
    agreedToTerms: true,
    adminPrivateNotes: 'ফিল্ড অফিসার সরেজমিনে দোকান পরিদর্শন করছেন। আগামী সোমবারে চূড়ান্ত সিদ্ধান্ত।',
    publicMessage: 'আপনার আবেদনটি বর্তমানে ফিল্ড ইন্সপেকশন পর্যায়ে রয়েছে। অনুগ্রহ করে ফোন সচল রাখুন।',
    smsNotified: true,
    pushNotified: false,
  },
  {
    id: 'HNX-2026-000103',
    fullName: 'শেখ মোঃ তানভীর হাসান',
    fatherName: 'শেখ জসিম উদ্দিন',
    motherName: 'বিলকিস বানু',
    mobile: '01955443322',
    email: 'tanvir.khulna@example.com',
    occupation: 'মোটরসাইকেল স্পেয়ার পার্টস ব্যবসায়ী',
    address: 'ডাকবাংলো মোড়, খুলনা সদর, খুলনা',
    dealerArea: 'খুলনা সদর ও দৌলতপুর',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    status: 'Pending',
    submittedAt: '2026-03-20T08:00:00Z',
    updatedAt: '2026-03-20T08:00:00Z',
    agreedToTerms: true,
    publicMessage: 'আপনার আবেদনপত্র গৃহীত হয়েছে। যাচাই-বাছাই প্রক্রিয়া শুরু হলে অবগত করা হবে।',
    smsNotified: true,
    pushNotified: false,
  },
];

const sampleNotifications: DealerNotification[] = [
  {
    id: 'notif-1',
    applicationId: 'HNX-2026-000101',
    recipientMobile: '01711223344',
    type: 'approved',
    channel: 'sms',
    title: 'ডিলারশিপ অনুমোদন কনফার্মেশন',
    message: 'হোলিনেক্স গ্রুপ: প্রিয় আবেদনকারী, আপনার ডিলারশিপ আবেদন HNX-2026-000101 অনুমোদিত হয়েছে। বিস্তারিত তথ্যের জন্য যোগাযোগ করুন: 01307835260',
    sentAt: '2026-03-12T14:16:00Z',
    status: 'sent',
    providerResponse: 'DELIVERED_STATUS_OK',
  },
  {
    id: 'notif-2',
    applicationId: 'HNX-2026-000102',
    recipientMobile: '01899887766',
    type: 'under_review',
    channel: 'sms',
    title: 'আবেদন পর্যালোচনা নোটিশ',
    message: 'হোলিনেক্স গ্রুপ: আপনার আবেদন HNX-2026-000102 পর্যালোচনার জন্য গৃহীত হয়েছে। স্ট্যাটাস চেক লিংক: /status',
    sentAt: '2026-03-18T11:21:00Z',
    status: 'sent',
    providerResponse: 'DELIVERED_STATUS_OK',
  },
];

const sampleAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    action: 'SYSTEM_INITIALIZED',
    entity: 'SYSTEM',
    details: 'Holynex Group corporate ecosystem initialized with production seed data.',
    adminUser: 'SYSTEM_ADMIN',
    timestamp: '2026-03-20T00:00:00Z',
  },
  {
    id: 'log-2',
    action: 'DEALER_STATUS_UPDATED',
    entity: 'DEALER_APP',
    details: 'Application HNX-2026-000101 status updated to Approved.',
    adminUser: 'SuperAdmin',
    timestamp: '2026-03-12T14:15:00Z',
  },
];

// Unified Storage API
export const Storage = {
  // Applications
  getApplications: (): DealerApplication[] => {
    return getLocalItem<DealerApplication[]>('holynex_applications', sampleApplications);
  },

  saveApplication: (appData: Omit<DealerApplication, 'id' | 'status' | 'submittedAt' | 'updatedAt'>): DealerApplication => {
    const existing = Storage.getApplications();
    const count = existing.length + 104;
    const pad = String(count).padStart(6, '0');
    const newId = `HNX-2026-${pad}`;

    const newApp: DealerApplication = {
      ...appData,
      id: newId,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publicMessage: 'আপনার আবেদনপত্র সফলভাবে গৃহীত হয়েছে। আমাদের প্রধান কার্যালয় কর্তৃক কাগজপত্র যাচাই-বাছাই করা হচ্ছে।',
      smsNotified: true,
      pushNotified: false,
    };

    const updated = [newApp, ...existing];
    setLocalItem('holynex_applications', updated);

    // Record audit log
    Storage.addAuditLog('NEW_DEALER_APPLICATION', 'DEALER_APP', `New application submitted by ${newApp.fullName} (${newApp.mobile}) for ${newApp.dealerArea}`);

    // Create automated reception notification
    Storage.createNotification({
      applicationId: newApp.id,
      recipientMobile: newApp.mobile,
      type: 'application_received',
      channel: 'sms',
      title: 'আবেদন গ্রহণ নিশ্চিতকরণ',
      message: `হোলিনেক্স গ্রুপ: আপনার ডিলারশিপ আবেদন সফল হয়েছে। ট্র্যাকিং আইডি: ${newApp.id}। স্ট্যাটাস চেক করতে আমাদের ওয়েবসাইটে ভিজিট করুন। ফোন: 01307835260`,
      status: 'sent',
      providerResponse: 'SMS_GATEWAY_SUCCESS_200',
    });

    return newApp;
  },

  findApplication: (id: string, mobile: string): DealerApplication | null => {
    const apps = Storage.getApplications();
    const cleanId = id.trim().toUpperCase();
    const cleanMobile = mobile.trim().replace(/[^0-9]/g, '');

    const found = apps.find((a) => {
      const matchId = a.id.toUpperCase() === cleanId;
      const aMobile = a.mobile.replace(/[^0-9]/g, '');
      const matchMobile = aMobile.endsWith(cleanMobile.slice(-10)) || aMobile === cleanMobile;
      return matchId && matchMobile;
    });

    return found || null;
  },

  updateApplicationStatus: (
    id: string,
    status: DealerApplication['status'],
    adminPrivateNotes?: string,
    publicMessage?: string,
    notifySms = true
  ): DealerApplication | null => {
    const apps = Storage.getApplications();
    const index = apps.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const current = apps[index];
    const defaultApprovalMsg = `অভিনন্দন! আপনার হোলিনেক্স ডিলারশিপ আবেদন সফলভাবে অনুমোদিত হয়েছে। আপনার ডিলার আইডি: DLR-${id.replace('HNX-2026-', '')}। অফিসিয়াল ডিলার সার্টিফিকেট ও কিট গ্রহণের জন্য যোগাযোগ করুন: 01307835260`;
    const resolvedPublicMsg =
      publicMessage !== undefined && publicMessage.trim() !== ''
        ? publicMessage
        : status === 'Approved'
        ? defaultApprovalMsg
        : status === 'Rejected'
        ? 'দুঃখিত, আপনার ডিলার আবেদনটি এই মুহূর্তে নীতিমালার সাথে সামঞ্জস্যপূর্ণ না হওয়ায় গ্রহণ করা সম্ভব হয়নি।'
        : current.publicMessage;

    const updated: DealerApplication = {
      ...current,
      status,
      updatedAt: new Date().toISOString(),
      adminPrivateNotes: adminPrivateNotes !== undefined ? adminPrivateNotes : current.adminPrivateNotes,
      publicMessage: resolvedPublicMsg,
      smsNotified: notifySms ? true : current.smsNotified,
    };

    apps[index] = updated;
    setLocalItem('holynex_applications', apps);

    Storage.addAuditLog(
      'DEALER_STATUS_CHANGE',
      'DEALER_APP',
      `Application ${id} (${current.fullName}) status updated to ${status}.`
    );

    if (notifySms) {
      Storage.createNotification({
        applicationId: id,
        recipientMobile: current.mobile,
        type: status === 'Approved' ? 'approved' : status === 'Rejected' ? 'rejected' : 'under_review',
        channel: 'sms',
        title: `স্ট্যাটাস আপডেট: ${status}`,
        message: resolvedPublicMsg || `হোলিনেক্স গ্রুপ নোটিশ: আপনার আবেদন ${id}-এর অবস্থা বর্তমানে '${status}'।`,
        status: 'sent',
        providerResponse: 'GATEWAY_DELIVERED_OK',
      });
    }

    return updated;
  },

  sendMessageToDealer: (
    id: string,
    message: string,
    channel: 'sms' | 'push' | 'system' = 'sms',
    title = 'হোলিনেক্স ডিলার বার্তা'
  ): { success: boolean; notification?: DealerNotification; error?: string } => {
    const apps = Storage.getApplications();
    const app = apps.find((a) => a.id === id);
    if (!app) return { success: false, error: 'ডিলার আবেদন পাওয়া যায়নি' };

    const notif = Storage.createNotification({
      applicationId: id,
      recipientMobile: app.mobile,
      type: 'general',
      channel,
      title,
      message,
      status: 'sent',
      providerResponse: 'SMS_SENT_CONFIRMED',
    });

    app.publicMessage = message;
    app.updatedAt = new Date().toISOString();
    app.smsNotified = true;
    setLocalItem('holynex_applications', apps);

    Storage.addAuditLog(
      'DEALER_DIRECT_MESSAGE',
      'DEALER_APP',
      `Direct message sent to ${app.fullName} (${app.mobile}): "${message.slice(0, 45)}..."`
    );
    return { success: true, notification: notif };
  },

  // Products
  getProducts: (): ProductItem[] => {
    const stored = getLocalItem<ProductItem[]>('holynex_products', initialProducts);
    // Ensure official terminology is preserved on existing stored products if they have old terminology
    let modified = false;
    const updated = stored.map((p) => {
      // If it's one of the canonical products, ensure official terminology
      if (p.id === 'prod-7' && p.nameBn.includes('চাল')) {
        modified = true;
        return {
          ...p,
          nameBn: p.nameBn.replace(/চাল/g, 'চাউল'),
          descBn: p.descBn.replace(/চাল/g, 'চাউল'),
          specificationsBn: p.specificationsBn?.map((s) => s.replace(/চাল/g, 'চাউল')),
        };
      }
      if (p.id === 'prod-8' && p.nameBn.includes('তেল')) {
        modified = true;
        return {
          ...p,
          nameBn: p.nameBn.replace(/তেল/g, 'তৈল'),
          descBn: p.descBn.replace(/তেল/g, 'তৈল'),
        };
      }
      if (p.id === 'prod-11' && p.descBn?.includes('চাল')) {
        modified = true;
        return {
          ...p,
          descBn: p.descBn.replace(/চাল/g, 'চাউল'),
        };
      }
      if (p.id === 'prod-12' && p.descBn?.includes('তেল')) {
        modified = true;
        return {
          ...p,
          descBn: p.descBn.replace(/তেল/g, 'তৈল'),
          specificationsBn: p.specificationsBn?.map((s) => s.replace(/তেল/g, 'তৈল')),
        };
      }
      return p;
    });

    // Automatically merge any newly added initial products (such as consumer goods items)
    const missing = initialProducts.filter((p) => !updated.some((s) => s.id === p.id));
    if (missing.length > 0 || modified) {
      const merged = [...updated, ...missing];
      setLocalItem('holynex_products', merged);
      return merged;
    }
    return updated;
  },

  saveProducts: (products: ProductItem[]): void => {
    setLocalItem('holynex_products', products);
  },

  saveProduct: (product: ProductItem): void => {
    const list = Storage.getProducts();
    const idx = list.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      list[idx] = product;
    } else {
      list.unshift(product);
    }
    setLocalItem('holynex_products', list);
    Storage.addAuditLog('SAVE_PRODUCT', 'PRODUCT', `Product ${product.nameEn || product.nameBn} saved.`);
  },

  deleteProduct: (id: string): void => {
    const list = Storage.getProducts().filter((p) => p.id !== id);
    setLocalItem('holynex_products', list);
    Storage.addAuditLog('DELETE_PRODUCT', 'PRODUCT', `Product ${id} deleted.`);
  },

  // News
  getNews: (): NewsItem[] => {
    return getLocalItem<NewsItem[]>('holynex_news', initialNews);
  },

  saveNews: (news: NewsItem[]): void => {
    setLocalItem('holynex_news', news);
  },

  saveNewsItem: (item: NewsItem): void => {
    const list = Storage.getNews();
    const idx = list.findIndex((n) => n.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    setLocalItem('holynex_news', list);
    Storage.addAuditLog('SAVE_NEWS', 'NEWS', `News notice ${item.id} published/updated.`);
  },

  deleteNewsItem: (id: string): void => {
    const list = Storage.getNews().filter((n) => n.id !== id);
    setLocalItem('holynex_news', list);
    Storage.addAuditLog('DELETE_NEWS', 'NEWS', `News notice ${id} deleted.`);
  },

  // Slides
  getSlides: (): SlideItem[] => {
    return getLocalItem<SlideItem[]>('holynex_slides', initialSlides);
  },

  saveSlides: (slides: SlideItem[]): void => {
    setLocalItem('holynex_slides', slides);
  },

  saveSlide: (slide: SlideItem): void => {
    const list = Storage.getSlides();
    const idx = list.findIndex((s) => s.id === slide.id);
    if (idx >= 0) {
      list[idx] = slide;
    } else {
      list.push(slide);
    }
    setLocalItem('holynex_slides', list);
    Storage.addAuditLog('SAVE_SLIDE', 'SLIDE', `Slide '${slide.titleBn || slide.titleEn}' saved.`);
  },

  deleteSlide: (id: string): void => {
    const list = Storage.getSlides().filter((s) => s.id !== id);
    setLocalItem('holynex_slides', list);
    Storage.addAuditLog('DELETE_SLIDE', 'SLIDE', `Slide ${id} deleted.`);
  },

  // Admin & Sub-Admin Users
  getAdminUsers: (): AdminUser[] => {
    return getLocalItem<AdminUser[]>('holynex_admin_users', initialAdminUsers);
  },

  saveAdminUser: (user: AdminUser): void => {
    const users = Storage.getAdminUsers();
    const idx = users.findIndex((u) => u.id === user.id || u.username.toLowerCase() === user.username.toLowerCase());
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...user };
    } else {
      users.push(user);
    }
    setLocalItem('holynex_admin_users', users);
    Storage.addAuditLog('SAVE_ADMIN_USER', 'AUTH', `User ${user.username} (${user.role}) saved.`);
  },

  deleteAdminUser: (id: string): boolean => {
    const users = Storage.getAdminUsers();
    const target = users.find((u) => u.id === id);
    if (target?.role === 'super_admin' && users.filter((u) => u.role === 'super_admin').length <= 1) {
      return false; // Prevent deleting last super admin
    }
    const updated = users.filter((u) => u.id !== id);
    setLocalItem('holynex_admin_users', updated);
    Storage.addAuditLog('DELETE_ADMIN_USER', 'AUTH', `Admin user ${id} removed.`);
    return true;
  },

  getCurrentAdminUser: (): AdminUser | null => {
    return getLocalItem<AdminUser | null>('holynex_current_admin', null);
  },

  setCurrentAdminUser: (user: AdminUser | null): void => {
    setLocalItem('holynex_current_admin', user);
  },

  authenticate: (username: string, pass: string): { success: boolean; user?: AdminUser; error?: string } => {
    const users = Storage.getAdminUsers();
    const cleanUser = username.trim().toLowerCase();
    const user = users.find(
      (u) => u.username.toLowerCase() === cleanUser || (cleanUser === 'admin' && u.role === 'super_admin')
    );

    if (!user) {
      // Fallback for root password if entered directly as admin
      if ((cleanUser === 'admin' || !cleanUser) && (pass === 'holynex@admin2026' || pass === 'HolynexAdmin2026!' || pass === 'admin')) {
        const rootAdmin = users.find((u) => u.role === 'super_admin') || initialAdminUsers[0];
        Storage.setCurrentAdminUser(rootAdmin);
        Storage.addAuditLog('ADMIN_LOGIN', 'AUTH', `SuperAdmin logged in via root credentials.`, rootAdmin.name);
        return { success: true, user: rootAdmin };
      }
      return { success: false, error: 'ইউজারনেম পাওয়া যায়নি (Username not found)' };
    }

    if (user.status !== 'active') {
      return { success: false, error: 'এই অ্যাকাউন্টটি নিষ্ক্রিয় রাখা হয়েছে। প্রধান অ্যাডমিনের সাথে যোগাযোগ করুন।' };
    }

    // Check password
    const valid = user.password === pass || (user.role === 'super_admin' && (pass === 'holynex@admin2026' || pass === 'HolynexAdmin2026!'));
    if (!valid) {
      return { success: false, error: 'ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড লিখুন।' };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    Storage.saveAdminUser(user);
    Storage.setCurrentAdminUser(user);
    Storage.addAuditLog('ADMIN_LOGIN', 'AUTH', `${user.name} (${user.role}) logged in successfully.`, user.name);

    return { success: true, user };
  },

  // Benefits
  getBenefits: (): CustomerBenefitItem[] => {
    return getLocalItem<CustomerBenefitItem[]>('holynex_benefits', initialBenefits);
  },

  saveBenefits: (benefits: CustomerBenefitItem[]): void => {
    setLocalItem('holynex_benefits', benefits);
  },

  // Team
  getTeam: (): TeamMemberItem[] => {
    return getLocalItem<TeamMemberItem[]>('holynex_team', initialTeam);
  },

  saveTeam: (team: TeamMemberItem[]): void => {
    setLocalItem('holynex_team', team);
  },

  // Settings
  getSettings: (): SiteSettings => {
    return getLocalItem<SiteSettings>('holynex_settings', initialSiteSettings);
  },

  saveSettings: (settings: SiteSettings): void => {
    setLocalItem('holynex_settings', settings);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('holynex_settings_updated', { detail: settings }));
    }
    Storage.addAuditLog('SITE_SETTINGS_SAVED', 'SETTINGS', 'Corporate site configuration and contact details updated.');
  },

  // Notifications
  getNotifications: (): DealerNotification[] => {
    return getLocalItem<DealerNotification[]>('holynex_notifications', sampleNotifications);
  },

  createNotification: (notifData: Omit<DealerNotification, 'id' | 'sentAt'>): DealerNotification => {
    const list = Storage.getNotifications();
    const newNotif: DealerNotification = {
      ...notifData,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sentAt: new Date().toISOString(),
    };
    const updated = [newNotif, ...list];
    setLocalItem('holynex_notifications', updated);
    return newNotif;
  },

  // Audit Logs
  getAuditLogs: (): AuditLog[] => {
    return getLocalItem<AuditLog[]>('holynex_audit_logs', sampleAuditLogs);
  },

  addAuditLog: (action: string, entity: string, details: string, adminUser = 'Admin'): void => {
    const logs = Storage.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      entity,
      details,
      adminUser,
      timestamp: new Date().toISOString(),
    };
    setLocalItem('holynex_audit_logs', [newLog, ...logs.slice(0, 99)]);
  },

  // Master Network People: Dealers, Sub-Dealers, Workers, Representatives, Customers
  getNetworkPeople: (): NetworkPerson[] => {
    return getLocalItem<NetworkPerson[]>('holynex_network_people', initialNetworkPeople);
  },

  saveNetworkPerson: (person: NetworkPerson): void => {
    const list = Storage.getNetworkPeople();
    const existingIdx = list.findIndex((p) => p.id === person.id);
    let updated: NetworkPerson[];
    if (existingIdx >= 0) {
      updated = [...list];
      updated[existingIdx] = person;
    } else {
      updated = [person, ...list];
    }
    setLocalItem('holynex_network_people', updated);
    Storage.addAuditLog(
      existingIdx >= 0 ? 'UPDATE_PERSON' : 'CREATE_PERSON',
      person.role.toUpperCase(),
      `${person.name} (${person.id}) saved with role ${person.role}.`
    );
  },

  deleteNetworkPerson: (id: string): void => {
    const list = Storage.getNetworkPeople();
    const target = list.find((p) => p.id === id);
    const updated = list.filter((p) => p.id !== id);
    setLocalItem('holynex_network_people', updated);
    if (target) {
      Storage.addAuditLog('DELETE_PERSON', target.role.toUpperCase(), `${target.name} (${target.id}) was removed.`);
    }
  },

  // Fair Price Cards
  getFairPriceCards: (): FairPriceCardRecord[] => {
    return getLocalItem<FairPriceCardRecord[]>('holynex_fair_price_cards', initialFairPriceCards);
  },

  saveFairPriceCard: (card: FairPriceCardRecord): void => {
    const list = Storage.getFairPriceCards();
    const idx = list.findIndex((c) => c.id === card.id || c.cardNumber === card.cardNumber);
    let updated: FairPriceCardRecord[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = card;
    } else {
      updated = [card, ...list];
    }
    setLocalItem('holynex_fair_price_cards', updated);
    Storage.addAuditLog('SAVE_CARD', 'FAIR_PRICE_CARD', `Card ${card.cardNumber} saved for customer ${card.customerName}.`);
  },

  updateCardStatus: (cardId: string, status: FairPriceCardRecord['status']): void => {
    const list = Storage.getFairPriceCards();
    const updated = list.map((c) => (c.id === cardId ? { ...c, status } : c));
    setLocalItem('holynex_fair_price_cards', updated);
  },

  // Product Schedules (Customer Entitlement & Supply Schedules)
  getProductSchedules: (): ProductScheduleItem[] => {
    return getLocalItem<ProductScheduleItem[]>('holynex_product_schedules', initialProductSchedules);
  },

  saveProductSchedule: (sch: ProductScheduleItem): void => {
    const list = Storage.getProductSchedules();
    const idx = list.findIndex((s) => s.id === sch.id);
    let updated: ProductScheduleItem[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = sch;
    } else {
      updated = [sch, ...list];
    }
    setLocalItem('holynex_product_schedules', updated);
    Storage.addAuditLog('SAVE_SCHEDULE', 'PRODUCT_SCHEDULE', `Schedule ${sch.scheduleCode} saved for ${sch.customerName}.`);
  },

  updateScheduleStatus: (id: string, status: ProductScheduleItem['status']): void => {
    const list = Storage.getProductSchedules();
    const updated = list.map((s) => (s.id === id ? { ...s, status } : s));
    setLocalItem('holynex_product_schedules', updated);
  },

  // Orders
  getOrders: (): OrderRecord[] => {
    return getLocalItem<OrderRecord[]>('holynex_orders', initialOrders);
  },

  saveOrder: (order: OrderRecord): void => {
    const list = Storage.getOrders();
    const idx = list.findIndex((o) => o.id === order.id);
    let updated: OrderRecord[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = order;
    } else {
      updated = [order, ...list];
    }
    setLocalItem('holynex_orders', updated);
  },

  updateOrderStatus: (id: string, status: OrderRecord['status']): void => {
    const list = Storage.getOrders();
    const updated = list.map((o) => (o.id === id ? { ...o, status } : o));
    setLocalItem('holynex_orders', updated);
  },

  // Deliveries
  getDeliveries: (): DeliveryRecord[] => {
    return getLocalItem<DeliveryRecord[]>('holynex_deliveries', initialDeliveries);
  },

  saveDelivery: (del: DeliveryRecord): void => {
    const list = Storage.getDeliveries();
    const idx = list.findIndex((d) => d.id === del.id);
    let updated: DeliveryRecord[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = del;
    } else {
      updated = [del, ...list];
    }
    setLocalItem('holynex_deliveries', updated);
  },

  updateDeliveryStatus: (id: string, status: DeliveryRecord['status']): void => {
    const list = Storage.getDeliveries();
    const updated = list.map((d) => (d.id === id ? { ...d, status } : d));
    setLocalItem('holynex_deliveries', updated);
  },

  recordDeliveryUpdate: (id: string, status: DeliveryRecord['status'], note?: string): void => {
    Storage.updateDeliveryStatus(id, status);
    Storage.addAuditLog('DELIVERY_UPDATE', 'LOGISTICS', `Delivery ${id} marked as ${status}. ${note || ''}`);
  },

  // Commissions
  getCommissions: (): CommissionRecord[] => {
    return getLocalItem<CommissionRecord[]>('holynex_commissions', initialCommissions);
  },

  saveCommission: (comm: CommissionRecord): void => {
    const list = Storage.getCommissions();
    const idx = list.findIndex((c) => c.id === comm.id);
    let updated: CommissionRecord[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = comm;
    } else {
      updated = [comm, ...list];
    }
    setLocalItem('holynex_commissions', updated);
  },

  updateCommissionStatus: (id: string, status: CommissionRecord['status']): void => {
    const list = Storage.getCommissions();
    const updated = list.map((c) => (c.id === id ? { ...c, status } : c));
    setLocalItem('holynex_commissions', updated);
  },

  // Withdrawals
  getWithdrawals: (): WithdrawalRequest[] => {
    return getLocalItem<WithdrawalRequest[]>('holynex_withdrawals', initialWithdrawals);
  },

  saveWithdrawal: (wth: WithdrawalRequest): void => {
    const list = Storage.getWithdrawals();
    const idx = list.findIndex((w) => w.id === wth.id);
    let updated: WithdrawalRequest[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = wth;
    } else {
      updated = [wth, ...list];
    }
    setLocalItem('holynex_withdrawals', updated);
  },

  requestWithdrawal: (
    reqOrId: WithdrawalRequest | string,
    requesterName?: string,
    requesterRole?: any,
    amount?: number,
    payoutMethod?: any,
    payoutDetails?: string
  ): void => {
    let req: WithdrawalRequest;
    if (typeof reqOrId === 'object') {
      req = reqOrId;
    } else {
      req = {
        id: `WTH-${Date.now().toString().slice(-4)}`,
        requesterId: reqOrId,
        requesterName: requesterName || 'User',
        requesterRole: requesterRole || 'dealer',
        amount: amount || 0,
        payoutMethod: payoutMethod || 'bKash',
        payoutDetails: payoutDetails || '',
        status: 'pending',
        requestedAt: new Date().toISOString(),
      };
    }
    Storage.saveWithdrawal(req);
    Storage.addAuditLog('WITHDRAWAL_REQUEST', 'FINANCE', `${req.requesterName} requested withdrawal of ৳${req.amount}.`);
  },

  updateWithdrawalStatus: (id: string, status: WithdrawalRequest['status'], adminNote?: string): void => {
    const list = Storage.getWithdrawals();
    const updated = list.map((w) =>
      w.id === id
        ? {
            ...w,
            status,
            adminNote: adminNote || w.adminNote,
            processedAt: status === 'paid' ? new Date().toISOString() : w.processedAt,
          }
        : w
    );
    setLocalItem('holynex_withdrawals', updated);
    Storage.addAuditLog('WITHDRAWAL_STATUS', 'FINANCE', `Withdrawal ${id} status updated to ${status}.`);
  },

  // Commission Rules
  getCommissionRules: (): CommissionRule[] => {
    return getLocalItem<CommissionRule[]>('holynex_commission_rules', initialCommissionRules);
  },

  saveCommissionRule: (rule: CommissionRule): void => {
    const list = Storage.getCommissionRules();
    const idx = list.findIndex((r) => r.id === rule.id);
    let updated: CommissionRule[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = rule;
    } else {
      updated = [rule, ...list];
    }
    setLocalItem('holynex_commission_rules', updated);
  },

  // SMS & Messaging Campaigns
  getSmsCampaigns: (): SmsCampaign[] => {
    return getLocalItem<SmsCampaign[]>('holynex_sms_campaigns', initialSmsCampaigns);
  },

  saveSmsCampaign: (camp: SmsCampaign): void => {
    const list = Storage.getSmsCampaigns();
    const updated = [camp, ...list];
    setLocalItem('holynex_sms_campaigns', updated);
    Storage.addAuditLog('SMS_CAMPAIGN', 'MESSAGING', `Campaign "${camp.title}" dispatched to ${camp.recipientsCount} recipients.`);
  },

  // ----------------------------------------------------
  // Real AI Assistant Settings & Knowledge Base
  // ----------------------------------------------------
  getAISettings: (): AISettings => {
    return getLocalItem<AISettings>('holynex_ai_settings', initialAISettings);
  },

  saveAISettings: (settings: AISettings): void => {
    setLocalItem('holynex_ai_settings', settings);
    Storage.addAuditLog('AI_SETTINGS_UPDATE', 'AI_SYSTEM', 'Corporate AI Assistant parameters updated.');
  },

  getAIKnowledge: (): AIKnowledgeItem[] => {
    return getLocalItem<AIKnowledgeItem[]>('holynex_ai_knowledge', initialAIKnowledge);
  },

  saveAIKnowledgeItem: (item: AIKnowledgeItem): void => {
    const list = Storage.getAIKnowledge();
    const idx = list.findIndex((k) => k.id === item.id);
    let updated: AIKnowledgeItem[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = { ...item, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...item, updatedAt: new Date().toISOString() }, ...list];
    }
    setLocalItem('holynex_ai_knowledge', updated);
    Storage.addAuditLog('AI_KNOWLEDGE_SAVE', 'AI_SYSTEM', `Knowledge entry "${item.questionBn.slice(0, 30)}..." updated.`);
  },

  deleteAIKnowledgeItem: (id: string): void => {
    const list = Storage.getAIKnowledge();
    const updated = list.filter((k) => k.id !== id);
    setLocalItem('holynex_ai_knowledge', updated);
    Storage.addAuditLog('AI_KNOWLEDGE_DELETE', 'AI_SYSTEM', `Knowledge entry ${id} removed.`);
  },

  getAIChatAnalytics: (): AIChatAnalytics => {
    return getLocalItem<AIChatAnalytics>('holynex_ai_analytics', initialAIChatAnalytics);
  },

  logAIChatQuery: (log: Omit<AIChatQueryLog, 'id' | 'timestamp'>): void => {
    const current = Storage.getAIChatAnalytics();
    const newLog: AIChatQueryLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    const updatedLogs = [newLog, ...(current.recentLogs || [])].slice(0, 100);
    const isBn = log.lang === 'bn';
    const totalMsgs = current.totalMessages + 1;
    const bnCount = Math.round((current.totalMessages * current.banglaPercentage) / 100) + (isBn ? 1 : 0);
    const newBnPct = Math.round((bnCount / totalMsgs) * 100);

    const updated: AIChatAnalytics = {
      ...current,
      totalMessages: totalMsgs,
      answeredByAI: current.answeredByAI + (log.status === 'answered_ai' ? 1 : 0),
      answeredByKnowledgeBase: current.answeredByKnowledgeBase + (log.status === 'answered_kb' ? 1 : 0),
      escalatedToHuman: current.escalatedToHuman + (log.status === 'escalated' ? 1 : 0),
      banglaPercentage: newBnPct,
      englishPercentage: 100 - newBnPct,
      recentLogs: updatedLogs,
    };
    setLocalItem('holynex_ai_analytics', updated);
  },

  resetAIAnalytics: (): void => {
    setLocalItem('holynex_ai_analytics', {
      ...initialAIChatAnalytics,
      totalConversations: 0,
      totalMessages: 0,
      answeredByAI: 0,
      answeredByKnowledgeBase: 0,
      escalatedToHuman: 0,
      recentLogs: [],
    });
    Storage.addAuditLog('AI_ANALYTICS_RESET', 'AI_SYSTEM', 'AI Chat interaction logs reset.');
  },

  // ----------------------------------------------------
  // Customer Payments & Transactions
  // ----------------------------------------------------
  getCustomerPayments: (customerId?: string): CustomerPaymentRecord[] => {
    const list = getLocalItem<CustomerPaymentRecord[]>('holynex_customer_payments', initialCustomerPayments);
    if (customerId) {
      return list.filter((p) => p.customerId === customerId);
    }
    return list;
  },

  saveCustomerPayment: (payment: CustomerPaymentRecord): void => {
    const list = Storage.getCustomerPayments();
    const idx = list.findIndex((p) => p.id === payment.id);
    let updated: CustomerPaymentRecord[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = payment;
    } else {
      updated = [payment, ...list];
    }
    setLocalItem('holynex_customer_payments', updated);
  },

  // ----------------------------------------------------
  // Role-Based Portal Authentication & Session
  // ----------------------------------------------------
  getPortalSession: (): PortalUserSession | null => {
    return getLocalItem<PortalUserSession | null>('holynex_portal_session', null);
  },

  setPortalSession: (session: PortalUserSession | null): void => {
    setLocalItem('holynex_portal_session', session);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('holynex_portal_auth_changed', { detail: session }));
    }
  },

  clearPortalSession: (): void => {
    Storage.setPortalSession(null);
  },

  resetPersonPassword: (id: string, newPassword: string): boolean => {
    const list = Storage.getNetworkPeople();
    const idx = list.findIndex((p) => p.id === id);
    if (idx >= 0) {
      const updated = [...list];
      updated[idx] = {
        ...updated[idx],
        password: newPassword,
        loginAttempts: 0,
      };
      setLocalItem('holynex_network_people', updated);
      Storage.addAuditLog('PASSWORD_RESET', updated[idx].role.toUpperCase(), `Password reset for user ${updated[idx].name} (${id}).`);
      return true;
    }
    return false;
  },

  updatePersonStatus: (id: string, status: 'active' | 'suspended' | 'pending'): void => {
    const list = Storage.getNetworkPeople();
    const idx = list.findIndex((p) => p.id === id);
    if (idx >= 0) {
      const updated = [...list];
      updated[idx] = { ...updated[idx], status };
      setLocalItem('holynex_network_people', updated);
      Storage.addAuditLog('STATUS_CHANGE', updated[idx].role.toUpperCase(), `User ${id} status set to ${status}.`);
    }
  },

  findNetworkPersonByIdentifier: (identifier: string): NetworkPerson | undefined => {
    const list = Storage.getNetworkPeople();
    const cleanId = identifier.trim().toLowerCase();
    return list.find(
      (p) =>
        p.id.toLowerCase() === cleanId ||
        p.mobile.replace(/\D/g, '').includes(cleanId.replace(/\D/g, '')) ||
        (p.email && p.email.toLowerCase() === cleanId)
    );
  },
};

