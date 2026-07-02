'use client';

import { useState } from 'react';
import { HelpCircle, X, MessageCircle, Mail, BookOpen, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Plan, PLANS } from './plan';

export default function HelpWidget({ plan }: { plan: Plan }) {
  const [open, setOpen] = useState(false);
  const planInfo = PLANS[plan];

  return (
    <>
      <button
        className="help-fab"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Sluit hulp' : 'Open hulp'}
      >
        {open ? <X size={22} /> : <HelpCircle size={22} />}
      </button>

      {open && (
        <div className="help-panel glass-panel">
          <div className="help-panel-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Hulp nodig?</h3>
              <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                We staan voor je klaar.
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="help-close" aria-label="Sluit">
              <X size={18} />
            </button>
          </div>

          <div className="help-options">
            <Link href="/dashboard/docs" className="help-option" onClick={() => setOpen(false)}>
              <BookOpen size={18} color="var(--accent)" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="help-option-title">Lees de handleiding</div>
                <div className="help-option-sub">Onboarding, functies en stap-voor-stap</div>
              </div>
            </Link>

            {planInfo.prioritySupport && (
              <button
                className="help-option"
                onClick={() => {
                  alert('Demo: in de echte app opent hier een live chat met support.');
                }}
              >
                <MessageCircle size={18} color="var(--accent)" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="help-option-title">Start een chat</div>
                  <div className="help-option-sub">Direct contact met support</div>
                </div>
              </button>
            )}

            <a href="mailto:hallo@reason3n.com" className="help-option">
              <Mail size={18} color="var(--accent)" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="help-option-title">Stuur een mailtje</div>
                <div className="help-option-sub">hallo@reason3n.com</div>
              </div>
            </a>
          </div>

          <div className="help-plan-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Clock size={14} color={planInfo.color} />
              <strong style={{ fontSize: '13px' }}>Jouw support-tijden</strong>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {planInfo.supportHours}
            </div>
            {planInfo.dedicatedSuccess && (
              <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(250, 204, 21, 0.1)', border: '1px solid rgba(250, 204, 21, 0.3)', borderRadius: '8px', fontSize: '12px' }}>
                <Sparkles size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Je hebt een vaste success manager. Mail Marco direct: <strong>marco@reason3n.com</strong>
              </div>
            )}
            {!planInfo.prioritySupport && (
              <Link href="/pricing" className="help-upgrade-link">
                Upgrade voor sneller contact →
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
