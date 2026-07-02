'use client';

import { FileText, Clock, User, Search, Download, CheckCircle2, Shield, ShieldCheck } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { getCurrentPlan, PLANS, Plan } from '../plan';

interface LedgerEntry {
  id: number;
  title: string;
  rationale: string;
  actor: string;
  method: string;
  timestamp: string;
  hash: string;
}

const LEDGER_DATA: LedgerEntry[] = [
  { id: 1, title: 'Budget Verhoogd: Voorjaarsactie 2026', rationale: 'De CPC-kosten op LinkedIn zijn gestegen. Na akkoord van de board hebben we besloten het budget met €5.000 te verhogen om de lead-targets voor Q2 alsnog te halen.', actor: 'Sarah (Marketing Manager)', method: 'Reason3n Portal', timestamp: 'Vandaag, 14:30', hash: 'a3f8c2...e91d' },
  { id: 2, title: 'Campagne gestopt: Winter Actie', rationale: 'AI voorstel goedgekeurd. De campagne liep al 4 weken zonder conversies. Budget wordt doorgeschoven naar de nieuwe Voorjaarsactie.', actor: 'Jan de Vries (AI Goedgekeurd)', method: 'AI Proposal #127', timestamp: '3 Maart 2026, 09:15', hash: 'b7d2a1...f44e' },
  { id: 3, title: 'Deal Fase Gewijzigd: TechCorp B.V.', rationale: 'Na het gesprek met de CFO van TechCorp is duidelijk geworden dat het budget pas in Q3 vrijkomt. Fase teruggezet van Onderhandeling naar Discovery.', actor: 'Marco (Account Executive)', method: 'Reason3n Portal', timestamp: '28 Februari 2026, 16:45', hash: 'c1e9b3...a82f' },
  { id: 4, title: 'Nieuwe Entiteit Gekoppeld: Webinar Q2', rationale: 'Handmatige koppeling van HubSpot Event "Webinar Q2 Launch" aan Excel budgetlijn "Webinar Budget Mei" (Rij 78). Bevestigd door marketing.', actor: 'Sarah (Marketing Manager)', method: 'Entity Resolution', timestamp: '25 Februari 2026, 11:00', hash: 'd5f7c4...b13a' },
  { id: 5, title: 'Toegang Ingetrokken: Extern Bureau', rationale: 'Samenwerking met extern mediabureau beëindigd per Q2. Alle viewer-toegang verwijderd conform het offboarding protocol.', actor: 'Jan de Vries (Administrator)', method: 'Instellingen RBAC', timestamp: '20 Februari 2026, 09:00', hash: 'e8a2d6...c97b' },
];

export default function LedgerModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ msg: string; signed?: boolean } | null>(null);
  const [plan, setPlan] = useState<Plan>('pro');

  useEffect(() => {
    setPlan(getCurrentPlan());
  }, []);

  const signedExport = PLANS[plan].signedExport;

  const filtered = useMemo(() => {
    if (!searchTerm) return LEDGER_DATA;
    const q = searchTerm.toLowerCase();
    return LEDGER_DATA.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.rationale.toLowerCase().includes(q) ||
      e.actor.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const handleExport = () => {
    setToast({ msg: 'PDF wordt voorbereid...' });
    setTimeout(() => {
      setToast({
        msg: signedExport
          ? 'PDF gedownload — voorzien van digitale handtekening'
          : 'PDF gedownload',
        signed: signedExport,
      });
      setTimeout(() => setToast(null), 3500);
    }, 1500);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>Logboek</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Elke beslissing in je werkruimte staat hier — wie het deed, wanneer, en vooral <strong>waarom</strong>.
        </p>
        <div className="page-explainer">
          Dit logboek kan niemand achteraf wijzigen of verwijderen, ook wij van Reason3n niet.
          Daardoor is het bruikbaar als bewijs bij een controle of vraag van een collega.
          Zoek erin met de zoekbalk, of download alles als PDF.
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Zoek in beslissingen..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '10px 12px 10px 36px', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>
        <button className="btn-secondary" onClick={handleExport}>
          <Download size={16} /> Download als PDF
          {signedExport && (
            <span className="signed-badge" title="Bij export wordt een digitale handtekening toegevoegd — bewijst dat het bestand niet gewijzigd is">
              <ShieldCheck size={12} /> ondertekend
            </span>
          )}
        </button>
      </div>

      {/* Integrity banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(74, 222, 128, 0.08)', border: '1px solid rgba(74, 222, 128, 0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '24px', fontSize: '13px', color: 'var(--success)' }}>
        <Shield size={18} /> Logboek gecontroleerd — alle {LEDGER_DATA.length} beslissingen zijn ongewijzigd
      </div>

      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map((entry, idx) => (
          <div key={entry.id} className="glass-panel ledger-row" style={{ padding: '24px', display: 'flex', gap: '24px' }}>
            <div className="ledger-icon-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '60px', flexShrink: 0 }}>
              <div style={{ background: idx === 0 ? 'rgba(94, 106, 210, 0.2)' : 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '50%', color: idx === 0 ? 'var(--accent)' : 'var(--text-muted)' }}>
                <FileText size={24} />
              </div>
              {idx < filtered.length - 1 && <div style={{ width: '2px', flex: 1, background: 'var(--border-color)' }}></div>}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', gap: '16px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{entry.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px', whiteSpace: 'nowrap' }}>
                  <Clock size={14} /> {entry.timestamp}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', borderLeft: `3px solid ${idx === 0 ? 'var(--accent)' : 'rgba(255,255,255,0.15)'}`, marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>
                  Waarom? (Rationale)
                </div>
                <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.5' }}>
                  &ldquo;{entry.rationale}&rdquo;
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <User size={14} /> Uitgevoerd door: <strong style={{ color: 'var(--text-main)' }}>{entry.actor}</strong> via {entry.method}
                </div>
                <div className="ledger-hash" style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }} title="Unieke verificatiecode — laat zien dat deze regel niet gewijzigd is">
                  Verificatie: {entry.hash}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Geen beslissingen gevonden voor &ldquo;{searchTerm}&rdquo;
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast toast-success">
          {toast.signed ? <ShieldCheck size={18} /> : <CheckCircle2 size={18} />} {toast.msg}
        </div>
      )}
    </div>
  );
}
