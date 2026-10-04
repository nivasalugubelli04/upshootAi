'use client';

import { useState } from 'react';
import type { ActivePage } from '@/app/page';
import styles from './Pricing.module.css';

interface PricingProps {
  onNavigate: (page: ActivePage) => void;
  onSignIn?: () => void;
}

const PLANS = [
  {
    id: 'instant',
    name: 'Instant Package',
    price: '£300',
    headline: 'Fast, essential content and paid social setup — live in days.',
    features: [
      'Meta Ads (Facebook & Instagram)',
      'Email Marketing Automation Setup',
      'High-Converting Short-Form Reel Creation',
      'Comprehensive Brand Conversion Audit',
    ],
    bestFor: 'Brands that need immediate content and profitable social ads running fast.',
    cta: 'Get Started with Instant',
    featured: false,
  },
  {
    id: 'business',
    name: 'Business Package',
    price: '£500',
    headline: 'Everything needed to operate a multi-channel revenue engine.',
    features: [
      'Everything in Instant Package, plus:',
      'Google Ads (Search & Performance Max)',
      'YouTube Video Ads Campaign Direction',
      'Dedicated Paid Media Channel Allocation',
    ],
    bestFor: 'Growing businesses ready to aggressively scale across multiple paid channels.',
    cta: 'Book Business Engine',
    featured: true,
  },
  {
    id: 'exclusives',
    name: 'Exclusives',
    price: '£850',
    headline: 'Full-service creative, ads, and web architecture managed end-to-end.',
    features: [
      'Everything in Business Package, plus:',
      'High-Speed Web Design & Development',
      'Dedicated Senior Strategist Account Lead',
      'Bi-Weekly Strategic Growth Advisory',
    ],
    bestFor: 'Brands seeking an elite, white-glove, done-for-you growth partner.',
    cta: 'Apply for Exclusives',
    featured: false,
  },
];

export default function Pricing({ onNavigate }: PricingProps) {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <section className={`section ${styles.pricing}`} id="pricing">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.badgeWrapper}>
            <div className="badge">
              <span className="badgeDot" />
              <span>Transparent Growth Plans</span>
            </div>
          </div>
          <h2 className={styles.title}>
            Transparent pricing for predictable scale.
          </h2>
          <p className={styles.subtitle}>
            Predictable packages with no hidden agency markups. Tailored for ambitious DTC brands, B2B services, and scaling ventures.
          </p>

          {/* Desktop/Tablet Tab Switcher */}
          <div className={styles.tabs} role="tablist" aria-label="Pricing package tabs">
            {PLANS.map((plan, index) => (
              <button
                key={plan.id}
                role="tab"
                aria-selected={activeTab === index}
                aria-controls={`panel-${plan.id}`}
                id={`tab-${plan.id}`}
                className={`${styles.tab} ${activeTab === index ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(index)}
              >
                <span>{plan.name}</span>
                <span className={styles.tabBadge}>{plan.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className={styles.cardsGrid}>
          {PLANS.map((plan, index) => {
            const isSelected = activeTab === index;
            return (
              <div
                key={plan.id}
                id={`panel-${plan.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${plan.id}`}
                className={`${styles.card} ${plan.featured ? styles.cardFeatured : ''} ${
                  isSelected ? styles.cardActiveMobile : ''
                }`}
              >
                {plan.featured && (
                  <div className={styles.popularBadge}>
                    <span className={styles.popularDot} />
                    <span>Most Popular Growth Choice</span>
                  </div>
                )}

                <div className={styles.cardTop}>
                  <span className={styles.planName}>{plan.name}</span>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>{plan.price}</span>
                    <span className={styles.pricePeriod}>/ package</span>
                  </div>
                  <p className={styles.headline}>{plan.headline}</p>
                </div>

                <div className={styles.divider} />

                <ul className={styles.featList}>
                  {plan.features.map((feat, i) => (
                    <li key={i} className={styles.featItem}>
                      <svg className={styles.featIcon} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.bestForBox}>
                  <span className={styles.bestForLabel}>Optimal Stage</span>
                  <span className={styles.bestForText}>{plan.bestFor}</span>
                </div>

                <button
                  onClick={() => onNavigate('contact')}
                  className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'} ${styles.selectBtn}`}
                >
                  <span>{plan.cta}</span>
                  <span className="btnArrow">→</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
