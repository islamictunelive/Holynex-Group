import {
  AdminUser,
  CustomerBenefitItem,
  NewsItem,
  ProductItem,
  SiteSettings,
  SlideItem,
  TeamMemberItem,
} from '../types';

export const initialSlides: SlideItem[] = [
  {
    id: 'slide-1',
    titleBn: 'ফেয়ার প্রাইস কার্ড সিস্টেমে সাশ্রয়ী মূল্যে সেরা পণ্য',
    titleEn: 'Quality Products at Fair Prices with Fair Price Card',
    subtitleBn: 'হোলিনেক্স গ্রুপ কার্ডধারীদের জন্য বিশেষ ছাড় ও দ্রুততম কিস্তি পরিশোধ সুবিধা।',
    subtitleEn: 'Exclusive discounts and fastest installment approval for Holynex cardholders.',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1600&q=80',
    ctaTextBn: 'কার্ড সুবিধা জানুন',
    ctaTextEn: 'Explore Card Benefits',
    ctaLink: '/customer-benefits',
    active: true,
    order: 1,
  },
  {
    id: 'slide-2',
    titleBn: 'সহজ শর্তে ঝামেলামুক্ত মাসিক কিস্তি সুবিধা',
    titleEn: 'Hassle-Free Monthly Installment Facilities on Easy Terms',
    subtitleBn: 'স্বল্প ডাউন পেমেন্টে রেফ্রিজারেটর, এলইডি টিভি, মোটরসাইকেল ও স্মার্টফোন আপনার ঘরে।',
    subtitleEn: 'Get refrigerators, LED TVs, motorcycles, and smartphones with minimal down payment.',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1600&q=80',
    ctaTextBn: 'পণ্য সমূহ দেখুন',
    ctaTextEn: 'Browse Products',
    ctaLink: '/products',
    active: true,
    order: 2,
  },
  {
    id: 'slide-3',
    titleBn: 'হোলিনেক্স গ্রুপের অনুমোদিত ডিলারশিপ গ্রহণ করুন',
    titleEn: 'Become an Authorized Dealer of Holynex Group',
    subtitleBn: 'আপনার এলাকায় বিশ্বস্ত ব্র্যান্ডের ডিলার হিসেবে নিশ্চিত ক্যারিয়ার ও আকর্ষণীয় মুনাফা অর্জন করুন।',
    subtitleEn: 'Secure a rewarding business career and attractive profits in your designated territory.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    ctaTextBn: 'ডিলার আবেদন করুন',
    ctaTextEn: 'Apply for Dealership',
    ctaLink: '/dealer-application',
    active: true,
    order: 3,
  },
];

export const initialNews: NewsItem[] = [
  {
    id: 'news-1',
    textBn: 'হোলিনেক্স গ্রুপে পবিত্র ঈদ উপলক্ষে ফেয়ার প্রাইস কার্ডধারীদের জন্য বিশেষ ক্যাশব্যাক অফার শুরু হয়েছে।',
    textEn: 'Special cashback offer has commenced for Fair Price Card holders on the occasion of the upcoming festival.',
    categoryBn: 'অফার',
    categoryEn: 'Offer',
    date: '২০২৬-০৩-২০',
    published: true,
    important: true,
  },
  {
    id: 'news-2',
    textBn: 'ঢাকা ও চট্টগ্রাম বিভাগে নতুন ৬০টি উপজেলায় অনুমোদিত ডিলার নিয়োগ প্রক্রিয়া চলমান। এখনই আবেদন করুন।',
    textEn: 'Authorized dealer recruitment process is ongoing for 60 new upazilas in Dhaka and Chittagong divisions.',
    categoryBn: 'ডিলার নোটিশ',
    categoryEn: 'Dealer Notice',
    date: '২০২৬-০৩-১৮',
    published: true,
    important: true,
  },
  {
    id: 'news-3',
    textBn: 'গ্রাহকদের সুবিধার জন্য ২৪ ঘণ্টা অনলাইন কিস্তি পেমেন্ট ও ভেরিফিকেশন সিস্টেম চালু করা হয়েছে।',
    textEn: '24/7 online installment payment and verification system launched for valued customers.',
    categoryBn: 'সেবা আপডেট',
    categoryEn: 'Service Update',
    date: '২০২৬-০৩-১৫',
    published: true,
    important: false,
  },
  {
    id: 'news-4',
    textBn: 'শ্যামপুর ও যাত্রাবাড়ী সেন্ট্রাল শোরুমে নতুন মডেলের ইনভার্টার রেফ্রিজারেটর ও স্মার্ট এলইডি টিভি স্টক পৌঁছেছে।',
    textEn: 'New models of inverter refrigerators and smart LED TVs have arrived at Shyampur and Jatrabari showrooms.',
    categoryBn: 'পণ্য আগমন',
    categoryEn: 'Stock Arrival',
    date: '২০২৬-০৩-১২',
    published: true,
    important: false,
  },
];

export const initialProducts: ProductItem[] = [
  {
    id: 'prod-1',
    nameBn: 'স্মার্ট ইনভার্টার রেফ্রিজারেটর ২৬৫ লিটার',
    nameEn: 'Smart Inverter Refrigerator 265L',
    descBn: 'বিদ্যুৎ সাশ্রয়ী টুইন কুলিং টেকনোলজি, ফ্রস্ট-ফ্রি এবং দীর্ঘস্থায়ী ১০ বছরের কম্প্রেসার ওয়ারেন্টি।',
    descEn: 'Energy-saving twin cooling technology, frost-free operation, and 10-year compressor warranty.',
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80',
    category: 'appliances',
    price: 48500,
    downPayment: 9700,
    months: 12,
    monthly: 3233,
    badge: 'জনপ্রিয়',
    featured: true,
    inStock: true,
    specificationsBn: ['ধারণক্ষমতা: ২৬৫ লিটার', 'বিদ্যুৎ সাশ্রয়ী: ৭০% পর্যন্ত', 'কম্প্রেসার ওয়ারেন্টি: ১০ বছর', 'রং: ক্রিস্টাল ব্ল্যাক'],
    specificationsEn: ['Capacity: 265 Liters', 'Power Saving: Up to 70%', 'Compressor Warranty: 10 Years', 'Finish: Crystal Black'],
  },
  {
    id: 'prod-2',
    nameBn: '৪৩ ইঞ্চি ৪কে আল্ট্রা এইচডি স্মার্ট অ্যান্ড্রয়েড টিভি',
    nameEn: '43" 4K Ultra HD Smart Android TV',
    descBn: 'ডলবি অডিও সাউন্ড, ভয়েস কন্ট্রোল রিমোট এবং ডুয়াল ব্যান্ড ওয়াইফাই সাপোর্টেড হাই-ডেফিনিশন ডিসপ্লে।',
    descEn: 'Dolby Audio sound, voice control remote, and dual-band WiFi supported high-definition display.',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    category: 'electronics',
    price: 38900,
    downPayment: 7800,
    months: 12,
    monthly: 2592,
    badge: 'সেরা অফার',
    featured: true,
    inStock: true,
    specificationsBn: ['ডিসপ্লে: ৪৩ ইঞ্চি ৪কে রেজোলিউশন', 'ওএস: অফিসিয়াল অ্যান্ড্রয়েড ১১', 'ওয়ারেন্টি: প্যানেল ৪ বছর', 'সাউন্ড: ২০ ওয়াট ডলবি অডিও'],
    specificationsEn: ['Display: 43" 4K Resolution', 'OS: Official Android 11', 'Warranty: Panel 4 Years', 'Sound: 20W Dolby Audio'],
  },
  {
    id: 'prod-3',
    nameBn: '১২৫ সিসি সিটি প্রিমিয়াম মোটরসাইকেল',
    nameEn: '125cc City Premium Commuter Motorcycle',
    descBn: 'প্রতি লিটারে ৬০ কিমি মাইলেজ, টিউবলেস টায়ার, সিবিএস ব্রেকিং এবং শক্তিশালী ফুয়েল-ইনজেকশন ইঞ্জিন।',
    descEn: '60 km/L fuel efficiency, tubeless tires, CBS braking system, and durable fuel-injected engine.',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    category: 'motorcycle',
    price: 135000,
    downPayment: 27000,
    months: 24,
    monthly: 4500,
    badge: 'সহজ কিস্তি',
    featured: true,
    inStock: true,
    specificationsBn: ['ইঞ্জিন: ১২৫ সিসি ৪-স্ট্রোক', 'মাইলেজ: ৬০ কিমি/লিটার', 'ব্রেক: ফ্রন্ট ডিস্ক ও সিবিএস', 'রেজিস্ট্রেশন সহযোগিতা অন্তর্ভুক্ত'],
    specificationsEn: ['Engine: 125cc 4-Stroke', 'Mileage: 60 km/L', 'Braking: Front Disc & CBS', 'Registration Assistance Included'],
  },
  {
    id: 'prod-4',
    nameBn: '৫জি ফ্ল্যাগশিপ কিলার স্মার্টফোন ২৫৬ জিবি',
    nameEn: '5G Flagship Killer Smartphone 256GB',
    descBn: '১০৮ মেগাপিক্সেল ট্রিপল ক্যামেরা, ৫০০০ মিলিঅ্যাম্পিয়ার ব্যাটারি এবং ৬৭ ওয়াট সুপার ফাস্ট চার্জার।',
    descEn: '108MP triple camera, 5000mAh long battery life, and 67W super-fast wired charger.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    category: 'mobile',
    price: 29500,
    downPayment: 5900,
    months: 6,
    monthly: 3933,
    badge: 'নতুন মডেল',
    featured: true,
    inStock: true,
    specificationsBn: ['র‌্যাম/রম: ৮ জিবি / ২৫৬ জিবি', 'ক্যামেরা: ১০৮ এমপি + ৮ এমপি + ২ এমপি', 'ডিসপ্লে: ১২০ হার্টজ অ্যামোলেড', 'ওয়ারেন্টি: ১ বছর অফিসিয়াল'],
    specificationsEn: ['RAM/Storage: 8GB / 256GB', 'Camera: 108MP + 8MP + 2MP', 'Display: 120Hz AMOLED', 'Warranty: 1 Year Official'],
  },
  {
    id: 'prod-5',
    nameBn: '১.৫ টন ডুয়াল ইনভার্টার হট অ্যান্ড কুল এয়ার কন্ডিশনার',
    nameEn: '1.5 Ton Dual Inverter Hot & Cool AC',
    descBn: 'গ্রীষ্মে দ্রুত শীতলকরণ এবং শীতে আরামদায়ক উষ্ণতা। বিদ্যুৎ সাশ্রয়ী কপার কনডেন্সার ও ফিল্টার।',
    descEn: 'Rapid cooling in summer and comfortable warmth in winter. High energy-saving copper condenser.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    category: 'appliances',
    price: 64000,
    downPayment: 12800,
    months: 18,
    monthly: 2844,
    badge: 'প্রিমিয়াম',
    featured: true,
    inStock: true,
    specificationsBn: ['ক্যাপাসিটি: ১.৫ টন (১৮,০০০ বিটিইউ)', 'টেকনোলজি: ডুয়াল ইনভার্টার', 'কম্প্রেসার ওয়ারেন্টি: ১০ বছর', 'ফ্রি ইনস্টলেশন সার্ভিস'],
    specificationsEn: ['Capacity: 1.5 Ton (18,000 BTU)', 'Tech: Dual Inverter', 'Compressor Warranty: 10 Years', 'Free Installation Service'],
  },
  {
    id: 'prod-6',
    nameBn: 'আধুনিক কাঠের বেডরুম মাস্টার সেট',
    nameEn: 'Modern Teak Finished Bedroom Master Set',
    descBn: 'সেগুন কাঠের মজবুত কাঠামোর কিং সাইজ বেড, ৪-পাল্লার আলমিরা ও ড্রেসিং টেবিলের পূর্ণাঙ্গ সেট।',
    descEn: 'Solid teak finished King Size bed, 4-door wardrobe, and dressing table complete royal ensemble.',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    category: 'furniture',
    price: 92000,
    downPayment: 18400,
    months: 18,
    monthly: 4088,
    badge: 'হোম কম্বো',
    featured: false,
    inStock: true,
    specificationsBn: ['ম্যাটেরিয়াল: সিজনড চিটাগাং সেগুন ফিনিশ', 'সেট অন্তর্ভুক্তি: খাট + আলমিরা + ড্রেসিং টেবিল', 'ওয়ারেন্টি: ১৫ বছর ঘুণের নিশ্চয়তা'],
    specificationsEn: ['Material: Seasoned Chittagong Teak Finish', 'Set Includes: Bed + Wardrobe + Vanity', 'Warranty: 15-Year Borer Warranty'],
  },
  {
    id: 'prod-7',
    nameBn: 'প্রিমিয়াম মিনিকেট চাল (২৫ কেজি স্পেশাল বস্তা)',
    nameEn: 'Premium Miniket Rice (25kg Bag)',
    descBn: 'শতভাগ পুষ্টিকর, চকচকে ও দীর্ঘ দানার বাছাইকৃত মিনিকেট চাল। সরাসরি মিল থেকে সংগৃহীত সেরা মান।',
    descEn: '100% nutritious, polished, long-grain selected Miniket rice sourced directly from partner mills.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    category: 'consumer',
    price: 1950,
    downPayment: 390,
    months: 3,
    monthly: 520,
    badge: 'নিত্যপ্রয়োজনীয়',
    featured: true,
    inStock: true,
    specificationsBn: ['ওজন: ২৫ কেজি বস্তা', 'জাত: প্রিমিয়াম মিনিকেট চাল', 'ফেয়ার প্রাইস রেট: বাজারের চেয়ে সাশ্রয়ী', 'মান: শতভাগ পাথর ও ময়লামুক্ত'],
    specificationsEn: ['Weight: 25kg Bag', 'Variety: Premium Miniket Rice', 'Fair Price Rate: Below Retail Market', 'Quality: 100% Cleaned & Destoned'],
  },
  {
    id: 'prod-8',
    nameBn: 'বিশুদ্ধ ফর্টিফাইড সয়াবিন তেল (৫ লিটার জার)',
    nameEn: 'Pure Fortified Soybean Oil (5 Liter Can)',
    descBn: 'ভিটামিন এ ও ডি সমৃদ্ধ বিশুদ্ধ পরিশোধিত সয়াবিন তেল। কোলেস্টেরল মুক্ত ও হৃদবান্ধব রান্নার জন্য আদর্শ।',
    descEn: 'Vitamin A & D enriched 100% pure refined edible soybean oil. Cholesterol-free healthy cooking.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    category: 'consumer',
    price: 940,
    downPayment: 200,
    months: 3,
    monthly: 247,
    badge: 'পাইকারি রেট',
    featured: true,
    inStock: true,
    specificationsBn: ['পরিমাণ: ৫ লিটার পিইটি জার', 'ভিটামিন: এ এবং ডি ফর্টিফাইড', 'কোল্ড ফিল্টার্ড রিফাইনিং', 'কোলেস্টেরল: ০%'],
    specificationsEn: ['Volume: 5 Liter Can', 'Vitamins: Fortified with A & D', 'Cold Filtered Refining', 'Cholesterol: 0%'],
  },
  {
    id: 'prod-9',
    nameBn: 'প্রিমিয়াম পুষ্টিকর প্যাকেট আটা (২ কেজি x ৫ প্যাকেট - ১০ কেজি কম্বো)',
    nameEn: 'Premium Whole Wheat Atta (10kg Family Combo)',
    descBn: '১০০% খাঁটি বাছাইকৃত গমের তৈরি আটা। প্রাকৃতিক ফাইবার সমৃদ্ধ যা নরম ও স্বাস্থ্যকর রুটি তৈরি নিশ্চিত করে।',
    descEn: '100% pure selected whole wheat flour rich in natural dietary fiber for soft, nutritious rotis.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    category: 'consumer',
    price: 620,
    downPayment: 150,
    months: 2,
    monthly: 235,
    badge: 'সেরা মান',
    featured: true,
    inStock: true,
    specificationsBn: ['প্যাকেজ: ২ কেজি x ৫ প্যাকেট (১০ কেজি)', 'উপাদান: ১০০% খাঁটি গম', 'প্রাকৃতিক ফাইবার ও খনিজ সমৃদ্ধ', 'সংরক্ষণ মেয়াদ: ৬ মাস'],
    specificationsEn: ['Package: 2kg x 5 Packs (10kg)', 'Ingredient: 100% Pure Wheat', 'Rich in natural dietary fiber', 'Shelf Life: 6 Months'],
  },
  {
    id: 'prod-10',
    nameBn: 'বাছাইকৃত দেশি মসুর ডাল (৫ কেজি ফ্যামিলি প্যাক)',
    nameEn: 'Premium Deshi Red Lentils / Masoor Dal (5kg)',
    descBn: 'দ্রুত সেদ্ধ হওয়া দানাদার সুস্বাদু দেশি মসুর ডাল। উচ্চ প্রোটিনসমৃদ্ধ ও শতভাগ কৃত্রিম রং ও কেমিক্যালমুক্ত।',
    descEn: 'Quick-boiling premium red lentils rich in natural protein, completely free from artificial polish.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    category: 'consumer',
    price: 680,
    downPayment: 150,
    months: 2,
    monthly: 265,
    badge: 'বিশুদ্ধ খাদ্য',
    featured: true,
    inStock: true,
    specificationsBn: ['ওজন: ৫ কেজি প্যাক', 'ধরন: দেশি দানাদার মসুর ডাল', 'উচ্চ প্রোটিন ও পুষ্টিগুণ সম্পন্ন', 'কোনো কৃত্রিম রং নেই'],
    specificationsEn: ['Weight: 5kg Pack', 'Type: Premium Deshi Red Lentils', 'High protein & mineral content', 'No artificial colors or chemicals'],
  },
  {
    id: 'prod-11',
    nameBn: 'সুগন্ধি চিনিগুঁড়া পোলাও চাউল (৫ কেজি স্পেশাল ব্যাগ)',
    nameEn: 'Aromatic Premium Chinigura Polao Rice (5kg)',
    descBn: 'উৎকৃষ্ট সুবাস ও ঝরঝরে দানার ঐতিহ্যবাহী দিনাজপুরী চিনিগুঁড়া পোলাও চাল। বিরিয়ানি, পোলাও ও পায়েসের জন্য সেরা।',
    descEn: 'Authentic aromatic Dinajpur Chinigura rice. Exceptional fragrance and non-sticky grains for polao, biryani, and desserts.',
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80',
    category: 'consumer',
    price: 750,
    downPayment: 150,
    months: 2,
    monthly: 300,
    badge: 'উৎকৃষ্ট সুবাস',
    featured: true,
    inStock: true,
    specificationsBn: ['ওজন: ৫ কেজি স্পেশাল ব্যাগ', 'উৎস: দিনাজপুর ও উত্তরবঙ্গ', 'প্রাকৃতিক সুবাস ও ঝরঝরে দানা', 'উৎসব ও পারিবারিক অনুষ্ঠানের জন্য সেরা'],
    specificationsEn: ['Weight: 5kg Special Bag', 'Origin: Dinajpur, Northern BD', 'Natural rich aroma & fluffy grains', 'Ideal for festivals & family feasts'],
  },
  {
    id: 'prod-12',
    nameBn: 'রিফাইন খাঁটি চিনি ও কিচেন স্পাইস কম্বো প্যাক',
    nameEn: 'Refined Pure Sugar & Kitchen Essentials Combo',
    descBn: '৫ কেজি খাঁটি রিফাইন চিনি + ১ লিটার সরিষার তেল + হলুদ ও মরিচ গুঁড়ার পূর্ণাঙ্গ মাসব্যাপী কিচেন কিট।',
    descEn: '5kg pure refined sugar + 1L cold-pressed mustard oil + turmeric & chili powder complete monthly kitchen bundle.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    category: 'consumer',
    price: 1150,
    downPayment: 250,
    months: 3,
    monthly: 300,
    badge: 'মাসিক কম্বো',
    featured: true,
    inStock: true,
    specificationsBn: ['অন্তর্ভুক্তি: চিনি ৫ কেজি, সরিষার তেল ১ লিটার, মসলা প্যাক', 'ফেয়ার প্রাইস রেট সুবিধা', 'হোম ডেলিভারি সহজলভ্য'],
    specificationsEn: ['Includes: Sugar 5kg, Mustard Oil 1L, Spices', 'Fair Price Card wholesale rate', 'Fast home delivery available'],
  },
];

export const initialBenefits: CustomerBenefitItem[] = [
  {
    id: 'ben-1',
    titleBn: 'ফেয়ার প্রাইস কার্ডের নিশ্চয়তা',
    titleEn: 'Fair Price Card Assurance',
    descBn: 'কার্ডধারী সম্মানিত গ্রাহকদের জন্য প্রতিটি পণ্যে পাইকারি ও নির্ধারিত ন্যায্য মূল্যের সুনির্দিষ্ট সুবিধা।',
    descEn: 'Guaranteed wholesale and regulated fair pricing on all products exclusively for cardholders.',
    iconName: 'CreditCard',
    order: 1,
    active: true,
  },
  {
    id: 'ben-2',
    titleBn: 'সহজ ও স্বস্তিদায়ক কিস্তি পদ্ধতি',
    titleEn: 'Easy & Flexible Installments',
    descBn: 'ন্যূনতম ডাউন পেমেন্ট এবং ৩ থেকে ২৪ মাস পর্যন্ত যেকোনো সুবিধাজনক মেয়াদে সহজ মাসিক কিস্তির সুযোগ।',
    descEn: 'Minimal down payment with custom 3 to 24 month flexible installment terms matching your income.',
    iconName: 'CalendarCheck',
    order: 2,
    active: true,
  },
  {
    id: 'ben-3',
    titleBn: 'দ্রুততম অনুমোদন ও যাচাইকরণ',
    titleEn: 'Fast Approval & Verification',
    descBn: 'কাগজপত্রের ন্যূনতম ঝামেলায় মাত্র ২৪ ঘণ্টার মধ্যে ডিলার ও প্রধান কার্যালয় কর্তৃক আবেদন অনুমোদন।',
    descEn: 'Fastest 24-hour approval verification through our authorized dealer network and head office.',
    iconName: 'ShieldCheck',
    order: 3,
    active: true,
  },
  {
    id: 'ben-4',
    titleBn: 'দেশব্যাপী অনুমোদিত ডিলার সেবা',
    titleEn: 'Nationwide Dealer Network',
    descBn: 'আপনার নিজ থানা ও ইউনিয়নের হোলিনেক্স ডিলার পয়েন্ট থেকে সরাসরি পণ্য ডেলিভারি ও বিক্রয়োত্তর সেবা।',
    descEn: 'Direct product pickup, warranty fulfillment, and after-sales service from your local dealer.',
    iconName: 'Store',
    order: 4,
    active: true,
  },
  {
    id: 'ben-5',
    titleBn: 'শতভাগ জেনুইন ব্র্যান্ড ওয়ারেন্টি',
    titleEn: '100% Genuine Brand Warranty',
    descBn: 'সরাসরি উৎপাদক ও অফিসিয়াল সরবরাহকারী থেকে আমদানিকৃত সর্বোচ্চ কোয়ালিটির আসল পণ্যের গ্যারান্টি।',
    descEn: 'Direct manufacturer warranty and genuine product guarantee with round-the-clock service backup.',
    iconName: 'Award',
    order: 5,
    active: true,
  },
  {
    id: 'ben-6',
    titleBn: 'স্বচ্ছ পেমেন্ট ও এসএমএস নোটিফিকেশন',
    titleEn: 'Transparent Billing & SMS Alerts',
    descBn: 'প্রতিটি কিস্তি জমা দেওয়ার সাথে সাথে গ্রাহক ও ডিলারের মোবাইলে তাৎক্ষণিক কনফার্মেশন এসএমএস রসিদ।',
    descEn: 'Instant automated SMS confirmations for every installment deposit and statement transparency.',
    iconName: 'BellRing',
    order: 6,
    active: true,
  },
];

export const initialTeam: TeamMemberItem[] = [
  {
    id: 'team-1',
    nameBn: 'মোঃ রফিকুল ইসলাম',
    nameEn: 'Md. Rafiqul Islam',
    roleBn: 'চেয়ারম্যান, হোলিনেক্স গ্রুপ',
    roleEn: 'Chairman, Holynex Group',
    bioBn: 'দীর্ঘ ২৫ বছরের ব্যবসা অভিজ্ঞতা সম্পন্ন এবং দেশের মানুষের মাঝে সাশ্রয়ী মূল্যে নিত্যপ্রয়োজনীয় সুবিধা পৌঁছে দিতে প্রতিশ্রুতিবদ্ধ দূরদর্শী নেতৃত্ব।',
    bioEn: 'Visionary leader with 25+ years of corporate excellence, committed to empowering citizens through ethical and fair consumer commerce.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    type: 'chairman',
    order: 1,
    active: true,
  },
  {
    id: 'team-2',
    nameBn: 'ইঞ্জিনিয়ার আরিফুর রহমান',
    nameEn: 'Engr. Arifur Rahman',
    roleBn: 'ম্যানেজিং ডিরেক্টর ও সিইও',
    roleEn: 'Managing Director & CEO',
    bioBn: 'ব্যবস্থাপনা ও ফিনটেক সিস্টেমে উচ্চতর দক্ষতাসম্পন্ন প্রধান নির্বাহী কর্মকর্তা, যিনি ডিজিটাল কিস্তি ও ডিলার নেটওয়ার্ক সম্প্রসারণে নেতৃত্ব দিচ্ছেন।',
    bioEn: 'Executive strategist specializing in supply chain logistics and customer installment systems across Bangladesh.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    type: 'ceo',
    order: 2,
    active: true,
  },
  {
    id: 'team-3',
    nameBn: 'মাহমুদুল হাসান',
    nameEn: 'Mahmudul Hasan',
    roleBn: 'ডিরেক্টর অব অপারেশনস',
    roleEn: 'Director of Operations',
    bioBn: 'সাপ্লাই চেইন, গুদাম ব্যবস্থাপনা ও ডিলার ডেলিভারি লজিস্টিকসের সার্বিক তত্ত্বাবধানকারী।',
    bioEn: 'Overseeing nationwide supply chain, warehouse logistics, and quality assurance.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    type: 'management',
    order: 3,
    active: true,
  },
  {
    id: 'team-4',
    nameBn: 'ফারহানা আফরিন',
    nameEn: 'Farhana Afrin',
    roleBn: 'হেড অব কাস্টমার রিলেশনস অ্যান্ড বেনিফিটস',
    roleEn: 'Head of Customer Relations & Benefits',
    bioBn: 'গ্রাহক সেবা, ফেয়ার প্রাইস কার্ডের যাচাই প্রক্রিয়া এবং কিস্তি সহায়তা সমন্বয়কারী।',
    bioEn: 'Directing customer success, Fair Price Card eligibility, and client support operations.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    type: 'management',
    order: 4,
    active: true,
  },
];

export const initialSiteSettings: SiteSettings = {
  companyNameBn: 'হোলিনেক্স গ্রুপ',
  companyNameEn: 'Holynex Group',
  taglineBn: 'ফেয়ার প্রাইস কার্ড ও সহজ কিস্তিতে আধুনিক জীবনের সব সমাধান',
  taglineEn: 'Empowering Lives with Fair Price Cards and Flexible Installments',
  phone: '01307835260',
  email: 'contact@holynexgroup.com',
  addressBn: '৭১২, কমিশনার রোড, জুরাইন, যাত্রাবাড়ী, শ্যামপুর, ঢাকা',
  addressEn: '712, Commissioner Road, Jurain, Jatrabari, Shyampur, Dhaka',
  logoUrl: '/holynex-logo.jpg',
  facebookUrl: 'https://facebook.com/holynexgroup',
  youtubeUrl: 'https://youtube.com/@holynexgroup',
  whatsappNumber: '+8801307835260',
  messengerUrl: 'https://m.me/holynexgroup',
  fairPriceCardInfoBn: 'হোলিনেক্স গ্রুপ ফেয়ার প্রাইস কার্ড সিস্টেম হলো গ্রাহকবান্ধব একটি বিশেষ মেম্বারশিপ ব্যবস্থা, যার মাধ্যমে নিবন্ধিত গ্রাহকগণ ইলেকট্রনিক্স, মোটরসাইকেল, গৃহস্থালী পণ্য ও ফার্নিচার পাইকারি ও বিশেষ ভর্তুকি মূল্যে ক্রয় করতে পারেন। এর মাধ্যমে মধ্যস্বত্বভোগীদের অতিরিক্ত মুনাফা রোধ করে সরাসরি কোম্পানির সেরা সুবিধা পৌঁছে দেওয়া হয়।',
  fairPriceCardInfoEn: 'Holynex Group Fair Price Card System is a consumer-focused membership initiative enabling registered cardholders to purchase electronics, motorcycles, home appliances, and furniture at regulated fair wholesale rates, eliminating intermediary markups.',
  installmentInfoBn: 'আমাদের কিস্তি সিস্টেম সম্পূর্ণ স্বচ্ছ ও গ্রাহকবান্ধব। মাত্র ২০% থেকে ৩০% প্রাথমিক ডাউন পেমেন্ট প্রদান করে ৬, ১২, ১৮ বা ২৪ মাসের সমান মাসিক কিস্তিতে পণ্য বুঝে নিতে পারেন। আবেদনপত্র জমা ও প্রয়োজনীয় যাচাই-বাছাই শেষে সর্বোচ্চ ২৪-৪৮ ঘণ্টার মধ্যে পণ্য সরবরাহ সম্পন্ন হয়।',
  installmentInfoEn: 'Our installment framework is 100% transparent and accessible. With an initial down payment of 20% to 30%, customers can procure appliances, gadgets, or vehicles over 6, 12, 18, or 24 equal monthly installments, verified within 24 to 48 hours.',
  dealerAgreementBn: '১. অনুমোদিত ডিলার শুধুমাত্র নির্ধারিত এলাকায় হোলিনেক্স গ্রুপের পণ্য বিপণন ও গ্রাহক কিস্তি সেবা পরিচালনা করবেন।\n২. ফেয়ার প্রাইস কার্ড ও কিস্তি পরিশোধের প্রতিটি লেনদেন কোম্পানির কেন্দ্রীয় সিস্টেমে নিয়মিত এন্ট্রি নিশ্চিত করতে হবে।\n৩. গ্রাহকের সাথে সর্বোচ্চ পেশাদার ও সৎ আচরণ বজায় রাখতে হবে।\n৪. কোনো অননুমোদিত অতিরিক্ত চার্জ বা গোপন ফি আদায় সম্পূর্ণ নিষিদ্ধ।\n৫. ডিলারশিপ বাতিলের ক্ষেত্রে কোম্পানির প্রচলিত বিধিমালা প্রযোজ্য হবে।',
  dealerAgreementEn: '1. The authorized dealer shall exclusively distribute Holynex Group products and process customer installment agreements within the assigned territory.\n2. All transactions and payments must be logged into the central Holynex corporate portal immediately.\n3. Strict corporate ethics, honesty, and professional customer care must be upheld at all times.\n4. Imposition of any unauthorized fee or hidden interest charge is strictly prohibited.\n5. Termination of dealership shall follow standard corporate legal bylaws.',
  dealerRulesBn: '১. ন্যূনতম ব্যক্তিগত জামানত ও ব্যবসার বৈধ ট্রেড লাইসেন্স থাকতে হবে (প্রযোজ্য ক্ষেত্রে)।\n২. ডিলারের নিজস্ব দোকান বা শো-রুম স্পেস গ্রাহক পরিসেবার উপযোগী হতে হবে।\n৩. সময়মতো সাপ্তাহিক বা মাসিক প্রতিবেদন প্রধান কার্যালয়ে জমা দিতে হবে।\n৪. গ্রাহকদের সকল এসএমএস কনফার্মেশন ও ইনভয়েস সরবরাহ করতে হবে।',
  dealerRulesEn: '1. Must possess a valid commercial trade license and security deposit where applicable.\n2. The dealer showroom or point of sale must satisfy corporate presentation standards.\n3. Periodic sales and installment collection logs must be synchronized weekly.\n4. Every customer must receive printed or SMS official receipts for their installment deposits.',
};

// Required data getters matching the user's signature
export async function getSlides(): Promise<SlideItem[]> {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('holynex_slides');
      if (stored) return JSON.parse(stored);
    }
  } catch {}
  return initialSlides;
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('holynex_news');
      if (stored) return JSON.parse(stored);
    }
  } catch {}
  return initialNews;
}

export async function getProducts(): Promise<ProductItem[]> {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('holynex_products');
      if (stored) return JSON.parse(stored);
    }
  } catch {}
  return initialProducts;
}

export async function getBenefits(): Promise<CustomerBenefitItem[]> {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('holynex_benefits');
      if (stored) return JSON.parse(stored);
    }
  } catch {}
  return initialBenefits;
}

export async function getTeam(): Promise<TeamMemberItem[]> {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('holynex_team');
      if (stored) return JSON.parse(stored);
    }
  } catch {}
  return initialTeam;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('holynex_settings');
      if (stored) return JSON.parse(stored);
    }
  } catch {}
  return initialSiteSettings;
}

export const initialAdminUsers: AdminUser[] = [
  {
    id: 'admin-root',
    username: 'admin',
    password: 'holynex@admin2026',
    name: 'প্রধান পরিচালক ও অ্যাডমিন (Chief Director & Admin)',
    role: 'super_admin',
    email: 'admin@holynexgroup.com',
    phone: '01307835260',
    status: 'active',
    permissions: {
      canManageApplications: true,
      canManageProducts: true,
      canManageNews: true,
      canManageSlides: true,
      canManageSettings: true,
      canManageAdmins: true,
    },
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'subadmin-01',
    username: 'subadmin',
    password: 'subadmin@2026',
    name: 'সহকারী অ্যাডমিন ও ফিল্ড ইনচার্জ (Sub-Admin Officer)',
    role: 'sub_admin',
    email: 'subadmin@holynexgroup.com',
    phone: '01307835261',
    status: 'active',
    permissions: {
      canManageApplications: true,
      canManageProducts: true,
      canManageNews: true,
      canManageSlides: true,
      canManageSettings: false,
      canManageAdmins: false,
    },
    createdAt: '2026-02-15T00:00:00Z',
  },
];

