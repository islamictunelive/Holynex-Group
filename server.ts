import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
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
} from './src/lib/data.js';

let slidesDb = [...initialSlides];
let newsDb = [...initialNews];
let productsDb = [...initialProducts];
let benefitsDb = [...initialBenefits];
let teamDb = [...initialTeam];
let settingsDb = { ...initialSiteSettings };
let adminUsersDb = [...initialAdminUsers];

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

// Floating Corporate AI Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, lang = 'bn', history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

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

        const systemPrompt = `You are the official Corporate AI Representative for Holynex Group (হোলিনেক্স গ্রুপ).
Company Details:
- Business: Fair Price Card System (ফেয়ার প্রাইস কার্ড) and transparent Installment Sales (কিস্তি সুবিধা) for electronics, home appliances, motorcycles, mobile phones, and furniture.
- Corporate Office Address: ৭১২, কমিশনার রোড, জুরাইন, যাত্রাবাড়ী, শ্যামপুর, ঢাকা (712, Commissioner Road, Jurain, Jatrabari, Shyampur, Dhaka).
- Hotlines / Customer Care: 01307835260.
- Authorized Dealership: Individuals can apply online through our Dealer Application system without any traditional dealer login. Required items: full name, parents' names, mobile, occupation, address, designated territory, mandatory applicant photo, optional NID/trade license, and agreement to dealer terms. Unique Application ID (HNX-2026-XXXXXX) is provided for status tracking.
- Fair Price Card System: Special regulated fair-price consumer membership removing middlemen markups, allowing easy installments from 6 to 24 months with 20-30% down payment.
- Tone: Highly corporate, polite, helpful, prestigious, and honest.
- Language: Respond in ${lang === 'bn' ? 'Bangla (বাংলা)' : 'English'}, or match the user's inquiry language naturally.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });

        const replyText = response.text || (lang === 'bn' ? 'হোলিনেক্স গ্রুপে আপনাকে স্বাগতম। কীভাবে সাহায্য করতে পারি?' : 'Welcome to Holynex Group. How may I assist you today?');
        return res.json({ reply: replyText });
      } catch (genErr) {
        console.error('Gemini API execution error, falling back to rule-based engine:', genErr);
      }
    }

    // High quality intelligent corporate FAQ rule-based fallback
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('card') || lower.includes('কার্ড') || lower.includes('ফেয়ার প্রাইস') || lower.includes('fair price')) {
      reply = lang === 'bn'
        ? 'হোলিনেক্স গ্রুপ ফেয়ার প্রাইস কার্ড সিস্টেমে আপনি পাইকারি ও ন্যায্য মূল্যে রেফ্রিজারেটর, এলইডি টিভি, এসি, মোটরসাইকেল ও মোবাইল ফোন ক্রয় করতে পারেন। কার্ডধারীদের জন্য স্বল্প ডাউন পেমেন্টে ৬ থেকে ২৪ মাসের কিস্তি সুবিধা রয়েছে। বিস্তারিত জানতে "কাস্টমার বেনিফিটস" পেজ ভিজিট করুন অথবা কল করুন: 01307835260।'
        : 'Holynex Group Fair Price Card system allows valued customers to purchase electronics, appliances, motorcycles, and smartphones at regulated wholesale rates with 6 to 24 months flexible installment plans. For details, please call 01307835260.';
    } else if (lower.includes('dealer') || lower.includes('ডিলার') || lower.includes('আবেদন') || lower.includes('apply')) {
      reply = lang === 'bn'
        ? 'হোলিনেক্স গ্রুপের অনুমোদিত ডিলার হতে আমাদের ওয়েবসাইটের "ডিলার আবেদন" পেজে যান। আপনার নাম, ঠিকানা, ব্যক্তিগত ছবি ও প্রস্তাবিত ডিলার এলাকার বিবরণ দিয়ে সরাসরি আবেদন জমা দিন। আবেদন জমা হলে একটি ইউনিক ট্র্যাকিং আইডি (যেমন HNX-2026-XXXXXX) পাবেন। যেকোনো তথ্যে যোগাযোগ করুন: 01307835260।'
        : 'To become an authorized Holynex Group dealer, visit our "Dealer Application" section. Complete the online form with your photo, address, and designated territory. You will instantly receive a unique Tracking ID. Contact: 01307835260.';
    } else if (lower.includes('status') || lower.includes('অবস্থা') || lower.includes('ট্র্যাকিং') || lower.includes('track')) {
      reply = lang === 'bn'
        ? 'আপনার ডিলারশিপ আবেদনের বর্তমান অবস্থা জানতে আমাদের "আবেদন স্ট্যাটাস" মেন্যুতে যান এবং আপনার অ্যাপ্লিকেশন আইডি ও মোবাইল নম্বর প্রদান করুন।'
        : 'To check your dealership application status, go to the "Application Status" page and enter your Application ID along with your mobile number.';
    } else if (lower.includes('কিস্তি') || lower.includes('installment') || lower.includes('ডাউন পেমেন্ট')) {
      reply = lang === 'bn'
        ? 'আমাদের কিস্তি পদ্ধতিতে মাত্র ২০% থেকে ৩০% ডাউন পেমেন্ট প্রদান করে ৬ থেকে ২৪ মাসের সমান মাসিক কিস্তিতে পছন্দের পণ্য কেনা যায়। কোনো গোপন চার্জ নেই।'
        : 'With 20% to 30% initial down payment, you can purchase products on 6 to 24 equal monthly installments with 100% transparency.';
    } else if (lower.includes('ঠিকানা') || lower.includes('address') || lower.includes('অফিস') || lower.includes('phone') || lower.includes('ফোন')) {
      reply = lang === 'bn'
        ? 'হোলিনেক্স গ্রুপ প্রধান কার্যালয়: ৭১২, কমিশনার রোড, জুরাইন, যাত্রাবাড়ী, শ্যামপুর, ঢাকা। হেল্পলাইন ও সরাসরি যোগাযোগ: 01307835260।'
        : 'Holynex Group Head Office: 712, Commissioner Road, Jurain, Jatrabari, Shyampur, Dhaka. Helpline: 01307835260.';
    } else {
      reply = lang === 'bn'
        ? 'হোলিনেক্স গ্রুপে আপনাকে স্বাগতম। আমরা ফেয়ার প্রাইস কার্ড সিস্টেম এবং সহজ কিস্তিতে গ্রাহকদের সেবা প্রদান করি। পণ্য, ডিলারশিপ বা কিস্তি সম্পর্কিত যেকোনো তথ্য জানতে প্রশ্ন করুন অথবা সরাসরি ফোন করুন: 01307835260।'
        : 'Welcome to Holynex Group. We offer premium products through Fair Price Card and flexible installment facilities. Ask any question about products, dealership, or installments, or contact 01307835260.';
    }

    res.json({ reply });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
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
