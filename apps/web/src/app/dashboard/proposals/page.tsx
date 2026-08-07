'use client';

import { useI18n } from '../../i18n';
import { Bot, CheckCircle2, XCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { useState } from 'react';

type ProposalStatus = 'pending' | 'approving' | 'approved' | 'rejected';

interface Proposal {
  id: number;
  title: string;
  description: string;
  currentState: string;
  currentDetail: string;
  proposedState: string;
  proposedDetail: string;
  source: string;
  daysStale: number;
  status: ProposalStatus;
}

export default function ProposalsModule() {
  const { t } = useI18n();

  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 1,
      title: 'Deal Terugzetten naar Discovery',
      description: 'AI detecteerde stilstaande pijplijn in HubSpot CRM',
      currentState: 'Fase: Onderhandeling',
      currentDetail: 'Staat al 18 dagen stil',
      proposedState: 'Fase: Discovery',
      proposedDetail: 'Om de pipeline realistisch te houden',
      source: 'HubSpot CRM',
      daysStale: 18,
      status: 'pending',
    },
    {
      id: 2,
      title: 'Budget Verlagen: LinkedIn Ads',
      description: 'CPC gestegen met 45% zonder conversie-verbetering',
      currentState: 'Budget: €8.500 / maand',
      currentDetail: 'ROI gedaald naar 0.8x',
      proposedState: 'Budget: €5.000 / maand',
      proposedDetail: 'Overschot naar Google Ads verplaatsen',
      source: 'Excel Budget Q2',
      daysStale: 7,
      status: 'pending',
    },
    {
      id: 3,
      title: 'Campagne Pauzeren: Zomer Promo',
      description: 'Geen opens meer sinds 3 weken, budget brandt op',
      currentState: 'Status: Actief',
      currentDetail: '€2.100 uitgegeven, 0 conversies',
      proposedState: 'Status: Gepauzeerd',
      proposedDetail: 'Heractiveren na creatieve refresh',
      source: 'HubSpot Campaigns',
      daysStale: 21,
      status: 'pending',
    },
  ]);

  const [rationales, setRationales] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id: number) => {
    const rationale = (rationales[id] || '').trim();
    if (rationale.length < 10) {
      setErrors({ ...errors, [id]: 'Geef minimaal 10 tekens als reden op (verplicht voor het logboek)' });
      return;
    }
    setErrors({ ...errors, [id]: '' });

    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'approving' as ProposalStatus } : p));

    setTimeout(() => {
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' as ProposalStatus } : p));
      showToast(`Voorstel goedgekeurd en vastgelegd in het Beslissingen Logboek`);
    }, 1200);
  };

  const handleReject = (id: number) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' as ProposalStatus } : p));
    showToast('Voorstel genegeerd', 'error');
  };

  const pendingCount = proposals.filter(p => p.status === 'pending').length;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>AI-suggesties</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          De slimme assistent heeft het volgende opgemerkt. Lees het door, schrijf je reden op, en keur goed of negeer.
          {pendingCount > 0 && <span style={{ color: 'var(--warning)', marginLeft: '8px' }}>- {pendingCount} wacht op jou</span>}
        </p>
        <div className="page-explainer">
          <strong>Belangrijk:</strong> de AI doet alleen voorstellen - hij voert niets zelf uit.
          Pas als jij op &ldquo;Keur goed&rdquo; klikt wordt het doorgevoerd in de gekoppelde tool
          (zoals HubSpot of Excel) én vastgelegd in je logboek.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {proposals.map(proposal => (
          <div
            key={proposal.id}
            className="glass-panel"
            style={{
              padding: '24px',
              opacity: proposal.status === 'rejected' ? 0.4 : 1,
              transition: 'opacity 0.5s ease',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <Bot color="var(--accent)" size={24} />
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '18px', fontWeight: '500', margin: 0 }}>{proposal.title}</h2>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{proposal.description} - Bron: {proposal.source}</div>
              </div>
              {proposal.status === 'pending' && <div className="badge badge-pending">Wacht op jou</div>}
              {proposal.status === 'approving' && <div className="badge badge-active"><span className="spinner" style={{ width: '12px', height: '12px', display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}></span>Verwerken...</div>}
              {proposal.status === 'approved' && <div className="badge badge-approved">Goedgekeurd ✓</div>}
              {proposal.status === 'rejected' && <div className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>Genegeerd</div>}
            </div>

            {/* Before/After comparison */}
            <div className="proposal-compare">
              <div className="proposal-compare-current">
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>Huidige situatie</div>
                <div style={{ fontWeight: '500' }}>{proposal.currentState}</div>
                <div style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '4px' }}>{proposal.currentDetail}</div>
              </div>
              <div className="proposal-compare-arrow">
                <ArrowRight size={24} />
              </div>
              <div className="proposal-compare-proposed">
                <div style={{ color: 'var(--accent)', fontSize: '13px', marginBottom: '8px' }}>Voorgestelde wijziging</div>
                <div style={{ fontWeight: '500' }}>{proposal.proposedState}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>{proposal.proposedDetail}</div>
              </div>
            </div>

            {/* Actions - only for pending */}
            {proposal.status === 'pending' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                    Waarom voer je dit uit? (Verplicht)
                  </label>
                  <textarea
                    value={rationales[proposal.id] || ''}
                    onChange={e => {
                      setRationales({ ...rationales, [proposal.id]: e.target.value });
                      if (errors[proposal.id]) setErrors({ ...errors, [proposal.id]: '' });
                    }}
                    placeholder="Bijv: Na overleg met sales blijkt dat budget pas in Q4 vrijkomt..."
                    style={{
                      width: '100%',
                      height: '80px',
                      background: 'rgba(0,0,0,0.2)',
                      border: `1px solid ${errors[proposal.id] ? 'var(--danger)' : 'var(--border-color)'}`,
                      color: 'var(--text-main)',
                      padding: '12px',
                      borderRadius: '8px',
                      resize: 'none',
                      fontFamily: 'inherit',
                      fontSize: '14px',
                    }}
                  />
                  {errors[proposal.id] && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                      <AlertCircle size={14} color="var(--danger)" />
                      <span className="field-error">{errors[proposal.id]}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <button
                    className="btn-primary"
                    onClick={() => handleApprove(proposal.id)}
                    style={{ flex: 1 }}
                  >
                    <CheckCircle2 size={18} />
                    Keur goed & Voer uit
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => handleReject(proposal.id)}
                    style={{ flex: 1 }}
                  >
                    <XCircle size={18} />
                    Negeer voorstel
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
