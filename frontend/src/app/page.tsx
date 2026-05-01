'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import styles from './landing.module.css';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: '📋',
      title: 'Job Notification Forms',
      description:
        'Streamlined JNF submission for companies to post full-time job opportunities with detailed eligibility and compensation structures.',
    },
    {
      icon: '🎓',
      title: 'Internship Notification Forms',
      description:
        'Dedicated INF portal for internship listings, enabling companies to target specific programs and branches efficiently.',
    },
    {
      icon: '🤖',
      title: 'AI-Powered Autofill',
      description:
        'Upload company brochures and let our AI extract and prefill form fields automatically, saving time and reducing errors.',
    },
    {
      icon: '👨‍💼',
      title: 'Alumni Mentorship',
      description:
        'Connect students with experienced IIT ISM alumni mentors for career guidance and professional development.',
    },
    {
      icon: '📊',
      title: 'Admin Dashboard',
      description:
        'Comprehensive admin tools to review, manage, and track all recruitment submissions and mentor applications.',
    },
    {
      icon: '📄',
      title: 'PDF Generation',
      description:
        'Instantly generate professionally formatted, printable PDF documents for all submitted recruitment forms.',
    },
  ];



  return (
    <div className={styles.landingRoot}>
      {/* ── Navbar ── */}
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <div className={styles.navbarInner}>
          <div className={styles.navbarBrand}>
            <Image src="/logo.webp" alt="IIT ISM Logo" width={44} height={44} className={styles.navbarLogo} />
            <div className={styles.navbarTitleBlock}>
              <span className={styles.navbarTitle}>CDC Portal</span>
              <span className={styles.navbarSubtitle}>IIT (ISM) Dhanbad</span>
            </div>
          </div>
          <div className={styles.navbarLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#about" className={styles.navLink}>About</a>

            <Link href="/auth/login" className={styles.navCta}>Login</Link>
            <Link href="/auth/register" className={`${styles.navCta} ${styles.navCtaOutline}`}>Register</Link>
            <Link href="/auth/login" className={`${styles.navCta} ${styles.navCtaAdmin}`}>Admin Login</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero} ref={heroRef} id="hero">
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Career Development Centre</div>
          <h1 className={styles.heroTitle}>
            Bridging Talent &amp;<br />
            <span className={styles.heroTitleAccent}>Opportunity</span>
          </h1>
          <p className={styles.heroDesc}>
            The official recruitment portal of IIT (ISM) Dhanbad — connecting
            industry leaders with India&apos;s brightest engineering minds through
            a seamless, AI-powered recruitment experience.
          </p>
          <div className={styles.heroActions}>
            <Link href="/auth/register" className={styles.btnPrimary}>
              Register as Recruiter
            </Link>
            <Link href="/auth/login" className={styles.btnGhost}>
              Sign In
            </Link>
          </div>
          <div className={styles.heroScrollHint}>
            <span className={styles.scrollMouse}>
              <span className={styles.scrollWheel} />
            </span>
            <span className={styles.scrollLabel}>Scroll to explore</span>
          </div>
        </div>
      </section>



      {/* ── Features ── */}
      <section className={styles.featuresSection} id="features">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>What We Offer</span>
            <h2 className={styles.sectionTitle}>Everything You Need,<br />In One Place</h2>
            <p className={styles.sectionDesc}>
              A unified platform designed to simplify campus recruitment for companies,
              students, and administrators alike.
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / CTA ── */}
      <section className={styles.aboutSection} id="about">
        <div className={styles.aboutBg} />
        <div className={styles.aboutOverlay} />
        <div className={`${styles.sectionInner} ${styles.aboutInner}`}>
          <div className={styles.aboutText}>
            <span className={`${styles.sectionTag} ${styles.sectionTagLight}`}>About CDC</span>
            <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>
              Empowering Careers Since 1926
            </h2>
            <p className={styles.aboutDesc}>
              The Career Development Centre at IIT (ISM) Dhanbad has been
              facilitating placement and internship opportunities for decades.
              Our digitized portal brings speed, transparency, and intelligence
              to the process — from JNF/INF submission to offer rollouts.
            </p>
            <ul className={styles.aboutBullets}>
              <li>✓ Streamlined online recruitment process</li>
              <li>✓ AI-powered document extraction</li>
              <li>✓ Real-time admin tracking &amp; management</li>
              <li>✓ Alumni mentorship network integration</li>
            </ul>

          </div>
          <div className={styles.aboutLogoWrap}>
            <Image
              src="/centenary.webp"
              alt="IIT ISM Centenary"
              width={320}
              height={320}
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Image src="/logo.webp" alt="IIT ISM" width={40} height={40} />
            <div>
              <div className={styles.footerTitleText}>CDC Recruitment Portal</div>
              <div className={styles.footerSubtitle}>IIT (ISM) Dhanbad</div>
            </div>
          </div>

          <div className={styles.footerCopy}>
            © {new Date().getFullYear()} IIT (ISM) Dhanbad. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}