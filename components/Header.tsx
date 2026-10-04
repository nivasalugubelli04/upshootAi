'use client';

import { useState } from 'react';
import type { ActivePage } from '@/app/page';
import type { User } from '@supabase/supabase-js';
import styles from './Header.module.css';

interface HeaderProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  user: User | null;
  userProfile: { name: string; email: string; phone: string } | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenMonitor?: () => void;
}

const NAV_ITEMS: { page: ActivePage; label: string }[] = [
  { page: 'home', label: 'Home' },
  { page: 'services', label: 'Services' },
  { page: 'pricing', label: 'Pricing' },
  { page: 'about', label: 'About' },
  { page: 'contact', label: 'Contact' },
];

export default function Header({
  activePage,
  onNavigate,
  user,
  userProfile,
  onSignIn,
  onSignOut,
  onOpenMonitor,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleNav = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const userInitial = userProfile?.name
    ? userProfile.name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'U';

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Brand */}
        <button
          className={styles.brand}
          onClick={() => handleNav('home')}
          aria-label="Upshoot AI — Capture · Create · Inspire"
        >
          <img
            src="/images/upshoot-logo.jpg"
            alt="Upshoot AI Logo"
            className={styles.brandLogoImg}
          />
        </button>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.page}
              className={`${styles.navLink} ${
                activePage === item.page ? styles.navLinkActive : ''
              }`}
              onClick={() => handleNav(item.page)}
              aria-current={activePage === item.page ? 'page' : undefined}
            >
              {activePage === item.page && (
                <span className={styles.activeDot} />
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {user ? (
            <div className={styles.userMenu}>
              <button
                className={styles.avatar}
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="User menu"
                aria-expanded={showUserMenu}
              >
                {userInitial}
              </button>

              {showUserMenu && (
                <div className={styles.dropdown}>
                  <div className={styles.userInfo}>
                    <p className={styles.userName}>
                      {userProfile?.name || 'Verified Client'}
                    </p>
                    <p className={styles.userEmail}>{user.email}</p>
                    {userProfile?.phone && (
                      <p className={styles.userPhone}>{userProfile.phone}</p>
                    )}
                  </div>
                  <div className={styles.menuDivider} />
                  {(user?.email?.toLowerCase() === 'upshootai@gmail.com' || user?.id === 'usr_upshoot_founder') && (
                    <a
                      href="/admin"
                      className={styles.menuItem}
                      onClick={() => setShowUserMenu(false)}
                      style={{ color: '#0071e3', fontWeight: 600 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="9" y1="21" x2="9" y2="9" />
                      </svg>
                      <span>Admin Database Dashboard</span>
                    </a>
                  )}
                  <button
                    className={styles.menuItem}
                    onClick={() => {
                      setShowUserMenu(false);
                      handleNav('contact');
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span>Contact Strategy Team</span>
                  </button>
                  <button
                    className={styles.menuItem}
                    onClick={() => {
                      setShowUserMenu(false);
                      onSignOut();
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className={`btn btn-secondary ${styles.signInBtn}`}
              onClick={onSignIn}
              id="header-signin-btn"
            >
              Sign In
            </button>
          )}

          <button
            className={`btn btn-primary ${styles.headerCta}`}
            onClick={() => handleNav('contact')}
            id="header-cta-btn"
          >
            <span>Get in Touch</span>
            <span className="btnArrow">→</span>
          </button>

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span
              className={`${styles.hamburgerBar} ${
                mobileMenuOpen ? styles.hamburgerBarOpen1 : ''
              }`}
            />
            <span
              className={`${styles.hamburgerBar} ${
                mobileMenuOpen ? styles.hamburgerBarOpen2 : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.page}
                className={`${styles.mobileNavLink} ${
                  activePage === item.page ? styles.mobileNavLinkActive : ''
                }`}
                onClick={() => handleNav(item.page)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className={styles.mobileActions}>
            {user ? (
              <button
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
                }}
              >
                Sign Out ({userProfile?.name || user.email})
              </button>
            ) : (
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignIn();
                }}
              >
                Client Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
