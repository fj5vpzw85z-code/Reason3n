'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Boxes, Check, X, ArrowRight, Sparkles } from 'lucide-react';

type Billing = 'monthly' | 'yearly';

const TIERS = [
  {
    name: 'Starter',
    description: 'Voor kleine teams die net beginnen met governance.',
    monthly: 49,
    yearly: 39,
    cta: 'Start gratis proefperiode',
    highlighted: false,
    features: [
      { label: 'Tot 5 gebruikers', included: true },
      { label: '2 connectoren (HubSpot + Excel)', included: true },
      { label: '1.000 logboek-invoeren / maand', included: true },
      { label: 'Basis AI-voorstellen (10/dag)', included: true },
      { label: 'E-mail ondersteuning', included: true },
      { label: 'Custom RBAC rollen', included: false },
      { label: 'SSO (SAML / Entra ID)', included: false },
      { label: 'Tamper-evident export (signed PDF)', included: false },
      { label: 'Dedicated success manager', included: false },
    ],
  },
  {
    name: 'Pro',
    description: 'Voor groeiende sales- en marketing-organisaties.',
    monthly: 299,
    yearly: 239,
    cta: 'Probeer Pro 14 dagen',
    highlighted: true,
    features: [
      { label: 'Tot 25 gebruikers', included: true },
      { label: 'Alle connectoren (HubSpot, M365, Notion, Slack)', included: true },
      { label: '50.000 logboek-invoeren / maand', included: true },
      { label: 'Onbeperkte AI-voorstellen', included: true },
      { label: 'Priority chat + e-mail support', included: true },
      { label: 'Custom RBAC rollen', included: true },
      { label: 'SSO (SAML / Entra ID)', included: true },
      { label: 'Tamper-evident export (signed PDF)', included: true },
      { label: 'Dedicated success manager', included: false },
    ],
  },
  {
    name: 'Enterprise',
    description: 'Voor grote organisaties met compliance-vereisten.',
    monthly: null,
    yearly: null,
    cta: 'Plan een gesprek',
    highlighted: false,
    features: [
      { label: 'Onbeperkt aantal gebruikers', included: true },
      { label: 'Alle connectoren + custom integraties', included: true },
      { label: 'Onbeperkte logboek-invoeren', included: true },
      { label: 'Onbeperkte AI-voorstellen', included: true },
      { label: '24/7 priority support + SLA', included: true },
      { label: 'Custom RBAC rollen', included: true },
      { label: 'SSO (SAML / Entra ID)', included: true },
      { label: 'Tamper-evident export (signed PDF)', included: true },
      { label: 'Dedicated success manager', included: true },
    ],
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>('monthly');

  return (
    <div className="landing-root">
      <nav className="landing-nav">
        <Link href="/" className="landing-logo">
          <Boxes color="var(--accent)" size={26} /> Reason3n
        </Link>
        <div className="landing-nav-links">
          <Link href="/pricing" className="active">Prijzen</Link>
          <Link href="/login">Inloggen</Link>
          <Link href="/signup" className="btn-primary" style={{ padding: '10px 18px', fontSize: '14px' }}>
            Aanmelden
          </Link>
        </div>
      </nav>

      <section className="pricing-hero">
        <div className="badge-pill">
          <Sparkles size={14} /> Eenvoudige prijzen - schaalt mee met je team
        </div>
        <h1 className="hero-title" style={{ fontSize: '42px' }}>Kies wat past</h1>
        <p className="hero-sub" style={{ maxWidth: '600px' }}>
          Geen verborgen kosten. Stop wanneer je wil. Alle plannen bevatten ons
          tamper-evident logboek en de menselijke goedkeuringsstap.
        </p>

        <div className="billing-toggle">
          <button
            className={billing === 'monthly' ? 'active' : ''}
            onClick={() => setBilling('monthly')}
          >
            Maandelijks
          </button>
          <button
            className={billing === 'yearly' ? 'active' : ''}
            onClick={() => setBilling('yearly')}
          >
            Jaarlijks <span className="save-pill">−20%</span>
          </button>
        </div>
      </section>

      <section className="landing-section" style={{ paddingTop: 0 }}>
        <div className="pricing-grid">
          {TIERS.map(tier => {
            const price = billing === 'yearly' ? tier.yearly : tier.monthly;
            return (
              <div
                key={tier.name}
                className={`glass-panel pricing-card ${tier.highlighted ? 'highlighted' : ''}`}
              >
                {tier.highlighted && <div className="pricing-badge">Populair</div>}
                <h3>{tier.name}</h3>
                <p className="pricing-desc">{tier.description}</p>

                <div className="pricing-price">
                  {price === null ? (
                    <span className="custom-price">Op aanvraag</span>
                  ) : (
                    <>
                      <span className="price-currency">€</span>
                      <span className="price-value">{price}</span>
                      <span className="price-period">/maand</span>
                    </>
                  )}
                </div>
                {price !== null && billing === 'yearly' && (
                  <div className="price-note">jaarlijks gefactureerd</div>
                )}

                <Link
                  href={tier.name === 'Enterprise' ? '/signup?plan=enterprise' : `/signup?plan=${tier.name.toLowerCase()}`}
                  className={tier.highlighted ? 'btn-primary' : 'btn-secondary'}
                  style={{ width: '100%', padding: '12px', fontSize: '14px', justifyContent: 'center' }}
                >
                  {tier.cta} <ArrowRight size={14} />
                </Link>

                <ul className="pricing-features">
                  {tier.features.map(f => (
                    <li key={f.label} className={f.included ? 'included' : 'excluded'}>
                      {f.included ? <Check size={16} color="var(--success)" /> : <X size={16} color="var(--text-muted)" />}
                      {f.label}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="landing-section">
        <div className="section-header">
          <h2>Veelgestelde vragen</h2>
        </div>
        <div className="faq-grid">
          {[
            {
              q: 'Heb ik een creditcard nodig om te starten?',
              a: 'Nee. Je kan de demo direct starten zonder creditcard. Voor een proefperiode op een betaald plan vragen we wel betaalgegevens, maar de eerste 14 dagen zijn gratis.',
            },
            {
              q: 'Wat gebeurt er met mijn data als ik stop?',
              a: 'Je kan op elk moment een volledige export downloaden van het logboek (PDF + JSON). Na opzegging bewaren we je data nog 30 dagen, daarna wordt alles cryptografisch verwijderd.',
            },
            {
              q: 'Werkt Reason3n met onze on-prem CRM?',
              a: 'Standaard ondersteunen we cloud-CRM\'s (HubSpot, Salesforce in beta). Voor on-prem oplossingen heb je het Enterprise-plan nodig met custom integratie.',
            },
            {
              q: 'Voldoet het aan AVG/GDPR?',
              a: 'Ja. Data-residentie binnen EU, DPA beschikbaar, audit-log is tamper-evident en geldig bewijsstuk. Pro en Enterprise hebben SOC2-rapport op aanvraag.',
            },
          ].map(item => (
            <div key={item.q} className="glass-panel faq-card">
              <h4>{item.q}</h4>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

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
