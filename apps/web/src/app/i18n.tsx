'use client';

import React, { createContext, useContext, useState } from 'react';

type Language = 'nl' | 'en' | 'de' | 'fr' | 'es';

type Translations = {
  [key in Language]: Record<string, string>;
};

const translations: Translations = {
  nl: {
    dashboard: 'Overzicht',
    entity_resolution: 'Tools verbinden',
    decision_ledger: 'Logboek',
    ai_proposals: 'AI-suggesties',
    settings: 'Instellingen',
    documents: 'Documenten',
    sign_out: 'Uitloggen',
    workspace_overview: 'Welkom terug',
    monitor_entities: 'Hier zie je in één oogopslag wat er speelt in je werkruimte.',
    pending_matches: 'Te koppelen items',
    ai_proposals_req: 'AI-suggesties',
    ledger_entries: 'Vastgelegde beslissingen',
    recent_proposals: 'Laatste suggesties',
    recent_decisions: 'Laatste beslissingen',
    view_all: 'Bekijk alles',
    export_audit: 'Download logboek als PDF',
    pending_approval: 'Wacht op jou',
    approved: 'Goedgekeurd',
    mock_deal_update: 'Deal verplaatsen: Q3 Marketing',
    mock_deal_reason: 'Deze deal staat al meer dan 14 dagen stil',
    mock_merge_contact: 'Contact samenvoegen: Jan de Vries',
    mock_merge_reason: 'Lijkt dezelfde persoon in twee tools',
    mock_budget_update: 'Budget aangepast',
    mock_budget_reason: 'Klant vroeg om verlenging tot Q4',
    mock_entity_link: 'Campagne gekoppeld: Voorjaar 2026',
    mock_entity_reason: 'Excel-regel verbonden met HubSpot-campagne',
    hours_ago: '2 uur geleden',
    yesterday: 'Gisteren'
  },
  en: {
    dashboard: 'Overview',
    entity_resolution: 'Connect tools',
    decision_ledger: 'Activity log',
    ai_proposals: 'AI suggestions',
    settings: 'Settings',
    documents: 'Documents',
    sign_out: 'Sign out',
    workspace_overview: 'Welcome back',
    monitor_entities: 'At a glance: what\'s happening in your workspace.',
    pending_matches: 'Items to connect',
    ai_proposals_req: 'AI suggestions',
    ledger_entries: 'Recorded decisions',
    recent_proposals: 'Latest suggestions',
    recent_decisions: 'Latest decisions',
    view_all: 'View all',
    export_audit: 'Download log as PDF',
    pending_approval: 'Waiting on you',
    approved: 'Approved',
    mock_deal_update: 'Move deal back: Q3 Marketing',
    mock_deal_reason: 'This deal has been stuck for more than 14 days',
    mock_merge_contact: 'Merge contact: John Smith',
    mock_merge_reason: 'Looks like the same person in two tools',
    mock_budget_update: 'Budget adjusted',
    mock_budget_reason: 'Client asked to extend to Q4',
    mock_entity_link: 'Campaign linked: Spring 2026',
    mock_entity_reason: 'Excel row connected to HubSpot campaign',
    hours_ago: '2 hours ago',
    yesterday: 'Yesterday'
  },
  de: {
    dashboard: 'Übersicht',
    entity_resolution: 'Tools verbinden',
    decision_ledger: 'Aktivitätslog',
    ai_proposals: 'KI-Vorschläge',
    settings: 'Einstellungen',
    documents: 'Dokumente',
    sign_out: 'Abmelden',
    workspace_overview: 'Willkommen zurück',
    monitor_entities: 'Auf einen Blick: was in Ihrem Arbeitsbereich passiert.',
    pending_matches: 'Zu verbinden',
    ai_proposals_req: 'KI-Vorschläge',
    ledger_entries: 'Festgehaltene Entscheidungen',
    recent_proposals: 'Letzte Vorschläge',
    recent_decisions: 'Letzte Entscheidungen',
    view_all: 'Alle ansehen',
    export_audit: 'Log als PDF herunterladen',
    pending_approval: 'Wartet auf Sie',
    approved: 'Genehmigt',
    mock_deal_update: 'Deal zurücksetzen: Q3 Marketing',
    mock_deal_reason: 'Dieser Deal steht seit über 14 Tagen still',
    mock_merge_contact: 'Kontakt zusammenführen: Hans Müller',
    mock_merge_reason: 'Scheint dieselbe Person in zwei Tools zu sein',
    mock_budget_update: 'Budget angepasst',
    mock_budget_reason: 'Kunde bat um Verlängerung bis Q4',
    mock_entity_link: 'Kampagne verknüpft: Frühling 2026',
    mock_entity_reason: 'Excel-Zeile mit HubSpot-Kampagne verbunden',
    hours_ago: 'vor 2 Stunden',
    yesterday: 'Gestern'
  },
  fr: {
    dashboard: 'Aperçu',
    entity_resolution: 'Connecter les outils',
    decision_ledger: 'Journal',
    ai_proposals: 'Suggestions IA',
    settings: 'Paramètres',
    documents: 'Documents',
    sign_out: 'Déconnexion',
    workspace_overview: 'Bon retour',
    monitor_entities: 'En un coup d\'œil : ce qui se passe dans votre espace.',
    pending_matches: 'À connecter',
    ai_proposals_req: 'Suggestions IA',
    ledger_entries: 'Décisions enregistrées',
    recent_proposals: 'Dernières suggestions',
    recent_decisions: 'Dernières décisions',
    view_all: 'Voir tout',
    export_audit: 'Télécharger le journal en PDF',
    pending_approval: 'En attente de vous',
    approved: 'Approuvé',
    mock_deal_update: 'Replacer le deal : Q3 Marketing',
    mock_deal_reason: 'Ce deal est bloqué depuis plus de 14 jours',
    mock_merge_contact: 'Fusionner le contact : Jean Dupont',
    mock_merge_reason: 'Semble être la même personne dans deux outils',
    mock_budget_update: 'Budget ajusté',
    mock_budget_reason: 'Client a demandé une extension au T4',
    mock_entity_link: 'Campagne liée : Printemps 2026',
    mock_entity_reason: 'Ligne Excel connectée à la campagne HubSpot',
    hours_ago: 'il y a 2 heures',
    yesterday: 'Hier'
  },
  es: {
    dashboard: 'Resumen',
    entity_resolution: 'Conectar herramientas',
    decision_ledger: 'Registro',
    ai_proposals: 'Sugerencias de IA',
    settings: 'Configuración',
    documents: 'Documentos',
    sign_out: 'Cerrar sesión',
    workspace_overview: 'Bienvenido de nuevo',
    monitor_entities: 'De un vistazo: lo que pasa en tu espacio de trabajo.',
    pending_matches: 'Por conectar',
    ai_proposals_req: 'Sugerencias de IA',
    ledger_entries: 'Decisiones registradas',
    recent_proposals: 'Últimas sugerencias',
    recent_decisions: 'Últimas decisiones',
    view_all: 'Ver todo',
    export_audit: 'Descargar registro como PDF',
    pending_approval: 'Esperando por ti',
    approved: 'Aprobado',
    mock_deal_update: 'Mover trato: Q3 Marketing',
    mock_deal_reason: 'Este trato lleva más de 14 días sin avanzar',
    mock_merge_contact: 'Fusionar contacto: Juan Pérez',
    mock_merge_reason: 'Parece ser la misma persona en dos herramientas',
    mock_budget_update: 'Presupuesto ajustado',
    mock_budget_reason: 'Cliente pidió extender al T4',
    mock_entity_link: 'Campaña vinculada: Primavera 2026',
    mock_entity_reason: 'Fila de Excel conectada con campaña HubSpot',
    hours_ago: 'hace 2 horas',
    yesterday: 'Ayer'
  }
};

type I18nContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('nl');

  const t = (key: string) => {
    return translations[lang]?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
}
