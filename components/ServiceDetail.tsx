'use client';

import styles from './ServiceDetail.module.css';

export interface ServiceData {
  id: string;
  tag: string;
  title: string;
  tagline: string;
  overview: string;
  metrics: { value: string; label: string }[];
  deliverables: { title: string; desc: string }[];
  process: { step: string; title: string; desc: string }[];
  processNote?: string;
  tools: string[];
  caseStudy: {
    title: string;
    description: string;
    stat: string;
    statLabel: string;
  };
}

export const SERVICES_CATALOG: Record<string, ServiceData> = {
  'meta-ads': {
    id: 'meta-ads',
    tag: 'Paid Social Performance',
    title: 'Meta Ads (Instagram & Facebook)',
    tagline: 'Scientific creative testing, broad audience scaling & ROAS maximization.',
    overview:
      'Meta remains the highest-volume customer acquisition channel on the planet when executed with algorithmic creative testing. We build structured CBO/ABO campaigns, deploy 10-20 high-converting hooks weekly, and scale budgets cleanly while maintaining profit margin.',
    metrics: [
      { value: '4.8x', label: 'Average Blended ROAS' },
      { value: '48 Hours', label: 'Campaign Launch SLA' },
      { value: '-32%', label: 'Average CPA Reduction' },
    ],
    deliverables: [
      {
        title: 'Weekly Creative Sprints',
        desc: '10 to 20 new static, reel, and video hook variations tested every single week.',
      },
      {
        title: 'Advantage+ Shopping (ASC) Setup',
        desc: 'Full optimization of Meta’s latest machine-learning bidding models and custom audiences.',
      },
      {
        title: 'Server-Side CAPI Tracking',
        desc: 'Eliminate iOS drop-off with 100% verified Conversions API and Event Deduplication.',
      },
      {
        title: 'Daily Budget & Bid Management',
        desc: 'Systematic scaling of winners and rapid culling of underperforming ad sets.',
      },
    ],
    process: [
      {
        step: '1',
        title: 'Historical Ad Account & Hook Audit',
        desc: 'We analyze your past 90 days of ad spend to identify winner concepts, fatigue points, and CPA leaks.',
      },
      {
        step: '2',
        title: 'Creative Matrix & Scripting',
        desc: 'Our direct-response team scripts high-velocity hooks, problem-solution reels, and visual proofs.',
      },
      {
        step: '3',
        title: 'Algorithmic Sandbox Testing',
        desc: 'Testing hooks in low-spend sandbox ad sets before graduating winners into primary scaling campaigns.',
      },
      {
        step: '4',
        title: 'Horizontal & Vertical Scaling',
        desc: 'Pumping profitable ad spend into proven creatives while optimizing blended MER and lifetime value.',
      },
    ],
    tools: ['Meta Ads Manager', 'Triple Whale', 'Motion App', 'Northbeam', 'Premiere Pro'],
    caseStudy: {
      title: 'DTC Wellness Brand Scaled 5.2x in 60 Days',
      description:
        'By transitioning from fatigued interest targeting to our dynamic creative testing matrix, we reduced Customer Acquisition Cost by 38% and scaled spend from £8,000 to £42,000/month.',
      stat: '+380%',
      statLabel: 'Revenue Growth',
    },
  },

  'google-ads': {
    id: 'google-ads',
    tag: 'High-Intent Search & PMax',
    title: 'Google Ads (Search, Shopping & PMax)',
    tagline: 'Capture active high-intent searchers at the exact moment of purchase intent.',
    overview:
      'When buyers search for your solution, you must occupy position one profitably. We architect high-converting Google Search campaigns, optimize Performance Max asset groups, and protect your branded real estate while poaching competitor search volume.',
    metrics: [
      { value: '5.4x', label: 'Top-Of-Funnel ROAS' },
      { value: '100%', label: 'Negative Match Guard' },
      { value: '+44%', label: 'Impression Share Lift' },
    ],
    deliverables: [
      {
        title: 'Precision Exact & Phrase Match Architecture',
        desc: 'Structured campaign isolation ensuring your money is never wasted on loose broad match queries.',
      },
      {
        title: 'Performance Max (PMax) Asset Optimization',
        desc: 'High-converting video, image, and copy combinations feed Google’s neural bidding algorithms.',
      },
      {
        title: 'Merchant Center & Feed Optimization',
        desc: 'Enriched product titles, custom labels, and dynamic pricing integration for e-commerce.',
      },
      {
        title: 'Negative Keyword Shielding',
        desc: 'Continuous daily query negative filtering to prevent unqualified clicks and bot clicks.',
      },
    ],
    process: [
      {
        step: '1',
        title: 'High-Intent Search Term Extraction',
        desc: 'Keyword discovery analyzing transactional intent, competitor bidding gaps, and search volumes.',
      },
      {
        step: '2',
        title: 'Ad Copy & Extension Crafting',
        desc: 'Formulating high CTR responsive search ads with dynamic keyword insertion and compelling USPs.',
      },
      {
        step: '3',
        title: 'Conversion Value Bidding Setup',
        desc: 'Configuring Target ROAS and Target CPA bidding tied directly to verified purchase revenue.',
      },
      {
        step: '4',
        title: 'Bid Shading & Scale',
        desc: 'Scaling top-performing search themes while maximizing share of voice on high-converting keywords.',
      },
    ],
    tools: ['Google Ads Manager', 'Google Merchant Center', 'SEMrush', 'GA4 Analytics'],
    caseStudy: {
      title: 'B2B SaaS Firm Achieves £48 Cost Per Qualified Lead',
      description:
        'Eliminated 65% of wasted search terms, restructured landing pages, and increased inbound demo conversions by 142% within 30 days.',
      stat: '142%',
      statLabel: 'Lead Conversion Lift',
    },
  },

  'youtube-ads': {
    id: 'youtube-ads',
    tag: 'Video Growth Engine',
    title: 'YouTube Video Advertising',
    tagline: 'Direct-response storytelling that captures attention and converts on video.',
    overview:
      'YouTube is the world’s second largest search engine and the undisputed king of long-form authority. We shoot and edit high-impact video ads that grip viewers within the first 5 seconds, overcome objections, and drive massive direct response purchases.',
    metrics: [
      { value: '82%', label: 'View-Through Engagement' },
      { value: '4.2x', label: 'Average Video ROAS' },
      { value: '5 Sec', label: 'Hook Retention Rate' },
    ],
    deliverables: [
      {
        title: 'Direct-Response Storyboard Scripts',
        desc: 'Battle-tested hook-story-offer formulas designed to stop skips and compel action.',
      },
      {
        title: 'In-Stream & Shorts Video Ads',
        desc: 'Both cinematic horizontal formats and viral vertical shorts tailored to YouTube viewers.',
      },
      {
        title: 'Custom In-Market & Affinity Audiences',
        desc: 'Targeting users who have recently searched for competitor brand terms on Google.',
      },
      {
        title: 'Frequency & Attribution Modeling',
        desc: 'Tracking post-view conversions and cross-device assisted sales across your marketing mix.',
      },
    ],
    process: [
      {
        step: '1',
        title: 'Audience Desire & Objection Mapping',
        desc: 'Identifying the exact emotional triggers and skepticism your target buyer holds.',
      },
      {
        step: '2',
        title: 'Studio Production & Hook Shooting',
        desc: 'Filming multiple pattern-interrupt hooks to guarantee viewers do not hit Skip Ad.',
      },
      {
        step: '3',
        title: 'Placement & Search Theme Launch',
        desc: 'Targeting specific channels, in-market segments, and competitor search intent queries.',
      },
      {
        step: '4',
        title: 'View-Rate & CPA Scaling',
        desc: 'Optimizing for view rate, click-through rate, and downstream blended customer revenue.',
      },
    ],
    tools: ['YouTube Studio', 'Google Ads', 'DaVinci Resolve', 'VidIQ'],
    caseStudy: {
      title: 'Apparel Brand Scales to £95,000/mo via YouTube Shorts Ads',
      description:
        'Deployed 15-second high-energy product transformation videos targeting fashion searchers, driving 3.9x blended return on ad spend.',
      stat: '3.9x',
      statLabel: 'Return on Ad Spend',
    },
  },

  'email-marketing': {
    id: 'email-marketing',
    tag: 'Retention & Lifecycle',
    title: 'Email Marketing & Retention Automation',
    tagline: 'Turn one-time shoppers into repeat brand advocates with automated revenue flows.',
    overview:
      'Acquisition gets you customers; retention makes you rich. We build Klaviyo flows, segmented campaigns, and SMS sequences that systematically extract 30% - 45% of your total brand revenue on complete autopilot.',
    metrics: [
      { value: '38%', label: 'Of Total Revenue from Email' },
      { value: '46%', label: 'Average Open Rate' },
      { value: '6.8x', label: 'Flow ROI Multiplier' },
    ],
    deliverables: [
      {
        title: 'Core Revenue Lifecycle Flows',
        desc: 'Welcome Series, Abandoned Cart, Browse Abandonment, Customer Winback, and VIP Nurture.',
      },
      {
        title: 'Custom HTML & Visual Email Design',
        desc: 'Editorial luxury layouts matching your brand voice that render flawlessly across iPhone and Android.',
      },
      {
        title: 'Hyper-Segmented Weekly Campaigns',
        desc: 'Behavior-based targeting (high spenders, unengaged, recent buyers) to protect sender reputation.',
      },
      {
        title: 'Deliverability & Domain Health',
        desc: 'Full DMARC, DKIM, and SPF authentication ensuring 99.4% inbox placement.',
      },
    ],
    process: [
      {
        step: '1',
        title: 'Flow & Sender Score Audit',
        desc: 'Analyzing current email capture rate, unsubscribes, spam rate, and flow performance.',
      },
      {
        step: '2',
        title: 'Copywriting & Design System',
        desc: 'Writing compelling subject lines, clear value hooks, and irresistible CTAs.',
      },
      {
        step: '3',
        title: 'Automation Logic & Triggering',
        desc: 'Setting up conditional splits based on cart value, purchase history, and product categories.',
      },
      {
        step: '4',
        title: 'Continuous A/B Testing',
        desc: 'Testing subject lines, send times, and dynamic discount structures to maximize revenue per recipient.',
      },
    ],
    processNote: 'Compatible with Shopify, WooCommerce, Magento & custom backends.',
    tools: ['Klaviyo', 'Omnisend', 'Postscript', 'Figma'],
    caseStudy: {
      title: 'Luxury Goods Retailer Added £64,000/mo in Automated Flows',
      description:
        'Revamped welcome sequence and high-intent cart recovery flows, boosting total revenue share from 11% to 39% in 45 days.',
      stat: '+255%',
      statLabel: 'Email Revenue Surge',
    },
  },

  'content-creation': {
    id: 'content-creation',
    tag: 'Creative Studio',
    title: 'Content Creation & Storytelling',
    tagline: 'Scroll-stopping reels, product showcases, and viral UGC that convert.',
    overview:
      'Content without strategy is noise. We shoot, edit, and deliver cinema-grade short-form video reels, TikToks, and luxury photography that stop the scroll within 0.5 seconds and build authentic brand equity.',
    metrics: [
      { value: '10 Min', label: 'First Reel Turnaround SLA' },
      { value: '25+', label: 'Monthly Assets Produced' },
      { value: '3.4x', label: 'Organic & Paid Virality Lift' },
    ],
    deliverables: [
      {
        title: 'High-Paced Short-Form Reels',
        desc: 'Vertical 9:16 videos with dynamic pacing, sound design, and animated captions.',
      },
      {
        title: 'Product & Model Macro Photography',
        desc: 'Editorial still shots engineered for high-converting social ads and website headers.',
      },
      {
        title: 'UGC & Founder Storytelling',
        desc: 'Relatable, believable direct-to-camera storytelling that builds immediate trust.',
      },
      {
        title: 'Hook Variation Testing Library',
        desc: 'Each core concept delivered with 3-5 different opening hooks to test in paid ads.',
      },
    ],
    process: [
      {
        step: '1',
        title: 'Trend & Competitor Intelligence',
        desc: 'Studying trending audio, viral formats, and conversion angles in your niche.',
      },
      {
        step: '2',
        title: 'Pre-Production & Scripting',
        desc: 'Outlining shot lists, visual cues, product props, and direct-response talking points.',
      },
      {
        step: '3',
        title: 'Production & Studio Filming',
        desc: 'Shot in 4K with professional cinema cameras, studio lighting, and color grading.',
      },
      {
        step: '4',
        title: 'Rapid Post-Production & Delivery',
        desc: 'Sound design, captions, and platform exports delivered ready to publish and scale.',
      },
    ],
    tools: ['Sony FX3 / RED Cameras', 'Premiere Pro', 'After Effects', 'CapCut Pro'],
    caseStudy: {
      title: 'Beverage Brand Generates 2.4M Views & 4,200 New Orders',
      description:
        'A single 12-second ASMR pouring hook went viral on Instagram Reels and TikTok, driving 4,200 orders in the first 72 hours.',
      stat: '2.4M',
      statLabel: 'Organic & Paid Views',
    },
  },

  'paid-media-strategy': {
    id: 'paid-media-strategy',
    tag: 'Capital Allocation',
    title: 'Paid Media Strategy & Advisory',
    tagline: 'Scientific budget allocation that eliminates wasted spend and scales profitability.',
    overview:
      'Throwing money at random ad platforms without a cohesive model is the fastest way to burn capital. Our Senior Media Directors construct full-funnel media plans, calculate your maximum allowable CPA, and orchestrate omnichannel budgets with surgical precision.',
    metrics: [
      { value: '£1.8M+', label: 'Spend Managed' },
      { value: '100%', label: 'Attribution Visibility' },
      { value: '24h', label: 'Strategist Response SLA' },
    ],
    deliverables: [
      {
        title: 'Blended MER & Unit Economics Model',
        desc: 'Know your exact breakeven CPA, contribution margin, and target ROAS per channel.',
      },
      {
        title: 'Omnichannel Budget Architecture',
        desc: 'Dynamic budget distribution balancing cold acquisition, middle-funnel retargeting, and retention.',
      },
      {
        title: 'Competitor Reverse-Engineering',
        desc: 'Deep inspection of what offers, funnels, and ad formats are scaling for your rivals.',
      },
      {
        title: 'Bi-Weekly Executive Strategy Sessions',
        desc: 'Direct advisory calls with Senior Growth Directors to steer quarterly roadmap.',
      },
    ],
    process: [
      {
        step: '1',
        title: 'Financial & Growth Modeling',
        desc: 'Audit of gross margins, LTV, repurchase rate, and platform attribution discrepancies.',
      },
      {
        step: '2',
        title: 'Channel Selection & Weighting',
        desc: 'Determining the exact percentage split between Meta, Google, YouTube, and Email.',
      },
      {
        step: '3',
        title: 'Creative Brief Directives',
        desc: 'Supplying our production studio with the exact hook types required by media buyers.',
      },
      {
        step: '4',
        title: 'Weekly Capital Re-allocation',
        desc: 'Shifting ad spend fluidly to the channels and campaigns delivering highest marginal ROI.',
      },
    ],
    tools: ['Triple Whale', 'Northbeam', 'Looker Studio', 'Supermetrics'],
    caseStudy: {
      title: 'Eliminated 40% Wasted Spend & Increased Net Profit 82%',
      description:
        'Reallocated ad capital from unprofitable secondary channels into winning Meta Advantage+ and Google Shopping campaigns.',
      stat: '+82%',
      statLabel: 'Net Profit Margin Lift',
    },
  },

  'brand-optimisation': {
    id: 'brand-optimisation',
    tag: 'Conversion Rate CRO',
    title: 'Brand Identity & Conversion Optimisation',
    tagline: 'Frictionless checkout paths, landing page split-testing, and luxury brand design.',
    overview:
      'Double your website conversion rate, and your ad spend becomes twice as profitable overnight. We audit every scroll, tap, and click across your mobile experience to remove friction, build undeniable credibility, and turn visitors into buyers.',
    metrics: [
      { value: '+64%', label: 'Average CR Increase' },
      { value: '< 1.2s', label: 'Mobile Interaction Speed' },
      { value: '98%', label: 'Checkout Completion Rate' },
    ],
    deliverables: [
      {
        title: 'Complete Mobile UX Friction Audit',
        desc: 'Heatmap, scroll map, and user session analysis identifying why visitors abandon cart.',
      },
      {
        title: 'High-Converting Landing Page Design',
        desc: 'Custom product detail pages (PDP) and advertorials engineered for cold ad traffic.',
      },
      {
        title: 'Offer & Bundle Structuring',
        desc: 'Designing buy-one-get-one, tiered discounts, and subscriptions to elevate Average Order Value (AOV).',
      },
      {
        title: 'Rigorous Split A/B Testing',
        desc: 'Continuous split testing of headlines, social proof badges, and sticky checkout buttons.',
      },
    ],
    process: [
      {
        step: '1',
        title: 'Heuristic & Quantitative Review',
        desc: 'Analyzing GA4 drop-off funnels, session recordings, and checkout abandonment rates.',
      },
      {
        step: '2',
        title: 'Hypothesis & Wireframing',
        desc: 'Designing high-converting UI mockups with clearer value propositions and trust badges.',
      },
      {
        step: '3',
        title: 'Engineering & Live A/B Deployment',
        desc: 'Deploying statistically valid split tests via VWO or Shopify Scripts.',
      },
      {
        step: '4',
        title: 'Winner Implementation',
        desc: 'Locking in the winning variant and moving onto the next highest leverage test.',
      },
    ],
    tools: ['Hotjar', 'Microsoft Clarity', 'Figma', 'Shopify Plus'],
    caseStudy: {
      title: 'Skincare Brand Elevates Conversion Rate from 1.8% to 3.4%',
      description:
        'Streamlined mobile PDP layout, added sticky Add to Cart bar, and introduced 3-tier bundle options, raising AOV by £18.',
      stat: '3.4%',
      statLabel: 'Mobile Conversion Rate',
    },
  },

  'web-design-dev': {
    id: 'web-design-dev',
    tag: 'Modern Web Architecture',
    title: 'High-Speed Web Design & Development',
    tagline: 'Sub-second load speeds, modern Swiss aesthetic, and mobile-first checkout flows.',
    overview:
      'Your website is your agency’s most valuable sales representative. We engineer ultra-fast, mobile-first web applications using modern Next.js and headless architectures that wow visitors instantly and turn cold traffic into committed clients.',
    metrics: [
      { value: '< 0.8s', label: 'Largest Contentful Paint' },
      { value: '100', label: 'Google PageSpeed Score' },
      { value: '99.9%', label: 'Guaranteed Uptime' },
    ],
    deliverables: [
      {
        title: 'Custom Headless & Next.js Development',
        desc: 'Lightning-fast client rendering with server-side rendering and edge caching.',
      },
      {
        title: 'Swiss Precision Design Language',
        desc: 'Architectural minimalism, high-contrast typography, and smooth micro-animations.',
      },
      {
        title: 'Database & Auth Integration',
        desc: 'Full Supabase PostgreSQL setup, Row Level Security, and OAuth pipelines.',
      },
      {
        title: 'Transactional Email & Lead Gateways',
        desc: 'Direct integration with Resend, Webhooks, and CRM databases for instant lead routing.',
      },
    ],
    process: [
      {
        step: '1',
        title: 'Information Architecture & Wireframes',
        desc: 'Mapping out user journeys, conversion paths, and technical specifications.',
      },
      {
        step: '2',
        title: 'High-Fidelity Visual Design',
        desc: 'Designing every screen in Figma following modern Swiss minimalist design principles.',
      },
      {
        step: '3',
        title: 'Production Engineering & Testing',
        desc: 'Writing clean TypeScript, performant CSS Modules, and robust API endpoints.',
      },
      {
        step: '4',
        title: 'Global Edge Deployment',
        desc: 'Deploying with automated CI/CD, SSL security, and global CDN caching.',
      },
    ],
    tools: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Vercel'],
    caseStudy: {
      title: 'Agency Platform Cuts Bounce Rate by 44% with 0.6s Load Time',
      description:
        'Migrated from sluggish legacy stack to custom Next.js architecture, scoring 100/100 on Google Core Web Vitals.',
      stat: '0.6s',
      statLabel: 'Global Page Load Time',
    },
  },
};

interface ServiceDetailProps {
  serviceId: string;
  onBack: () => void;
  onNavigate: (page: any) => void;
  onSelectService: (serviceId: string) => void;
}

export default function ServiceDetail({
  serviceId,
  onBack,
  onNavigate,
  onSelectService,
}: ServiceDetailProps) {
  const service = SERVICES_CATALOG[serviceId] || SERVICES_CATALOG['meta-ads'];
  const allServiceIds = Object.keys(SERVICES_CATALOG);
  const currentIndex = allServiceIds.indexOf(service.id);
  const prevId = allServiceIds[(currentIndex - 1 + allServiceIds.length) % allServiceIds.length];
  const nextId = allServiceIds[(currentIndex + 1) % allServiceIds.length];

  return (
    <section className={`section ${styles.serviceDetail}`}>
      <div className="container">
        {/* Navigation Bar */}
        <div className={styles.topBar}>
          <button onClick={onBack} className={styles.backBtn} aria-label="Back to all services">
            <span>← Back to All Services</span>
          </button>

          <div className={styles.serviceNavPills}>
            <button
              onClick={() => onSelectService(prevId)}
              className={styles.navPillBtn}
              title="Previous Service"
            >
              ← Previous
            </button>
            <button
              onClick={() => onSelectService(nextId)}
              className={styles.navPillBtn}
              title="Next Service"
            >
              Next Service →
            </button>
          </div>
        </div>

        {/* Hero Card of the Service */}
        <div className={styles.heroCard}>
          <div className={styles.badgeRow}>
            <div className="badge">
              <span className="badgeDot" />
              <span>{service.tag}</span>
            </div>
            <span className="badge" style={{ background: '#F5F5F7' }}>
              Capability Deep-Dive
            </span>
          </div>

          <h1 className={styles.title}>{service.title}</h1>
          <p className={styles.tagline}>{service.tagline}</p>
          <p className={styles.overviewText}>{service.overview}</p>

          {/* Performance Metrics */}
          <div className={styles.metricsGrid}>
            {service.metrics.map((m, i) => (
              <div key={i} className={styles.metricItem}>
                <span className={styles.metricValue}>{m.value}</span>
                <span className={styles.metricLabel}>{m.label}</span>
              </div>
            ))}
          </div>

          {/* Action Triggers */}
          <div className={styles.actionsRow}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('contact')}
            >
              <span>Initiate {service.title} Brief</span>
              <span className="btnArrow">→</span>
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate('pricing')}
            >
              Compare Growth Plans
            </button>
          </div>
        </div>

        {/* 2-Column Specification Grid */}
        <div className={styles.detailGrid}>
          {/* Deliverables Column */}
          <div className={styles.colCard}>
            <h2 className={styles.cardHeading}>Key Deliverables</h2>
            <ul className={styles.deliverablesList}>
              {service.deliverables.map((item, idx) => (
                <li key={idx} className={styles.deliverableItem}>
                  <div className={styles.checkIcon}>✓</div>
                  <div>
                    <h3 className={styles.deliverableTitle}>{item.title}</h3>
                    <p className={styles.deliverableDesc}>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.toolsBox}>
              <div className={styles.toolsHeading}>Verified Platform Stack</div>
              <div className={styles.toolsPills}>
                {service.tools.map((t, idx) => (
                  <span key={idx} className={styles.toolPill}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Process Timeline Column */}
          <div className={styles.colCard}>
            <h2 className={styles.cardHeading}>4-Step Execution Framework</h2>
            <ul className={styles.processList}>
              {service.process.map((p, idx) => (
                <li key={idx} className={styles.processItem}>
                  <div className={styles.processNum}>{p.step}</div>
                  <div>
                    <h3 className={styles.processStepTitle}>{p.title}</h3>
                    <p className={styles.processStepDesc}>{p.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Real-World Case Study Highlight */}
        <div className={styles.caseCard}>
          <div>
            <div className="badge" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', marginBottom: '1rem' }}>
              <span className="badgeDot" style={{ background: '#38bdf8' }} />
              <span>Proven Benchmark Result</span>
            </div>
            <h3 className={styles.caseTitle}>{service.caseStudy.title}</h3>
            <p className={styles.caseBody}>{service.caseStudy.description}</p>
          </div>

          <div className={styles.caseMetricsCol}>
            <div>
              <div className={styles.caseStatNum}>{service.caseStudy.stat}</div>
              <div className={styles.caseStatLabel}>{service.caseStudy.statLabel}</div>
            </div>
            <button
              className="btn btn-white"
              onClick={() => onNavigate('contact')}
            >
              <span>Schedule Strategy Call</span>
              <span className="btnArrow" style={{ background: '#111111', color: '#ffffff' }}>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
