'use client';

import { CheckCircle2, Link as LinkIcon, Bot, ArrowRight, FileDown, Lightbulb, X as XIcon, ShieldCheck } from 'lucide-react';
import { useI18n } from '../i18n';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentPlan, PLANS, formatLimit, usagePercent, Plan } from './plan';

const WELCOME_KEY = 'r3n_welcome_dismissed';

// Mock huidige usage
const USAGE = {
  users: 3,
  ledgerThisMonth: 84,
  aiToday: 3,
};

export default function DashboardOverview() {
  const { t } = useI18n();
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; signed?: boolean } | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [plan, setPlan] = useState<Plan>('pro');

  useEffect(() => {
    setPlan(getCurrentPlan());
    setShowWelcome(localStorage.getItem(WELCOME_KEY) !== '1');
  }, []);

  const planInfo = PLANS[plan];

  const dismissWelcome = () => {
    localStorage.setItem(WELCOME_KEY, '1');
    setShowWelcome(false);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setToast({
        msg: planInfo.signedExport
          ? 'Logboek-PDF gedownload — cryptografisch ondertekend'
          : 'Logboek-PDF gedownload',
        signed: planInfo.signedExport,
      });
      setTimeout(() => setToast(null), 3500);
    }, 1500);
  };

  return (
    <>
      {showWelcome && (
        <div className="welcome-banner glass-panel">
          <div className="welcome-banner-icon">
            <Lightbulb size={20} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 600 }}>
              Welkom bij Reason3n
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Reason3n helpt je <strong style={{ color: 'var(--text-main)' }}>orde te scheppen in je sales- en marketing-tools</strong>.
              De AI doet suggesties, jij beslist. Klik op de tegels hieronder om aan de slag te gaan,
              of bekijk eerst de{' '}
              <Link href="/dashboard/docs" style={{ color: 'var(--accent)' }}>handleiding</Link>.
            </p>
          </div>
          <button className="welcome-close" onClick={dismissWelcome} aria-label="Verberg welkom-bericht">
            <XIcon size={18} />
          </button>
        </div>
      )}

      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>{t('workspace_overview')}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{t('monitor_entities')}</p>
      </div>

      <div className="grid-cards">
        <div
          className="glass-panel stat-card with-action"
          onClick={() => router.push('/dashboard/resolution')}
        >
          <div className="stat-title"><LinkIcon size={16} color="var(--accent)" /> {t('pending_matches')}</div>
          <div className="stat-value">12</div>
          <p className="stat-explainer">
            Dingen uit verschillende tools die misschien hetzelfde zijn. Bevestig of wijs af.
          </p>
          <div className="stat-action">Bekijken <ArrowRight size={14} /></div>
        </div>

        <div
          className="glass-panel stat-card with-action"
          onClick={() => router.push('/dashboard/proposals')}
        >
          <div className="stat-title"><Bot size={16} color="#facc15" /> {t('ai_proposals_req')}</div>
          <div className="stat-value">3</div>
          <p className="stat-explainer">
            De slimme assistent wil iets veranderen. Wacht op jouw goedkeuring.
          </p>
          <div className="stat-action">Bekijken <ArrowRight size={14} /></div>
        </div>

        <div
          className="glass-panel stat-card with-action"
          onClick={() => router.push('/dashboard/ledger')}
        >
          <div className="stat-title"><CheckCircle2 size={16} color="#4ade80" /> {t('ledger_entries')}</div>
          <div className="stat-value">84</div>
          <p className="stat-explainer">
            Genomen beslissingen tot nu toe. Dit logboek kan niemand achteraf wijzigen.
          </p>
          <div className="stat-action">Bekijken <ArrowRight size={14} /></div>
        </div>
      </div>

      {/* Usage panel */}
      <UsagePanel plan={plan} />

      <div className="two-col-grid">
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="card-header">{t('recent_proposals')}</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '-12px 0 16px' }}>
            De laatste twee suggesties van de AI.
          </p>
          <div>
            <div className="list-item">
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 500, marginBottom: '4px' }}>{t('mock_deal_update')}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('mock_deal_reason')}</div>
              </div>
              <div className="badge badge-pending">{t('pending_approval')}</div>
            </div>
            <div className="list-item">
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 500, marginBottom: '4px' }}>{t('mock_merge_contact')}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('mock_merge_reason')}</div>
              </div>
              <div className="badge badge-approved">{t('approved')}</div>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard/proposals')}
            className="btn-secondary"
            style={{ width: '100%', marginTop: '16px' }}
          >
            {t('view_all')}
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="card-header">{t('recent_decisions')}</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '-12px 0 16px' }}>
            De twee meest recente beslissingen in je logboek.
          </p>
          <div>
            <div className="list-item">
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 500, marginBottom: '4px' }}>{t('mock_budget_update')}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('mock_budget_reason')}</div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{t('hours_ago')}</div>
            </div>
            <div className="list-item">
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 500, marginBottom: '4px' }}>{t('mock_entity_link')}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('mock_entity_reason')}</div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{t('yesterday')}</div>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn-secondary"
            style={{ width: '100%', marginTop: '16px' }}
          >
            {isExporting ? <><span className="spinner"></span> Bezig met downloaden...</> : <><FileDown size={16} /> {t('export_audit')}</>}
          </button>
        </div>
      </div>

      {toast && (
        <div className="toast toast-success">
          {toast.signed ? <ShieldCheck size={18} /> : <CheckCircle2 size={18} />}
          {toast.msg}
        </div>
      )}
    </>
  );
}

function UsagePanel({ plan }: { plan: Plan }) {
  const planInfo = PLANS[plan];
  const userPct = usagePercent(USAGE.users, planInfo.users);
  const ledgerPct = usagePercent(USAGE.ledgerThisMonth, planInfo.ledgerPerMonth);
  const aiPct = planInfo.aiPerDay === 'unlimited' ? 0 : usagePercent(USAGE.aiToday, planInfo.aiPerDay);

  const showUpgrade = plan !== 'enterprise' && (userPct > 70 || ledgerPct > 70 || aiPct > 70);

  return (
    <div className="usage-panel glass-panel">
      <div className="usage-header">
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Verbruik deze maand</h3>
          <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
            Plan: <strong style={{ color: planInfo.color }}>{planInfo.label}</strong> — limieten worden per maand bijgehouden
          </p>
        </div>
        {showUpgrade && (
          <Link href="/pricing" className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
            Plan upgraden
          </Link>
        )}
      </div>

      <div className="usage-meters">
        <UsageMeter
          label="Teamleden"
          used={USAGE.users}
          limit={planInfo.users}
          hint={planInfo.users === 'unlimited' ? 'Geen limiet' : `Maximaal ${formatLimit(planInfo.users)} mensen in je werkruimte`}
        />
        <UsageMeter
          label="Beslissingen in logboek"
          used={USAGE.ledgerThisMonth}
          limit={planInfo.ledgerPerMonth}
          hint={planInfo.ledgerPerMonth === 'unlimited' ? 'Geen limiet' : `Maximaal ${formatLimit(planInfo.ledgerPerMonth)} per maand`}
        />
        <UsageMeter
          label="AI-suggesties vandaag"
          used={USAGE.aiToday}
          limit={planInfo.aiPerDay}
          hint={planInfo.aiPerDay === 'unlimited' ? 'Geen limiet — zoveel als nodig' : `Maximaal ${formatLimit(planInfo.aiPerDay)} per dag`}
        />
      </div>
    </div>
  );
}

function UsageMeter({ label, used, limit, hint }: { label: string; used: number; limit: number | 'unlimited'; hint: string }) {
  const pct = usagePercent(used, limit);
  const color = pct > 85 ? 'var(--danger)' : pct > 70 ? 'var(--warning)' : 'var(--accent)';
  const limitStr = limit === 'unlimited' ? '∞' : formatLimit(limit);

  return (
    <div className="usage-meter">
      <div className="usage-meter-top">
        <span className="usage-meter-label">{label}</span>
        <span className="usage-meter-value">
          <strong>{used.toLocaleString('nl-NL')}</strong>
          <span style={{ color: 'var(--text-muted)' }}> / {limitStr}</span>
        </span>
      </div>
      <div className="usage-meter-bar">
        <div
          className="usage-meter-fill"
          style={{ width: limit === 'unlimited' ? '8%' : `${pct}%`, background: color }}
        />
      </div>
      <div className="usage-meter-hint">{hint}</div>
    </div>
  );
}
