'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Boxes, Bot, FileText, DatabaseZap, Shield, ArrowRight,
  CheckCircle2, Workflow, Lock, Globe, Sparkles
} from 'lucide-react';

// Interesse-/wachtlijstformulier op de Dif3r3nt-hoofdsite. Wie zich aanmeldt,
// verschijnt automatisch in de whitelist. Eén bron van waarheid voor de URL.
const INTERESSE_URL = 'https://dif3r3nt.nl/interesse?dienst=reason3n';

export default function LandingPage() {
  const router = useRouter();

  const handleTryDemo = () => {
    localStorage.setItem('access_token', 'demo_token');
    localStorage.setItem('refresh_token', 'demo_refresh');
    router.push('/dashboard');
  };

  return (
    <div className="landing-root">
      {/* Top nav */}
      <nav className="landing-nav">
        <Link href="/" className="landing-logo">
          <Boxes color="var(--accent)" size={26} /> Reason3n
        </Link>
        <div className="landing-nav-links">
          <Link href="/pricing">Prijzen</Link>
          <a href={INTERESSE_URL} target="_blank" rel="noopener noreferrer">Interesse</a>
          <Link href="/login">Inloggen</Link>
          <Link href="/signup" className="btn-primary" style={{ padding: '10px 18px', fontSize: '14px' }}>
            Aanmelden
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <div className="badge-pill">
            <Sparkles size={14} /> Nieuw - Operationele governance voor sales & marketing
          </div>
          <h1 className="hero-title">
            AI <span className="text-accent">stelt voor</span>,<br />
            mensen <span className="text-accent">beslissen</span>.
          </h1>
          <p className="hero-sub">
            Reason3n is de besturingslaag bovenop HubSpot, Excel, Notion en Slack.
            Verbindt verspreide data, onthoudt elke beslissing en houdt AI binnen de lijntjes
            via een verplichte goedkeuringsstap met rationale.
          </p>
          <div className="hero-cta">
            <button onClick={handleTryDemo} className="btn-primary" style={{ padding: '14px 24px', fontSize: '15px' }}>
              Probeer de demo <ArrowRight size={16} />
            </button>
            <a href={INTERESSE_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '14px 24px', fontSize: '15px' }}>
              Interesse tonen <ArrowRight size={16} />
            </a>
            <Link href="/pricing" className="btn-secondary" style={{ padding: '14px 24px', fontSize: '15px' }}>
              Bekijk prijzen
            </Link>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '8px 0 0' }}>
            Geen creditcard nodig - directe toegang tot de demo-omgeving.
          </p>
        </div>

        {/* Floating dashboard preview */}
        <div className="hero-preview glass-panel">
          <div className="hero-preview-bar">
            <span className="dot" style={{ background: '#ff5e5e' }} />
            <span className="dot" style={{ background: '#facc15' }} />
            <span className="dot" style={{ background: '#4ade80' }} />
            <span style={{ marginLeft: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
              reason3n.app/dashboard
            </span>
          </div>
          <div className="hero-preview-body">
            <div className="hero-stat">
              <div className="hero-stat-label"><DatabaseZap size={14} color="var(--accent)" /> Wachtende matches</div>
              <div className="hero-stat-val">12</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-label"><Bot size={14} color="#facc15" /> AI Voorstellen</div>
              <div className="hero-stat-val">3</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-label"><FileText size={14} color="#4ade80" /> Logboek invoer</div>
              <div className="hero-stat-val">84</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="trust-strip">
        <span>Werkt naadloos met</span>
        <span className="logo-pill">HubSpot</span>
        <span className="logo-pill">Microsoft 365</span>
        <span className="logo-pill">Notion</span>
        <span className="logo-pill">Slack</span>
        <span className="logo-pill">Excel</span>
      </section>

      {/* Features */}
      <section className="landing-section">
        <div className="section-header">
          <h2>Drie kernfuncties, één doel</h2>
          <p>Geen losse tools meer - één plek waar je weet wat er gebeurt en waarom.</p>
        </div>

        <div className="feature-grid">
          <div className="glass-panel feature-card">
            <div className="feature-icon"><DatabaseZap size={24} color="var(--accent)" /></div>
            <h3>Entiteit Resolutie</h3>
            <p>Verbind dezelfde campagne, deal of contact uit verschillende tools. Reason3n leest mee en stelt koppelingen voor met een vertrouwensscore.</p>
          </div>
          <div className="glass-panel feature-card">
            <div className="feature-icon"><Bot size={24} color="var(--accent)" /></div>
            <h3>Begrensde AI Voorstellen</h3>
            <p>De AI mag voorstellen, nooit zelf uitvoeren. Elke goedkeuring vereist een geschreven rationale - verantwoordelijkheid blijft bij de mens.</p>
          </div>
          <div className="glass-panel feature-card">
            <div className="feature-icon"><FileText size={24} color="var(--accent)" /></div>
            <h3>Onveranderlijk Logboek</h3>
            <p>Elke beslissing wordt cryptografisch vastgelegd in een hash-chain. Audit-klaar, exporteerbaar, onveranderbaar.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing-section">
        <div className="section-header">
          <h2>Hoe het werkt</h2>
          <p>Van verspreide data naar verantwoorde beslissingen, in vier stappen.</p>
        </div>

        <div className="how-it-works">
          {[
            { icon: <Workflow size={20} />, num: '01', title: 'Koppel je tools', desc: 'OAuth-verbinding met HubSpot, Microsoft 365, Notion en Slack - geen data-migratie nodig.' },
            { icon: <DatabaseZap size={20} />, num: '02', title: 'AI brengt orde', desc: 'Reason3n detecteert dubbele entiteiten, stilstaande pijplijnen en budget-anomalieën.' },
            { icon: <CheckCircle2 size={20} />, num: '03', title: 'Mens beslist', desc: 'Voorstellen verschijnen op je dashboard. Jij keurt goed met rationale, of negeert.' },
            { icon: <Shield size={20} />, num: '04', title: 'Logboek vergrendelt', desc: 'Goedgekeurde acties worden uitgevoerd én onveranderbaar vastgelegd in het beslissingenlogboek.' },
          ].map(step => (
            <div key={step.num} className="glass-panel step-card">
              <div className="step-num">{step.num}</div>
              <div className="step-icon">{step.icon}</div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="landing-section">
        <div className="why-grid">
          <div>
            <h2>Waarom Reason3n?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Marketing- en salesteams werken in een wirwar van tools. Niemand weet meer
              wie wat besloot, en waarom. AI-tools maken het erger door autonoom dingen
              door te voeren. Reason3n draait dat om.
            </p>
            <ul className="why-list">
              <li><Lock size={16} color="var(--accent)" /> AI heeft geen schrijfrechten - alle wijzigingen zijn mens-goedgekeurd</li>
              <li><Shield size={16} color="var(--accent)" /> Tamper-evident audit-log voldoet aan AVG-vereisten</li>
              <li><Globe size={16} color="var(--accent)" /> Werkt met je bestaande stack - geen migratie</li>
              <li><CheckCircle2 size={16} color="var(--accent)" /> Verplichte rationale per beslissing - institutioneel geheugen blijft</li>
            </ul>
          </div>
          <div className="glass-panel quote-card">
            <p className="quote-text">&ldquo;Eindelijk een tool die niet doet alsof AI alles vanzelf oplost. Onze sales-managers zien voorstellen, beslissen, en de reden blijft bewaard.&rdquo;</p>
            <div className="quote-author">
              <div className="avatar">M</div>
              <div>
                <div style={{ fontWeight: 500 }}>Marco Visser</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Head of Revenue, TechCorp B.V.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section">
        <div className="glass-panel final-cta">
          <h2>Klaar om je sales-stack onder controle te krijgen?</h2>
          <p>Probeer Reason3n vandaag nog - demo-omgeving met realistische data.</p>
          <div className="hero-cta" style={{ justifyContent: 'center' }}>
            <a href={INTERESSE_URL} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '14px 24px', fontSize: '15px' }}>
              Interesse tonen <ArrowRight size={16} />
            </a>
            <button onClick={handleTryDemo} className="btn-secondary" style={{ padding: '14px 24px', fontSize: '15px' }}>
              Start de demo
            </button>
            <Link href="/signup" className="btn-secondary" style={{ padding: '14px 24px', fontSize: '15px' }}>
              Maak een account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Boxes color="var(--accent)" size={20} /> Reason3n
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', marginLeft: '12px' }}>
              © {new Date().getFullYear()} Dif3r3nt
            </span>
          </div>
          <div className="footer-links">
            <Link href="/pricing">Prijzen</Link>
            <Link href="/login">Inloggen</Link>
            <Link href="/signup">Aanmelden</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
