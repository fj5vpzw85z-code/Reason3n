'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Boxes, ArrowLeft, CheckCircle2 } from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'pro';

  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!company.trim()) e.company = 'Bedrijfsnaam is verplicht';
    else if (company.trim().length < 2) e.company = 'Bedrijfsnaam te kort';
    if (!name.trim()) e.name = 'Naam is verplicht';
    else if (name.trim().length < 2) e.name = 'Naam te kort';
    if (!email.trim()) e.email = 'E-mailadres is verplicht';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Voer een geldig e-mailadres in';
    if (!password) e.password = 'Wachtwoord is verplicht';
    else if (password.length < 8) e.password = 'Minimaal 8 tekens';
    else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) e.password = 'Gebruik minimaal 1 hoofdletter en 1 cijfer';
    if (!agreed) e.agreed = 'Je moet akkoord gaan met de voorwaarden';
    return e;
  };

  const passwordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = passwordStrength();
  const strengthLabel = ['', 'Zwak', 'Matig', 'Goed', 'Sterk', 'Zeer sterk'][strength];
  const strengthColor = strength <= 1 ? 'var(--danger)' : strength <= 2 ? 'var(--warning)' : 'var(--success)';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    const account = {
      company: company.trim(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      plan,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('demo_account', JSON.stringify(account));
    localStorage.setItem('access_token', `demo_${Date.now()}`);
    localStorage.setItem('refresh_token', 'demo_refresh');
    localStorage.setItem('user_name', account.name);
    localStorage.setItem('user_email', account.email);
    localStorage.setItem('user_company', account.company);

    setSuccess(true);
    setTimeout(() => router.push('/dashboard'), 1500);
  };

  if (success) {
    return (
      <div className="login-container">
        <div className="glass-panel login-card" style={{ alignItems: 'center', textAlign: 'center' }}>
          <div style={{ background: 'rgba(74,222,128,0.15)', borderRadius: '50%', padding: '20px' }}>
            <CheckCircle2 size={48} color="var(--success)" />
          </div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Welkom bij Reason3n!</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            Je werkruimte voor <strong style={{ color: 'var(--text-main)' }}>{company}</strong> is aangemaakt.
            We nemen je mee naar je dashboard...
          </p>
          <div className="spinner" style={{ width: '24px', height: '24px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <Link href="/" className="back-link">
        <ArrowLeft size={16} /> Terug naar home
      </Link>
      <form className="glass-panel login-card" onSubmit={handleSubmit} noValidate style={{ maxWidth: '460px' }}>
        <div className="login-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <Boxes color="var(--accent)" size={36} />
          </div>
          <h1>Maak je werkruimte aan</h1>
          <p>
            Plan: <strong style={{ color: 'var(--accent)', textTransform: 'capitalize' }}>{plan}</strong>
            {plan !== 'enterprise' && ' — 14 dagen gratis, geen creditcard nodig'}
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="su-company">Bedrijfsnaam</label>
          <input
            id="su-company"
            type="text"
            autoComplete="organization"
            placeholder="Acme B.V."
            value={company}
            onChange={e => { setCompany(e.target.value); if (errors.company) setErrors({ ...errors, company: '' }); }}
            style={errors.company ? { borderColor: 'var(--danger)' } : {}}
          />
          {errors.company && <span className="field-error">{errors.company}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="su-name">Jouw naam</label>
          <input
            id="su-name"
            type="text"
            autoComplete="name"
            placeholder="Jan de Vries"
            value={name}
            onChange={e => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: '' }); }}
            style={errors.name ? { borderColor: 'var(--danger)' } : {}}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="su-email">Werk e-mailadres</label>
          <input
            id="su-email"
            type="email"
            autoComplete="email"
            placeholder="jij@bedrijf.nl"
            value={email}
            onChange={e => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }); }}
            style={errors.email ? { borderColor: 'var(--danger)' } : {}}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="su-password">Wachtwoord</label>
          <input
            id="su-password"
            type="password"
            autoComplete="new-password"
            placeholder="Minimaal 8 tekens, 1 hoofdletter, 1 cijfer"
            value={password}
            onChange={e => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: '' }); }}
            style={errors.password ? { borderColor: 'var(--danger)' } : {}}
          />
          {password && (
            <div className="strength-bar">
              <div className="strength-fill" style={{ width: `${(strength / 5) * 100}%`, background: strengthColor }} />
              <span style={{ fontSize: '12px', color: strengthColor, minWidth: '70px', textAlign: 'right' }}>{strengthLabel}</span>
            </div>
          )}
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer', color: 'var(--text-main)', fontSize: '13px', fontWeight: 'normal' }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => { setAgreed(e.target.checked); if (errors.agreed) setErrors({ ...errors, agreed: '' }); }}
              style={{ marginTop: '2px', width: 'auto' }}
            />
            <span>
              Ik ga akkoord met de <a href="#" style={{ color: 'var(--accent)' }}>algemene voorwaarden</a> en het <a href="#" style={{ color: 'var(--accent)' }}>privacybeleid</a>.
            </span>
          </label>
          {errors.agreed && <span className="field-error">{errors.agreed}</span>}
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <><span className="spinner" style={{ width: '16px', height: '16px' }}></span> Account aanmaken...</> : 'Werkruimte aanmaken'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          Heb je al een account? <Link href="/login" style={{ color: 'var(--accent)' }}>Inloggen</Link>
        </p>
      </form>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="login-container"><div className="spinner" /></div>}>
      <SignupForm />
    </Suspense>
  );
}
