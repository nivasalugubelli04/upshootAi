'use client';

import type { ActivePage } from '@/app/page';
import styles from './Hero.module.css';

interface HeroProps {
  onNavigate: (page: ActivePage) => void;
  onSelectService?: (serviceId: string) => void;
  onSignIn?: () => void;
}

export default function Hero({ onNavigate, onSelectService }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.container}`}>
        {/* Left Column: Asymmetric Precision Typography */}
        <div className={styles.leftCol}>
          <div className={styles.badgeWrapper}>
            <div className="badge">
              <span className="badgeDot" />
              <span>Performance Marketing & Content Engine</span>
            </div>
          </div>

          <h1 className={styles.title}>
            Precise marketing for ambitious brands.
            <span className={styles.titleHighlight}>
              Content, ads & funnels built to convert.
            </span>
          </h1>

          <p className={styles.subtitle}>
            We engineer high-velocity creative assets and scalable paid media systems.
            From Meta and Google Ads to full white-glove growth architecture, we build what your stage needs to scale predictably.
          </p>

          <div className={styles.ctas}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('pricing')}
              id="hero-see-plans-btn"
            >
              <span>See Growth Plans</span>
              <span className="btnArrow">→</span>
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate('services')}
              id="hero-services-btn"
            >
              Explore 8 Core Services
            </button>
          </div>

          {/* High-Impact Proof Highlights (vs-epple precision strip) */}
          <div className={styles.proofStrip}>
            <div className={styles.proofItem}>
              <span className={styles.proofNumber}>10 MIN</span>
              <span className={styles.proofLabel}>Instant Reel Delivery</span>
            </div>
            <div className={styles.proofDivider} />
            <div className={styles.proofItem}>
              <span className={styles.proofNumber}>8 CHANNELS</span>
              <span className={styles.proofLabel}>Omnichannel Media Engine</span>
            </div>
            <div className={styles.proofDivider} />
            <div className={styles.proofItem}>
              <span className={styles.proofNumber}>24H</span>
              <span className={styles.proofLabel}>Guaranteed Strategy SLA</span>
            </div>
          </div>
        </div>

        {/* Right Column: Luxury Media & Campaign Showcase Card */}
        <div className={styles.rightCol}>
          <div className={styles.showcaseCard}>
            <div className={styles.cardGlow} aria-hidden="true" />

            <div className={styles.showcaseHeader}>
              <div className={styles.liveBadge}>
                <span className={styles.liveDot} />
                <span>Live Growth Engine</span>
              </div>
              <span className={styles.roasPill}>+380% Avg ROAS</span>
            </div>

            {/* Video / Creative Reel Showcase with Real Studio Imagery */}
            <div
              className={styles.reelFrame}
              onClick={() => onNavigate('services')}
              role="button"
              tabIndex={0}
              aria-label="View Showreel"
            >
              <img
                src="/images/agency_hero_showcase.jpg"
                alt="Upshoot AI Ad Performance & Production Studio"
                className={styles.reelBgImage}
              />
              <div className={styles.reelOverlay} />
              <div className={styles.reelContent}>
                <div className={styles.playBtn}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <h3 className={styles.reelTitle}>Creative Performance Reel</h3>
                <span className={styles.reelTag}>High-Converting Short-Form & Paid Social</span>
              </div>
            </div>

            {/* Stats Metric Strip */}
            <div className={styles.showcaseStats}>
              <div className={styles.statItem}>
                <span className={styles.statVal}>£1.8M+</span>
                <span className={styles.statName}>Ad Spend Scaled</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>4.8x</span>
                <span className={styles.statName}>Blended Return</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>100+</span>
                <span className={styles.statName}>Ads Built / Mo</span>
              </div>
            </div>

            <div className={styles.showcaseFooter}>
              <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verified performance tracking via Supabase & Direct Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Studio Production Spotlight Banner */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        <div className={styles.studioBanner}>
          <div className={styles.studioImageCol}>
            <img
              src="/images/agency_content_creation.jpg"
              alt="Creative Direction and Ad Optimization Studio"
              className={styles.studioImage}
            />
            <div className={styles.studioTag}>
              <span className="badgeDot" style={{ background: '#10B981' }} />
              <span>Studio Master Control · 4K Active Production</span>
            </div>
          </div>

          <div className={styles.studioContentCol}>
            <div className="badge" style={{ marginBottom: '1rem', width: 'fit-content' }}>
              <span className="badgeDot" />
              <span>Creative Architecture</span>
            </div>

            <h2 className={styles.studioTitle}>
              From raw concept to live ROAS in 48 hours.
            </h2>

            <p className={styles.studioDesc}>
              Modern ad platforms reward high-velocity creative testing. Our in-house editors and growth directors shoot, cut, and optimize direct-response video assets tailored to conquer Meta, TikTok, and YouTube algorithms.
            </p>

            <ul className={styles.studioChecklist}>
              <li className={styles.studioCheckItem}>
                <svg className={styles.studioCheckIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Cinema-grade 4K production & direct-response hooks</span>
              </li>
              <li className={styles.studioCheckItem}>
                <svg className={styles.studioCheckIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Automated weekly creative iteration based on live CPM/CPA</span>
              </li>
              <li className={styles.studioCheckItem}>
                <svg className={styles.studioCheckIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Full omnichannel synchronization with Klaviyo retention flows</span>
              </li>
            </ul>

            <button
              className="btn btn-primary"
              onClick={() => {
                if (onSelectService) {
                  onSelectService('content-creation');
                } else {
                  onNavigate('services');
                }
              }}
              style={{ width: 'fit-content' }}
              id="hero-explore-creative-btn"
            >
              <span>Explore Creative Production Details</span>
              <span className="btnArrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
