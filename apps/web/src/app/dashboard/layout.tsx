'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, DatabaseZap, Users, Settings, LogOut, Boxes, Globe, Menu, X, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '../i18n';
import { getCurrentPlan, PLANS, Plan } from './plan';
import HelpWidget from './HelpWidget';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string; company: string } | null>(null);
  const [plan, setPlan] = useState<Plan>('pro');
  const { lang, setLang, t } = useI18n();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    } else {
      const name = localStorage.getItem('user_name');
      const email = localStorage.getItem('user_email');
      const company = localStorage.getItem('user_company');
      if (name && email) {
        setUserInfo({ name, email, company: company || 'Demo werkruimte' });
      }
      setPlan(getCurrentPlan());
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) return null;

  const displayEmail = userInfo?.email || 'admin@reason3n.com';
  const displayCompany = userInfo?.company || 'TechCorp B.V.';
  const avatarChar = (userInfo?.name || 'A')[0].toUpperCase();
  const planInfo = PLANS[plan];

  return (
    <div className="dashboard-wrapper">
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Boxes color="var(--accent)" size={28} />
            Reason3n
          </div>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Sluit menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link href="/dashboard" className={`nav-item ${pathname === '/dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> {t('dashboard')}
          </Link>
          <Link href="/dashboard/resolution" className={`nav-item ${pathname === '/dashboard/resolution' ? 'active' : ''}`}>
            <DatabaseZap size={20} /> {t('entity_resolution')}
          </Link>
          <Link href="/dashboard/proposals" className={`nav-item ${pathname === '/dashboard/proposals' ? 'active' : ''}`}>
            <Users size={20} /> {t('ai_proposals')}
          </Link>
          <Link href="/dashboard/ledger" className={`nav-item ${pathname === '/dashboard/ledger' ? 'active' : ''}`}>
            <FileText size={20} /> {t('decision_ledger')}
          </Link>
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="nav-item" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', borderRadius: 0 }}>
            <Globe size={20} />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
              style={{ background: 'transparent', color: 'inherit', border: 'none', outline: 'none', cursor: 'pointer', flex: 1 }}
            >
              <option value="nl">Nederlands</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>

          <Link href="/dashboard/docs" className={`nav-item ${pathname?.startsWith('/dashboard/docs') ? 'active' : ''}`}>
            <BookOpen size={20} /> {t('documents')}
          </Link>
          <Link href="/dashboard/settings" className={`nav-item ${pathname === '/dashboard/settings' ? 'active' : ''}`}>
            <Settings size={20} /> {t('settings')}
          </Link>
          <div
            className="nav-item"
            onClick={() => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              router.push('/');
            }}
          >
            <LogOut size={20} /> {t('sign_out')}
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Werkruimte: <strong style={{ color: 'var(--text-main)' }}>{displayCompany}</strong>
              </div>
              <Link
                href="/pricing"
                className="plan-badge"
                style={{ background: `${planInfo.color}22`, color: planInfo.color, borderColor: `${planInfo.color}55` }}
                title="Bekijk en wijzig je abonnement"
              >
                {planInfo.label}
              </Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="topbar-email">{displayEmail}</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
              {avatarChar}
            </div>
          </div>
        </header>

        <div className="page-container">
          {children}
        </div>
      </main>

      <HelpWidget plan={plan} />
    </div>
  );
}
