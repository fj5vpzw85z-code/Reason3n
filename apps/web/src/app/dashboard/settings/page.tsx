'use client';

import { Link as LinkIcon, Users, CheckCircle2, XCircle, Plus, X, AlertCircle, ShieldCheck, Lock, RefreshCw, Clock, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentPlan, PLANS, Plan } from '../plan';

interface Integration {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'disconnecting' | 'connecting';
  detail: string;
  lastSync?: string;
  syncing?: boolean;
}

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface CustomRole {
  id: number;
  name: string;
  permissions: string[];
}

const PERMISSIONS = [
  { key: 'view_dashboard', label: 'Het overzicht bekijken' },
  { key: 'view_log', label: 'Het logboek doorzoeken en downloaden' },
  { key: 'submit_proposals', label: 'Voorstellen indienen' },
  { key: 'approve_proposals', label: 'Voorstellen goedkeuren' },
  { key: 'manage_connections', label: 'Tools koppelen of ontkoppelen' },
  { key: 'manage_team', label: 'Collega\'s uitnodigen en beheren' },
];

export default function SettingsModule() {
  const [plan, setPlan] = useState<Plan>('pro');
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 1, name: 'HubSpot CRM', status: 'active', detail: 'Klanten, deals en marketing-campagnes', lastSync: '14 minuten geleden' },
    { id: 2, name: 'Microsoft Excel (Office 365)', status: 'active', detail: 'Budget-overzichten en planningen', lastSync: '2 minuten geleden' },
    { id: 3, name: 'Notion', status: 'inactive', detail: 'Projectpagina\'s en interne notities' },
    { id: 4, name: 'Slack', status: 'inactive', detail: 'Team-communicatie' },
  ]);

  const [members, setMembers] = useState<TeamMember[]>([
    { id: 1, name: 'Jan de Vries', email: 'jan@techcorp.nl', role: 'Administrator' },
    { id: 2, name: 'Sarah Bakker', email: 'sarah@techcorp.nl', role: 'Editor' },
    { id: 3, name: 'Marco Visser', email: 'marco@techcorp.nl', role: 'Editor' },
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [inviteError, setInviteError] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // SSO state
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [ssoProvider, setSsoProvider] = useState<'entra' | 'saml'>('entra');
  const [ssoDomain, setSsoDomain] = useState('');

  // Custom roles
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePerms, setNewRolePerms] = useState<string[]>([]);
  const [roleNameError, setRoleNameError] = useState('');

  useEffect(() => {
    setPlan(getCurrentPlan());
    // Load persisted settings
    try {
      const sso = localStorage.getItem('demo_sso');
      if (sso) {
        const parsed = JSON.parse(sso);
        setSsoEnabled(!!parsed.enabled);
        setSsoProvider(parsed.provider || 'entra');
        setSsoDomain(parsed.domain || '');
      }
      const roles = localStorage.getItem('demo_custom_roles');
      if (roles) setCustomRoles(JSON.parse(roles));
    } catch { /* ignore */ }
  }, []);

  const planInfo = PLANS[plan];

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDisconnect = (id: number) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'disconnecting' as const } : i));
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'inactive' as const, lastSync: undefined } : i));
      showToast('Tool ontkoppeld');
    }, 1000);
  };

  const handleConnect = (id: number) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'connecting' as const } : i));
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'active' as const, lastSync: 'zojuist' } : i));
      showToast('Tool gekoppeld - Reason3n leest nu mee');
    }, 1500);
  };

  const handleSyncNow = (id: number) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, syncing: true } : i));
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, syncing: false, lastSync: 'zojuist' } : i));
      showToast('Synchronisatie voltooid');
    }, 1200);
  };

  const handleInvite = () => {
    const email = inviteEmail.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInviteError('Voer een geldig e-mailadres in');
      return;
    }
    if (members.some(m => m.email === email)) {
      setInviteError('Dit e-mailadres heeft al toegang');
      return;
    }
    const limit = planInfo.users;
    if (limit !== 'unlimited' && members.length >= limit) {
      setInviteError(`Je hebt het maximum van ${limit} teamleden bereikt op het ${planInfo.label}-plan. Upgrade om meer mensen uit te nodigen.`);
      return;
    }

    setMembers(prev => [...prev, {
      id: Date.now(),
      name: email.split('@')[0],
      email,
      role: inviteRole === 'editor' ? 'Editor' : inviteRole === 'admin' ? 'Administrator' : 'Viewer',
    }]);
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteRole('viewer');
    setInviteError('');
    showToast(`Uitnodiging verstuurd naar ${email}`);
  };

  const handleRemoveMember = (id: number) => {
    const member = members.find(m => m.id === id);
    setMembers(prev => prev.filter(m => m.id !== id));
    showToast(`${member?.name} verwijderd uit werkruimte`, 'error');
  };

  const persistSso = (enabled: boolean, provider: 'entra' | 'saml', domain: string) => {
    localStorage.setItem('demo_sso', JSON.stringify({ enabled, provider, domain }));
  };

  const handleToggleSso = () => {
    if (!planInfo.sso) return;
    const next = !ssoEnabled;
    setSsoEnabled(next);
    persistSso(next, ssoProvider, ssoDomain);
    showToast(next ? 'Inloggen via je werk-account is geactiveerd' : 'SSO uitgeschakeld');
  };

  const handleSaveSso = () => {
    if (!ssoDomain.match(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i)) {
      showToast('Voer een geldig domein in (bv. bedrijf.nl)', 'error');
      return;
    }
    persistSso(true, ssoProvider, ssoDomain);
    showToast('Instellingen opgeslagen - Reason3n stuurt nu inlogverzoeken naar ' + ssoDomain);
  };

  const handleSaveRole = () => {
    const name = newRoleName.trim();
    if (name.length < 2) {
      setRoleNameError('Geef de rol een naam (minimaal 2 letters)');
      return;
    }
    if (customRoles.some(r => r.name.toLowerCase() === name.toLowerCase())) {
      setRoleNameError('Een rol met deze naam bestaat al');
      return;
    }
    if (newRolePerms.length === 0) {
      setRoleNameError('Selecteer minimaal één bevoegdheid');
      return;
    }
    const newRole: CustomRole = { id: Date.now(), name, permissions: newRolePerms };
    const updated = [...customRoles, newRole];
    setCustomRoles(updated);
    localStorage.setItem('demo_custom_roles', JSON.stringify(updated));
    setShowRoleModal(false);
    setNewRoleName('');
    setNewRolePerms([]);
    setRoleNameError('');
    showToast(`Rol "${name}" toegevoegd`);
  };

  const handleDeleteRole = (id: number) => {
    const role = customRoles.find(r => r.id === id);
    const updated = customRoles.filter(r => r.id !== id);
    setCustomRoles(updated);
    localStorage.setItem('demo_custom_roles', JSON.stringify(updated));
    showToast(`Rol "${role?.name}" verwijderd`, 'error');
  };

  const togglePerm = (key: string) => {
    setNewRolePerms(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>Instellingen</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Beheer je werkruimte, je teamleden en de tools waarmee Reason3n verbonden is.
        </p>
      </div>

      <div className="two-col-grid">
        {/* Integrations */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <LinkIcon color="var(--accent)" size={20} />
            <h2 style={{ fontSize: '18px', fontWeight: '500', margin: 0 }}>Verbonden tools</h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px' }}>
            Programma&apos;s waar Reason3n meekijkt. We schrijven nooit iets terug zonder jouw goedkeuring.
          </p>

          {integrations.map(integration => (
            <div key={integration.id} className="integration-row">
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {integration.name}
                  {integration.status === 'active' && <span className="dot-live" />}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: integration.status === 'active' ? '6px' : 0 }}>
                  {integration.detail}
                </div>
                {integration.status === 'active' && integration.lastSync && (
                  <div className="sync-info">
                    <Clock size={11} /> Laatste sync: <strong>{integration.lastSync}</strong> · elke 15 min
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                {integration.status === 'active' && (
                  <>
                    <button
                      className="btn-secondary"
                      onClick={() => handleSyncNow(integration.id)}
                      disabled={integration.syncing}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      {integration.syncing
                        ? <><span className="spinner" style={{ width: '12px', height: '12px' }} /> Bezig...</>
                        : <><RefreshCw size={12} /> Sync nu</>}
                    </button>
                    <button className="btn-danger" onClick={() => handleDisconnect(integration.id)} style={{ padding: '6px 12px', fontSize: '12px' }}>
                      Ontkoppelen
                    </button>
                  </>
                )}
                {integration.status === 'inactive' && (
                  <button className="btn-secondary" onClick={() => handleConnect(integration.id)} style={{ padding: '6px 14px' }}>
                    Koppelen
                  </button>
                )}
                {(integration.status === 'disconnecting' || integration.status === 'connecting') && (
                  <button className="btn-secondary" disabled style={{ padding: '6px 14px' }}>
                    <span className="spinner" style={{ width: '14px', height: '14px' }}></span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Users color="var(--accent)" size={20} />
            <h2 style={{ fontSize: '18px', fontWeight: '500', margin: 0 }}>Wie heeft toegang</h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px' }}>
            Mensen die in jouw werkruimte mogen kijken of werken.
            {' '}{members.length} van {planInfo.users === 'unlimited' ? 'onbeperkt' : planInfo.users} plaatsen gebruikt.
          </p>

          {members.map(member => (
            <div key={member.id} className="list-item">
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 500 }}>{member.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {member.email} · <strong style={{ color: 'var(--text-main)' }}>{member.role}</strong>
                </div>
              </div>
              {member.role !== 'Administrator' && (
                <button className="btn-danger" onClick={() => handleRemoveMember(member.id)}>Verwijder</button>
              )}
            </div>
          ))}

          <button className="btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={() => setShowInviteModal(true)}>
            <Plus size={18} /> Iemand uitnodigen
          </button>
        </div>
      </div>

      {/* Security section */}
      <div className="glass-panel" style={{ padding: '24px', marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Lock color="var(--accent)" size={20} />
          <h2 style={{ fontSize: '18px', fontWeight: '500', margin: 0 }}>Beveiliging &amp; toegang</h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 24px' }}>
          Bepaal hoe collega&apos;s inloggen en wat ze mogen doen.
        </p>

        {/* SSO */}
        <div className="setting-block">
          <div className="setting-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>
                Inloggen via je werk-account (SSO)
                {!planInfo.sso && <span className="upgrade-pill">Pro of hoger</span>}
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                Laat je team inloggen met hun bestaande Microsoft- of Google-account, zonder apart wachtwoord.
              </p>
            </div>
            <label className={`toggle ${!planInfo.sso ? 'disabled' : ''}`}>
              <input
                type="checkbox"
                checked={ssoEnabled}
                onChange={handleToggleSso}
                disabled={!planInfo.sso}
              />
              <span className="toggle-slider" />
            </label>
          </div>
          {ssoEnabled && planInfo.sso && (
            <div className="setting-detail">
              <div className="form-group">
                <label>Aanbieder</label>
                <select value={ssoProvider} onChange={e => setSsoProvider(e.target.value as 'entra' | 'saml')}>
                  <option value="entra">Microsoft (Entra ID / Office 365)</option>
                  <option value="saml">SAML 2.0 (Okta, OneLogin, etc.)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Bedrijfsdomein</label>
                <input
                  type="text"
                  placeholder="bedrijf.nl"
                  value={ssoDomain}
                  onChange={e => setSsoDomain(e.target.value)}
                />
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Iedereen met een e-mailadres op <em>@{ssoDomain || 'bedrijf.nl'}</em> kan voortaan rechtstreeks inloggen.
                </p>
              </div>
              <button className="btn-primary" style={{ alignSelf: 'flex-start' }} onClick={handleSaveSso}>
                <ShieldCheck size={16} /> Configuratie opslaan
              </button>
            </div>
          )}
          {!planInfo.sso && (
            <Link href="/pricing" className="upgrade-link">Plan upgraden om SSO te activeren →</Link>
          )}
        </div>

        {/* Custom roles */}
        <div className="setting-block">
          <div className="setting-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>
                Eigen rollen aanmaken
                {!planInfo.customRoles && <span className="upgrade-pill">Pro of hoger</span>}
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                Standaard zijn er drie rollen: Viewer, Editor, Administrator.
                Met een eigen rol bepaal je zelf precies wat iemand mag.
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={() => setShowRoleModal(true)}
              disabled={!planInfo.customRoles}
              style={{ padding: '8px 14px', fontSize: '13px' }}
            >
              <Plus size={14} /> Nieuwe rol
            </button>
          </div>

          {planInfo.customRoles && customRoles.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', marginTop: '12px' }}>
              Nog geen eigen rollen. Klik op &ldquo;Nieuwe rol&rdquo; om er een te maken.
            </div>
          )}

          {customRoles.length > 0 && (
            <div className="custom-roles-list">
              {customRoles.map(role => (
                <div key={role.id} className="custom-role-card">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{role.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {role.permissions.length} bevoegdheden: {role.permissions.map(p => PERMISSIONS.find(x => x.key === p)?.label).filter(Boolean).join(', ')}
                    </div>
                  </div>
                  <button className="btn-danger" onClick={() => handleDeleteRole(role.id)} style={{ padding: '6px 10px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {!planInfo.customRoles && (
            <Link href="/pricing" className="upgrade-link">Plan upgraden om eigen rollen te maken →</Link>
          )}
        </div>

        {/* Dedicated success */}
        {plan === 'enterprise' && (
          <div className="setting-block" style={{ background: 'rgba(250, 204, 21, 0.05)', borderColor: 'rgba(250, 204, 21, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Sparkles size={20} color="#facc15" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 600 }}>Jouw success manager</h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text-main)' }}>Marco Visser</strong> is jouw vaste contactpersoon.
                  Mail direct: <a href="mailto:marco@reason3n.com" style={{ color: 'var(--accent)' }}>marco@reason3n.com</a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="glass-panel modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Iemand uitnodigen</h2>
              <button onClick={() => setShowInviteModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
              We sturen een mailtje met een uitnodigingslink. Ze stellen hun eigen wachtwoord in.
            </p>

            <div className="form-group">
              <label>E-mailadres</label>
              <input
                type="email"
                placeholder="collega@bedrijf.nl"
                value={inviteEmail}
                onChange={e => { setInviteEmail(e.target.value); setInviteError(''); }}
                style={inviteError ? { borderColor: 'var(--danger)' } : {}}
              />
              {inviteError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} color="var(--danger)" />
                  <span className="field-error">{inviteError}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Wat mag deze persoon doen?</label>
              <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                <option value="viewer">Alleen kijken (Viewer)</option>
                <option value="editor">Suggesties indienen (Editor)</option>
                <option value="admin">Alles inclusief instellingen (Administrator)</option>
                {planInfo.customRoles && customRoles.map(r => (
                  <option key={r.id} value={`custom-${r.id}`}>Eigen rol: {r.name}</option>
                ))}
              </select>
            </div>

            <button className="btn-primary" onClick={handleInvite}>
              Uitnodiging versturen
            </button>
          </div>
        </div>
      )}

      {/* Custom role modal */}
      {showRoleModal && (
        <div className="modal-overlay" onClick={() => setShowRoleModal(false)}>
          <div className="glass-panel modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Eigen rol aanmaken</h2>
              <button onClick={() => setShowRoleModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
              Geef de rol een herkenbare naam en kies wat iemand met deze rol mag doen.
            </p>

            <div className="form-group">
              <label>Naam van de rol</label>
              <input
                type="text"
                placeholder="Bijv. Sales-manager, Externe consultant..."
                value={newRoleName}
                onChange={e => { setNewRoleName(e.target.value); setRoleNameError(''); }}
                style={roleNameError && newRoleName.length < 2 ? { borderColor: 'var(--danger)' } : {}}
              />
            </div>

            <div className="form-group">
              <label>Bevoegdheden</label>
              <div className="perm-list">
                {PERMISSIONS.map(p => (
                  <label key={p.key} className="perm-row">
                    <input
                      type="checkbox"
                      checked={newRolePerms.includes(p.key)}
                      onChange={() => togglePerm(p.key)}
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {roleNameError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={14} color="var(--danger)" />
                <span className="field-error">{roleNameError}</span>
              </div>
            )}

            <button className="btn-primary" onClick={handleSaveRole}>
              Rol opslaan
            </button>
          </div>
        </div>
      )}

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
