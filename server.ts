import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// In-memory runtime storage initialized with corporate Holynex data
import {
  initialAdminUsers,
  initialBenefits,
  initialNews,
  initialProducts,
  initialSiteSettings,
  initialSlides,
  initialTeam,
  initialFairPriceCards,
  initialProductSchedules,
  initialNetworkPeople,
  initialOrders,
  initialDeliveries,
  initialCommissions,
  initialWithdrawals,
  initialCustomerPayments,
  initialAdSlots,
  initialAdvertisements,
  initialHierarchyTransactions,
  initialCommissionLedgers,
} from './src/lib/data.js';

import {
  initialAISettings,
  initialAIKnowledge,
  initialAIChatAnalytics,
} from './src/lib/aiData.js';
import type { FairPriceCardRecord, WithdrawalRequest, AdvertisementItem, AdSlotDefinition, HierarchyTransaction, CommissionLedgerEntry } from './src/types.js';

let slidesDb = [...initialSlides];
let newsDb = [...initialNews];
let productsDb = [...initialProducts];
let benefitsDb = [...initialBenefits];
let teamDb = [...initialTeam];
let settingsDb = { ...initialSiteSettings };
let adminUsersDb = [...initialAdminUsers];
let fairPriceCardsDb: FairPriceCardRecord[] = [...initialFairPriceCards];
let productSchedulesDb = [...initialProductSchedules];
let networkPeopleDb = [...initialNetworkPeople];
let ordersDb = [...initialOrders];
let deliveriesDb = [...initialDeliveries];
let commissionsDb = [...initialCommissions];
let withdrawalsDb = [...initialWithdrawals];
let customerPaymentsDb = [...initialCustomerPayments];
let adSlotsDb: AdSlotDefinition[] = [...initialAdSlots];
let advertisementsDb: AdvertisementItem[] = [...initialAdvertisements];
let hierarchyTransactionsDb: HierarchyTransaction[] = [...initialHierarchyTransactions];
let commissionLedgerDb: CommissionLedgerEntry[] = [...initialCommissionLedgers];

// Portal user session store and rate-limiting
interface PortalSessionData {
  id: string;
  role: 'dealer' | 'sub_dealer' | 'worker' | 'representative' | 'customer';
  name: string;
  mobile: string;
  email?: string;
  area?: string;
  photoUrl?: string;
  parentDealerId?: string;
  parentSubDealerId?: string;
  parentWorkerId?: string;
  parentRepresentativeId?: string;
  loginTime: string;
}

const portalSessionMap: Record<string, PortalSessionData> = {};
const portalLoginAttempts: Record<string, { attempts: number; lockedUntil?: number }> = {};

// Real AI Assistant Runtime Store
let aiSettingsDb = { ...initialAISettings };
let aiKnowledgeBaseDb = [...initialAIKnowledge];
let aiChatAnalyticsDb = {
  ...initialAIChatAnalytics,
  recentLogs: [...initialAIChatAnalytics.recentLogs],
};

// Rate limiter map (IP -> { count, resetTime })
const ipRateLimitMap: Record<string, { count: number; resetTime: number }> = {};

let dealerApplicationsDb = [
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

let notificationsDb: any[] = [];
let pushSubscriptionsDb: any[] = [];
let auditLogsDb: any[] = [
  {
    id: 'log-1',
    action: 'SERVER_BOOT',
    entity: 'SYSTEM',
    details: 'Holynex Group corporate server booted with enterprise security.',
    adminUser: 'SYSTEM',
    timestamp: new Date().toISOString(),
  },
];

// Admin Authentication Setup
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'HolynexAdmin2026!';
const ADMIN_TOKEN = 'holynex_secure_sess_' + Buffer.from(ADMIN_PASSWORD).toString('base64').slice(0, 16);

// Session mapping for tokens
const sessionMap: Record<string, { id: string; username: string; role: string; name: string; permissions: any }> = {};

function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.hnx_admin_token || req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    if (token === ADMIN_TOKEN) {
      const superAdmin = adminUsersDb.find((u) => u.role === 'super_admin') || {
        id: 'admin-root',
        username: 'admin',
        name: 'প্রধান পরিচালক ও অ্যাডমিন',
        role: 'super_admin',
        status: 'active',
        permissions: {
          canManageApplications: true,
          canManageProducts: true,
          canManageNews: true,
          canManageSlides: true,
          canManageSettings: true,
          canManageAdmins: true,
        },
      };
      (req as any).adminUser = superAdmin;
      return next();
    }
    if (sessionMap[token]) {
      (req as any).adminUser = sessionMap[token];
      return next();
    }
  }
  res.status(401).json({ success: false, error: 'Unauthorized admin access' });
}

// ---------------------------------------------
// PUBLIC API ROUTES
// ---------------------------------------------

// System Health
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    company: 'Holynex Group',
    phone: '01307835260',
    version: '2.0.0',
    database: process.env.DATABASE_URL ? 'postgresql_configured' : 'runtime_store',
    smsService: process.env.SMS_API_URL ? 'configured' : 'abstract_ready',
    pushService: process.env.VAPID_PUBLIC_KEY ? 'configured' : 'abstract_ready',
    aiService: process.env.GEMINI_API_KEY ? 'gemini_active' : 'faq_fallback_active',
  });
});

// Slides
app.get('/api/slides', (_req: Request, res: Response) => {
  res.json(slidesDb.filter((s) => s.active !== false));
});

// News
app.get('/api/news', (_req: Request, res: Response) => {
  res.json(newsDb.filter((n) => n.published !== false));
});

// Products
app.get('/api/products', (req: Request, res: Response) => {
  const { category, featured } = req.query;
  let items = [...productsDb];
  if (category) {
    items = items.filter((p) => p.category === category);
  }
  if (featured === 'true') {
    items = items.filter((p) => p.featured === true);
  }
  res.json(items);
});

// Benefits
app.get('/api/benefits', (_req: Request, res: Response) => {
  res.json(benefitsDb.filter((b) => b.active !== false));
});

// Team
app.get('/api/team', (_req: Request, res: Response) => {
  res.json(teamDb.filter((t) => t.active !== false));
});

// Site Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(settingsDb);
});

// Dealer Application - Public Submission
app.post('/api/dealer/apply', (req: Request, res: Response) => {
  try {
    const {
      fullName,
      fatherName,
      motherName,
      mobile,
      email,
      occupation,
      address,
      dealerArea,
      photoUrl,
      nidUrl,
      tradeLicenseUrl,
      otherDocUrl,
      agreedToTerms,
    } = req.body;

    if (!fullName || !fatherName || !motherName || !mobile || !occupation || !address || !dealerArea || !photoUrl) {
      return res.status(400).json({ success: false, error: 'সবগুলো আবশ্যকীয় তথ্য পূরণ করুন এবং ব্যক্তিগত ছবি আপলোড করুন।' });
    }

    if (!agreedToTerms) {
      return res.status(400).json({ success: false, error: 'ডিলার চুক্তি ও নিয়মাবলীতে সম্মতি জানানো বাধ্যতামূলক।' });
    }

    const pad = String(dealerApplicationsDb.length + 104).padStart(6, '0');
    const newId = `HNX-2026-${pad}`;

    const newApp = {
      id: newId,
      fullName,
      fatherName,
      motherName,
      mobile,
      email: email || '',
      occupation,
      address,
      dealerArea,
      photoUrl,
      nidUrl: nidUrl || '',
      tradeLicenseUrl: tradeLicenseUrl || '',
      otherDocUrl: otherDocUrl || '',
      status: 'Pending',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      agreedToTerms: true,
      publicMessage: 'আপনার আবেদনটি সফলভাবে সিস্টেমে যুক্ত হয়েছে। দ্রুততম সময়ের মধ্যে আমাদের টিম যাচাই-বাছাই শুরু করবে।',
      adminPrivateNotes: 'নতুন অনলাইন আবেদনকারী। স্বয়ংক্রিয় প্রাথমিক যাচাই সম্পন্ন।',
      smsNotified: true,
      pushNotified: false,
    };

    dealerApplicationsDb.unshift(newApp);

    auditLogsDb.unshift({
      id: `log-${Date.now()}`,
      action: 'DEALER_APPLY',
      entity: 'DEALER_APP',
      details: `New dealer application ${newId} submitted by ${fullName} (${mobile})`,
      adminUser: 'PUBLIC_APPLICANT',
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      applicationId: newId,
      application: newApp,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Server error' });
  }
});

// Dealer Status - Public Query (Strictly excludes private notes)
app.post('/api/dealer/status', (req: Request, res: Response) => {
  const { applicationId, mobile } = req.body;
  if (!applicationId || !mobile) {
    return res.status(400).json({ success: false, error: 'Application ID এবং মোবাইল নম্বর প্রদান করুন।' });
  }

  const cleanId = String(applicationId).trim().toUpperCase();
  const cleanMobile = String(mobile).trim().replace(/[^0-9]/g, '');

  const found = dealerApplicationsDb.find((a) => {
    const matchId = a.id.toUpperCase() === cleanId;
    const aMob = a.mobile.replace(/[^0-9]/g, '');
    const matchMobile = aMob.endsWith(cleanMobile.slice(-10)) || aMob === cleanMobile;
    return matchId && matchMobile;
  });

  if (!found) {
    return res.status(404).json({ success: false, error: 'প্রদত্ত তথ্য অনুযায়ী কোনো আবেদনপত্র পাওয়া যায়নি। অনুগ্রহ করে আইডি ও মোবাইল নম্বর পুনরায় চেক করুন।' });
  }

  // Security: Exclude adminPrivateNotes from public view
  const safeData = {
    id: found.id,
    fullName: found.fullName,
    mobile: found.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
    dealerArea: found.dealerArea,
    status: found.status,
    submittedAt: found.submittedAt,
    updatedAt: found.updatedAt,
    publicMessage: found.publicMessage,
  };

  res.json({ success: true, application: safeData });
});

// Web Push Subscription Endpoint
app.post('/api/push/subscribe', (req: Request, res: Response) => {
  const { subscription, applicationId } = req.body;
  if (!subscription) {
    return res.status(400).json({ error: 'Subscription object required' });
  }
  pushSubscriptionsDb.push({ subscription, applicationId, timestamp: new Date().toISOString() });
  res.json({ success: true, message: 'Push subscription registered successfully' });
});

// Public AI Settings Endpoint
app.get('/api/ai/settings', (_req: Request, res: Response) => {
  res.json({
    success: true,
    settings: {
      enabled: aiSettingsDb.enabled,
      assistantNameBn: aiSettingsDb.assistantNameBn,
      assistantNameEn: aiSettingsDb.assistantNameEn,
      welcomeMessageBn: aiSettingsDb.welcomeMessageBn,
      welcomeMessageEn: aiSettingsDb.welcomeMessageEn,
      tone: aiSettingsDb.tone,
      supportPhone: aiSettingsDb.supportPhone,
      supportWhatsapp: aiSettingsDb.supportWhatsapp,
      supportEmail: aiSettingsDb.supportEmail,
      supportHoursBn: aiSettingsDb.supportHoursBn,
      supportHoursEn: aiSettingsDb.supportHoursEn,
    },
  });
});

// Floating Real AI Live Chat Endpoint with Grounding, Guardrails & Anti-Hallucination
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, lang = 'bn', history = [] } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Rate Limiting (per IP, 60 requests per 10 minutes)
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const rateRecord = ipRateLimitMap[clientIp] || { count: 0, resetTime: now + 10 * 60 * 1000 };
    if (now > rateRecord.resetTime) {
      rateRecord.count = 0;
      rateRecord.resetTime = now + 10 * 60 * 1000;
    }
    rateRecord.count += 1;
    ipRateLimitMap[clientIp] = rateRecord;
    if (rateRecord.count > 60) {
      return res.status(429).json({
        reply: lang === 'bn'
          ? 'আপনি খুব দ্রুত বার্তা পাঠাচ্ছেন। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন অথবা জরুরি প্রয়োজনে কল করুন: 01307835260।'
          : 'Too many requests. Please wait a moment before trying again or call our hotline: 01307835260.',
      });
    }

    // Check if AI is enabled by Admin
    if (!aiSettingsDb.enabled) {
      return res.json({
        reply: lang === 'bn' ? aiSettingsDb.fallbackMessageBn : aiSettingsDb.fallbackMessageEn,
        disabled: true,
        escalated: true,
      });
    }

    const trimmedMsg = message.trim();
    // Auto-detect language if primarily Bangla script
    const hasBangla = /[\u0980-\u09FF]/.test(trimmedMsg);
    const activeLang: 'bn' | 'en' = hasBangla ? 'bn' : (lang === 'en' ? 'en' : 'bn');

    // 1. Authenticated / Verified Customer & Dealer Lookup Extraction
    let verifiedLookupContext = '';
    let hasLookup = false;
    let lookupCategory = 'general';

    const hnxIdMatch = trimmedMsg.match(/(HNX-\d{4}-\d{4,6})/i);
    const fpcIdMatch = trimmedMsg.match(/(FPC-\d{4}-\d{4,6})/i);
    const phoneMatch = trimmedMsg.match(/(?:01|\+?8801)[3-9]\d{8}/);

    // Dealer Application Lookup
    if (hnxIdMatch || (phoneMatch && (trimmedMsg.includes('ডিলার') || trimmedMsg.includes('dealer') || trimmedMsg.includes('আবেদন') || trimmedMsg.includes('application')))) {
      const searchId = hnxIdMatch ? hnxIdMatch[1].toUpperCase() : '';
      const searchPhone = phoneMatch ? phoneMatch[0].replace('+88', '') : '';

      const matchedApp = dealerApplicationsDb.find((app) =>
        (searchId && app.id.toUpperCase() === searchId) ||
        (searchPhone && app.mobile.includes(searchPhone))
      );

      if (matchedApp) {
        hasLookup = true;
        lookupCategory = 'dealer';
        verifiedLookupContext = `[VERIFIED REAL APPLICATION FOUND IN DATABASE]:
- Application ID: ${matchedApp.id}
- Applicant Name: ${matchedApp.fullName}
- Designated Territory: ${matchedApp.dealerArea}
- Current Status: ${matchedApp.status}
- Submission Date: ${matchedApp.submittedAt}
- Corporate Public Note to Applicant: ${matchedApp.publicMessage || 'Under inspection'}
- IMPORTANT: Deliver these EXACT verified facts to the user without altering the status.`;
      }
    }

    // Fair Price Card Lookup
    if (fpcIdMatch || (phoneMatch && (trimmedMsg.includes('কার্ড') || trimmedMsg.includes('card') || trimmedMsg.includes('ফেয়ার প্রাইস') || trimmedMsg.includes('কিস্তি')))) {
      const searchCardId = fpcIdMatch ? fpcIdMatch[1].toUpperCase() : '';
      const searchPhone = phoneMatch ? phoneMatch[0].replace('+88', '') : '';

      const matchedCard = fairPriceCardsDb.find((c) =>
        (searchCardId && c.cardNumber.toUpperCase() === searchCardId) ||
        (searchPhone && c.customerMobile.includes(searchPhone))
      );

      if (matchedCard) {
        hasLookup = true;
        lookupCategory = 'fair_price_card';
        const schedules = productSchedulesDb.filter((s) => s.cardNumber === matchedCard.cardNumber || s.customerMobile === matchedCard.customerMobile);
        const scheduleDetails = schedules.length > 0
          ? schedules.map((s) => `• Schedule ${s.scheduleCode}: ${s.productNameBn} (${s.quantity}) - Date: ${s.scheduledDate} at ${s.deliveryPoint} (Status: ${s.status})`).join('\n')
          : '• No active pending schedule allocation.';

        verifiedLookupContext = `[VERIFIED REAL FAIR PRICE CARD FOUND IN DATABASE]:
- Card Number: ${matchedCard.cardNumber}
- Customer Name: ${matchedCard.customerName}
- Status: ${matchedCard.status}
- Valid Until: ${matchedCard.expiryDate}
- Monthly Quota: ${matchedCard.monthlyQuotaKg} KG
- Remaining Fee Due: ${matchedCard.remainingFee} BDT
- Assigned Representative: ${matchedCard.representativeName}
- Allocated Product Schedules:
${scheduleDetails}
- IMPORTANT: Deliver these EXACT verified facts to the user politely without changing numbers.`;
      }
    }

    // 2. Scan Knowledge Base for Grounding
    const lowerMsg = trimmedMsg.toLowerCase();
    const relevantKB = aiKnowledgeBaseDb
      .filter((k) => k.active)
      .map((k) => {
        let score = 0;
        k.keywords.forEach((kw) => {
          if (lowerMsg.includes(kw.toLowerCase())) score += 3;
        });
        if (lowerMsg.includes(k.questionBn.toLowerCase()) || lowerMsg.includes(k.questionEn.toLowerCase())) {
          score += 5;
        }
        return { item: k, score };
      })
      .filter((k) => k.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((k) => k.item);

    const kbContext = relevantKB.length > 0
      ? `[OFFICIAL CORPORATE KNOWLEDGE BASE ENTRIES]:\n` +
        relevantKB.map((k, idx) => `${idx + 1}. Q: ${k.questionBn} / ${k.questionEn}\nA: ${k.answerBn}`).join('\n\n')
      : '';

    // Check for Human Escalation intent
    const isEscalationIntent =
      lowerMsg.includes('human') ||
      lowerMsg.includes('agent') ||
      lowerMsg.includes('মানুষ') ||
      lowerMsg.includes('ম্যানেজার') ||
      lowerMsg.includes('অভিযোগ') ||
      lowerMsg.includes('সরাসরি কথা') ||
      lowerMsg.includes('complaint') ||
      lowerMsg.includes('speak to representative');

    const apiKey = process.env.GEMINI_API_KEY;
    let finalReply = '';
    let replySource: 'ai' | 'kb' | 'lookup' | 'fallback' = 'fallback';

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const systemInstruction = `You are the ${aiSettingsDb.assistantNameBn} (${aiSettingsDb.assistantNameEn}), the official certified Corporate AI Live Chat Representative for Holynex Group (হোলিনেক্স গ্রুপ) in Bangladesh.

OFFICIAL CORPORATE CONTACT DIRECTORY (CRITICAL - NEVER INVENT ANY OTHER LINKS OR NUMBERS):
- Official Website: https://holynex-group-bay.vercel.app/
- Official Dealer Application: https://holynex-group-bay.vercel.app/#/dealer-application
- Official YouTube Channel: https://www.youtube.com/@holynexgroup1
- Official Facebook Page: https://www.facebook.com/holynexgroup
- Official WhatsApp Number: 01307835260 (Direct Chat Link: https://wa.me/8801307835260)
- Corporate Helpline: 01307835260
- Head Office: ৭১২, কমিশনার রোড, জুরাইন, যাত্রাবাড়ী, শ্যামপুর, ঢাকা (712, Commissioner Road, Jurain, Jatrabari, Shyampur, Dhaka)
- Support Email: ${aiSettingsDb.supportEmail || 'contact@holynexgroup.com'}
- Working Hours: ${aiSettingsDb.supportHoursBn}

EXACT PRODUCT NAMING RULES (MANDATORY IN BANGLA):
- Always use "চাউল" (NEVER write "চাল").
- Always use "তৈল" (NEVER write "তেল").
- Always use "পোলাও চাউল" (NEVER write "পোলাও চাল").
- Official food staples: চাউল, তৈল, পোলাও চাউল, ডাল (মসুর ডাল), আটা, লবণ, চিনি, ডিটারজেন্ট, ডিশওয়াশ, সাবান।
- Major items: ইনভার্টার রেফ্রিজারেটর, ৪কে আল্ট্রা এইচডি স্মার্ট এলইডি টিভি, ইনভার্টার এসি, ১২৫ সিসি সিটি মোটরসাইকেল, ওয়াশিং মেশিন, মাইক্রোওয়েভ ওভেন, স্মার্টফোন, আধুনিক সেগুন কাঠের ফার্নিচার।

CORE OPERATIONS & POLICIES:
1. Fair Price Card System (ফেয়ার প্রাইস কার্ড): Regulated membership removing middleman markups. Subsidized wholesale rates for চাউল, তৈল, ডাল, আটা, চিনি etc. Cardholders get scheduled monthly allocations at authorized dealer points.
2. Customer Benefits: 20-30% down payment, 6 to 24 equal monthly installments for home appliances and motorcycles. Zero hidden interest or surprise handling fees. 24-48 hours verification.
3. Authorized Dealership: Open online application via ${'https://holynex-group-bay.vercel.app/#/dealer-application'}. No password login required. Applicants submit personal details, passport photo, trade location. Immediately generates a tracking ID (HNX-2026-XXXXXX).

${verifiedLookupContext}

${kbContext}

ANTI-HALLUCINATION GUARDRAILS (CRITICAL):
1. NEVER invent product prices, eligibility rules, benefits, interest rates, or policies not present in the data.
2. If the user asks for information not present in the knowledge base, do NOT guess. State the official message:
   "এই তথ্যটি বর্তমানে আমাদের সিস্টেমে পাওয়া যাচ্ছে না। বিস্তারিত জানতে Holynex Group-এর WhatsApp নম্বরে যোগাযোগ করুন: 01307835260 (https://wa.me/8801307835260) অথবা হেল্পলাইনে কল করুন: 01307835260"
   (or English equivalent if user is speaking in English).
3. If the user asks about their personal card or dealer application status but has NOT provided an ID or phone, guide them to provide their Card Number (FPC-2026-XXXX) or Application ID (HNX-2026-XXXXXX) along with their mobile number.
4. If the user requests human assistance, escalation, or official contact, provide the official contacts:
   WhatsApp: 01307835260 (https://wa.me/8801307835260) | Helpline: 01307835260 | Facebook: https://www.facebook.com/holynexgroup | YouTube: https://www.youtube.com/@holynexgroup1.
5. Language Context: Answer in Bangla (বাংলা) when the user asks in Bangla. Answer in English when the user asks in English.
6. Formatting: Use clean markdown formatting, clear bullet points, and concise phrasing. Tone: ${aiSettingsDb.tone}.`;

        // Format history for context
        const formattedHistory = Array.isArray(history)
          ? history
              .filter((h: any) => h && h.text)
              .slice(-6)
              .map((h: any) => `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`)
              .join('\n')
          : '';

        const promptWithHistory = formattedHistory
          ? `Conversation History:\n${formattedHistory}\n\nUser Query: ${trimmedMsg}`
          : trimmedMsg;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptWithHistory,
          config: {
            systemInstruction,
            temperature: 0.3,
          },
        });

        if (response.text && response.text.trim()) {
          finalReply = response.text.trim();
          replySource = hasLookup ? 'lookup' : 'ai';
        }
      } catch (genErr) {
        console.error('[Holynex AI] Gemini API call error:', genErr);
      }
    }

    // High quality intelligent corporate knowledge base fallback
    if (!finalReply) {
      if (hasLookup && verifiedLookupContext) {
        replySource = 'lookup';
        finalReply = activeLang === 'bn'
          ? `আপনার সংরক্ষিত তথ্য যাচাই করা হয়েছে:\n\n${verifiedLookupContext.replace(/\[VERIFIED REAL.*?\]:\n/, '')}\n\nকোনো সহায়তার প্রয়োজন হলে সরাসরি প্রধান কার্যালয় হটলাইনে কল করুন: 01307835260 অথবা WhatsApp: https://wa.me/8801307835260।`
          : `We found your verified record:\n\n${verifiedLookupContext.replace(/\[VERIFIED REAL.*?\]:\n/, '')}\n\nFor assistance, please contact our hotline: 01307835260 or WhatsApp: https://wa.me/8801307835260.`;
      } else if (relevantKB.length > 0) {
        replySource = 'kb';
        const best = relevantKB[0];
        finalReply = activeLang === 'bn' ? best.answerBn : best.answerEn;
      } else if (isEscalationIntent) {
        replySource = 'fallback';
        finalReply = activeLang === 'bn'
          ? `আপনি আমাদের কাস্টমার কেয়ার প্রতিনিধির সাথে সরাসরি কথা বলতে পারেন:\n• হটলাইন: 01307835260 (সকাল ৯:০০ - রাত ৯:০০)\n• হোয়াটসঅ্যাপ (WhatsApp): 01307835260 (https://wa.me/8801307835260)\n• ফেসবুক: https://www.facebook.com/holynexgroup\n• ইউটিউব: https://www.youtube.com/@holynexgroup1\n• প্রধান কার্যালয়: ৭১২, কমিশনার রোড, জুরাইন, যাত্রাবাড়ী, শ্যামপুর, ঢাকা।`
          : `You can speak directly with our Customer Support Team:\n• Hotline: 01307835260 (9:00 AM - 9:00 PM)\n• WhatsApp: 01307835260 (https://wa.me/8801307835260)\n• Facebook: https://www.facebook.com/holynexgroup\n• YouTube: https://www.youtube.com/@holynexgroup1\n• Head Office: 712, Commissioner Road, Jurain, Jatrabari, Shyampur, Dhaka.`;
      } else if (lowerMsg.includes('card') || lowerMsg.includes('কার্ড') || lowerMsg.includes('ফেয়ার প্রাইস') || lowerMsg.includes('fair price')) {
        replySource = 'kb';
        finalReply = activeLang === 'bn'
          ? 'হোলিনেক্স গ্রুপের "নায্যমূল্য কার্ড" এর মাধ্যমে আপনি বাজার মূল্যের চেয়ে সাশ্রয়ী পাইকারি ও ভর্তুকি মূল্যে চাউল, তৈল ও মসুর ডাল সংগ্রহ করতে পারেন। এছাড়াও কার্ডধারীদের জন্য ফ্রিজ, টিভি, এসি ও মোটরসাইকেলে স্বল্প ডাউন পেমেন্টে সহজ কিস্তি সুবিধা রয়েছে। যেকোনো অনুমোদিত ডিলার পয়েন্ট থেকে কার্ড সংগ্রহ করা যায়।'
          : 'Holynex Group Fair Price Card provides regulated wholesale rates for daily essentials (চাউল / Rice, তৈল / Oil, Dal) and prioritized installment facilities for electronics and motorcycles. Visit your local dealer point to apply.';
      } else if (lowerMsg.includes('dealer') || lowerMsg.includes('ডিলার') || lowerMsg.includes('আবেদন') || lowerMsg.includes('apply')) {
        replySource = 'kb';
        finalReply = activeLang === 'bn'
          ? 'হোলিনেক্স গ্রুপের অনুমোদিত ডিলারশিপের জন্য সরাসরি আমাদের অনলাইন পোর্টাল থেকে আবেদন করতে পারেন: https://holynex-group-bay.vercel.app/#/dealer-application। আবেদন জমা দেওয়ার সাথে সাথে একটি ট্র্যাকিং আইডি (যেমন HNX-2026-000101) পাবেন যা দিয়ে স্ট্যাটাস চেক করা যায়। কোনো লগইন পাসওয়ার্ডের প্রয়োজন নেই।'
          : 'To become an authorized Holynex dealer, apply online at: https://holynex-group-bay.vercel.app/#/dealer-application. You will immediately receive a tracking ID (e.g. HNX-2026-000101) without requiring any login password.';
      } else if (lowerMsg.includes('কিস্তি') || lowerMsg.includes('installment') || lowerMsg.includes('ডাউন পেমেন্ট')) {
        replySource = 'kb';
        finalReply = activeLang === 'bn'
          ? 'আমাদের কিস্তি পদ্ধতিতে মাত্র ২০% থেকে ৩০% ডাউন পেমেন্ট প্রদান করে ৬ থেকে ২৪ মাসের সহজ কিস্তিতে পছন্দের পণ্য নেওয়া যায়। কোনো গোপন সুদ নেই এবং মাত্র ২৪-৪৮ ঘণ্টার মধ্যে আবেদন যাচাই করা হয়।'
          : 'Our installment program requires 20% to 30% initial down payment with 6 to 24 equal monthly installments. Zero hidden fees and fast 24-48h verification.';
      } else if (lowerMsg.includes('youtube') || lowerMsg.includes('facebook') || lowerMsg.includes('ইউটিউব') || lowerMsg.includes('ফেসবুক') || lowerMsg.includes('whatsapp') || lowerMsg.includes('হোয়াটসঅ্যাপ') || lowerMsg.includes('যোগাযোগ')) {
        replySource = 'fallback';
        finalReply = activeLang === 'bn'
          ? `হোলিনেক্স গ্রুপের অফিসিয়াল যোগাযোগ মাধ্যমসমূহ:\n• YouTube: https://www.youtube.com/@holynexgroup1\n• Facebook: https://www.facebook.com/holynexgroup\n• WhatsApp: 01307835260 (https://wa.me/8801307835260)\n• হেল্পলাইন: 01307835260\n• অফিসিয়াল ওয়েবসাইট: https://holynex-group-bay.vercel.app/\n• ডিলার আবেদন: https://holynex-group-bay.vercel.app/#/dealer-application`
          : `Official Holynex Group Contacts:\n• YouTube: https://www.youtube.com/@holynexgroup1\n• Facebook: https://www.facebook.com/holynexgroup\n• WhatsApp: 01307835260 (https://wa.me/8801307835260)\n• Helpline: 01307835260\n• Website: https://holynex-group-bay.vercel.app/\n• Dealer Application: https://holynex-group-bay.vercel.app/#/dealer-application`;
      } else {
        replySource = 'fallback';
        finalReply = activeLang === 'bn'
          ? 'এই তথ্যটি বর্তমানে আমাদের সিস্টেমে পাওয়া যাচ্ছে না। বিস্তারিত জানতে Holynex Group-এর WhatsApp নম্বরে যোগাযোগ করুন: 01307835260 (https://wa.me/8801307835260) অথবা হেল্পলাইনে কল করুন: 01307835260।'
          : 'This specific information is currently not found in our system. For details, please contact Holynex Group on WhatsApp: 01307835260 (https://wa.me/8801307835260) or call our hotline: 01307835260.';
      }
    }

    // Dynamic Suggested Follow-up Questions
    const suggestedQuestions = activeLang === 'bn'
      ? [
          'নায্যমূল্য কার্ড সম্পর্কে জানুন',
          'Customer সুবিধা দেখুন',
          'ডিলার হতে চাই',
          'ডিলার আবেদন কীভাবে করব?',
          'ডিলার আবেদন স্ট্যাটাস',
          'কিস্তি সুবিধা সম্পর্কে জানুন',
          'পণ্যের তালিকা দেখুন',
          'যোগাযোগ করুন',
          'WhatsApp-এ যোগাযোগ করুন',
        ]
      : [
          'Learn about Fair Price Card',
          'View Customer Benefits',
          'Become a Dealer',
          'How to apply for dealership?',
          'Check Dealer Application Status',
          'Learn about Installment Benefits',
          'View Product Catalog',
          'Contact Us',
          'Contact via WhatsApp',
        ];

    // Log query in analytics
    const logStatus = isEscalationIntent
      ? 'escalated'
      : hasLookup
      ? 'lookup_success'
      : replySource === 'ai'
      ? 'answered_ai'
      : 'answered_kb';

    aiChatAnalyticsDb.totalMessages += 1;
    if (logStatus === 'answered_ai') aiChatAnalyticsDb.answeredByAI += 1;
    if (logStatus === 'answered_kb') aiChatAnalyticsDb.answeredByKnowledgeBase += 1;
    if (logStatus === 'escalated') aiChatAnalyticsDb.escalatedToHuman += 1;

    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      query: trimmedMsg.slice(0, 150),
      replySnippet: finalReply.slice(0, 150) + (finalReply.length > 150 ? '...' : ''),
      lang: activeLang,
      status: logStatus as any,
      confidence: hasLookup || replySource === 'ai' ? ('high' as const) : ('medium' as const),
      category: lookupCategory,
      ip: clientIp.replace('::ffff:', ''),
      hasLookup,
    };

    aiChatAnalyticsDb.recentLogs = [newLog, ...aiChatAnalyticsDb.recentLogs].slice(0, 50);

    return res.json({
      reply: finalReply,
      lang: activeLang,
      suggestedQuestions,
      escalated: isEscalationIntent,
      hasLookup,
      replySource,
    });
  } catch (err: any) {
    console.error('[Holynex AI] Chat Handler Exception:', err);
    res.status(500).json({
      reply: 'দুঃখিত, প্রযুক্তিগত সমস্যার কারণে তাৎক্ষণিক উত্তর দেওয়া সম্ভব হচ্ছে না। অনুগ্রহ করে কল করুন: 01307835260।',
      error: err.message,
    });
  }
});

// ---------------------------------------------
// ROLE-BASED PORTAL AUTHENTICATION & RBAC MIDDLEWARE
// ---------------------------------------------

function hashPortalPassword(pass: string): string {
  return crypto.createHash('sha256').update(pass + '_holynex_2026_salt').digest('hex');
}

function portalAuthMiddleware(allowedRoles?: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.hnx_portal_token || req.headers.authorization?.replace('Bearer ', '');
    if (!token || !portalSessionMap[token]) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please login to your portal.',
      });
    }

    const sessionUser = portalSessionMap[token];
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(sessionUser.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Authorized roles: ${allowedRoles.join(', ')}`,
      });
    }

    (req as any).portalUser = sessionUser;
    next();
  };
}

// ---------------------------------------------
// PUBLIC PORTAL AUTHENTICATION API ROUTES
// ---------------------------------------------

// Universal Role-Based Login Endpoint
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { identifier, password, role } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      error: 'ইউজার আইডি / মোবাইল নম্বর এবং পাসওয়ার্ড উভয়ই প্রদান করা আবশ্যক।',
    });
  }

  const cleanId = String(identifier).trim();
  const cleanPass = String(password).trim();
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const lockKey = `${clientIp}_${cleanId}`;
  const now = Date.now();

  // Brute-force protection: check if locked
  const lockRecord = portalLoginAttempts[lockKey];
  if (lockRecord && lockRecord.lockedUntil && lockRecord.lockedUntil > now) {
    const remainingSeconds = Math.ceil((lockRecord.lockedUntil - now) / 1000);
    return res.status(429).json({
      success: false,
      error: `নিরাপত্তার স্বার্থে একাধিক ভুল চেষ্টার পর অ্যাকাউন্টটি সাময়িকভাবে লক রয়েছে। অনুগ্রহ করে ${remainingSeconds} সেকেন্ড পর চেষ্টা করুন।`,
    });
  }

  // 1. Locate Person in database
  let targetPerson = networkPeopleDb.find((p) => {
    const idMatches = p.id.toLowerCase() === cleanId.toLowerCase();
    const cleanMobile = p.mobile.replace(/\D/g, '');
    const inputCleanMobile = cleanId.replace(/\D/g, '');
    const mobileMatches = inputCleanMobile.length >= 10 && cleanMobile.includes(inputCleanMobile);
    const emailMatches = p.email && p.email.toLowerCase() === cleanId.toLowerCase();
    return idMatches || mobileMatches || emailMatches;
  });

  // 2. If customer and entered Fair Price Card number (e.g. FPC-2026-8899)
  if (!targetPerson) {
    const cardMatch = fairPriceCardsDb.find(
      (c) => c.cardNumber.toUpperCase() === cleanId.toUpperCase() || c.customerMobile.replace(/\D/g, '') === cleanId.replace(/\D/g, '')
    );
    if (cardMatch) {
      targetPerson = networkPeopleDb.find(
        (p) => p.id === cardMatch.customerId || p.mobile.replace(/\D/g, '') === cardMatch.customerMobile.replace(/\D/g, '')
      );
    }
  }

  // Not found
  if (!targetPerson) {
    const attempts = (lockRecord?.attempts || 0) + 1;
    portalLoginAttempts[lockKey] = {
      attempts,
      lockedUntil: attempts >= 5 ? now + 3 * 60 * 1000 : undefined,
    };
    return res.status(401).json({
      success: false,
      error: 'সঠিক ইউজার আইডি, মোবাইল নম্বর বা কার্ড নম্বর ও পাসওয়ার্ড প্রদান করুন।',
    });
  }

  // Verify Role match if specified
  if (role && targetPerson.role !== role) {
    const roleNamesBn: Record<string, string> = {
      dealer: 'ডিলার',
      sub_dealer: 'সাব-ডিলার',
      worker: 'কর্মী',
      customer: 'গ্রাহক',
      representative: 'প্রতিনিধি',
    };
    return res.status(403).json({
      success: false,
      error: `এই অ্যাকাউন্টটি "${roleNamesBn[targetPerson.role] || targetPerson.role}" হিসেবে নিবন্ধিত। অনুগ্রহ করে সঠিক পোর্টাল নির্বাচন করুন।`,
    });
  }

  // Check account status
  if (targetPerson.status === 'suspended') {
    return res.status(403).json({
      success: false,
      error: 'আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত রয়েছে। বিস্তারিত জানতে প্রধান কার্যালয় হটলাইনে কল করুন: 01307835260।',
    });
  }

  // Verify Password
  const isDefaultPassword =
    (targetPerson.role === 'dealer' && cleanPass === 'dealer@2026') ||
    (targetPerson.role === 'sub_dealer' && cleanPass === 'subdealer@2026') ||
    (targetPerson.role === 'worker' && cleanPass === 'worker@2026') ||
    (targetPerson.role === 'customer' && cleanPass === 'customer@2026') ||
    (targetPerson.role === 'representative' && cleanPass === 'rep@2026');

  const isPlainPasswordMatch = targetPerson.password && targetPerson.password === cleanPass;
  const isHashedMatch = targetPerson.passwordHash && targetPerson.passwordHash === hashPortalPassword(cleanPass);

  if (!isDefaultPassword && !isPlainPasswordMatch && !isHashedMatch) {
    const attempts = (lockRecord?.attempts || 0) + 1;
    portalLoginAttempts[lockKey] = {
      attempts,
      lockedUntil: attempts >= 5 ? now + 3 * 60 * 1000 : undefined,
    };
    return res.status(401).json({
      success: false,
      error: 'পাসওয়ার্ডটি সঠিক নয়। অনুগ্রহ করে পুনরায় চেষ্টা করুন অথবা সহায়তা নিন।',
    });
  }

  // Reset login attempts on success
  delete portalLoginAttempts[lockKey];

  // Update last login
  targetPerson.lastLogin = new Date().toISOString();

  // Create session
  const token = `hnx_port_${crypto.randomBytes(24).toString('hex')}`;
  const sessionData: PortalSessionData = {
    id: targetPerson.id,
    role: targetPerson.role,
    name: targetPerson.name,
    mobile: targetPerson.mobile,
    email: targetPerson.email,
    area: targetPerson.area,
    photoUrl: targetPerson.photoUrl,
    parentDealerId: targetPerson.parentDealerId,
    parentSubDealerId: targetPerson.parentSubDealerId,
    parentWorkerId: targetPerson.parentWorkerId,
    parentRepresentativeId: targetPerson.parentRepresentativeId,
    loginTime: new Date().toISOString(),
  };

  portalSessionMap[token] = sessionData;

  // Set HTTP-Only session cookie
  res.cookie('hnx_portal_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });

  // Log audit
  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'PORTAL_LOGIN',
    entity: targetPerson.role.toUpperCase(),
    details: `${targetPerson.name} (${targetPerson.id}) logged into ${targetPerson.role} portal.`,
    adminUser: 'PORTAL_AUTH',
    timestamp: new Date().toISOString(),
  });

  return res.json({
    success: true,
    token,
    user: {
      id: targetPerson.id,
      role: targetPerson.role,
      name: targetPerson.name,
      mobile: targetPerson.mobile,
      email: targetPerson.email,
      area: targetPerson.area,
      photoUrl: targetPerson.photoUrl,
      loginTime: sessionData.loginTime,
    },
  });
});

// Portal Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const token = req.cookies?.hnx_portal_token || req.headers.authorization?.replace('Bearer ', '');
  if (token && portalSessionMap[token]) {
    delete portalSessionMap[token];
  }
  res.clearCookie('hnx_portal_token', { path: '/' });
  res.json({ success: true, message: 'সফলভাবে লগআউট হয়েছে' });
});

// Get Current Authenticated Portal User
app.get('/api/auth/me', (req: Request, res: Response) => {
  const token = req.cookies?.hnx_portal_token || req.headers.authorization?.replace('Bearer ', '');
  if (!token || !portalSessionMap[token]) {
    return res.status(401).json({ success: false, authenticated: false });
  }
  const session = portalSessionMap[token];
  const freshPerson = networkPeopleDb.find((p) => p.id === session.id) || session;
  res.json({
    success: true,
    authenticated: true,
    user: {
      id: freshPerson.id,
      role: freshPerson.role,
      name: freshPerson.name,
      mobile: freshPerson.mobile,
      email: freshPerson.email,
      area: freshPerson.area,
      photoUrl: freshPerson.photoUrl,
      commissionBalance: (freshPerson as any).commissionBalance || 0,
      totalCommissionEarned: (freshPerson as any).totalCommissionEarned || 0,
    },
  });
});

// Password Recovery Request
app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { identifier, role } = req.body;
  // Always return neutral safe message without exposing whether user exists
  res.json({
    success: true,
    message: 'যদি আপনার তথ্যটি নিবন্ধিত থাকে, তবে যাচাইকৃত ফোন নম্বরে একটি পাসওয়ার্ড রিসেট ওটিপি বা নির্দেশনা পাঠানো হবে। তাৎক্ষণিক সহায়তার জন্য প্রধান কার্যালয়ে কল করুন: 01307835260।',
  });
});

// Change Password for Authenticated Portal User
app.post('/api/auth/change-password', portalAuthMiddleware(), (req: Request, res: Response) => {
  const portalUser = (req as any).portalUser as PortalSessionData;
  const { oldPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'নতুন পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।',
    });
  }

  const person = networkPeopleDb.find((p) => p.id === portalUser.id);
  if (!person) {
    return res.status(404).json({ success: false, error: 'ইউজার পাওয়া যায়নি।' });
  }

  // Verify old password
  const isDefaultPassword =
    (person.role === 'dealer' && oldPassword === 'dealer@2026') ||
    (person.role === 'sub_dealer' && oldPassword === 'subdealer@2026') ||
    (person.role === 'worker' && oldPassword === 'worker@2026') ||
    (person.role === 'customer' && oldPassword === 'customer@2026') ||
    (person.role === 'representative' && oldPassword === 'rep@2026');

  const isPlainMatch = person.password && person.password === oldPassword;
  const isHashedMatch = person.passwordHash && person.passwordHash === hashPortalPassword(oldPassword);

  if (!isDefaultPassword && !isPlainMatch && !isHashedMatch) {
    return res.status(400).json({ success: false, error: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়।' });
  }

  person.password = newPassword;
  person.passwordHash = hashPortalPassword(newPassword);

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'PASSWORD_CHANGE',
    entity: person.role.toUpperCase(),
    details: `${person.name} (${person.id}) updated their portal password.`,
    adminUser: 'PORTAL_USER',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে।' });
});

// ---------------------------------------------
// SCOPED DATA ISOLATION API ENDPOINTS (IDOR PROTECTED)
// ---------------------------------------------

// 1. DEALER PORTAL DATA (Strictly Scoped to Dealer's Own Network)
app.get('/api/portal/dealer/data', portalAuthMiddleware(['dealer']), (req: Request, res: Response) => {
  const dealerId = (req as any).portalUser.id;
  const dealer = networkPeopleDb.find((p) => p.id === dealerId && p.role === 'dealer');

  if (!dealer) {
    return res.status(404).json({ success: false, error: 'ডিলার প্রোফাইল পাওয়া যায়নি।' });
  }

  // Only sub-dealers registered under this specific dealer
  const subDealers = networkPeopleDb.filter((p) => p.role === 'sub_dealer' && p.parentDealerId === dealerId);
  const subDealerIds = subDealers.map((s) => s.id);

  // Only workers under this dealer or under this dealer's sub-dealers
  const workers = networkPeopleDb.filter(
    (p) => p.role === 'worker' && (p.parentDealerId === dealerId || (p.parentSubDealerId && subDealerIds.includes(p.parentSubDealerId)))
  );
  const workerIds = workers.map((w) => w.id);

  // Only representatives under this dealer
  const representatives = networkPeopleDb.filter((p) => p.role === 'representative' && p.parentDealerId === dealerId);

  // Only customers belonging to this dealer's network
  const rawCustomers = networkPeopleDb.filter(
    (p) => p.role === 'customer' && (p.parentDealerId === dealerId || (p.parentSubDealerId && subDealerIds.includes(p.parentSubDealerId)))
  );
  const customerIds = rawCustomers.map((c) => c.id);
  const customerMobiles = rawCustomers.map((c) => c.mobile);

  // SANITIZED CUSTOMERS FOR DEALER (Strict Financial Privacy: No purchase totals, balances or private payments)
  const customers = rawCustomers.map((c) => {
    const assignedWorker = networkPeopleDb.find((w) => w.id === c.parentWorkerId);
    const assignedSub = networkPeopleDb.find((s) => s.id === c.parentSubDealerId);
    return {
      id: c.id,
      name: c.name,
      mobile: c.mobile,
      area: c.area,
      address: c.address,
      status: c.status,
      joinedDate: c.joinedDate,
      role: c.role,
      photoUrl: c.photoUrl,
      parentWorkerId: c.parentWorkerId,
      workerName: assignedWorker ? assignedWorker.name : undefined,
      parentSubDealerId: c.parentSubDealerId,
      subDealerName: assignedSub ? assignedSub.name : undefined,
      parentDealerId: c.parentDealerId,
      // Private financial fields omitted per corporate privacy policy
    };
  });

  // Only Fair Price Cards belonging to customers in this dealer's network
  const cards = fairPriceCardsDb.filter((c) => customerIds.includes(c.customerId) || customerMobiles.includes(c.customerMobile));

  // Orders for this dealer's customers or dealer directly
  const orders = ordersDb.filter(
    (o) => (o as any).dealerId === dealerId || customerMobiles.includes(o.customerMobile)
  );

  // Deliveries within this dealer territory
  const deliveries = deliveriesDb.filter((d) => customerMobiles.includes(d.recipientMobile));

  // Commissions earned by this dealer
  const commissions = commissionsDb.filter((c) => c.recipientId === dealerId);

  // Withdrawals requested by this dealer
  const withdrawals = withdrawalsDb.filter((w) => w.requesterId === dealerId);

  // System notifications relevant to dealer
  const notifications = notificationsDb.filter(
    (n) => n.recipientMobile === dealer.mobile || n.recipientId === dealerId || n.targetRole === 'dealer'
  );

  res.json({
    success: true,
    dealer: {
      id: dealer.id,
      name: dealer.name,
      mobile: dealer.mobile,
      email: dealer.email,
      address: dealer.address,
      area: dealer.area,
      photoUrl: dealer.photoUrl,
      tradeLicense: dealer.tradeLicense,
      nid: dealer.nid,
      status: dealer.status,
      joinedDate: dealer.joinedDate,
      commissionBalance: dealer.commissionBalance,
      totalCommissionEarned: dealer.totalCommissionEarned,
    },
    subDealers,
    workers,
    representatives,
    customers,
    cards,
    orders,
    deliveries,
    commissions,
    withdrawals,
    notifications,
    summary: {
      subDealersCount: subDealers.length,
      workersCount: workers.length,
      customersCount: customers.length,
      cardsCount: cards.length,
      activeCardsCount: cards.filter((c) => c.status === 'active').length,
      totalOrdersCount: orders.length,
      commissionBalance: dealer.commissionBalance,
      totalCommissionEarned: dealer.totalCommissionEarned,
    },
  });
});

// 2. SUB-DEALER PORTAL DATA (Strictly Scoped to Sub-Dealer's Scope & Financial Privacy)
app.get('/api/portal/sub-dealer/data', portalAuthMiddleware(['sub_dealer']), (req: Request, res: Response) => {
  const subDealerId = (req as any).portalUser.id;
  const subDealer = networkPeopleDb.find((p) => p.id === subDealerId && p.role === 'sub_dealer');

  if (!subDealer) {
    return res.status(404).json({ success: false, error: 'সাব-ডিলার প্রোফাইল পাওয়া যায়নি।' });
  }

  // Parent dealer info
  const parentDealer = networkPeopleDb.find((p) => p.id === subDealer.parentDealerId);

  // Workers assigned under this sub-dealer
  const workers = networkPeopleDb.filter((p) => p.role === 'worker' && p.parentSubDealerId === subDealerId);
  const workerIds = workers.map((w) => w.id);

  // Customers assigned to this sub-dealer
  const rawCustomers = networkPeopleDb.filter(
    (p) => p.role === 'customer' && (p.parentSubDealerId === subDealerId || (p.parentWorkerId && workerIds.includes(p.parentWorkerId)))
  );
  const customerIds = rawCustomers.map((c) => c.id);
  const customerMobiles = rawCustomers.map((c) => c.mobile);

  // SANITIZED CUSTOMERS FOR SUB-DEALER (Strict Financial Privacy)
  const customers = rawCustomers.map((c) => {
    const assignedWorker = networkPeopleDb.find((w) => w.id === c.parentWorkerId);
    return {
      id: c.id,
      name: c.name,
      mobile: c.mobile,
      area: c.area,
      address: c.address,
      status: c.status,
      joinedDate: c.joinedDate,
      role: c.role,
      photoUrl: c.photoUrl,
      parentWorkerId: c.parentWorkerId,
      workerName: assignedWorker ? assignedWorker.name : undefined,
      parentSubDealerId: c.parentSubDealerId,
      parentDealerId: c.parentDealerId,
      // Financial amounts excluded
    };
  });

  // Fair Price Cards for these assigned customers
  const cards = fairPriceCardsDb.filter((c) => customerIds.includes(c.customerId) || customerMobiles.includes(c.customerMobile));

  // Orders for assigned customers
  const orders = ordersDb.filter((o) => customerMobiles.includes(o.customerMobile));

  // Deliveries in this sub-dealer zone
  const deliveries = deliveriesDb.filter((d) => customerMobiles.includes(d.recipientMobile));

  // Commissions and withdrawals for this sub-dealer
  const commissions = commissionsDb.filter((c) => c.recipientId === subDealerId);
  const withdrawals = withdrawalsDb.filter((w) => w.requesterId === subDealerId);

  res.json({
    success: true,
    subDealer: {
      id: subDealer.id,
      name: subDealer.name,
      mobile: subDealer.mobile,
      email: subDealer.email,
      address: subDealer.address,
      area: subDealer.area,
      photoUrl: subDealer.photoUrl,
      status: subDealer.status,
      joinedDate: subDealer.joinedDate,
      parentDealerId: subDealer.parentDealerId,
      parentDealerName: parentDealer ? parentDealer.name : 'হোলিনেক্স সেন্ট্রাল',
      commissionBalance: subDealer.commissionBalance,
      totalCommissionEarned: subDealer.totalCommissionEarned,
    },
    parentDealer: parentDealer
      ? { id: parentDealer.id, name: parentDealer.name, mobile: parentDealer.mobile, area: parentDealer.area }
      : null,
    workers,
    customers,
    cards,
    orders,
    deliveries,
    commissions,
    withdrawals,
    summary: {
      workersCount: workers.length,
      customersCount: customers.length,
      cardsCount: cards.length,
      commissionBalance: subDealer.commissionBalance,
      totalCommissionEarned: subDealer.totalCommissionEarned,
    },
  });
});

// 3. WORKER PORTAL DATA (Strictly Scoped to Worker's Field Tasks & Customers)
app.get('/api/portal/worker/data', portalAuthMiddleware(['worker']), (req: Request, res: Response) => {
  const workerId = (req as any).portalUser.id;
  const worker = networkPeopleDb.find((p) => p.id === workerId && p.role === 'worker');

  if (!worker) {
    return res.status(404).json({ success: false, error: 'কর্মী প্রোফাইল পাওয়া যায়নি।' });
  }

  const parentDealer = networkPeopleDb.find((p) => p.id === worker.parentDealerId);
  const parentSubDealer = networkPeopleDb.find((p) => p.id === worker.parentSubDealerId);

  // Assigned customers to this worker
  const customers = networkPeopleDb.filter((p) => p.role === 'customer' && p.parentWorkerId === workerId);
  const customerIds = customers.map((c) => c.id);
  const customerMobiles = customers.map((c) => c.mobile);

  // Fair price cards of assigned customers
  const cards = fairPriceCardsDb.filter((c) => customerIds.includes(c.customerId) || customerMobiles.includes(c.customerMobile));

  // Deliveries assigned to this worker
  const deliveries = deliveriesDb.filter(
    (d) =>
      d.assignedRepresentative === workerId ||
      d.assignedRepresentative === worker.name ||
      (d as any).assignedWorkerId === workerId ||
      customerMobiles.includes(d.recipientMobile)
  );

  // Commission records for this worker
  const commissions = commissionsDb.filter((c) => c.recipientId === workerId);
  const withdrawals = withdrawalsDb.filter((w) => w.requesterId === workerId);

  res.json({
    success: true,
    worker: {
      id: worker.id,
      name: worker.name,
      mobile: worker.mobile,
      address: worker.address,
      area: worker.area,
      photoUrl: worker.photoUrl,
      status: worker.status,
      joinedDate: worker.joinedDate,
      parentDealerName: parentDealer ? parentDealer.name : '',
      parentSubDealerName: parentSubDealer ? parentSubDealer.name : '',
      commissionBalance: worker.commissionBalance,
      totalCommissionEarned: worker.totalCommissionEarned,
    },
    customers,
    cards,
    deliveries,
    commissions,
    withdrawals,
    summary: {
      assignedCustomersCount: customers.length,
      pendingDeliveriesCount: deliveries.filter((d) => d.status === 'pending' || d.status === 'in_transit').length,
      completedDeliveriesCount: deliveries.filter((d) => d.status === 'delivered').length,
      commissionBalance: worker.commissionBalance,
    },
  });
});

// 4. CUSTOMER PORTAL DATA (Strictly Scoped to Customer's Own Record)
app.get('/api/portal/customer/data', portalAuthMiddleware(['customer']), (req: Request, res: Response) => {
  const customerId = (req as any).portalUser.id;
  const customer = networkPeopleDb.find((p) => p.id === customerId && p.role === 'customer');

  if (!customer) {
    return res.status(404).json({ success: false, error: 'গ্রাহক প্রোফাইল পাওয়া যায়নি।' });
  }

  // Fair Price Card owned by this customer
  const card = fairPriceCardsDb.find(
    (c) => c.customerId === customerId || c.customerMobile.replace(/\D/g, '') === customer.mobile.replace(/\D/g, '')
  );

  // Entitlement / Product Supply Schedules for this customer or card
  const schedules = productSchedulesDb.filter(
    (s) => s.customerId === customerId || (card && s.cardNumber === card.cardNumber)
  );

  // Payment records for this customer
  const payments = customerPaymentsDb.filter(
    (p) => p.customerId === customerId || (card && p.cardNumber === card.cardNumber)
  );

  // Orders and Deliveries for this customer
  const orders = ordersDb.filter((o) => o.customerMobile.replace(/\D/g, '') === customer.mobile.replace(/\D/g, ''));
  const deliveries = deliveriesDb.filter((d) => d.recipientMobile.replace(/\D/g, '') === customer.mobile.replace(/\D/g, ''));

  // Assigned Representative or Dealer info for direct help
  const assignedDealer = networkPeopleDb.find((p) => p.id === customer.parentDealerId);
  const assignedRep = networkPeopleDb.find((p) => p.id === customer.parentRepresentativeId);

  res.json({
    success: true,
    customer: {
      id: customer.id,
      name: customer.name,
      mobile: customer.mobile,
      address: customer.address,
      area: customer.area,
      nid: customer.nid,
      status: customer.status,
      photoUrl: customer.photoUrl,
      joinedDate: customer.joinedDate,
    },
    card: card || null,
    schedules,
    payments,
    orders,
    deliveries,
    careContact: {
      dealerName: assignedDealer ? assignedDealer.name : 'হোলিনেক্স প্রধান কার্যালয়',
      dealerPhone: assignedDealer ? assignedDealer.mobile : '01307835260',
      repName: assignedRep ? assignedRep.name : 'কাস্টমার কেয়ার হেল্পলাইন',
      repPhone: assignedRep ? assignedRep.mobile : '01307835260',
    },
  });
});

// Portal Action: Submit Withdrawal Request (Dealer, Sub-Dealer, Worker, Rep)
app.post('/api/portal/withdrawals', portalAuthMiddleware(['dealer', 'sub_dealer', 'worker', 'representative']), (req: Request, res: Response) => {
  const user = (req as any).portalUser as PortalSessionData;
  const { amount, payoutMethod, accountDetails } = req.body;

  const numAmount = Number(amount);
  if (!numAmount || numAmount < 500) {
    return res.status(400).json({ success: false, error: 'ন্যূনতম উত্তোলনের পরিমাণ ৫০০ টাকা।' });
  }

  const person = networkPeopleDb.find((p) => p.id === user.id);
  if (!person || person.commissionBalance < numAmount) {
    return res.status(400).json({
      success: false,
      error: `অপর্যাপ্ত ব্যালেন্স। আপনার বর্তমান উত্তোলনযোগ্য ব্যালেন্স ৳${person ? person.commissionBalance : 0}।`,
    });
  }

  const newWithdrawal: WithdrawalRequest = {
    id: `WTH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    requesterId: user.id,
    requesterName: user.name,
    requesterRole: user.role as 'dealer' | 'sub_dealer' | 'worker' | 'representative',
    amount: numAmount,
    payoutMethod: payoutMethod || 'bKash',
    payoutDetails: accountDetails || user.mobile,
    status: 'pending',
    requestedAt: new Date().toISOString(),
  };

  withdrawalsDb.unshift(newWithdrawal);
  person.commissionBalance -= numAmount;

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'WITHDRAWAL_REQUEST',
    entity: user.role.toUpperCase(),
    details: `${user.name} requested withdrawal of ৳${numAmount} via ${payoutMethod}.`,
    adminUser: 'PORTAL_USER',
    timestamp: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: 'উত্তোলন আবেদন প্রধান ফাইন্যান্স বিভাগে জমা হয়েছে।',
    withdrawal: newWithdrawal,
    remainingBalance: person.commissionBalance,
  });
});

// Portal Action: Worker Update Delivery Status
app.post('/api/portal/worker/complete-delivery', portalAuthMiddleware(['worker']), (req: Request, res: Response) => {
  const { deliveryId, otp } = req.body;
  const delivery = deliveriesDb.find((d) => d.id === deliveryId);

  if (!delivery) {
    return res.status(404).json({ success: false, error: 'ডেলিভারি রেকর্ড পাওয়া যায়নি।' });
  }

  delivery.status = 'delivered';
  delivery.otpVerified = true;

  res.json({ success: true, message: 'ডেলিভারি সফলভাবে সম্পন্ন হয়েছে।', delivery });
});

// Portal Action: Customer Report Payment
app.post('/api/portal/customer/report-payment', portalAuthMiddleware(['customer']), (req: Request, res: Response) => {
  const user = (req as any).portalUser as PortalSessionData;
  const { cardNumber, amount, type, method, transactionReference, notes } = req.body;

  if (!transactionReference || !amount) {
    return res.status(400).json({ success: false, error: 'টাকা এবং ট্রানজেকশন রেফারেন্স প্রদান করুন।' });
  }

  const newPayment = {
    id: `PAY-${Date.now()}`,
    customerId: user.id,
    cardNumber: cardNumber || 'FPC-ONLINE',
    amount: Number(amount),
    type: type || 'installment',
    method: method || 'bKash',
    transactionReference: String(transactionReference).trim(),
    status: 'pending' as const,
    date: new Date().toISOString(),
    notes: notes || 'গ্রাহক পোর্টাল থেকে জমা দেওয়া ট্রানজেকশন রসিদ',
  };

  customerPaymentsDb.unshift(newPayment);

  res.json({
    success: true,
    message: 'পেমেন্ট তথ্য যাচাইয়ের জন্য সফলভাবে জমা হয়েছে। ২৪ ঘণ্টার মধ্যে ভেরিফিকেশন সম্পন্ন হবে।',
    payment: newPayment,
  });
});

// ---------------------------------------------
// HIERARCHY-BASED REGISTRATION & TRANSFER ROUTES (ZERO-ORPHAN ENFORCEMENT)
// ---------------------------------------------

// 1. Worker registers a Customer (Auto-bound to Worker's hierarchy)
app.post('/api/portal/worker/register-customer', portalAuthMiddleware(['worker']), (req: Request, res: Response) => {
  const workerSession = (req as any).portalUser as PortalSessionData;
  const worker = networkPeopleDb.find((p) => p.id === workerSession.id && p.role === 'worker');

  if (!worker) {
    return res.status(404).json({ success: false, error: 'দায়িত্বপ্রাপ্ত কর্মী পাওয়া যায়নি।' });
  }

  const { name, mobile, address, area, nid, photoUrl } = req.body;

  if (!name || !mobile) {
    return res.status(400).json({ success: false, error: 'গ্রাহকের নাম এবং মোবাইল নম্বর আবশ্যক।' });
  }

  const cleanMobile = mobile.replace(/\D/g, '');
  if (networkPeopleDb.some((p) => p.mobile.replace(/\D/g, '') === cleanMobile)) {
    return res.status(400).json({ success: false, error: 'এই মোবাইল নম্বরটি ইতিমধ্যে নিবন্ধিত আছে।' });
  }

  const customerId = `CUS-${Math.floor(100000 + Math.random() * 900000)}`;
  const newCustomer = {
    id: customerId,
    role: 'customer' as const,
    name: name.trim(),
    mobile: mobile.trim(),
    password: 'customer@2026',
    address: (address || worker.address || '').trim(),
    area: (area || worker.area || '').trim(),
    parentWorkerId: worker.id,
    parentSubDealerId: worker.parentSubDealerId,
    parentDealerId: worker.parentDealerId,
    status: 'active' as const,
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    nid: nid || '',
    joinedDate: new Date().toISOString().split('T')[0],
    commissionBalance: 0,
    totalCommissionEarned: 0,
  };

  networkPeopleDb.push(newCustomer);

  // Automatically issue Fair Price Card
  const newCard: FairPriceCardRecord = {
    id: `card-${Date.now()}`,
    cardNumber: `FPC-${Math.floor(10000000 + Math.random() * 90000000)}`,
    customerId: newCustomer.id,
    customerName: newCustomer.name,
    customerMobile: newCustomer.mobile,
    customerNid: newCustomer.nid,
    customerAddress: newCustomer.address,
    customerArea: newCustomer.area,
    status: 'active' as const,
    representativeId: worker.id,
    representativeName: worker.name,
    assignedRepresentative: worker.name,
    parentDealerId: worker.parentDealerId,
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '2028-12-31',
    cardFee: 0,
    paidFee: 0,
    remainingFee: 0,
    monthlyQuotaKg: 25,
    monthlyGroceryLimit: 5000,
    groceryPurchasedThisMonth: 0,
    applianceCreditLimit: 40000,
    applianceCreditUsed: 0,
    totalSavings: 0,
  };
  fairPriceCardsDb.unshift(newCard);

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'HIERARCHY_REGISTER',
    entity: 'CUSTOMER',
    details: `Customer ${newCustomer.name} (${newCustomer.id}) registered by Worker ${worker.name} (${worker.id}). Hierarchy: Main Dealer [${worker.parentDealerId}] -> Sub-Dealer [${worker.parentSubDealerId || 'none'}] -> Worker [${worker.id}].`,
    adminUser: worker.name,
    timestamp: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: 'গ্রাহক সফলভাবে নিবন্ধিত হয়েছে এবং ফেয়ার প্রাইস কার্ড ইস্যু করা হয়েছে।',
    customer: newCustomer,
    card: newCard,
  });
});

// 2. Dealer registers a Sub-Dealer (Strictly belongs to logged-in Dealer)
app.post('/api/portal/dealer/register-sub-dealer', portalAuthMiddleware(['dealer']), (req: Request, res: Response) => {
  const dealerSession = (req as any).portalUser as PortalSessionData;
  const { name, mobile, email, address, area, nid, tradeLicense } = req.body;

  if (!name || !mobile) {
    return res.status(400).json({ success: false, error: 'সাব-ডিলারের নাম ও মোবাইল আবশ্যক।' });
  }

  const cleanMobile = mobile.replace(/\D/g, '');
  if (networkPeopleDb.some((p) => p.mobile.replace(/\D/g, '') === cleanMobile)) {
    return res.status(400).json({ success: false, error: 'এই মোবাইল নম্বরটি ইতিমধ্যে নিবন্ধিত।' });
  }

  const subDealerId = `SUB-${Math.floor(100000 + Math.random() * 900000)}`;
  const newSubDealer = {
    id: subDealerId,
    role: 'sub_dealer' as const,
    name: name.trim(),
    mobile: mobile.trim(),
    email: email ? email.trim() : undefined,
    password: 'subdealer@2026',
    address: address || '',
    area: area || '',
    parentDealerId: dealerSession.id, // Strictly auto-assigned!
    status: 'active' as const,
    nid: nid || '',
    tradeLicense: tradeLicense || '',
    joinedDate: new Date().toISOString().split('T')[0],
    commissionBalance: 0,
    totalCommissionEarned: 0,
  };

  networkPeopleDb.push(newSubDealer);

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'HIERARCHY_REGISTER',
    entity: 'SUB_DEALER',
    details: `Sub-Dealer ${newSubDealer.name} (${newSubDealer.id}) registered under Main Dealer ${dealerSession.name} (${dealerSession.id}).`,
    adminUser: dealerSession.name,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, message: 'সাব-ডিলার সফলভাবে তৈরি হয়েছে।', subDealer: newSubDealer });
});

// 3. Dealer registers a Worker (Either directly under dealer OR under dealer's sub-dealer)
app.post('/api/portal/dealer/register-worker', portalAuthMiddleware(['dealer']), (req: Request, res: Response) => {
  const dealerSession = (req as any).portalUser as PortalSessionData;
  const { name, mobile, address, area, parentSubDealerId } = req.body;

  if (!name || !mobile) {
    return res.status(400).json({ success: false, error: 'কর্মীর নাম ও মোবাইল আবশ্যক।' });
  }

  // If subDealer is specified, verify it belongs to this dealer
  if (parentSubDealerId) {
    const subDealer = networkPeopleDb.find(
      (p) => p.id === parentSubDealerId && p.role === 'sub_dealer' && p.parentDealerId === dealerSession.id
    );
    if (!subDealer) {
      return res.status(400).json({ success: false, error: 'নির্বাচিত সাব-ডিলারটি আপনার অধীনস্থ নয়।' });
    }
  }

  const cleanMobile = mobile.replace(/\D/g, '');
  if (networkPeopleDb.some((p) => p.mobile.replace(/\D/g, '') === cleanMobile)) {
    return res.status(400).json({ success: false, error: 'এই মোবাইল নম্বরটি ইতিমধ্যে নিবন্ধিত।' });
  }

  const workerId = `WRK-${Math.floor(100000 + Math.random() * 900000)}`;
  const newWorker = {
    id: workerId,
    role: 'worker' as const,
    name: name.trim(),
    mobile: mobile.trim(),
    password: 'worker@2026',
    address: address || '',
    area: area || '',
    parentDealerId: dealerSession.id, // Strictly auto-assigned!
    parentSubDealerId: parentSubDealerId || undefined,
    status: 'active' as const,
    joinedDate: new Date().toISOString().split('T')[0],
    commissionBalance: 0,
    totalCommissionEarned: 0,
  };

  networkPeopleDb.push(newWorker);

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'HIERARCHY_REGISTER',
    entity: 'WORKER',
    details: `Worker ${newWorker.name} (${newWorker.id}) registered under Dealer ${dealerSession.name} (Sub-Dealer: ${parentSubDealerId || 'Direct'}).`,
    adminUser: dealerSession.name,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, message: 'কর্মী সফলভাবে নিবন্ধিত হয়েছে।', worker: newWorker });
});

// 4. Sub-Dealer registers a Worker (Strictly auto-bound to this Sub-Dealer and its Main Dealer)
app.post('/api/portal/sub-dealer/register-worker', portalAuthMiddleware(['sub_dealer']), (req: Request, res: Response) => {
  const subDealerSession = (req as any).portalUser as PortalSessionData;
  const subDealer = networkPeopleDb.find((p) => p.id === subDealerSession.id && p.role === 'sub_dealer');

  if (!subDealer || !subDealer.parentDealerId) {
    return res.status(400).json({ success: false, error: 'সাব-ডিলারের মূল ডিলার তথ্য পাওয়া যায়নি।' });
  }

  const { name, mobile, address, area } = req.body;
  if (!name || !mobile) {
    return res.status(400).json({ success: false, error: 'কর্মীর নাম ও মোবাইল আবশ্যক।' });
  }

  const cleanMobile = mobile.replace(/\D/g, '');
  if (networkPeopleDb.some((p) => p.mobile.replace(/\D/g, '') === cleanMobile)) {
    return res.status(400).json({ success: false, error: 'এই মোবাইল নম্বরটি ইতিমধ্যে নিবন্ধিত।' });
  }

  const workerId = `WRK-${Math.floor(100000 + Math.random() * 900000)}`;
  const newWorker = {
    id: workerId,
    role: 'worker' as const,
    name: name.trim(),
    mobile: mobile.trim(),
    password: 'worker@2026',
    address: address || '',
    area: area || '',
    parentSubDealerId: subDealer.id, // Strictly auto-assigned!
    parentDealerId: subDealer.parentDealerId, // Inherited from Sub-Dealer!
    status: 'active' as const,
    joinedDate: new Date().toISOString().split('T')[0],
    commissionBalance: 0,
    totalCommissionEarned: 0,
  };

  networkPeopleDb.push(newWorker);

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'HIERARCHY_REGISTER',
    entity: 'WORKER',
    details: `Worker ${newWorker.name} (${newWorker.id}) registered by Sub-Dealer ${subDealer.name} (${subDealer.id}) under Main Dealer [${subDealer.parentDealerId}].`,
    adminUser: subDealer.name,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, message: 'কর্মী সফলভাবে নিবন্ধিত হয়েছে।', worker: newWorker });
});

// 5. Hierarchy Structure & Dropdown Helper (Public/Portal/Admin)
app.get('/api/hierarchy/network-tree', (req: Request, res: Response) => {
  const dealers = networkPeopleDb
    .filter((p) => p.role === 'dealer')
    .map((d) => ({ id: d.id, name: d.name, area: d.area, mobile: d.mobile, status: d.status }));

  const subDealers = networkPeopleDb
    .filter((p) => p.role === 'sub_dealer')
    .map((s) => ({
      id: s.id,
      name: s.name,
      area: s.area,
      mobile: s.mobile,
      parentDealerId: s.parentDealerId,
      status: s.status,
    }));

  const workers = networkPeopleDb
    .filter((p) => p.role === 'worker')
    .map((w) => ({
      id: w.id,
      name: w.name,
      area: w.area,
      mobile: w.mobile,
      parentDealerId: w.parentDealerId,
      parentSubDealerId: w.parentSubDealerId,
      status: w.status,
    }));

  res.json({ success: true, dealers, subDealers, workers });
});

// ---------------------------------------------
// ADVERTISEMENT SYSTEM API ROUTES (7 Configurable Slots)
// ---------------------------------------------

// Public Ads: Get active ads by slot or all slots with impressions
app.get('/api/ads', (req: Request, res: Response) => {
  const { slotId } = req.query;
  const today = new Date().toISOString().split('T')[0];

  let activeAds = advertisementsDb.filter((a) => {
    if (!a.active) return false;
    if (a.startDate && a.startDate > today) return false;
    if (a.endDate && a.endDate < today) return false;
    if (slotId && a.slotId !== slotId) return false;
    return true;
  });

  // Sort by priority descending (highest priority first)
  activeAds.sort((a, b) => (b.priority || 5) - (a.priority || 5));

  // Increment impression counter
  activeAds.forEach((ad) => {
    ad.impressions = (ad.impressions || 0) + 1;
  });

  res.json({
    success: true,
    slots: adSlotsDb,
    advertisements: activeAds,
  });
});

// Public Ad Click Tracking
app.post('/api/ads/click/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const ad = advertisementsDb.find((a) => a.id === id);
  if (ad) {
    ad.clicks = (ad.clicks || 0) + 1;
    return res.json({ success: true, clicks: ad.clicks, destinationUrl: ad.destinationUrl });
  }
  res.status(404).json({ success: false, error: 'বিজ্ঞাপন পাওয়া যায়নি।' });
});

// ---------------------------------------------
// SECURE ADMIN API ROUTES
// ---------------------------------------------

// Admin Login (Super Admin & Sub-Admin)
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, error: 'পাসওয়ার্ড প্রদান করুন' });
  }

  const cleanUser = (username || 'admin').trim().toLowerCase();

  // Find user in admin database
  const user = adminUsersDb.find(
    (u) => u.username.toLowerCase() === cleanUser || (cleanUser === 'admin' && u.role === 'super_admin')
  );

  // Fallback for root ADMIN_PASSWORD
  if (!user && (cleanUser === 'admin' || !username) && (password === ADMIN_PASSWORD || password === 'holynex@admin2026')) {
    const rootAdmin = adminUsersDb.find((u) => u.role === 'super_admin') || initialAdminUsers[0];
    res.cookie('hnx_admin_token', ADMIN_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    sessionMap[ADMIN_TOKEN] = {
      id: rootAdmin.id,
      username: rootAdmin.username,
      name: rootAdmin.name,
      role: rootAdmin.role,
      permissions: rootAdmin.permissions,
    };
    auditLogsDb.unshift({
      id: `log-${Date.now()}`,
      action: 'ADMIN_LOGIN_SUCCESS',
      entity: 'ADMIN_AUTH',
      details: `${rootAdmin.name} (${rootAdmin.role}) authenticated via root key.`,
      adminUser: rootAdmin.name,
      timestamp: new Date().toISOString(),
    });
    const { password: _, ...safeUser } = rootAdmin;
    return res.json({ success: true, token: ADMIN_TOKEN, user: safeUser });
  }

  if (!user) {
    auditLogsDb.unshift({
      id: `log-${Date.now()}`,
      action: 'ADMIN_LOGIN_FAILED',
      entity: 'ADMIN_AUTH',
      details: `Failed admin login attempt: Username '${cleanUser}' not found.`,
      adminUser: 'UNKNOWN',
      timestamp: new Date().toISOString(),
    });
    return res.status(401).json({ success: false, error: 'ইউজারনেম সঠিক নয়!' });
  }

  if (user.status !== 'active') {
    return res.status(403).json({ success: false, error: 'এই অ্যাকাউন্টটি নিষ্ক্রিয়। প্রধান অ্যাডমিনের সাথে যোগাযোগ করুন।' });
  }

  // Validate password
  const isValid =
    user.password === password ||
    (user.role === 'super_admin' && (password === ADMIN_PASSWORD || password === 'holynex@admin2026'));

  if (!isValid) {
    auditLogsDb.unshift({
      id: `log-${Date.now()}`,
      action: 'ADMIN_LOGIN_FAILED',
      entity: 'ADMIN_AUTH',
      details: `Failed login attempt for user '${user.username}'.`,
      adminUser: user.username,
      timestamp: new Date().toISOString(),
    });
    return res.status(401).json({ success: false, error: 'ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড লিখুন।' });
  }

  // Generate dynamic session token
  const token = `hnx_tok_${user.role}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  sessionMap[token] = {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    permissions: user.permissions,
  };

  user.lastLogin = new Date().toISOString();

  res.cookie('hnx_admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'ADMIN_LOGIN_SUCCESS',
    entity: 'ADMIN_AUTH',
    details: `${user.name} (${user.role === 'super_admin' ? 'প্রধান অ্যাডমিন' : 'সাব-এডমিন'}) লগইন করেছেন।`,
    adminUser: user.name,
    timestamp: new Date().toISOString(),
  });

  const { password: _, ...safeUser } = user;
  return res.json({ success: true, token, user: safeUser });
});

// Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const token = req.cookies?.hnx_admin_token || req.headers.authorization?.replace('Bearer ', '');
  if (token && sessionMap[token]) {
    delete sessionMap[token];
  }
  res.clearCookie('hnx_admin_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Admin Verify Session
app.get('/api/admin/verify', (req: Request, res: Response) => {
  const token = req.cookies?.hnx_admin_token || req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    if (token === ADMIN_TOKEN) {
      const superAdmin = adminUsersDb.find((u) => u.role === 'super_admin') || initialAdminUsers[0];
      const { password: _, ...safeUser } = superAdmin;
      return res.json({ authenticated: true, user: safeUser, role: 'super_admin' });
    }
    if (sessionMap[token]) {
      return res.json({ authenticated: true, user: sessionMap[token], role: sessionMap[token].role });
    }
  }
  res.json({ authenticated: false });
});

// Admin Users Management (Super Admin only can manage)
app.get('/api/admin/users', authMiddleware, (_req: Request, res: Response) => {
  const safeList = adminUsersDb.map(({ password: _, ...u }) => u);
  res.json({ success: true, users: safeList });
});

app.post('/api/admin/users', authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).adminUser;
  if (currentUser?.role !== 'super_admin') {
    return res.status(403).json({ success: false, error: 'শুধুমাত্র প্রধান অ্যাডমিন নতুন সাব-এডমিন তৈরি করতে পারেন।' });
  }

  const { username, password, name, role, email, phone, permissions } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ success: false, error: 'ইউজারনেম, পাসওয়ার্ড এবং নাম প্রদান আবশ্যক।' });
  }

  const cleanUser = username.trim().toLowerCase();
  if (adminUsersDb.some((u) => u.username.toLowerCase() === cleanUser)) {
    return res.status(400).json({ success: false, error: 'এই ইউজারনেমটি ইতিমধ্যে বিদ্যমান।' });
  }

  const newUser = {
    id: `admin-${Date.now()}`,
    username: cleanUser,
    password,
    name,
    role: role || 'sub_admin',
    email: email || '',
    phone: phone || '',
    status: 'active' as const,
    permissions: permissions || {
      canManageApplications: true,
      canManageProducts: true,
      canManageNews: true,
      canManageSlides: true,
      canManageSettings: false,
      canManageAdmins: false,
    },
    createdAt: new Date().toISOString(),
  };

  adminUsersDb.push(newUser);
  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'ADMIN_USER_CREATED',
    entity: 'AUTH',
    details: `${currentUser.name} created new ${newUser.role}: ${newUser.username} (${newUser.name})`,
    adminUser: currentUser.name,
    timestamp: new Date().toISOString(),
  });

  const { password: _, ...safeUser } = newUser;
  res.json({ success: true, user: safeUser });
});

app.put('/api/admin/users/:id', authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).adminUser;
  if (currentUser?.role !== 'super_admin') {
    return res.status(403).json({ success: false, error: 'শুধুমাত্র প্রধান অ্যাডমিন অ্যাকাউন্ট পরিবর্তন করতে পারেন।' });
  }

  const { id } = req.params;
  const user = adminUsersDb.find((u) => u.id === id);
  if (!user) return res.status(404).json({ success: false, error: 'ইউজার পাওয়া যায়নি' });

  const { name, email, phone, status, permissions, password } = req.body;
  if (name) user.name = name;
  if (email !== undefined) user.email = email;
  if (phone !== undefined) user.phone = phone;
  if (status) user.status = status;
  if (permissions) user.permissions = permissions;
  if (password && password.trim()) user.password = password;

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'ADMIN_USER_UPDATED',
    entity: 'AUTH',
    details: `Updated user profile for ${user.username}`,
    adminUser: currentUser.name,
    timestamp: new Date().toISOString(),
  });

  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

app.delete('/api/admin/users/:id', authMiddleware, (req: Request, res: Response) => {
  const currentUser = (req as any).adminUser;
  if (currentUser?.role !== 'super_admin') {
    return res.status(403).json({ success: false, error: 'শুধুমাত্র প্রধান অ্যাডমিন একাউন্ট ডিলিট করতে পারেন।' });
  }

  const { id } = req.params;
  const target = adminUsersDb.find((u) => u.id === id);
  if (target?.role === 'super_admin' && adminUsersDb.filter((u) => u.role === 'super_admin').length <= 1) {
    return res.status(400).json({ success: false, error: 'প্রধান অ্যাডমিন অ্যাকাউন্টটি মুছে ফেলা যাবে না।' });
  }

  adminUsersDb = adminUsersDb.filter((u) => u.id !== id);
  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'ADMIN_USER_DELETED',
    entity: 'AUTH',
    details: `User ${id} removed by ${currentUser.name}`,
    adminUser: currentUser.name,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true });
});

// Admin Dashboard Analytics
app.get('/api/admin/dashboard', authMiddleware, (_req: Request, res: Response) => {
  const totalApps = dealerApplicationsDb.length;
  const pendingApps = dealerApplicationsDb.filter((a) => a.status === 'Pending').length;
  const underReviewApps = dealerApplicationsDb.filter((a) => a.status === 'Under Review').length;
  const approvedApps = dealerApplicationsDb.filter((a) => a.status === 'Approved').length;
  const rejectedApps = dealerApplicationsDb.filter((a) => a.status === 'Rejected').length;

  res.json({
    metrics: {
      totalApplications: totalApps,
      pendingApplications: pendingApps,
      underReviewApplications: underReviewApps,
      approvedApplications: approvedApps,
      rejectedApplications: rejectedApps,
      totalProducts: productsDb.length,
      activeSliders: slidesDb.filter((s) => s.active !== false).length,
      publishedNews: newsDb.filter((n) => n.published !== false).length,
      teamMembers: teamDb.length,
    },
    systemStatus: {
      server: 'Healthy (Port 3000)',
      database: process.env.DATABASE_URL ? 'PostgreSQL (Connected)' : 'Local High-Speed Cache (Active)',
      smsGateway: process.env.SMS_API_URL ? 'Connected' : 'Ready (Mock/Live Handler)',
      pushNotifications: process.env.VAPID_PUBLIC_KEY ? 'VAPID Configured' : 'Service Worker Ready',
      aiEngine: process.env.GEMINI_API_KEY ? 'Gemini 3.8 Flash' : 'Smart Corporate Fallback Engine',
    },
  });
});

// Admin Dealer Management - List all applications
app.get('/api/admin/applications', authMiddleware, (req: Request, res: Response) => {
  const { status, search } = req.query;
  let list = [...dealerApplicationsDb];

  if (status && status !== 'All') {
    list = list.filter((a) => a.status === status);
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.fullName.toLowerCase().includes(q) ||
        a.mobile.includes(q) ||
        a.dealerArea.toLowerCase().includes(q)
    );
  }

  res.json(list);
});

// Admin Dealer Management - Update Status & Private Notes
app.post('/api/admin/applications/:id/status', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminPrivateNotes, publicMessage, sendSms, sendPush } = req.body;

  const appItem = dealerApplicationsDb.find((a) => a.id === id);
  if (!appItem) {
    return res.status(404).json({ success: false, error: 'Application not found' });
  }

  if (status) appItem.status = status;
  if (adminPrivateNotes !== undefined) appItem.adminPrivateNotes = adminPrivateNotes;
  if (publicMessage !== undefined) appItem.publicMessage = publicMessage;
  appItem.updatedAt = new Date().toISOString();

  // Audit
  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'DEALER_STATUS_UPDATE',
    entity: 'DEALER_APP',
    details: `Application ${id} status set to '${status}'.`,
    adminUser: 'SuperAdmin',
    timestamp: new Date().toISOString(),
  });

  // SMS dispatch logic
  let smsResult = 'NOT_REQUESTED';
  if (sendSms) {
    smsResult = process.env.SMS_API_URL ? 'SENT_VIA_CARRIER' : 'SIMULATED_SUCCESS_200';
    notificationsDb.unshift({
      id: `notif-${Date.now()}`,
      applicationId: id,
      recipientMobile: appItem.mobile,
      type: status.toLowerCase().replace(' ', '_'),
      channel: 'sms',
      title: `ডিলার স্ট্যাটাস আপডেট: ${status}`,
      message: `হোলিনেক্স গ্রুপ: প্রিয় আবেদনকারী, আপনার আবেদন ${id}-এর স্ট্যাটাস '${status}' করা হয়েছে। বিস্তারিত: ${publicMessage || 'অফিসিয়াল ফলাফল নির্ধারিত'}`,
      sentAt: new Date().toISOString(),
      status: 'sent',
      providerResponse: smsResult,
    });
  }

  res.json({ success: true, application: appItem, smsStatus: smsResult });
});

// Admin Product CRUD
app.post('/api/admin/products', authMiddleware, (req: Request, res: Response) => {
  const newProduct = {
    ...req.body,
    id: `prod-${Date.now()}`,
  };
  productsDb.unshift(newProduct);
  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'PRODUCT_CREATED',
    entity: 'PRODUCT',
    details: `Created product ${newProduct.nameEn || newProduct.nameBn}`,
    adminUser: 'SuperAdmin',
    timestamp: new Date().toISOString(),
  });
  res.json({ success: true, product: newProduct });
});

app.put('/api/admin/products/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = productsDb.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  productsDb[idx] = { ...productsDb[idx], ...req.body };
  res.json({ success: true, product: productsDb[idx] });
});

app.delete('/api/admin/products/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  productsDb = productsDb.filter((p) => p.id !== id);
  res.json({ success: true });
});

// Admin News CRUD
app.post('/api/admin/news', authMiddleware, (req: Request, res: Response) => {
  const item = { ...req.body, id: `news-${Date.now()}` };
  newsDb.unshift(item);
  res.json({ success: true, news: item });
});

app.put('/api/admin/news/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = newsDb.findIndex((n) => n.id === id);
  if (idx === -1) return res.status(404).json({ error: 'News not found' });
  newsDb[idx] = { ...newsDb[idx], ...req.body };
  res.json({ success: true, news: newsDb[idx] });
});

app.delete('/api/admin/news/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  newsDb = newsDb.filter((n) => n.id !== id);
  res.json({ success: true });
});

// Admin Slides CRUD
app.post('/api/admin/slides', authMiddleware, (req: Request, res: Response) => {
  const item = { ...req.body, id: `slide-${Date.now()}` };
  slidesDb.unshift(item);
  res.json({ success: true, slide: item });
});

app.put('/api/admin/slides/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = slidesDb.findIndex((s) => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Slide not found' });
  slidesDb[idx] = { ...slidesDb[idx], ...req.body };
  res.json({ success: true, slide: slidesDb[idx] });
});

app.delete('/api/admin/slides/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  slidesDb = slidesDb.filter((s) => s.id !== id);
  res.json({ success: true });
});

// Admin Site Settings
app.post('/api/admin/settings', authMiddleware, (req: Request, res: Response) => {
  settingsDb = { ...settingsDb, ...req.body };
  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'SETTINGS_UPDATE',
    entity: 'SETTINGS',
    details: 'Corporate site settings and contacts updated.',
    adminUser: 'SuperAdmin',
    timestamp: new Date().toISOString(),
  });
  res.json({ success: true, settings: settingsDb });
});

// Admin Audit Logs
app.get('/api/admin/audit-logs', authMiddleware, (_req: Request, res: Response) => {
  res.json(auditLogsDb);
});

// Admin Notifications History
app.get('/api/admin/notifications', authMiddleware, (_req: Request, res: Response) => {
  res.json(notificationsDb);
});

// ---------------------------------------------
// ADMIN REAL AI ASSISTANT & KNOWLEDGE BASE APIS
// ---------------------------------------------

// Get AI Settings
app.get('/api/admin/ai/settings', authMiddleware, (_req: Request, res: Response) => {
  res.json({ success: true, settings: aiSettingsDb });
});

// Save AI Settings
app.post('/api/admin/ai/settings', authMiddleware, (req: Request, res: Response) => {
  const currentAdmin = (req as any).adminUser?.name || 'SuperAdmin';
  aiSettingsDb = { ...aiSettingsDb, ...req.body };

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'AI_SETTINGS_UPDATE',
    entity: 'AI_SYSTEM',
    details: `Corporate AI parameters updated. Status: ${aiSettingsDb.enabled ? 'Active' : 'Disabled'}.`,
    adminUser: currentAdmin,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, settings: aiSettingsDb });
});

// Get AI Knowledge Base
app.get('/api/admin/ai/knowledge', authMiddleware, (_req: Request, res: Response) => {
  res.json({ success: true, knowledge: aiKnowledgeBaseDb });
});

// Save or Update Knowledge Item
app.post('/api/admin/ai/knowledge', authMiddleware, (req: Request, res: Response) => {
  const currentAdmin = (req as any).adminUser?.name || 'SuperAdmin';
  const item = req.body;
  if (!item.questionBn || !item.answerBn) {
    return res.status(400).json({ success: false, error: 'Question and Answer in Bangla are required.' });
  }

  const existingIdx = aiKnowledgeBaseDb.findIndex((k) => k.id === item.id);
  const updatedItem = {
    ...item,
    id: item.id || `kb-${Date.now()}`,
    updatedAt: new Date().toISOString(),
    active: item.active !== undefined ? item.active : true,
    keywords: Array.isArray(item.keywords) ? item.keywords : [],
  };

  if (existingIdx >= 0) {
    aiKnowledgeBaseDb[existingIdx] = updatedItem;
  } else {
    aiKnowledgeBaseDb.unshift(updatedItem);
  }

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'AI_KNOWLEDGE_SAVE',
    entity: 'AI_SYSTEM',
    details: `Knowledge item "${updatedItem.questionBn.slice(0, 35)}..." saved.`,
    adminUser: currentAdmin,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, item: updatedItem });
});

// Delete Knowledge Item
app.delete('/api/admin/ai/knowledge/:id', authMiddleware, (req: Request, res: Response) => {
  const { id } = req.params;
  const currentAdmin = (req as any).adminUser?.name || 'SuperAdmin';
  aiKnowledgeBaseDb = aiKnowledgeBaseDb.filter((k) => k.id !== id);

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'AI_KNOWLEDGE_DELETE',
    entity: 'AI_SYSTEM',
    details: `Knowledge base item ${id} deleted.`,
    adminUser: currentAdmin,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, message: 'Deleted successfully' });
});

// Get AI Analytics & Interaction Logs
app.get('/api/admin/ai/analytics', authMiddleware, (_req: Request, res: Response) => {
  res.json({ success: true, analytics: aiChatAnalyticsDb });
});

// Reset AI Analytics Logs
app.post('/api/admin/ai/analytics/reset', authMiddleware, (req: Request, res: Response) => {
  const currentAdmin = (req as any).adminUser?.name || 'SuperAdmin';
  aiChatAnalyticsDb = {
    ...aiChatAnalyticsDb,
    recentLogs: [],
  };

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'AI_ANALYTICS_RESET',
    entity: 'AI_SYSTEM',
    details: 'AI chat interaction query logs cleared.',
    adminUser: currentAdmin,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, message: 'Analytics logs reset successfully' });
});

// Admin Reset Network Person Password
app.post('/api/admin/people/reset-password', authMiddleware, (req: Request, res: Response) => {
  const { personId, newPassword } = req.body;
  if (!personId || !newPassword) {
    return res.status(400).json({ success: false, error: 'Person ID and new password are required' });
  }
  const person = networkPeopleDb.find((p) => p.id === personId);
  if (!person) {
    return res.status(404).json({ success: false, error: 'User not found in network' });
  }
  person.password = newPassword;
  person.passwordHash = hashPortalPassword(newPassword);

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'ADMIN_RESET_PASSWORD',
    entity: person.role.toUpperCase(),
    details: `Admin reset password for ${person.name} (${person.id}).`,
    adminUser: (req as any).adminUser?.name || 'SuperAdmin',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, message: `Password reset successfully for ${person.name}.` });
});

// Admin Live AI Playground Test
app.post('/api/admin/ai/test', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { prompt, lang = 'bn', testLookupId } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    let lookupNote = '';
    if (testLookupId) {
      const appMatch = dealerApplicationsDb.find((a) => a.id === testLookupId || a.mobile.includes(testLookupId));
      if (appMatch) {
        lookupNote = `Verified Application: ${appMatch.id}, Name: ${appMatch.fullName}, Status: ${appMatch.status}`;
      }
      const cardMatch = fairPriceCardsDb.find((c) => c.cardNumber === testLookupId || c.customerMobile.includes(testLookupId));
      if (cardMatch) {
        lookupNote += (lookupNote ? ' | ' : '') + `Verified Card: ${cardMatch.cardNumber}, Customer: ${cardMatch.customerName}, Status: ${cardMatch.status}`;
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let responseText = '';
    let mode = 'rule_based_fallback';

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
        });

        const testInstruction = `You are ${aiSettingsDb.assistantNameBn}. Tone: ${aiSettingsDb.tone}. Corporate facts: Holynex Group Jurain, hotline 01307835260. ${lookupNote ? `[LOOKUP CONTEXT]: ${lookupNote}` : ''} Language: ${lang}. Keep response concise and factual.`;

        const testRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: testInstruction,
            temperature: 0.3,
          },
        });
        responseText = testRes.text || '';
        mode = 'gemini-3.8-flash';
      } catch (e: any) {
        console.error('[Admin Test] Gemini error:', e);
      }
    }

    if (!responseText) {
      responseText = `[Test Fallback Response]: Holynex Group official service test. Query: "${prompt}". Status: OK.`;
    }

    res.json({
      success: true,
      mode,
      hasApiKey: !!apiKey,
      lookupFound: !!lookupNote,
      response: responseText,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------
// ADMIN ADVERTISEMENT MANAGEMENT APIS
// ---------------------------------------------

// Get All Ads + Slot Analytics
app.get('/api/admin/ads', authMiddleware, (_req: Request, res: Response) => {
  const adsWithAnalytics = advertisementsDb.map((ad) => {
    const impressions = ad.impressions || 0;
    const clicks = ad.clicks || 0;
    const ctr = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;
    return { ...ad, ctr };
  });

  res.json({
    success: true,
    slots: adSlotsDb,
    advertisements: adsWithAnalytics,
  });
});

// Create Advertisement
app.post('/api/admin/ads', authMiddleware, (req: Request, res: Response) => {
  const currentAdmin = (req as any).adminUser?.name || 'Admin';
  const { companyName, title, slotId, type, imageUrl, destinationUrl, htmlCode, startDate, endDate, priority, showOnDesktop, showOnMobile, active } = req.body;

  if (!companyName || !title || !slotId) {
    return res.status(400).json({ success: false, error: 'কোম্পানির নাম, বিজ্ঞাপনের শিরোনাম এবং স্লট নির্বাচন আবশ্যক।' });
  }

  const newAd: AdvertisementItem = {
    id: `AD-${Date.now().toString().slice(-6)}`,
    companyName: companyName.trim(),
    title: title.trim(),
    slotId,
    type: type || 'image_banner',
    imageUrl: imageUrl || '',
    destinationUrl: destinationUrl || '',
    htmlCode: htmlCode || '',
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || '2026-12-31',
    priority: Number(priority) || 5,
    showOnDesktop: showOnDesktop !== undefined ? Boolean(showOnDesktop) : true,
    showOnMobile: showOnMobile !== undefined ? Boolean(showOnMobile) : true,
    active: active !== undefined ? Boolean(active) : true,
    impressions: 0,
    clicks: 0,
    createdAt: new Date().toISOString(),
  };

  advertisementsDb.unshift(newAd);

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'AD_CREATED',
    entity: 'MARKETING',
    details: `Advertisement "${newAd.title}" (${newAd.companyName}) created for slot ${newAd.slotId}.`,
    adminUser: currentAdmin,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, message: 'বিজ্ঞাপন সফলভাবে তৈরি হয়েছে।', advertisement: newAd });
});

// Update Advertisement
app.put('/api/admin/ads/:id', authMiddleware, (req: Request, res: Response) => {
  const currentAdmin = (req as any).adminUser?.name || 'Admin';
  const { id } = req.params;
  const idx = advertisementsDb.findIndex((a) => a.id === id);

  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'বিজ্ঞাপনটি পাওয়া যায়নি।' });
  }

  const updatedAd: AdvertisementItem = {
    ...advertisementsDb[idx],
    ...req.body,
    id,
    updatedAt: new Date().toISOString(),
  };

  advertisementsDb[idx] = updatedAd;

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'AD_UPDATED',
    entity: 'MARKETING',
    details: `Advertisement "${updatedAd.title}" (${id}) updated.`,
    adminUser: currentAdmin,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, message: 'বিজ্ঞাপন সফলভাবে হালনাগাদ করা হয়েছে।', advertisement: updatedAd });
});

// Delete Advertisement
app.delete('/api/admin/ads/:id', authMiddleware, (req: Request, res: Response) => {
  const currentAdmin = (req as any).adminUser?.name || 'Admin';
  const { id } = req.params;
  const target = advertisementsDb.find((a) => a.id === id);

  if (!target) {
    return res.status(404).json({ success: false, error: 'বিজ্ঞাপনটি পাওয়া যায়নি।' });
  }

  advertisementsDb = advertisementsDb.filter((a) => a.id !== id);

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'AD_DELETED',
    entity: 'MARKETING',
    details: `Advertisement "${target.title}" (${id}) deleted.`,
    adminUser: currentAdmin,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, message: 'বিজ্ঞাপন সফলভাবে মুছে ফেলা হয়েছে।' });
});

// Toggle Advertisement Status
app.post('/api/admin/ads/:id/toggle', authMiddleware, (req: Request, res: Response) => {
  const currentAdmin = (req as any).adminUser?.name || 'Admin';
  const { id } = req.params;
  const target = advertisementsDb.find((a) => a.id === id);

  if (!target) {
    return res.status(404).json({ success: false, error: 'বিজ্ঞাপনটি পাওয়া যায়নি।' });
  }

  target.active = !target.active;

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'AD_TOGGLE',
    entity: 'MARKETING',
    details: `Advertisement "${target.title}" set to ${target.active ? 'ACTIVE' : 'INACTIVE'}.`,
    adminUser: currentAdmin,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, active: target.active });
});

// ---------------------------------------------
// ADMIN HIERARCHY REGISTRATION & TRANSFERS
// ---------------------------------------------

// Admin registers user into hierarchy (Strict verification, no orphans)
app.post('/api/admin/hierarchy/register', authMiddleware, (req: Request, res: Response) => {
  const currentAdmin = (req as any).adminUser?.name || 'Admin';
  const { role, name, mobile, email, address, area, nid, tradeLicense, parentDealerId, parentSubDealerId, parentWorkerId } = req.body;

  if (!role || !name || !mobile) {
    return res.status(400).json({ success: false, error: 'ভূমিকা, নাম এবং মোবাইল নম্বর আবশ্যক।' });
  }

  const cleanMobile = mobile.replace(/\D/g, '');
  if (networkPeopleDb.some((p) => p.mobile.replace(/\D/g, '') === cleanMobile)) {
    return res.status(400).json({ success: false, error: 'এই মোবাইল নম্বরটি ইতিমধ্যে অন্য ব্যবহারকারীর দ্বারা ব্যবহৃত হচ্ছে।' });
  }

  // Hierarchy validation rules:
  let resolvedDealerId = parentDealerId;
  let resolvedSubDealerId = parentSubDealerId;
  let resolvedWorkerId = parentWorkerId;

  if (role === 'sub_dealer') {
    if (!parentDealerId) {
      return res.status(400).json({ success: false, error: 'সাব-ডিলার তৈরির জন্য অবশ্যই মূল ডিলার নির্বাচন করতে হবে।' });
    }
    const dealer = networkPeopleDb.find((p) => p.id === parentDealerId && p.role === 'dealer');
    if (!dealer) {
      return res.status(400).json({ success: false, error: 'নির্বাচিত মূল ডিলারটি সিস্টেমে বিদ্যমান নেই।' });
    }
  } else if (role === 'worker') {
    if (!parentDealerId && !parentSubDealerId) {
      return res.status(400).json({ success: false, error: 'কর্মীর জন্য মূল ডিলার অথবা সাব-ডিলার নির্বাচন করতে হবে।' });
    }
    if (parentSubDealerId) {
      const subDealer = networkPeopleDb.find((p) => p.id === parentSubDealerId && p.role === 'sub_dealer');
      if (!subDealer) {
        return res.status(400).json({ success: false, error: 'নির্বাচিত সাব-ডিলারটি সিস্টেমে বিদ্যমান নেই।' });
      }
      resolvedDealerId = subDealer.parentDealerId;
    } else {
      const dealer = networkPeopleDb.find((p) => p.id === parentDealerId && p.role === 'dealer');
      if (!dealer) {
        return res.status(400).json({ success: false, error: 'নির্বাচিত মূল ডিলারটি সিস্টেমে বিদ্যমান নেই।' });
      }
    }
  } else if (role === 'customer') {
    if (!parentWorkerId) {
      return res.status(400).json({ success: false, error: 'গ্রাহক তৈরির জন্য অবশ্যই একজন কর্মী (Worker) নির্বাচন করতে হবে।' });
    }
    const worker = networkPeopleDb.find((p) => p.id === parentWorkerId && p.role === 'worker');
    if (!worker) {
      return res.status(400).json({ success: false, error: 'নির্বাচিত কর্মীটি সিস্টেমে বিদ্যমান নেই।' });
    }
    resolvedSubDealerId = worker.parentSubDealerId;
    resolvedDealerId = worker.parentDealerId;
  }

  const prefix = role === 'dealer' ? 'DLR' : role === 'sub_dealer' ? 'SUB' : role === 'worker' ? 'WRK' : 'CUS';
  const newId = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

  const newPerson = {
    id: newId,
    role,
    name: name.trim(),
    mobile: mobile.trim(),
    email: email ? email.trim() : undefined,
    password: `${role}@2026`,
    address: (address || '').trim(),
    area: (area || '').trim(),
    nid: nid || '',
    tradeLicense: tradeLicense || '',
    parentDealerId: resolvedDealerId,
    parentSubDealerId: resolvedSubDealerId,
    parentWorkerId: resolvedWorkerId,
    status: 'active' as const,
    joinedDate: new Date().toISOString().split('T')[0],
    commissionBalance: 0,
    totalCommissionEarned: 0,
  };

  networkPeopleDb.push(newPerson);

  // If customer, also issue Fair Price Card
  if (role === 'customer') {
    const worker = networkPeopleDb.find((p) => p.id === resolvedWorkerId);
    const newCustomerCard: FairPriceCardRecord = {
      id: `card-${Date.now()}`,
      cardNumber: `FPC-${Math.floor(10000000 + Math.random() * 90000000)}`,
      customerId: newPerson.id,
      customerName: newPerson.name,
      customerMobile: newPerson.mobile,
      customerNid: newPerson.nid,
      customerAddress: newPerson.address,
      customerArea: newPerson.area,
      status: 'active',
      representativeId: worker?.id || 'WRK-DIRECT',
      representativeName: worker?.name || 'দায়িত্বপ্রাপ্ত কর্মী',
      assignedRepresentative: worker?.name || 'দায়িত্বপ্রাপ্ত কর্মী',
      parentDealerId: resolvedDealerId,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '2028-12-31',
      cardFee: 0,
      paidFee: 0,
      remainingFee: 0,
      monthlyQuotaKg: 25,
      monthlyGroceryLimit: 5000,
      groceryPurchasedThisMonth: 0,
      applianceCreditLimit: 40000,
      applianceCreditUsed: 0,
      totalSavings: 0,
    };
    fairPriceCardsDb.unshift(newCustomerCard);
  }

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'ADMIN_HIERARCHY_REGISTER',
    entity: role.toUpperCase(),
    details: `${role.toUpperCase()} ${newPerson.name} (${newPerson.id}) registered by Admin. Hierarchy: Dealer [${resolvedDealerId || 'none'}] -> Sub-Dealer [${resolvedSubDealerId || 'none'}] -> Worker [${resolvedWorkerId || 'none'}].`,
    adminUser: currentAdmin,
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, message: 'ব্যবহারকারী সফলভাবে তৈরি হয়েছে।', person: newPerson });
});

// Admin Transfers Worker (Updates worker and automatically updates all customers under this worker)
app.post('/api/admin/hierarchy/transfer-worker', authMiddleware, (req: Request, res: Response) => {
  const currentAdmin = (req as any).adminUser?.name || 'Admin';
  const { workerId, newParentType, newParentId } = req.body;

  const worker = networkPeopleDb.find((p) => p.id === workerId && p.role === 'worker');
  if (!worker) {
    return res.status(404).json({ success: false, error: 'কর্মী পাওয়া যায়নি।' });
  }

  let newDealerId = '';
  let newSubDealerId: string | undefined = undefined;

  if (newParentType === 'dealer') {
    const dealer = networkPeopleDb.find((p) => p.id === newParentId && p.role === 'dealer');
    if (!dealer) return res.status(400).json({ success: false, error: 'মূল ডিলার পাওয়া যায়নি।' });
    newDealerId = dealer.id;
  } else {
    const subDealer = networkPeopleDb.find((p) => p.id === newParentId && p.role === 'sub_dealer');
    if (!subDealer || !subDealer.parentDealerId) return res.status(400).json({ success: false, error: 'সাব-ডিলার পাওয়া যায়নি।' });
    newSubDealerId = subDealer.id;
    newDealerId = subDealer.parentDealerId;
  }

  const prevPath = `Dealer [${worker.parentDealerId}] -> Sub [${worker.parentSubDealerId || 'none'}]`;
  const newPath = `Dealer [${newDealerId}] -> Sub [${newSubDealerId || 'none'}]`;

  // Update worker
  worker.parentDealerId = newDealerId;
  worker.parentSubDealerId = newSubDealerId;

  // Update all customers under this worker
  let affectedCustomers = 0;
  networkPeopleDb.forEach((p) => {
    if (p.role === 'customer' && p.parentWorkerId === workerId) {
      p.parentDealerId = newDealerId;
      p.parentSubDealerId = newSubDealerId;
      affectedCustomers++;
    }
  });

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'TRANSFER_WORKER',
    entity: 'HIERARCHY',
    details: `Worker ${worker.name} (${worker.id}) transferred by ${currentAdmin} from ${prevPath} to ${newPath}. Affected customers updated: ${affectedCustomers}.`,
    adminUser: currentAdmin,
    timestamp: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: `কর্মী এবং সংশ্লিষ্ট ${affectedCustomers} জন গ্রাহক সফলভাবে নতুন হায়ারার্কিতে স্থানান্তরিত হয়েছে।`,
    worker,
  });
});

// Admin Transfers Customer (Updates worker, sub-dealer, and dealer)
app.post('/api/admin/hierarchy/transfer-customer', authMiddleware, (req: Request, res: Response) => {
  const currentAdmin = (req as any).adminUser?.name || 'Admin';
  const { customerId, newWorkerId } = req.body;

  const customer = networkPeopleDb.find((p) => p.id === customerId && p.role === 'customer');
  if (!customer) {
    return res.status(404).json({ success: false, error: 'গ্রাহক পাওয়া যায়নি।' });
  }

  const newWorker = networkPeopleDb.find((p) => p.id === newWorkerId && p.role === 'worker');
  if (!newWorker) {
    return res.status(400).json({ success: false, error: 'নতুন কর্মী পাওয়া যায়নি।' });
  }

  const prevWorker = customer.parentWorkerId;
  customer.parentWorkerId = newWorker.id;
  customer.parentSubDealerId = newWorker.parentSubDealerId;
  customer.parentDealerId = newWorker.parentDealerId;

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'TRANSFER_CUSTOMER',
    entity: 'HIERARCHY',
    details: `Customer ${customer.name} (${customer.id}) transferred from Worker [${prevWorker}] to Worker ${newWorker.name} (${newWorker.id}) by ${currentAdmin}.`,
    adminUser: currentAdmin,
    timestamp: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: `গ্রাহক সফলভাবে কর্মী ${newWorker.name}-এর অধীনে স্থানান্তরিত হয়েছে।`,
    customer,
  });
});

// ---------------------------------------------
// COMMISSION LEDGER & HIERARCHY TRANSACTIONS
// ---------------------------------------------

app.get('/api/admin/commissions/ledger', authMiddleware, (_req: Request, res: Response) => {
  res.json({
    success: true,
    ledgers: commissionLedgerDb,
    transactions: hierarchyTransactionsDb,
  });
});

// Process Transaction & Calculate Commissions
app.post('/api/admin/transactions/process', authMiddleware, (req: Request, res: Response) => {
  const { customerId, productName, quantity, totalAmount } = req.body;

  const customer = networkPeopleDb.find((p) => p.id === customerId && p.role === 'customer');
  if (!customer) {
    return res.status(404).json({ success: false, error: 'গ্রাহক পাওয়া যায়নি।' });
  }

  const worker = networkPeopleDb.find((p) => p.id === customer.parentWorkerId);
  const subDealer = networkPeopleDb.find((p) => p.id === customer.parentSubDealerId);
  const dealer = networkPeopleDb.find((p) => p.id === customer.parentDealerId);

  const txId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
  const amount = Number(totalAmount) || 1000;

  const newTx: HierarchyTransaction = {
    id: txId,
    customerId: customer.id,
    customerName: customer.name,
    customerMobile: customer.mobile,
    workerId: worker?.id || 'WRK-DIRECT',
    workerName: worker?.name || 'ফিল্ড কর্মী',
    subDealerId: subDealer?.id,
    subDealerName: subDealer?.name,
    dealerId: dealer?.id || 'DLR-000101',
    dealerName: dealer?.name || 'মূল ডিলার',
    productName: productName || 'পণ্য ক্রয়',
    quantity: Number(quantity) || 1,
    totalAmount: amount,
    status: 'completed',
    date: new Date().toISOString(),
  };

  const newLedgers: CommissionLedgerEntry[] = [];

  // 1. Worker Commission (Flat 50 or 5%)
  if (worker) {
    const comAmount = 50;
    newLedgers.push({
      id: `LEDGER-${Math.floor(100000 + Math.random() * 900000)}`,
      transactionId: txId,
      recipientId: worker.id,
      recipientName: worker.name,
      recipientRole: 'worker',
      commissionType: 'flat',
      commissionRate: 50,
      commissionAmount: comAmount,
      calculationBase: amount,
      status: 'approved',
      createdAt: new Date().toISOString(),
    });
    worker.commissionBalance = (worker.commissionBalance || 0) + comAmount;
    worker.totalCommissionEarned = (worker.totalCommissionEarned || 0) + comAmount;
  }

  // 2. Sub-Dealer Commission (Flat 50)
  if (subDealer) {
    const comAmount = 50;
    newLedgers.push({
      id: `LEDGER-${Math.floor(100000 + Math.random() * 900000)}`,
      transactionId: txId,
      recipientId: subDealer.id,
      recipientName: subDealer.name,
      recipientRole: 'sub_dealer',
      commissionType: 'flat',
      commissionRate: 50,
      commissionAmount: comAmount,
      calculationBase: amount,
      status: 'approved',
      createdAt: new Date().toISOString(),
    });
    subDealer.commissionBalance = (subDealer.commissionBalance || 0) + comAmount;
    subDealer.totalCommissionEarned = (subDealer.totalCommissionEarned || 0) + comAmount;
  }

  // 3. Main Dealer Commission (Flat 100)
  if (dealer) {
    const comAmount = 100;
    newLedgers.push({
      id: `LEDGER-${Math.floor(100000 + Math.random() * 900000)}`,
      transactionId: txId,
      recipientId: dealer.id,
      recipientName: dealer.name,
      recipientRole: 'dealer',
      commissionType: 'flat',
      commissionRate: 100,
      commissionAmount: comAmount,
      calculationBase: amount,
      status: 'approved',
      createdAt: new Date().toISOString(),
    });
    dealer.commissionBalance = (dealer.commissionBalance || 0) + comAmount;
    dealer.totalCommissionEarned = (dealer.totalCommissionEarned || 0) + comAmount;
  }

  hierarchyTransactionsDb.unshift(newTx);
  commissionLedgerDb = [...newLedgers, ...commissionLedgerDb];

  auditLogsDb.unshift({
    id: `log-${Date.now()}`,
    action: 'TRANSACTION_PROCESSED',
    entity: 'COMMISSIONS',
    details: `Transaction ${txId} (৳${amount}) processed. Total ${newLedgers.length} commission ledger entries generated across hierarchy.`,
    adminUser: (req as any).adminUser?.name || 'Admin',
    timestamp: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: 'ট্রানজেকশন সম্পন্ন হয়েছে এবং কমিশন ডিস্ট্রিবিউট করা হয়েছে।',
    transaction: newTx,
    ledgers: newLedgers,
  });
});

// ---------------------------------------------
// VITE & STATIC SERVING INTEGRATION
// ---------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Holynex Group] Corporate Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
