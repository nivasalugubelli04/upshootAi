'use client';

import type { ActivePage } from '@/app/page';
import styles from './Footer.module.css';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
  onSignIn?: () => void;
  onOpenMonitor?: () => void;
}

export default function Footer({ onNavigate, onOpenMonitor }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.cardContainer}>
          <div className={styles.top}>
            {/* Brand Col */}
            <div className={styles.brandCol}>
              <button
                onClick={() => onNavigate('home')}
                className={styles.brand}
                aria-label="Upshoot AI home"
              >
                <div className={styles.logoBadge}>
                  <img
                    src="/images/upshoot-logo.jpg"
                    alt="Upshoot AI — Capture · Create · Inspire"
                    className={styles.brandLogoImg}
                  />
                </div>
              </button>
              <p className={styles.tagline}>
                Lean performance marketing, high-converting creative machines, and full-funnel paid media architecture.
              </p>
              <div className={styles.contactEmailBox}>
                <a
                  href="mailto:Upshootai@gmail.com"
                  className={styles.contactEmailLink}
                >
                  Upshootai@gmail.com
                </a>
              </div>
            </div>

            {/* Nav Links */}
            <div className={styles.linksCol}>
              <h4 className={styles.columnTitle}>Navigation</h4>
              <ul className={styles.linksList}>
                <li>
                  <button onClick={() => onNavigate('home')} className={styles.footerLink}>
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('services')} className={styles.footerLink}>
                    Services
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('pricing')} className={styles.footerLink}>
                    Pricing
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('about')} className={styles.footerLink}>
                    About
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('contact')} className={styles.footerLink}>
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Services Col */}
            <div className={styles.linksCol}>
              <h4 className={styles.columnTitle}>Core Services</h4>
              <ul className={styles.linksList}>
                <li>
                  <button onClick={() => onNavigate('services')} className={styles.footerLink}>
                    Meta Ads (FB & IG)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('services')} className={styles.footerLink}>
                    Google Search & PMax
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('services')} className={styles.footerLink}>
                    YouTube Video Ads
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('services')} className={styles.footerLink}>
                    Email Marketing Automation
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('services')} className={styles.footerLink}>
                    High-Converting Web Dev
                  </button>
                </li>
              </ul>
            </div>

            {/* Direct Gateway Col */}
            <div className={styles.linksCol}>
              <h4 className={styles.columnTitle}>Agency Gateway</h4>
              <ul className={styles.linksList}>
                <li>
                  <button onClick={() => onNavigate('contact')} className={styles.footerLink}>
                    Direct Strategy SLA (24h)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('pricing')} className={styles.footerLink}>
                    Compare Growth Plans
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('contact')} className={styles.footerLink}>
                    Submit Project Brief
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.bottom}>
            <p className={styles.copyright}>
              © {currentYear} Upshoot AI. All rights reserved.
            </p>
            <div className={styles.statusIndicator}>
              <span className={styles.statusDot} />
              <span>Strategy Team Accepting Select Brands</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
