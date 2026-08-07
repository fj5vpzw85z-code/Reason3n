'use client';

import { useI18n } from '../../i18n';
import { DatabaseZap, Link as LinkIcon, CheckCircle2, Search, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';

interface EntityMatch {
  id: number;
  sysA: { name: string; type: string; source: string };
  sysB: { name: string; type: string; source: string };
  confidence: number;
  status: 'pending' | 'connecting' | 'connected';
}

const INITIAL_MATCHES: EntityMatch[] = [
  { id: 1, sysA: { name: 'Campagne Voorjaar', type: 'Marketing Campaign', source: 'HubSpot' }, sysB: { name: 'Voorjaarsactie 2026', type: 'Budgetlijn (Rij 42)', source: 'Excel' }, confidence: 94, status: 'pending' },
  { id: 2, sysA: { name: 'TechCorp Enterprise Deal', type: 'Sales Deal', source: 'HubSpot' }, sysB: { name: 'Project TC-2026', type: 'Planning Page', source: 'Notion' }, confidence: 87, status: 'pending' },
  { id: 3, sysA: { name: 'Webinar Q2 Launch', type: 'Event', source: 'HubSpot' }, sysB: { name: 'Webinar Budget Mei', type: 'Budgetlijn (Rij 78)', source: 'Excel' }, confidence: 91, status: 'pending' },
  { id: 4, sysA: { name: 'Newsletter Lijst A', type: 'Contact List', source: 'HubSpot' }, sysB: { name: 'Mailing Voorjaar 2026', type: 'Campagne', source: 'Slack #marketing' }, confidence: 72, status: 'pending' },
  { id: 5, sysA: { name: 'Deal: FinCorp Advisory', type: 'Sales Deal', source: 'HubSpot' }, sysB: { name: 'FinCorp Advies Q2', type: 'Project Planning', source: 'Notion' }, confidence: 96, status: 'pending' },
];

export default function ResolutionModule() {
  const { t } = useI18n();
  const [matches, setMatches] = useState<EntityMatch[]>(INITIAL_MATCHES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'connected'>('all');
  const [toast, setToast] = useState<string | null>(null);

  const handleConnect = (id: number) => {
    setMatches(prev => prev.map(m => m.id === id ? { ...m, status: 'connecting' as const } : m));
    setTimeout(() => {
      setMatches(prev => prev.map(m => m.id === id ? { ...m, status: 'connected' as const } : m));
      setToast('Entiteit succesvol gekoppeld en vastgelegd in het logboek');
      setTimeout(() => setToast(null), 3000);
    }, 1200);
  };

  const filtered = useMemo(() => {
    return matches.filter(m => {
      const matchesSearch = searchTerm === '' ||
        m.sysA.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.sysB.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || m.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [matches, searchTerm, filterStatus]);

  const pendingCount = matches.filter(m => m.status === 'pending').length;
  const connectedCount = matches.filter(m => m.status === 'connected').length;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>{t('entity_resolution')}</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Reason3n vermoedt dat sommige dingen uit verschillende tools eigenlijk hetzelfde zijn.
          Bevestig of wijs af.
        </p>
        <div className="page-explainer">
          <strong>Voorbeeld:</strong> in HubSpot heet een campagne &ldquo;Voorjaarsactie 2026&rdquo; en in
          Excel staat dezelfde campagne als rij 42 onder &ldquo;Campagne Voorjaar&rdquo;.
          Klik op <em>Verbinden</em> en ze tellen vanaf nu in al je rapporten als één item.
          De score (bv. 94%) laat zien hoe zeker Reason3n ervan is.
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Zoek op entiteitnaam..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '10px 12px 10px 36px', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'pending', 'connected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={filterStatus === f ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 14px', fontSize: '13px' }}
            >
              {f === 'all' ? `Alle (${matches.length})` : f === 'pending' ? `Open (${pendingCount})` : `Gekoppeld (${connectedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Uit deze tool</th>
              <th style={{ width: '60px' }}></th>
              <th>Lijkt hetzelfde als</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Zekerheid</th>
              <th style={{ textAlign: 'right' }}>Actie</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(match => (
              <tr key={match.id} style={{ background: match.status === 'connected' ? 'rgba(74, 222, 128, 0.04)' : 'transparent' }}>
                <td>
                  <div style={{ fontWeight: '500', fontSize: '15px', color: match.status === 'connected' ? 'var(--text-muted)' : 'inherit' }}>{match.sysA.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{match.sysA.type} - {match.sysA.source}</div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <DatabaseZap color={match.status === 'connected' ? 'var(--text-muted)' : 'var(--accent)'} size={20} />
                </td>
                <td>
                  <div style={{ fontWeight: '500', fontSize: '15px', color: match.status === 'connected' ? 'var(--text-muted)' : 'inherit' }}>{match.sysB.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{match.sysB.type} - {match.sysB.source}</div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ color: match.confidence >= 90 ? 'var(--success)' : match.confidence >= 80 ? 'var(--warning)' : 'var(--danger)', fontWeight: '600' }}>
                    {match.confidence}%
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {match.status === 'pending' && (
                    <button onClick={() => handleConnect(match.id)} className="btn-secondary">
                      <LinkIcon size={16} /> Verbinden
                    </button>
                  )}
                  {match.status === 'connecting' && (
                    <button className="btn-secondary" disabled>
                      <span className="spinner" style={{ width: '14px', height: '14px' }}></span> Koppelen...
                    </button>
                  )}
                  {match.status === 'connected' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontSize: '14px', fontWeight: '500' }}>
                      <CheckCircle2 size={18} /> Gekoppeld
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {searchTerm ? 'Geen resultaten gevonden voor deze zoekopdracht.' : 'Alle entiteiten zijn verwerkt.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast toast-success">
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}
    </div>
  );
}
