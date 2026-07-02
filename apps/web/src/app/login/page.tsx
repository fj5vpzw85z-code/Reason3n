'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Boxes, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const validateEmail = (val: string) => {
    if (!val) return 'E-mailadres is verplicht';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Voer een geldig e-mailadres in';
    if (val.length > 254) return 'E-mailadres is te lang';
    return '';
  };

  const validatePassword = (val: string) => {
    if (!val) return 'Wachtwoord is verplicht';
    if (val.length < 6) return 'Wachtwoord moet minimaal 6 tekens zijn';
    if (val.length > 128) return 'Wachtwoord is te lang';
    return '';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    const eErr = validateEmail(trimmedEmail);
    const pErr = validatePassword(password);

    setEmailError(eErr);
    setPasswordError(pErr);

    if (eErr || pErr) return;

    setLoading(true);
    setError('');

    try {
      let success = false;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);

        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail, password }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('access_token', data.accessToken);
          localStorage.setItem('refresh_token', data.refreshToken);
          success = true;
        }
      } catch {
        // API niet beschikbaar — demo fallback
      }

      if (!success) {
        await new Promise(resolve => setTimeout(resolve, 600));
        const storedAccount = localStorage.getItem('demo_account');
        const account = storedAccount ? JSON.parse(storedAccount) : null;

        const isDefaultDemo = trimmedEmail === 'admin@reason3n.com' && password === 'password123';
        const isCustomAccount = account && account.email === trimmedEmail && account.password === password;

        if (!isDefaultDemo && !isCustomAccount) {
          throw new Error('Onjuiste inloggegevens. Probeer admin@reason3n.com / password123 of meld je aan voor een nieuw account.');
        }

        localStorage.setItem('access_token', isCustomAccount ? `demo_${Date.now()}` : 'demo_token');
        localStorage.setItem('refresh_token', 'demo_refresh');
        if (isCustomAccount && account) {
          localStorage.setItem('user_name', account.name);
          localStorage.setItem('user_email', account.email);
          localStorage.setItem('user_company', account.company);
        }
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Link href="/" className="back-link">
        <ArrowLeft size={16} /> Terug naar home
      </Link>
      <form className="glass-panel login-card" onSubmit={handleLogin} noValidate>
        <div className="login-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <Boxes color="var(--accent)" size={36} />
          </div>
          <h1>Welkom terug</h1>
          <p>Log in op je Reason3n werkruimte</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="login-email">E-mailadres</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={e => { setEmail(e.target.value); setEmailError(''); }}
            onBlur={() => setEmailError(validateEmail(email.trim()))}
            style={emailError ? { borderColor: '#ff5e5e' } : {}}
          />
          {emailError && <span className="field-error">{emailError}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Wachtwoord</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={e => { setPassword(e.target.value); setPasswordError(''); }}
            onBlur={() => setPasswordError(validatePassword(password))}
            style={passwordError ? { borderColor: '#ff5e5e' } : {}}
          />
          {passwordError && <span className="field-error">{passwordError}</span>}
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Bezig met inloggen...' : 'Inloggen'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          Nog geen account? <Link href="/signup" style={{ color: 'var(--accent)' }}>Aanmelden</Link>
        </p>

        <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '12px', background: 'rgba(94,106,210,0.08)', border: '1px solid rgba(94,106,210,0.2)', borderRadius: '8px' }}>
          <strong>Demo:</strong> admin@reason3n.com / password123
        </div>
      </form>
    </div>
  );
}
