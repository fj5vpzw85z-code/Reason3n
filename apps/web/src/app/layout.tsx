import './globals.css';
import { I18nProvider } from './i18n';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://reason3n.vercel.app'),
  title: {
    default: 'Reason3n | Het besturingssysteem voor marketing & sales',
    template: '%s | Reason3n',
  },
  description: 'AI stelt voor, mensen beslissen. Verbind HubSpot, Excel, Notion en Slack. Onveranderlijk beslissingenlogboek met verplichte rationale per actie.',
  keywords: ['SaaS', 'sales', 'marketing', 'governance', 'AI', 'audit log', 'HubSpot', 'CRM', 'compliance', 'AVG', 'GDPR'],
  authors: [{ name: 'Dif3r3nt' }],
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://reason3n.vercel.app',
    siteName: 'Reason3n',
    title: 'Reason3n - Het besturingssysteem voor marketing & sales',
    description: 'AI stelt voor, mensen beslissen. Verbind je tools, onthoud elke beslissing, audit-klaar.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reason3n - AI stelt voor, mensen beslissen',
    description: 'Operationele governance voor sales & marketing teams. Begrensde AI, verplichte rationale, tamper-evident logboek.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
