/* Nabulsi.tech — live websites we designed & built.
   Shared by the home page (index.html) and the work page (work.html).
   Screenshots live in assets/work/<slug>-{thumb,hero,full,mobile}.webp
   embed:false → the site refuses to be framed, so the live preview falls
   back to a scrollable full-page capture (plus <slug>-mobile-full.webp).
   featured:true → part of the default "Featured" set in the work page showcase.
   short → optional compact name for tight spots (hero frame tags).
   Order matters: it is the order of the showcase, the index, the wall and the reel. */
window.NABULSI_WORK = [
  {
    slug: 'sweeteye', name: 'Sweet Eye Coffee', url: 'https://sweeteyecoffee.com/', domain: 'sweeteyecoffee.com',
    cat: 'hospitality', label: 'Café & coffee roastery', type: 'E-commerce & ordering', accent: '#c8894f', embed: true, featured: true,
    desc: 'A warm, appetite-first storefront for a Cordova coffee roaster — full menu, bestsellers and online ordering for pickup, wrapped in a rich espresso-toned identity.',
    tags: ['UI/UX design', 'Online ordering', 'Menu system', 'Responsive build']
  },
  {
    slug: 'finvoq', name: 'Finvoq', url: 'https://finvoq.com/', domain: 'finvoq.com',
    cat: 'saas', label: 'Multi-asset investment marketplace', type: 'Fintech platform website', accent: '#e0a83a', embed: true, featured: true,
    desc: 'A premium fintech site for an Indian multi-asset investment marketplace — a stock ticker strip, starlit brand story and asset-manager logo wall under a glowing gold hero.',
    tags: ['Fintech website', 'Market ticker', 'Brand storytelling', 'Responsive build']
  },
  {
    slug: 'auraweb', name: 'AuraWeb', url: 'https://auraweb.tech/', domain: 'auraweb.tech',
    cat: 'agency', label: 'Web, cloud & AI agency', type: 'Agency website', accent: '#e11d2a', embed: false, featured: true,
    desc: 'A dark, high-contrast agency site built around one punchy line — Build. Optimize. Scale. Success. — with services, products, case studies and a booking-first CTA.',
    tags: ['Art direction', 'Web development', 'Case studies', 'Motion']
  },
  {
    slug: 'twobrothers', name: 'Two Brothers India Farms', short: 'Two Brothers', url: 'https://twobrothersindiashop.com/', domain: 'twobrothersindiashop.com',
    cat: 'ecommerce', label: 'Farm-direct traditional food brand', type: 'D2C e-commerce store', accent: '#6a9f4b', embed: false, featured: true,
    desc: 'A farm-to-home storefront for stone-ground atta, bilona ghee and cold-pressed oils — festive campaign banners, shop-by-concern carousels, a brand film and farmer stories.',
    tags: ['E-commerce', 'Product catalogue', 'Membership programme', 'Brand storytelling']
  },
  {
    slug: 'velora', name: 'Velora', url: 'https://velorahubmedia.com/', domain: 'velorahubmedia.com',
    cat: 'agency', label: 'Influencer & celebrity marketing agency', type: 'Agency website', accent: '#a24bf5', embed: true, featured: true,
    desc: 'A high-energy site for an Indian influencer and celebrity marketing agency — seven service lines, a bookable creator roster, campaign reels and a founder spotlight.',
    tags: ['UI/UX design', 'Talent roster', 'Campaign showcase', 'Motion']
  },
  {
    slug: 'hrmsmaster', name: 'HRMS Master', url: 'https://www.hrmsmaster.in/', domain: 'hrmsmaster.in',
    cat: 'saas', label: 'HR & payroll SaaS', type: 'SaaS product website', accent: '#6d5dfc', embed: false, featured: true,
    desc: 'A clean SaaS site for an HR suite that automates payroll, attendance, leave and performance — product storytelling, pricing and a 30-day free-trial funnel.',
    tags: ['SaaS website', 'Product storytelling', 'Pricing', 'Conversion funnel']
  },
  {
    slug: 'hotchili', name: 'The Hot Chili', url: 'https://thehotchili.com/', domain: 'thehotchili.com',
    cat: 'hospitality', label: 'Food truck & restaurant', type: 'Online ordering platform', accent: '#e0483e', embed: true, featured: true,
    desc: 'A bold, fiery ordering experience for Cordova\'s favourite food truck — live menu, cart, order tracking and an admin panel that turns hungry visitors into orders.',
    tags: ['Online ordering', 'Order tracking', 'Admin dashboard', 'Mobile-first']
  },
  {
    slug: 'incerties', name: 'Incertis', url: 'https://incertiesportfolio.na3.digital/', domain: 'incertiesportfolio.na3.digital',
    cat: 'agency', label: 'Digital product studio', type: 'Portfolio website', accent: '#1d4ed8', embed: true, featured: true,
    desc: 'Ideas into impact — a refined portfolio for a studio shipping websites, apps and games, with expressive serif typography, project showcases and clear pricing.',
    tags: ['Brand typography', 'Portfolio', 'Pricing', 'Web development']
  },
  {
    slug: 'peculiex', name: 'Peculiex', url: 'https://peculiex.com/', domain: 'peculiex.com',
    cat: 'agency', label: 'Creative digital agency', type: 'Agency website', accent: '#a66bff', embed: true, featured: true,
    desc: 'A bold, cinematic site for a Delhi creative agency — a video hero, animated impact counters, a selected-works grid, a three-step method and a light/dark toggle.',
    tags: ['UI/UX design', 'Portfolio showcase', 'Motion', 'Dark/light mode']
  },
  {
    slug: '4knatural', name: '4K Natural', url: 'https://4knatural.com/', domain: '4knatural.com',
    cat: 'ecommerce', label: 'Natural grocery & wellness brand', type: 'E-commerce store', accent: '#a4f792', embed: true, featured: true,
    desc: 'A fresh, forest-green storefront for a 100% natural grocery and wellness brand — shop-by-category browsing, a bestseller grid with add-to-cart and certification badges.',
    tags: ['E-commerce', 'Product catalogue', 'Brand storytelling', 'Responsive build']
  },
  {
    slug: 'soluphilex', name: 'SoluphileX', url: 'https://soluphilex.com/', domain: 'soluphilex.com',
    cat: 'agency', label: 'Web & app development company', type: 'Agency website', accent: '#6366f1', embed: true, featured: true,
    desc: 'An immersive, deep-space site for a web and app studio — animated service carousels, LMS and CMS showcases, a live portfolio and newsletter sign-up.',
    tags: ['Interactive UI', 'Service carousels', 'Portfolio', 'SEO-ready']
  },
  {
    slug: 'diversepathwais', name: 'Diverse Pathwais', url: 'https://diversepathwais.org/', domain: 'diversepathwais.org',
    cat: 'services', label: 'Visa & immigration consultancy', type: 'Consultancy lead website', accent: '#f5ad16', embed: true, featured: true,
    desc: 'An aviation-themed site for a New Delhi visa and immigration consultancy — a destination marquee, visa category cards, testimonials and a free-assessment enquiry form.',
    tags: ['UI/UX design', 'Lead capture', 'Motion', 'Responsive build']
  },
  {
    slug: 'rajbhog', name: 'Rajbhog', url: 'https://rajbhog.peculiex.com/', domain: 'rajbhog.peculiex.com',
    cat: 'hospitality', label: 'Mithai, namkeen & gifting brand', type: 'E-commerce store', accent: '#e0701a', embed: true, featured: false,
    desc: 'A festive storefront for a Delhi mithai house — sweets, namkeen and gift hampers with pack-size selectors, plus corporate gifting, catering and a custom-box option.',
    tags: ['E-commerce', 'Product catalogue', 'Gifting & hampers', 'Responsive build']
  },
  {
    slug: 'skillonit', name: 'Skillonit', url: 'https://www.skillonit.com/', domain: 'skillonit.com',
    cat: 'education', label: 'IT training academy', type: 'EdTech platform', accent: '#2563eb', embed: false, featured: false,
    desc: 'Vidarbha\'s first IT academy, online — course catalogue, recorded learning, internships and a kids\' zone, designed to make tech careers feel within reach.',
    tags: ['EdTech platform', 'Course catalogue', 'Lead capture', 'SEO']
  },
  {
    slug: 'awsclub', name: 'AWS Student Builder Group', short: 'AWS Builder Group', url: 'https://awssbggeu.com/', domain: 'awssbggeu.com',
    cat: 'education', label: 'Cloud & GenAI community · GEU', type: 'Community platform', accent: '#a855f7', embed: true, featured: false,
    desc: 'The home of Graphic Era University\'s AWS Student Builder Group — events, challenges, a builder portal and team pages for a thriving cloud & GenAI community.',
    tags: ['Community platform', 'Events', 'Builder portal', 'Motion']
  },
  {
    slug: 'puneetgems', name: 'Puneet Gems', url: 'https://puneetgems.com/', domain: 'puneetgems.com',
    cat: 'ecommerce', label: 'Certified gemstone & Rudraksha retailer', type: 'E-commerce store', accent: '#bc7144', embed: false, featured: false,
    desc: 'A warm, earth-toned storefront for a Delhi gemstone house — certified gemstones, Rudraksha and healing bracelets, a planet-wise carousel and a certification showcase.',
    tags: ['E-commerce', 'Product catalogue', 'Trust signals', 'Blog & SEO']
  },
  {
    slug: 'aaghaz', name: 'Aaghaz.ai', url: 'https://www.aaghaz.ai/', domain: 'aaghaz.ai',
    cat: 'education', label: 'AI startup institute', type: 'EdTech website', accent: '#22c55e', embed: false, featured: false,
    desc: 'Asia\'s first AI Startup Institute — programmes, AI tools, founder stories and a student login, designed to turn learners into micro-SaaS founders.',
    tags: ['EdTech', 'Programme pages', 'Student portal', 'Video storytelling']
  },
  {
    slug: 'aeon', name: 'Aeon Cereals', url: 'https://aeon-cereals.vercel.app/', domain: 'aeon-cereals.vercel.app',
    cat: 'hospitality', label: 'Natural foods company', type: 'Corporate website', accent: '#e09a2e', embed: true, featured: false,
    desc: 'A heritage corporate site for a Delhi natural-foods company founded in 1995 — business verticals, the 4K Natural brand, investor financials and a distributor call to action.',
    tags: ['Corporate website', 'Brand storytelling', 'Investor relations', 'Video hero']
  },
  {
    slug: 'trosidex', name: 'Trosidex Technologies', url: 'https://trosidex.com/', domain: 'trosidex.com',
    cat: 'agency', label: 'IT & digital marketing company', type: 'Corporate website', accent: '#c8925a', embed: true, featured: false,
    desc: 'A polished corporate presence for a Lucknow IT and digital-marketing company — services, blog, careers and consultation funnels in a calm, premium palette.',
    tags: ['Corporate site', 'Service pages', 'Lead generation', 'SEO']
  },
  {
    slug: 'autoparts', name: 'MotoMart India', url: 'https://autoparts.peculiex.com/', domain: 'autoparts.peculiex.com',
    cat: 'ecommerce', label: 'Bike & scooter spare parts', type: 'E-commerce store', accent: '#c62828', embed: false, featured: false,
    desc: 'A bold, red-branded spare-parts store for India\'s bikes and scooters — shop by brand and model, a \'Your Garage\' fitment finder, garage deals and a full catalogue.',
    tags: ['E-commerce', 'Fitment finder', 'Product catalogue', 'Responsive build']
  },
  {
    slug: 'hanon', name: 'Hanon Cosmic Healer', url: 'https://hanoncosmichealer.com/', domain: 'hanoncosmichealer.com',
    cat: 'services', label: 'Numerology & astrology healer', type: 'Consultation booking website', accent: '#f6d23f', embed: true, featured: false,
    desc: 'A luminous, gold-accented site for a numerology and astrology healer — a free Mulayank & Bhagyank calculator, consultation packages and client stories that lead to bookings.',
    tags: ['Interactive calculator', 'Booking funnel', 'Pricing packages', 'Client portal']
  },
  {
    slug: '5igoya', name: '5i Goya', url: 'https://www.5igoya.com/', domain: '5igoya.com',
    cat: 'agency', label: 'Technology consultancy', type: 'Consulting website', accent: '#3b5bdb', embed: true, featured: false,
    desc: 'An editorial, systems-minded site for a cross-industry tech consultancy — software, cloud, automation and AI mapped across aerospace, supply chain, healthcare and fintech.',
    tags: ['Editorial design', 'Information design', 'Web development', 'Copy structure']
  },
  {
    slug: 'sleepline', name: 'Sleepline Mattress', url: 'https://sleeplinemattress.in/', domain: 'sleeplinemattress.in',
    cat: 'ecommerce', label: 'Mattress & sleep products brand', type: 'E-commerce store', accent: '#e3c45e', embed: true, featured: false,
    desc: 'A calm, black-and-gold storefront for an Indian mattress brand — mattress, pillow and accessory catalogues, trending products, plus compare and wishlist tools.',
    tags: ['E-commerce', 'Product catalogue', 'UI/UX design', 'Responsive build']
  },
  {
    slug: 'shakti', name: 'Shakti Web Solution', url: 'https://shaktiwebsolution.com/', domain: 'shaktiwebsolution.com',
    cat: 'agency', label: 'Web development company', type: 'Agency website', accent: '#c0262d', embed: true, featured: false,
    desc: 'A service-rich website for a Surat web studio — domains, hosting, development and client showcases, organised so every visitor finds a clear next step.',
    tags: ['Service architecture', 'Client showcase', 'Lead capture', 'SEO']
  },
  {
    slug: 'aumnamah', name: 'AumNamah', url: 'https://aumnamahral.com/', domain: 'aumnamahral.com',
    cat: 'services', label: 'Radioanalytical testing laboratory', type: 'Corporate lab website', accent: '#2563eb', embed: true, featured: false,
    desc: 'A precise, clinical site for a New Delhi radioanalytical lab — services by sample type, a detailed analytical scope, an instrumentation showcase and a Request Analysis CTA.',
    tags: ['UI/UX design', 'Service catalogue', 'Blog & insights', 'Lead capture']
  }
];

window.NABULSI_WORK_CATS = {
  hospitality: 'Food & hospitality',
  ecommerce: 'E-commerce & D2C',
  saas: 'SaaS & fintech',
  education: 'Education & EdTech',
  agency: 'Agencies & studios',
  services: 'Services & consulting'
};

/* compact labels for the showcase filter chips */
window.NABULSI_WORK_CATS_SHORT = {
  hospitality: 'Food',
  ecommerce: 'E-commerce',
  saas: 'SaaS & fintech',
  education: 'Education',
  agency: 'Agencies',
  services: 'Services'
};
