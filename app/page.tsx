'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import ServiceDetail from '@/components/ServiceDetail';
import Pricing from '@/components/Pricing';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import ProfileModal from '@/components/ProfileModal';
import { createClient } from '@/lib/supabase/client';
import { notifyUserDetails } from '@/lib/notify';
import type { User } from '@supabase/supabase-js';

export type ActivePage = 'home' | 'services' | 'pricing' | 'about' | 'contact';

export default function HomePage() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    phone: string;
  } | null>(null);

  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('name, email, phone')
      .eq('id', userId)
      .single();
    if (data) {
      setUserProfile(data);
      if (!data.name || !data.phone) {
        setShowProfile(true);
      }
    } else {
      setShowProfile(true);
    }
  }, [supabase]);

  useEffect(() => {
    const checkSession = async () => {
      // 1. Check Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
        return;
      }

      // 2. Check MSG91 mobile authenticated session
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('upshoot_auth_user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed?.id) {
              const mobileUser: any = {
                id: parsed.id,
                email: parsed.email || `${parsed.phone}@upshootai.com`,
                phone: parsed.phone,
                user_metadata: {
                  full_name: parsed.name || 'Verified Partner',
                  name: parsed.name || 'Verified Partner',
                },
              };
              setUser(mobileUser);
              setUserProfile({
                name: parsed.name || 'Verified Partner',
                email: parsed.email || `${parsed.phone}@upshootai.com`,
                phone: parsed.phone,
              });
            }
          } catch {
            localStorage.removeItem('upshoot_auth_user');
          }
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          // If not in supabase, keep mobile session if present
          if (typeof window !== 'undefined' && !localStorage.getItem('upshoot_auth_user')) {
            setUser(null);
            setUserProfile(null);
          }
        }
        if (event === 'SIGNED_OUT') {
          setShowProfile(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  // Hash-based routing & Deep Linking for Services
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('service-')) {
        const serviceId = hash.replace('service-', '');
        setSelectedService(serviceId);
        setActivePage('services');
        return;
      }
      const validPages: ActivePage[] = ['home', 'services', 'pricing', 'about', 'contact'];
      if (validPages.includes(hash as ActivePage)) {
        setActivePage(hash as ActivePage);
        if (hash !== 'services') {
          setSelectedService(null);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (page: ActivePage) => {
    setActivePage(page);
    setSelectedService(null);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId);
    setActivePage('services');
    window.location.hash = 'service-' + serviceId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut().catch(() => {});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('upshoot_auth_user');
      document.cookie = 'upshoot_auth_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    setUser(null);
    setUserProfile(null);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
  };

  const handleProfileComplete = () => {
    setShowProfile(false);
    if (user) {
      fetchProfile(user.id);
    }
  };

  const handleMockLogin = (mockData?: { name?: string; email?: string; phone?: string }) => {
    const defaultPhone = mockData?.phone || '+44 7700 900123';
    const defaultEmail = mockData?.email || 'client@upshootai.com';
    const defaultName = mockData?.name || 'Verified Client';

    const mockUser: any = {
      id: 'demo-client-id-01',
      email: defaultEmail,
      user_metadata: {
        full_name: defaultName,
        name: defaultName,
      },
      phone: defaultPhone,
    };
    setUser(mockUser);
    setUserProfile({
      name: defaultName,
      email: defaultEmail,
      phone: defaultPhone,
    });
    setShowAuth(false);

    // Notify Upshootai@gmail.com
    notifyUserDetails({
      name: defaultName,
      email: defaultEmail,
      phone: defaultPhone,
      userId: mockUser.id,
      action: 'Client Logged In & Started Browsing Upshoot AI',
    });
  };

  return (
    <>
      <Header
        activePage={activePage}
        onNavigate={navigate}
        user={user}
        userProfile={userProfile}
        onSignIn={() => setShowAuth(true)}
        onSignOut={handleSignOut}
      />

      <main>
        {activePage === 'home' && (
          <Hero onNavigate={navigate} onSelectService={handleSelectService} />
        )}
        {activePage === 'services' && (
          selectedService ? (
            <ServiceDetail
              serviceId={selectedService}
              onBack={() => {
                setSelectedService(null);
                window.location.hash = 'services';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigate={navigate}
              onSelectService={handleSelectService}
            />
          ) : (
            <Services onNavigate={navigate} onSelectService={handleSelectService} />
          )
        )}
        {activePage === 'pricing' && <Pricing onNavigate={navigate} />}
        {activePage === 'about' && <About />}
        {activePage === 'contact' && (
          <Contact
            user={user}
            userProfile={userProfile}
            onSignIn={() => setShowAuth(true)}
          />
        )}
      </main>

      <Footer onNavigate={navigate} />

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
          onMockLogin={handleMockLogin}
        />
      )}

      {showProfile && user && (
        <ProfileModal
          user={user}
          onComplete={handleProfileComplete}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
}
