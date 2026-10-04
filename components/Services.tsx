'use client';

import styles from './Services.module.css';

const SERVICES = [
  {
    id: 'meta-ads',
    tag: 'Paid Social',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z" />
      </svg>
    ),
    title: 'Meta Ads',
    description:
      'Instagram & Facebook campaigns built for direct conversions, ROAS scaling, and creative testing.',
  },
  {
    id: 'google-ads',
    tag: 'High Intent',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    title: 'Google Ads',
    description:
      'Search and display campaigns that capture active searchers ready to convert immediately.',
  },
  {
    id: 'youtube-ads',
    tag: 'Video Growth',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="5,3 19,12 5,21" />
      </svg>
    ),
    title: 'YouTube Ads',
    description:
      'Design, targeting, and management of high-engagement video ad campaigns across YouTube.',
  },
  {
    id: 'email-marketing',
    tag: 'Retention',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    title: 'Email Marketing',
    description:
      'Automated flows and segmented campaigns that turn first-time subscribers into lifelong repeat customers.',
  },
  {
    id: 'content-creation',
    tag: 'Creative Studio',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 4L16 12" />
        <circle cx="17" cy="7" r="5" />
      </svg>
    ),
    title: 'Content Creation & Storytelling',
    description:
      'Rapid video, photography, and conversion copywriting crafted around your brand’s actual voice.',
  },
  {
    id: 'brand-optimisation',
    tag: 'Identity & Voice',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'Brand Optimisation',
    description:
      'Sharpen positioning, visual appeal, and core message across all customer touchpoints.',
  },
  {
    id: 'paid-media-strategy',
    tag: 'Growth Strategy',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: 'Paid Media Strategy',
    description:
      'Scientific budget and channel allocation so your marketing spend goes directly where it generates ROI.',
  },
  {
    id: 'web-design-dev',
    tag: 'Conversion UX',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="14" x="2" y="3" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Web Design & Development',
    description:
      'High-speed landing pages and modern websites engineered specifically to convert visitors into paying clients.',
  },
];

interface ServicesProps {
  onNavigate?: (page: any) => void;
  onSelectService?: (serviceId: string) => void;
}

export default function Services({ onNavigate, onSelectService }: ServicesProps) {
  const handleServiceClick = (serviceId: string) => {
    if (onSelectService) {
      onSelectService(serviceId);
    } else if (onNavigate) {
      onNavigate('contact');
    }
  };

  return (
    <section className={`section ${styles.services}`} id="services">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.badgeWrapper}>
            <div className="badge">
              <span className="badgeDot" />
              <span>Capabilities & Core Services</span>
            </div>
          </div>
          <h2 className={styles.title}>
            Precise solutions engineered for scale.
          </h2>
          <p className={styles.subtitle}>
            From rapid high-converting creatives to omnichannel performance marketing, discover how our 8 core capabilities drive measurable brand revenue. Click any service to view full deliverables, workflows, and benchmarks.
          </p>
        </div>

        <div className={styles.grid}>
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className={styles.card}
              onClick={() => handleServiceClick(service.id)}
              role="button"
              tabIndex={0}
              aria-label={`View details about ${service.title}`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>{service.icon}</div>
                <span className={styles.tag}>{service.tag}</span>
              </div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDesc}>{service.description}</p>
              <div className={styles.cardFooter}>
                <span className={styles.footerLabel}>Learn more</span>
                <span className={styles.cardArrow}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
