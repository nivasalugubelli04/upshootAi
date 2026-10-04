'use client';

import styles from './About.module.css';

interface AboutProps {
  onNavigate?: (page: any) => void;
}

export default function About({ onNavigate }: AboutProps) {
  return (
    <section className={`section ${styles.about}`} id="about">
      <div className="container">
        <div className={styles.content}>
          <div className={styles.badgeWrapper}>
            <div className="badge">
              <span className="badgeDot" />
              <span>Strategic Perspective</span>
            </div>
          </div>

          <h2 className={styles.heading}>
            Engineered for high-growth brands.
          </h2>

          {/* Signature vs-epple style Executive Quote Card */}
          <div className={styles.leadCard}>
            <div className={styles.quoteCol}>
              <div className={styles.quoteMark}>“</div>
              <p className={styles.lead}>
                We don&apos;t build generic marketing campaigns that burn your budget. We engineer high-velocity creative assets and data-backed media architecture that scale your customer acquisition predictably.
              </p>
              <p className={styles.body}>
                From rapid short-form video to full-funnel multi-channel ad management, Upshoot AI provides the exact growth systems modern brands require to outperform their category.
              </p>
            </div>

            <div className={styles.directorCol}>
              <div className={styles.directorAvatar}>U</div>
              <div className={styles.directorName}>Senior Growth Partner</div>
              <div className={styles.directorTitle}>Paid Media & Creative Direction</div>
              <button
                className={`btn btn-primary ${styles.ctaBtn}`}
                onClick={() => onNavigate && onNavigate('contact')}
              >
                <span>Initiate Brief</span>
                <span className="btnArrow">→</span>
              </button>
            </div>
          </div>

          {/* 3 Precision Pillars Grid */}
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueNumber}>01</div>
              <h3 className={styles.valueTitle}>High-Velocity Execution</h3>
              <p className={styles.valueDesc}>
                Speed is an operational advantage. Launch high-converting reels, Meta ad creatives, and search campaigns in days, not months.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueNumber}>02</div>
              <h3 className={styles.valueTitle}>Full-Funnel Scientific Testing</h3>
              <p className={styles.valueDesc}>
                We test hooks, visual angles, and audience segments rigorously so your budget is deployed exclusively where return is maximized.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueNumber}>03</div>
              <h3 className={styles.valueTitle}>Direct Attribution & SLA</h3>
              <p className={styles.valueDesc}>
                24-Hour guaranteed response, transparent reporting, and clean conversion pipelines delivered straight to your team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
