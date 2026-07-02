import Link from 'next/link';
import { Boxes, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found-root">
      <div className="glass-panel not-found-card">
        <Boxes color="var(--accent)" size={36} />
        <div className="not-found-code">404</div>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>Pagina niet gevonden</h2>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
          De pagina die je zoekt bestaat niet of is verplaatst.
          Geen zorgen — er is geen logboek-invoer aangemaakt voor deze actie.
        </p>
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/" className="btn-primary" style={{ padding: '10px 18px', fontSize: '14px' }}>
            <Home size={16} /> Naar home
          </Link>
          <Link href="/dashboard" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '14px' }}>
            <ArrowLeft size={16} /> Naar dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
