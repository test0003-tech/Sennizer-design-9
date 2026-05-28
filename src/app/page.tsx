'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Globe,
  Layers,
  Lock,
  MapPin,
  Menu,
  MessageSquare,
  MousePointerClick,
  Play,
  Search,
  Shield,
  ShoppingBag,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
  Award,
  BookOpen,
  Phone,
  ExternalLink,
  Sparkles,
  Eye,
  FileText,
  Megaphone,
  BarChart2,
  Package,
  Settings,
} from 'lucide-react';

/* ════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════ */

const CLIENT_LOGOS = [
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo1.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo2.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo5.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo6.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo7.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo8.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo9.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo11.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo12.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo13.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo14.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo15.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo16.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo17.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo18.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo19.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo20.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo22.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo23.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo27.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo28.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo29.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo30.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo31.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo33.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo36.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo37.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo39.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo40.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo41.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo42.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo43.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo44.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo45.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo46.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo47.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo48.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo49.svg',
  'https://www.singleinterface.com/Enquiry/img/brands/Client-logo50.svg',
];

const PRODUCTS = [
  {
    title: 'Hyper X ai',
    badge: 'Beta',
    desc: 'Move from unknown and non-insightful information about your customers to in-depth and actionable audience data',
    image: null,
    isHyperX: true,
    features: [
      { icon: Eye, label: 'Interaction Intelligence' },
      { icon: Users, label: 'Custom Segment Creation' },
      { icon: Megaphone, label: 'Campaign Management' },
    ],
  },
  {
    title: 'Presence Management',
    desc: 'Establish your local business digital presence and become easily discoverable to customers.',
    image: 'https://www.singleinterface.com/Enquiry/img/presence-img.svg',
    icon: Globe,
  },
  {
    title: 'Reputation Management',
    desc: 'Enhance your local reputation, and build long-lasting relationships.',
    image: 'https://www.singleinterface.com/Enquiry/img/reputation-img.svg',
    icon: Star,
  },
  {
    title: 'Engagement Management',
    desc: 'Interact with customers, address all queries, and augment their experience.',
    image: 'https://www.singleinterface.com/Enquiry/img/engagement-img.svg',
    icon: MessageSquare,
  },
  {
    title: 'Spotlight',
    desc: 'Run hyperlocal ads and maximize local growth opportunities.',
    image: 'https://www.singleinterface.com/Enquiry/img/spotlight.svg',
    icon: Target,
  },
  {
    title: 'Call Leads',
    desc: 'Gain granular visibility into calls and understand customer intent.',
    image: 'https://www.singleinterface.com/Enquiry/img/leads-img.svg',
    icon: Phone,
  },
  {
    title: 'Transaction Management',
    desc: 'Enable commerce at location level by publishing location level catalogs and inventory.',
    image: 'https://www.singleinterface.com/Enquiry/img/transaction.svg',
    icon: ShoppingBag,
  },
  {
    title: 'Advance Feature Sets',
    desc: 'Leverage advance features to fully harness the power of our products',
    image: 'https://www.singleinterface.com/Enquiry/img/feature-img.svg',
    icon: Settings,
  },
  {
    title: 'Build with TRUST',
    desc: 'Security compliance and data protection for enterprise-grade trust.',
    image: null,
    isTrust: true,
    icon: Shield,
  },
];

const TESTIMONIALS = [
  {
    name: 'Vikram Garga',
    title: 'Group Head Marketing',
    company: 'Apollo Tyres',
    logo: 'https://www.singleinterface.com/Enquiry/img/testimonials/apollo-logo.png',
    text: 'SingleInterface played a pivotal role in enhancing our brand\'s digital visibility using its hyperlocal strategy. Their expertise drove notable improvements in store discoverability and customer interactions. Their meticulousness and commitment to our success were outstanding. We highly endorse SingleInterface to businesses aiming to boost digital presence and foot traffic to physical stores.',
  },
  {
    name: 'Francis Rodrigues',
    title: 'Head of Marketing',
    company: 'HDFC Life',
    logo: 'https://www.singleinterface.com/Enquiry/img/testimonials/hdfc-logo.png',
    text: 'For years, HDFC Life has partnered with SingleInterface, an enriching experience. Their diverse portfolio expanded our digital presence, enhancing business across regions. Through this collaboration, we digitized physical locations, opening new customer avenues. We\'re pleased with SingleInterface\'s services, fostering growth and innovation.',
  },
  {
    name: 'Arun Darwin Harikrishnan',
    title: 'AGM - Digital Marketing',
    company: "Dr. Agrawal's Eye Hospital",
    logo: 'https://www.singleinterface.com/Enquiry/img/testimonials/eyeClinic-logo.png',
    text: 'We have partnered with SingleInterface to help us improve our online discovery and we couldn\'t be happier with the results. They have a deep understanding of how to leverage online channels to drive traffic and generate leads. We highly recommend SingleInterface to any business looking to improve its online presence and generate more leads.',
  },
  {
    name: 'Gaurav Manihar',
    title: 'AD & Head',
    company: 'MOSL',
    logo: 'https://www.singleinterface.com/Enquiry/img/testimonials/mosl-logo.png',
    text: 'For over a year, our partnership with SingleInterface has greatly enhanced our search visibility, both at a brand and hyperlocal level. Their platform enables seamless offline-to-online customer experiences through omnichannel solutions. The user-friendly SI dashboard provides detailed location-based insights, empowering informed decision-making. A vital tool for franchise businesses seeking growth and efficiency.',
  },
  {
    name: 'Jahid Ahmed',
    title: 'Sr. Vice President',
    company: 'HDFC Bank',
    logo: 'https://www.singleinterface.com/Enquiry/img/testimonials/hdfcBank-logo.png',
    text: 'Collaborating with SingleInterface transformed HDFC Bank\'s digital strategy. Their proficiency in digitizing our Branches & ATMs elevated customer engagement and transactions. Connecting these assets with digital platforms enhanced customer experience and operational efficiency. Impressed by their meticulousness and results-driven approach, we strongly endorse SingleInterface for businesses seeking digital presence enhancement.',
  },
  {
    name: 'Prashant Gaur',
    title: 'Chief Brand Officer',
    company: 'Pizza Hut India',
    logo: 'https://www.singleinterface.com/Enquiry/img/testimonials/pizzaHut-logo.png',
    text: 'Our collaboration with SingleInterface has proven highly successful. It facilitated millions of instances of customer engagement and outlet visits. This strategy drove a remarkable 30% growth in online engagement and conversions. SingleInterface\'s technological prowess unlocked lucrative opportunities, elevating customer satisfaction and positioning us as industry leaders. They\'re not just a strategic partner in India, but globally.',
  },
  {
    name: 'Robin Samuel',
    title: 'General Manager-Marketing',
    company: 'Orientbell Tiles',
    logo: 'https://www.singleinterface.com/Enquiry/img/testimonials/orientbell-logo.png',
    text: 'At Orientbell Tiles, we simplify tile buying and selling. Partnering with SingleInterface two years ago transformed our online presence. They enable over 300 Orientbell Tile Boutiques to shine on Google through the store and My Business Profile pages. Their solution streamlines updates across all stores effortlessly, saving time. Their dedicated support team ensures exceptional service and swift turnaround.',
  },
  {
    name: 'Vedant Modi',
    title: 'Chief Marketing Officer',
    company: 'Manyavar Mohey',
    logo: 'https://www.singleinterface.com/Enquiry/img/testimonials/manyavarMohey-logo.png',
    text: 'Partnering with SingleInterface for over a year has revolutionized our online presence. Their platform optimizes brand and store-level search visibility, enhancing consumer experiences. Their omnichannel expertise fosters strong brand-consumer connections. Easy-to-use reporting provides actionable insights for strategic decisions. A must-have for franchise businesses seeking growth and success.',
  },
  {
    name: 'Vijay Pashte',
    title: 'Senior Manager, Head - Digital Marketing',
    company: 'Metropolis Healthcare Ltd',
    logo: 'https://www.singleinterface.com/Enquiry/img/testimonials/metropolis-logo.png',
    text: 'For over a year, our partnership with SingleInterface has been invaluable. Their tool facilitates seamless management and enhancement of our local stores\' visibility in Google search. It ensures uniform customer experiences, vital for locating Metropolis healthcare centers. A must-have for businesses with franchise models seeking digital optimization.',
  },
];

const AWARDS = [
  {
    title: 'Best Digital Advertising Awards',
    desc: 'Best Search Marketing Campaign, Best Omnichannel Campaign, Best Mobile Search Marketing Campaign, Best Execution of Performance Campaign',
    image: 'https://www.singleinterface.com/Enquiry/imgwebp/awards/bestDigital-img.webp',
  },
  {
    title: 'Deloitte Technology Fast 50',
    desc: '208% Average Revenue Growth',
    image: 'https://www.singleinterface.com/Enquiry/imgwebp/awards/deloitte-logo.webp',
  },
  {
    title: 'Drivers of Digital Awards (Sparkies)',
    desc: 'SEO Optimization',
    image: 'https://www.singleinterface.com/Enquiry/imgwebp/awards/sparkies-img.webp',
  },
  {
    title: 'Media360 Awards',
    desc: 'Product Sector Categories - Automotive',
    image: 'https://www.singleinterface.com/Enquiry/imgwebp/awards/media360-img.webp',
  },
  {
    title: 'ET Brand Equity Brand Disruption Awards',
    desc: 'Technology Driven campaign',
    image: 'https://www.singleinterface.com/Enquiry/imgwebp/awards/etBrand-img.webp',
  },
  {
    title: 'Indian Marketing Awards',
    desc: 'Best Use Of Search Marketing',
    image: 'https://www.singleinterface.com/Enquiry/imgwebp/awards/ima-img.webp',
  },
  {
    title: 'Martech WIN',
    desc: 'The 2nd Martech Leadership Awards 2022 - Overall Best Use of Marketing Technology',
    image: 'https://www.singleinterface.com/Enquiry/imgwebp/awards/martech-img.webp',
  },
  {
    title: 'Digimarcom Leadership',
    desc: 'Overall Best use of Marketing Technology in a Campaign',
    image: 'https://www.singleinterface.com/Enquiry/imgwebp/awards/digimarcom-img.webp',
  },
];

const SUCCESS_STORIES = [
  {
    title: "Lifestyle's success powered by SingleInterface and Hyperlocal",
    company: 'Lifestyle',
    logo: 'https://www.singleinterface.com/Enquiry/img/stories/lifestyle-story-logo.png',
    desc: 'Lifestyle collaborated with SingleInterface to create a strong hyperlocal presence across the digital ecosystem. With targeted local offerings and enhanced digital approaches, Lifestyle delivered frictionless online-to-offline customer experiences and gained local expansion.',
    metrics: [
      { value: '159X', label: 'Marketing ROI' },
      { value: '155%', label: 'Digital Visibility' },
      { value: '322%', label: 'Store Visits' },
    ],
    video: null,
  },
  {
    title: 'Motilal Oswal Financial Services starts the Hyperlocal journey',
    company: 'MOSL',
    logo: 'https://www.singleinterface.com/Enquiry/img/stories/mosl-story-logo.png',
    desc: 'MOSL joined hands with SingleInterface, to clear its digital clutter using modern approaches and to enhance franchisee-level digital presence.',
    metrics: [
      { value: '200K', label: 'New Prospects' },
      { value: '70%', label: 'Engagement Growth' },
      { value: '10X', label: 'Marketing ROI' },
    ],
    video: null,
  },
  {
    title: 'Nissan achieves staggering growth with SingleInterface',
    company: 'Nissan',
    logo: 'https://www.singleinterface.com/Enquiry/img/stories/nissan-story-logo.svg',
    desc: 'Nissan leveraged SingleInterface\'s full-stack offering, to create a strong digital presence across the virtual ecosystem.',
    metrics: [
      { value: '60X', label: 'Store Visits' },
      { value: '57X', label: 'Leads Generated' },
      { value: '66X', label: 'Marketing ROI' },
    ],
    video: 'https://www.youtube.com/embed/kKOMWk_dUkQ?si=H9oFGLa_hYh8lN7V',
  },
  {
    title: 'Ford unlocks massive local growth',
    company: 'Ford',
    logo: 'https://www.singleinterface.com/Enquiry/img/stories/ford-story-logo.svg',
    desc: "Ford partnered with SingleInterface to implement hyperlocal ads. This powerful digital channel seamlessly connected Ford's dealerships to customers, creating thousands of micro-targeted campaigns.",
    metrics: [
      { value: '145X', label: 'ROI on Topline' },
      { value: '139%', label: 'Lead Volume' },
      { value: '58%', label: 'CPL Reduction' },
    ],
    video: 'https://www.youtube.com/embed/osGgbyFAXmo?si=iEWfEmpSD-iJxLHm',
  },
];

const BLOGS = [
  {
    title: 'What is hyperlocal marketing?',
    desc: 'Marketing is seeing a phenomenal shift wherein personalisation and localisation is taking a big chunk from mass cover. If you\'ve ever found yourself looking for a very specific type of business...',
    image: 'https://www.singleinterface.com/Enquiry/imgwebp/blog-131.webp',
    url: 'https://blog.singleinterface.com/what-is-hyperlocal-marketing',
  },
  {
    title: '5 Reasons why a brand should focus on reviews',
    desc: 'The Internet over the last year has seen a fast paced penetration across all consumer sections globally and brought a plethora of opportunities to our fingertips.',
    image: 'https://www.singleinterface.com/Enquiry/imgwebp/blog-111.webp',
    url: 'https://blog.singleinterface.com/5-reasons-why-a-brand-should-focus-on-reviews/',
  },
  {
    title: 'Digitising your storefront - A digital first approach to your retail marketing.',
    desc: 'As more and more consumers get glued to their smartphones, marketers are finding novel ways to get a share of their attention...',
    image: 'https://www.singleinterface.com/Enquiry/imgwebp/blog-121.webp',
    url: 'https://blog.singleinterface.com/digitising-your-storefront-a-digital-first-approach-to-your-retail-marketing',
  },
];

const STATS = [
  { value: '200+', label: 'Brands Trusted' },
  { value: '$10B+', label: 'Revenue Delivered Annually' },
  { value: '50+', label: 'Platform Integrations' },
  { value: '30M+', label: 'Location Pages Managed' },
];

const STEPS = [
  {
    num: '01',
    title: 'Claim & Verify Locations',
    desc: 'Import and verify all your store locations across platforms. Ensure consistent and accurate business information everywhere.',
    icon: Shield,
  },
  {
    num: '02',
    title: 'Optimize & Manage',
    desc: 'Use AI-powered tools to optimize listings, manage reviews, run hyperlocal campaigns, and keep information up to date.',
    icon: Zap,
  },
  {
    num: '03',
    title: 'Measure & Grow',
    desc: 'Track performance with real-time analytics. Measure footfalls, conversions, and ROI to continuously improve results.',
    icon: TrendingUp,
  },
];

/* ════════════════════════════════════════════
   SECTION REVEAL HOOK
   ════════════════════════════════════════════ */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ════════════════════════════════════════════
   NAVIGATION
   ════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Products', href: '#products' },
    { label: 'Clients', href: '#clients' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Awards', href: '#awards' },
    { label: 'Success Stories', href: '#success-stories' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/60'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          <a href="#" className="flex items-center gap-2.5 group">
            <img
              src="https://www.singleinterface.com/Enquiry/imgwebp/Singleinterface-logo-dark.svg"
              alt="SingleInterface"
              className={`h-8 transition-opacity ${scrolled ? 'opacity-100' : 'brightness-0 invert opacity-90'}`}
            />
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  scrolled
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              className="ml-3 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-600 to-[#2563eb] text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.02]"
            >
              Get Demo
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/60 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="block mt-2 text-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-600 to-[#2563eb] text-white"
            >
              Get Demo
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ════════════════════════════════════════════
   HERO
   ════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0f1e] via-[#0d1a3a] to-[#0a1628]">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#1e3a6e]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#1a3668]/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#2a3f6e]/10 blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20 pb-16">
        {/* Announcement banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.07] backdrop-blur-sm border border-white/[0.08] mb-6">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-xs font-medium text-white/70">
            $30 Million Financing by Asia Partners & PayPal Ventures
          </span>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1a3a6a]/30 backdrop-blur-sm border border-[#2a5090]/30 mb-8">
          <Zap className="h-3.5 w-3.5 text-blue-300" />
          <span className="text-xs font-semibold text-blue-200 tracking-wide uppercase">
            Asia&apos;s #1 Hyperlocal Marketing Platform
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
          Acquire Customers,{' '}
          <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent">
            Locally
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/70 leading-relaxed mb-10">
          Harness the Power of Our AI-Driven Multi-Location Marketing-to-Commerce Software and
          amplify your brand&apos;s visibility during the critical buying journey — from discovery
          to purchase.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-600 to-[#2563eb] text-white shadow-xl shadow-blue-600/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.03]"
          >
            GET DEMO
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-medium text-white/90 border border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all"
          >
            Explore Products
            <ChevronDown className="h-4 w-4" />
          </a>
        </div>

        {/* Trust bar */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-white/40 text-xs font-medium">
          <span>Backed by PayPal Ventures</span>
          <span className="hidden sm:inline">&bull;</span>
          <span>200+ Brands Trust Us</span>
          <span className="hidden sm:inline">&bull;</span>
          <span>50+ Platform Integrations</span>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

/* ════════════════════════════════════════════
   CLIENT STRIP (same to same with scrolling logos)
   ════════════════════════════════════════════ */
function ClientStrip() {
  const reveal = useReveal();
  return (
    <section id="clients" ref={reveal.ref} className={`py-16 sm:py-20 bg-white reveal-section ${reveal.visible ? 'visible' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-3">
          Trusted by Industry Leaders
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          200+ Brands Power Their Hyperlocal Growth With Us
        </h2>
      </div>

      {/* Marquee container */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="marquee-track">
          {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-6 sm:mx-8 flex items-center justify-center h-16 sm:h-20 w-28 sm:w-36 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <img
                src={src}
                alt="SingleInterface client logo"
                className="max-h-12 sm:max-h-14 max-w-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   HYPERX STATIC VISUAL
   ════════════════════════════════════════════ */
function HyperXVisual() {
  const tags = [
    { label: 'Language', color: 'bg-blue-600' },
    { label: 'User', color: 'bg-orange-500' },
    { label: 'Intent', color: 'bg-violet-600' },
    { label: 'Variant', color: 'bg-slate-500' },
    { label: 'Category', color: 'bg-rose-500' },
    { label: 'Gender', color: 'bg-sky-600' },
    { label: 'Brand', color: 'bg-emerald-600' },
    { label: 'Product', color: 'bg-amber-500' },
  ];

  return (
    <div className="relative w-full py-8">
      {/* Central hub */}
      <div className="flex items-center justify-center mb-6">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-600 to-[#1e3a6e] flex items-center justify-center shadow-xl shadow-violet-500/30 animate-float">
          <Sparkles className="h-9 w-9 text-white" />
        </div>
      </div>

      {/* Tag cloud */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-[280px] mx-auto">
        {tags.map((tag) => (
          <span
            key={tag.label}
            className={`${tag.color} text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap`}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   POWER OF DIGITAL MARKETING SECTION
   (same to same with complete structure, graphics & animation)
   ════════════════════════════════════════════ */
function PowerOfDigital() {
  const reveal = useReveal();

  return (
    <section id="products" ref={reveal.ref} className={`py-20 sm:py-28 bg-[#f8fafc] reveal-section ${reveal.visible ? 'visible' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-4xl mx-auto text-center mb-6">
          <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-3">
            Power of Digital Marketing, E-Commerce & Deep Consumer Insights
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f172a] tracking-tight mb-5">
            AI-Powered Product Suite For All Hyperlocal Needs
          </h2>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">
            Build Robust Presence, Drive Engagement, Manage Reputation, Facilitate Transactions,
            Run Hyperlocal Ads & Get Rich Consumer Insights For Every Location.
          </p>
        </div>

        {/* Case study banner */}
        <div className="mt-8 mb-14 rounded-2xl bg-gradient-to-br from-[#0a0f1e] via-[#0d1a3a] to-[#0a1628] p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 h-[200px] w-[200px] rounded-full bg-[#1e3a6e]/15 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-[200px] w-[200px] rounded-full bg-[#1a3668]/15 blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Outcome-Focused, AI-Powered Marketing and Commerce Capabilities, for Multi-Location Brands.
              </h3>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                Streamline discovery, engage customers, handle feedback, and deliver seamless omnichannel
                experiences to boost revenue with actionable insights for every location.
              </p>
            </div>
            <div className="flex-shrink-0 flex gap-4 items-center">
              <img src="https://www.singleinterface.com/Enquiry/img/netSales.svg" alt="Net Sales" className="h-20 sm:h-24 hidden sm:block" />
              <img src="https://www.singleinterface.com/Enquiry/img/dashboard.svg" alt="Dashboard" className="h-20 sm:h-24 hidden sm:block" />
            </div>
            <a
              href="#contact"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-[#2563eb] text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition-all"
            >
              GET DEMO
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Product cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => (
            <div
              key={product.title}
              className="product-card-hover group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-lg hover:border-blue-200/60 relative overflow-hidden"
            >
              {product.badge && (
                <span className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 tracking-wider uppercase">
                  {product.badge}
                </span>
              )}

              {/* HyperX special card with orbital animation */}
              {product.isHyperX ? (
                <div className="mb-2">
                  <HyperXVisual />
                </div>
              ) : product.isTrust ? (
                /* Trust card with certification badges */
                <div className="mb-4 flex flex-col items-center gap-3">
                  <img src="https://www.singleinterface.com/Enquiry/img/trust-img1.png" alt="Build with Trust" className="h-24 object-contain" />
                  <img src="https://www.singleinterface.com/Enquiry/img/trust-img2.png" alt="Build with Trust" className="h-24 object-contain" />
                  <div className="flex gap-3 mt-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Shield className="h-3 w-3" /> REGULAR VAPT
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      <Lock className="h-3 w-3" /> END TO END ENCRYPTION
                    </span>
                  </div>
                </div>
              ) : (
                /* Regular product card with image */
                <div className="mb-4 h-32 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="max-h-28 max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  ) : product.icon ? (
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-[#1d4ed8] flex items-center justify-center shadow-lg shadow-blue-200/40">
                      <product.icon className="h-7 w-7 text-white" />
                    </div>
                  ) : null}
                </div>
              )}

              <h3 className="text-lg font-semibold text-slate-900 mb-2">{product.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{product.desc}</p>

              {/* HyperX feature pills */}
              {product.features && (
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feat) => (
                    <span key={feat.label} className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      <feat.icon className="h-3 w-3" />
                      {feat.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   STATS
   ════════════════════════════════════════════ */
function Stats() {
  const reveal = useReveal();
  return (
    <section ref={reveal.ref} className={`py-16 sm:py-20 bg-gradient-to-br from-[#0a0f1e] via-[#0d1a3a] to-[#0a1628] relative overflow-hidden reveal-section ${reveal.visible ? 'visible' : ''}`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-[#1e3a6e]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-[#1a3668]/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">{s.value}</p>
              <p className="text-sm text-white/60 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   HOW IT WORKS
   ════════════════════════════════════════════ */
function HowItWorks() {
  const reveal = useReveal();
  return (
    <section ref={reveal.ref} className={`py-20 sm:py-28 bg-white reveal-section ${reveal.visible ? 'visible' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] tracking-tight mb-5">
            Three Steps to Local Dominance
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Get started quickly and see measurable results in weeks, not months.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.num} className="relative text-center md:text-left">
              <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-[#1d4ed8] items-center justify-center mb-5 shadow-lg shadow-blue-200/40">
                <step.icon className="h-7 w-7 text-white" />
              </div>
              <div className="text-xs font-bold text-blue-500 tracking-widest mb-2">STEP {step.num}</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   TESTIMONIALS
   ════════════════════════════════════════════ */
function Testimonials() {
  const [current, setCurrent] = useState(0);
  const reveal = useReveal();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoPlay = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay, stopAutoPlay]);

  const prev = () => { stopAutoPlay(); setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length); };
  const next = () => { stopAutoPlay(); setCurrent((c) => (c + 1) % TESTIMONIALS.length); };

  const t = TESTIMONIALS[current];

  return (
    <section id="testimonials" ref={reveal.ref} className={`py-20 sm:py-28 bg-[#0f172a] relative overflow-hidden reveal-section ${reveal.visible ? 'visible' : ''}`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-[#1e3a6e]/8 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[#1a3668]/8 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-400 tracking-wide uppercase mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">Voice of the Customer</h2>
          <p className="text-base text-slate-400 max-w-xl mx-auto">
            A Trusted Partner To Many Customers In Their Marketing Stack.
          </p>
        </div>

        {/* Testimonial card */}
        <div className="relative">
          <div className="rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] p-8 sm:p-10 min-h-[320px] flex flex-col">
            {/* Quote icon */}
            <div className="mb-4">
              <svg className="h-8 w-8 text-blue-400/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            <p className="text-white/80 text-base sm:text-lg leading-relaxed flex-1 mb-6">
              &ldquo;{t.text}&rdquo;
            </p>

            <div className="flex items-center gap-4">
              {/* Company logo */}
              <img src={t.logo} alt={t.company} className="h-10 object-contain rounded" />
              <div>
                <p className="text-white font-semibold text-sm">{t.name}</p>
                <p className="text-slate-400 text-xs">{t.title}, {t.company}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { stopAutoPlay(); setCurrent(i); }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 bg-blue-500' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   AWARDS
   ════════════════════════════════════════════ */
function Awards() {
  const [scrollPos, setScrollPos] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reveal = useReveal();

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    const newPos = dir === 'left' ? Math.max(scrollPos - amount, 0) : scrollPos + amount;
    scrollRef.current.scrollTo({ left: newPos, behavior: 'smooth' });
    setScrollPos(newPos);
  };

  return (
    <section id="awards" ref={reveal.ref} className={`py-20 sm:py-28 bg-white reveal-section ${reveal.visible ? 'visible' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-3">
            Making Waves Across Industries
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Awards & Recognition
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Accolades Won By SingleInterface Recognizing The Impact Our Products Have Delivered Across Industries.
          </p>
        </div>

        {/* Scroll controls */}
        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors"
            aria-label="Scroll awards left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors"
            aria-label="Scroll awards right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide flex gap-6 px-8 snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {AWARDS.map((award, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-72 sm:w-80 snap-start rounded-2xl border border-slate-200 bg-white p-6 shadow-sm award-card-shimmer hover:shadow-md transition-shadow"
              >
                <div className="h-36 flex items-center justify-center mb-4 overflow-hidden">
                  <img src={award.image} alt={award.title} className="max-h-32 max-w-full object-contain" loading="lazy" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">{award.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{award.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   SUCCESS STORIES
   ════════════════════════════════════════════ */
function SuccessStories() {
  const [activeStory, setActiveStory] = useState(0);
  const reveal = useReveal();

  return (
    <section id="success-stories" ref={reveal.ref} className={`py-20 sm:py-28 bg-slate-50 reveal-section ${reveal.visible ? 'visible' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-3">Success Stories</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Helping Brands Grow Local Business. Exponentially.
          </h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Witness Remarkable Revenue Growth For Every Location
          </p>
        </div>

        {/* Story tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {SUCCESS_STORIES.map((story, i) => (
            <button
              key={i}
              onClick={() => setActiveStory(i)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                i === activeStory
                  ? 'bg-gradient-to-r from-blue-600 to-[#2563eb] text-white shadow-lg shadow-blue-200/40'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <img src={story.logo} alt={story.company} className="h-5 object-contain" />
              {story.company}
            </button>
          ))}
        </div>

        {/* Active story */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left: content */}
            <div className="p-8 sm:p-10 flex flex-col justify-center">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
                {SUCCESS_STORIES[activeStory].title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                {SUCCESS_STORIES[activeStory].desc}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {SUCCESS_STORIES[activeStory].metrics.map((m) => (
                  <div key={m.label} className="text-center p-3 rounded-xl bg-blue-50/50">
                    <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-[#2563eb] bg-clip-text text-transparent">
                      {m.value}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">{m.label}</p>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-[#2563eb] text-white shadow-lg shadow-blue-200/30 hover:shadow-blue-300/50 transition-all self-start"
              >
                View Case Study
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Right: video / brand visual */}
            <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 min-h-[300px] flex items-center justify-center">
              {SUCCESS_STORIES[activeStory].video ? (
                <div className="w-full h-full">
                  <iframe
                    src={SUCCESS_STORIES[activeStory].video}
                    title={`${SUCCESS_STORIES[activeStory].company} success story`}
                    className="w-full h-full min-h-[300px]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="text-center p-8">
                  <img
                    src={SUCCESS_STORIES[activeStory].logo}
                    alt={SUCCESS_STORIES[activeStory].company}
                    className="h-16 sm:h-20 object-contain mx-auto mb-4"
                  />
                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-sm font-medium">Results speak louder than words</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   BLOG
   ════════════════════════════════════════════ */
function Blog() {
  const reveal = useReveal();

  return (
    <section id="blog" ref={reveal.ref} className={`py-20 sm:py-28 bg-white relative reveal-section ${reveal.visible ? 'visible' : ''}`}>
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(37,99,235,0.4) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-3">Blogs</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Demystifying Hyperlocal
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Read Our Blogs, Find Enriching Insights, And Get An In-Depth Understanding Of Hyperlocal
            Marketing & Commerce Space.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOGS.map((blog) => (
            <a
              key={blog.title}
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-200/60 transition-all"
            >
              <div className="h-48 overflow-hidden bg-slate-100">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-3">
                  {blog.desc}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">
                  Read More <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://blog.singleinterface.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
          >
            VIEW ALL
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   CTA / CONTACT
   ════════════════════════════════════════════ */
function CTA() {
  return (
    <section id="contact" className="py-20 sm:py-28 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl bg-gradient-to-br from-[#0a0f1e] via-[#0d1a3a] to-[#0a1628] p-8 sm:p-14 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 h-[250px] w-[250px] rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-[250px] w-[250px] rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Local Marketing?
            </h2>
            <p className="text-white/70 mb-8 max-w-lg mx-auto">
              Join 200+ brands that use SingleInterface to drive footfalls and revenue from local
              search. Get a personalized demo today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:hello@singleinterface.com"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-600 to-[#2563eb] text-white shadow-xl shadow-blue-600/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.03]"
              >
                <Users className="h-4 w-4" />
                GET DEMO
              </a>
              <a
                href="#products"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-medium text-white/90 border border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img
              src="https://www.singleinterface.com/Enquiry/imgwebp/Singleinterface-logo-light.svg"
              alt="SingleInterface"
              className="h-8 mb-4"
            />
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-4">
              Asia&apos;s Largest Hyperlocal Marketing-To-Commerce Software For Multi-Location Brands.
            </p>
            <p className="text-xs text-slate-500">
              Digital Transformation Marketing Stack for Physical Retail Enterprises.
            </p>
          </div>

          {/* Local Cloud */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Local Cloud</h4>
            <ul className="space-y-2">
              {['Hyper X ai', 'Presence Management', 'Engagement Management', 'Reputation Management', 'Spotlight', 'Call Leads', 'Transaction Management', 'Advance Feature Sets'].map((item) => (
                <li key={item}>
                  <a href="#products" className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Industries</h4>
            <ul className="space-y-2">
              {['Automobile', 'Banking', 'Financial Services', 'Food & Beverage', 'Retail', 'Healthcare', 'Consumer Durables'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Contact Us', 'Blogs', 'Terms & Conditions', 'Data Protection'].map((item) => (
                <li key={item}>
                  <a href={item === 'Blogs' ? 'https://blog.singleinterface.com/' : '#'} target={item === 'Blogs' ? '_blank' : undefined} rel={item === 'Blogs' ? 'noopener noreferrer' : undefined} className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Insights */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Insights</h4>
            <ul className="space-y-2">
              {['Videos', 'Success Stories', 'Awards', 'Testimonials'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-slate-400 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Certifications & Social */}
        <div className="mt-10 pt-8 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src="https://www.singleinterface.com/Enquiry/imgwebp/GPTW.webp" alt="Great Place to Work" className="h-12 object-contain" />
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded bg-emerald-900/30 text-emerald-400 border border-emerald-800/30">
                  <Shield className="h-3 w-3" /> VAPT
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded bg-blue-900/30 text-blue-400 border border-blue-800/30">
                  <Lock className="h-3 w-3" /> Encrypted
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a href="https://x.com/SingleInterface" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/singleinterface/" target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} SingleInterface. All rights reserved.
            </p>
            <p className="text-xs text-slate-500">
              Backed by <span className="text-slate-400 font-medium">PayPal Ventures</span> &amp; <span className="text-slate-400 font-medium">Asia Partners</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════ */
export default function SingleInterfaceLanding() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ClientStrip />
        <PowerOfDigital />
        <Stats />
        <HowItWorks />
        <Testimonials />
        <Awards />
        <SuccessStories />
        <Blog />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
