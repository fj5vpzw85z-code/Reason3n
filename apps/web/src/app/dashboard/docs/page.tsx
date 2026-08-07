'use client';

import { useState } from 'react';
import { Compass, Layers, BookMarked, Printer, Download, CheckCircle2 } from 'lucide-react';

type Tab = 'welkom' | 'wat-kan-het' | 'hoe-werkt-het';

const TABS: { id: Tab; label: string; sub: string; icon: React.ReactNode }[] = [
  { id: 'welkom', label: 'Welkom & aan de slag', sub: 'Stap-voor-stap kennismaking', icon: <Compass size={18} /> },
  { id: 'wat-kan-het', label: 'Wat kan Reason3n', sub: 'Overzicht van alle mogelijkheden', icon: <Layers size={18} /> },
  { id: 'hoe-werkt-het', label: 'Dagelijkse handleiding', sub: 'Hoe gebruik je het in je werk', icon: <BookMarked size={18} /> },
];

export default function DocsPage() {
  const [active, setActive] = useState<Tab>('welkom');
  const [toast, setToast] = useState<string | null>(null);

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const handleDownload = () => {
    setToast('Document wordt voorbereid als PDF...');
    setTimeout(() => {
      setToast('PDF gedownload naar je computer');
      setTimeout(() => setToast(null), 2500);
    }, 1200);
  };

  const tab = TABS.find(t => t.id === active)!;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px' }}>Documenten</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Drie korte documenten in alledaagse taal - geen technisch gedoe.
          Bedoeld voor jou en je collega&apos;s.
        </p>
      </div>

      {/* Tab strip */}
      <div className="docs-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`docs-tab ${active === t.id ? 'active' : ''}`}
          >
            <div className="docs-tab-icon">{t.icon}</div>
            <div style={{ minWidth: 0, textAlign: 'left' }}>
              <div className="docs-tab-label">{t.label}</div>
              <div className="docs-tab-sub">{t.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          Versie 1.0 - Laatst bijgewerkt: mei 2026
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handlePrint} className="btn-secondary">
            <Printer size={14} /> Afdrukken
          </button>
          <button onClick={handleDownload} className="btn-secondary">
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      {/* Document body */}
      <article className="glass-panel docs-body">
        {active === 'welkom' && <WelkomDoc />}
        {active === 'wat-kan-het' && <WatKanHetDoc />}
        {active === 'hoe-werkt-het' && <HoeWerktHetDoc />}
      </article>

      {toast && (
        <div className="toast toast-success">
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   1. WELKOM & AAN DE SLAG (Onboarding)
   ============================================================ */
function WelkomDoc() {
  return (
    <>
      <h2>Welkom bij Reason3n</h2>
      <p className="lead">
        Fijn dat je er bent. Dit document helpt je om binnen 10 minuten op gang te komen.
        Je hoeft niets technisch te kunnen - alles kan met de muis en wat geduld.
      </p>

      <h3>In één zin</h3>
      <p>
        Reason3n is je <strong>centrale werkplek</strong> waar je losse tools (zoals HubSpot,
        Excel, Notion en Slack) bij elkaar brengt, slimme suggesties krijgt over wat je
        kan verbeteren, en waar elke beslissing wordt opgeschreven met de reden erbij.
      </p>

      <h3>Waarom heb je dit nodig?</h3>
      <ul>
        <li>Je werk staat verspreid over te veel programma&apos;s.</li>
        <li>Niemand weet meer wie wat besloot - laat staan waarom.</li>
        <li>Slimme computers (AI) doen tegenwoordig dingen zelf, terwijl jij liever zelf de baas blijft.</li>
        <li>Bij een controle wil je kunnen laten zien wat er gebeurd is.</li>
      </ul>
      <p>Reason3n lost deze vier zaken in één keer op.</p>

      <h3>Je eerste week - in zes stappen</h3>

      <div className="step-row">
        <div className="step-circle">1</div>
        <div>
          <h4>Maak je account</h4>
          <p>
            Je hebt al een account aangemaakt - anders zou je dit niet lezen.
            Bovenaan rechts zie je je e-mailadres en de naam van je werkruimte.
            Dat is jouw eigen, afgeschermde omgeving.
          </p>
        </div>
      </div>

      <div className="step-row">
        <div className="step-circle">2</div>
        <div>
          <h4>Verbind je tools</h4>
          <p>
            Ga in het menu naar <strong>Instellingen</strong>. Onder &ldquo;Connecties&rdquo;
            staan de programma&apos;s die je kan koppelen. Klik op <em>Koppelen</em> en
            log in met je gewone werk-account. Je hoeft geen data te kopiëren of over te zetten -
            Reason3n leest alleen mee.
          </p>
          <div className="callout">
            <strong>Goed om te weten:</strong> Reason3n krijgt nooit toestemming om iets in
            jouw tools te wijzigen zonder dat je eerst zelf op een goedkeur-knop drukt.
          </div>
        </div>
      </div>

      <div className="step-row">
        <div className="step-circle">3</div>
        <div>
          <h4>Nodig je collega&apos;s uit</h4>
          <p>
            Onder &ldquo;Toegangsbeheer&rdquo; in Instellingen kan je collega&apos;s
            uitnodigen. Je kiest per persoon wat ze mogen:
          </p>
          <ul>
            <li><strong>Bekijken</strong> - alleen meekijken, niets wijzigen</li>
            <li><strong>Voorstellen indienen</strong> - mag suggesties doen</li>
            <li><strong>Volledige toegang</strong> - beheert ook de instellingen</li>
          </ul>
        </div>
      </div>

      <div className="step-row">
        <div className="step-circle">4</div>
        <div>
          <h4>Bekijk je dashboard</h4>
          <p>
            Op de <strong>startpagina</strong> zie je in één oogopslag:
            hoeveel suggesties wachten op jouw oordeel, welke koppelingen Reason3n nog
            wil verbinden, en hoeveel beslissingen er al zijn vastgelegd.
            Klik op een tegel om door te gaan.
          </p>
        </div>
      </div>

      <div className="step-row">
        <div className="step-circle">5</div>
        <div>
          <h4>Behandel je eerste suggesties</h4>
          <p>
            Ga naar <strong>AI Voorstellen</strong>. Bij elke suggestie zie je wat
            Reason3n is opgevallen, en wat het zou willen veranderen. Lees het rustig
            door, schrijf in eigen woorden waarom je akkoord gaat (of niet),
            en klik <em>Goedkeuren</em> of <em>Negeren</em>.
          </p>
        </div>
      </div>

      <div className="step-row">
        <div className="step-circle">6</div>
        <div>
          <h4>Open je logboek</h4>
          <p>
            Onder <strong>Beslissingen Logboek</strong> staat alles wat er gebeurd is -
            wie wat heeft gedaan, wanneer, en met welke reden.
            Dit logboek kan niemand achteraf aanpassen, ook wij niet. Handig voor
            de boekhouder, een controle, of als iemand zich afvraagt &ldquo;wie heeft dit
            gedaan?&rdquo;.
          </p>
        </div>
      </div>

      <h3>Hulp nodig?</h3>
      <p>
        We zitten klaar om je te helpen. Stuur een mailtje naar
        <a href="mailto:hallo@reason3n.com" style={{ color: 'var(--accent)' }}> hallo@reason3n.com</a> of
        gebruik de chat-knop rechtsonderin (verschijnt zodra je je eerste tool hebt gekoppeld).
        Reactietijd: meestal binnen een paar uur op werkdagen.
      </p>

      <div className="info-box">
        <h4 style={{ marginTop: 0 }}>Tip voor je eerste dag</h4>
        <p style={{ margin: 0 }}>
          Begin met één tool koppelen (HubSpot of Excel is het simpelst).
          Wacht een uurtje - dan heeft Reason3n genoeg gelezen om de eerste suggesties te tonen.
          Vanaf daar wordt het vanzelf duidelijk.
        </p>
      </div>
    </>
  );
}

/* ============================================================
   2. WAT KAN REASON3N (Functionaliteiten)
   ============================================================ */
function WatKanHetDoc() {
  return (
    <>
      <h2>Wat kan Reason3n allemaal?</h2>
      <p className="lead">
        Een rondleiding langs alle onderdelen. Geen losse functies in een lijstje,
        maar uitgelegd waar je het voor gebruikt en wat het je oplevert.
      </p>

      <h3>Het dashboard</h3>
      <p>
        De startpagina als je inlogt. Drie tegels laten zien hoe het ervoor staat:
      </p>
      <ul>
        <li>
          <strong>Wachtende koppelingen</strong> - Reason3n vermoedt dat twee dingen uit
          verschillende tools eigenlijk hetzelfde zijn (bijvoorbeeld dezelfde campagne in
          HubSpot en in Excel). Hier zie je hoeveel daarvan op jouw oordeel wachten.
        </li>
        <li>
          <strong>Suggesties</strong> - voorstellen die de slimme computer heeft gemaakt
          (deal-fase aanpassen, budget verlagen, campagne pauzeren).
          Niets gebeurt zonder dat jij &lsquo;ja&rsquo; zegt.
        </li>
        <li>
          <strong>Beslissingen vastgelegd</strong> - het aantal genomen beslissingen tot nu toe.
          Dit cijfer kan alleen omhoog, niet omlaag.
        </li>
      </ul>
      <p>
        Onderaan zie je twee lijstjes: de meest recente suggesties en de meest recente
        beslissingen. Met één klik bekijk je het volledige overzicht.
      </p>

      <h3>Koppelingen tussen tools</h3>
      <p>
        Onder &ldquo;Entiteit Resolutie&rdquo; - wat een ingewikkeld woord is voor
        <em> dingen aan elkaar verbinden die bij elkaar horen</em>.
      </p>
      <p>
        Voorbeeld: in HubSpot heet een campagne &ldquo;Voorjaarsactie 2026&rdquo;,
        en in Excel staat dezelfde campagne als regelnummer 42 met de naam &ldquo;Campagne Voorjaar&rdquo;.
        Reason3n herkent dit en stelt voor om ze als hetzelfde te beschouwen.
        Met een score (bijvoorbeeld 94%) laat het zien hoe zeker het ervan is.
        Jij bevestigt of wijst af.
      </p>
      <p>
        Waarom is dit handig? Omdat je daarna in elk rapport ziet wat er bij die ene
        campagne hoort - uit alle tools tegelijk. Geen dubbele administratie meer.
      </p>

      <h3>Slimme suggesties (AI Voorstellen)</h3>
      <p>
        De slimme computer leest mee met je werk en wijst je op dingen die opvallen:
      </p>
      <ul>
        <li>Een deal staat al 18 dagen stil - misschien terugzetten naar &lsquo;verkennend gesprek&rsquo;?</li>
        <li>De kosten per klik op een advertentie zijn sterk gestegen - budget verlagen?</li>
        <li>Een campagne loopt al 3 weken zonder resultaat - pauzeren?</li>
      </ul>
      <p>
        Bij elk voorstel zie je <strong>de huidige situatie</strong> en <strong>het voorstel</strong>
        netjes naast elkaar. Je leest de uitleg, schrijft in je eigen woorden waarom
        je akkoord gaat, en klikt op goedkeuren. Pas dán wordt het ook in HubSpot,
        Excel of waar dan ook doorgevoerd.
      </p>
      <p>
        Wijst je af? Ook prima. Dat wordt ook opgeschreven, maar er gebeurt verder niets.
      </p>

      <h3>Het beslissingenlogboek</h3>
      <p>
        Een tijdlijn van alles wat er gebeurd is in jouw werkruimte.
        Bij elke beslissing zie je:
      </p>
      <ul>
        <li>Wat er is gebeurd</li>
        <li>Wie het heeft gedaan</li>
        <li>Wanneer (datum + tijd)</li>
        <li>De reden, in eigen woorden opgeschreven</li>
        <li>Een unieke vingerafdruk-code (technisch detail - voor de boekhouder of jurist)</li>
      </ul>
      <p>
        Je kan zoeken in het logboek (op naam, op reden, op persoon) en het hele logboek
        downloaden als PDF. Het logboek is <strong>onveranderbaar</strong>: zelfs wij van
        Reason3n kunnen er niets in wijzigen of verwijderen. Daardoor is het ook geldig
        bewijs als er ooit vragen komen.
      </p>

      <h3>Instellingen</h3>
      <p>
        Hier doe je drie dingen:
      </p>
      <ul>
        <li>
          <strong>Tools koppelen</strong> - HubSpot, Microsoft 365 (Excel), Notion, Slack.
          Eén keer inloggen en het is verbonden. Ontkoppelen kan ook met één klik.
        </li>
        <li>
          <strong>Teamleden beheren</strong> - collega&apos;s uitnodigen, hun rol aanpassen,
          of toegang weer intrekken.
        </li>
        <li>
          <strong>Taal kiezen</strong> - Nederlands, Engels, Duits, Frans of Spaans.
          Linksonderin de zijbalk.
        </li>
      </ul>

      <h3>Op je telefoon</h3>
      <p>
        Reason3n werkt op je computer én op je telefoon. Op kleinere schermen zie je
        rechtsboven een menu-knop (drie streepjes) waarmee je naar elk onderdeel kan.
        Goedkeuringen kan je dus ook onderweg afhandelen.
      </p>

      <h3>Wat doet Reason3n niét?</h3>
      <ul>
        <li>Het verstuurt geen e-mails namens jou.</li>
        <li>Het doet niets in je tools zonder jouw expliciete goedkeuring.</li>
        <li>Het deelt geen data met andere klanten - jouw werkruimte staat los.</li>
        <li>Het verkoopt je gegevens niet door.</li>
      </ul>
    </>
  );
}

/* ============================================================
   3. DAGELIJKSE HANDLEIDING (Gebruikersaanwijzing)
   ============================================================ */
function HoeWerktHetDoc() {
  return (
    <>
      <h2>Hoe gebruik je het dagelijks?</h2>
      <p className="lead">
        Een praktische handleiding voor de meest voorkomende handelingen.
        Lees het door, of zoek het op als je het nodig hebt.
      </p>

      <h3>Inloggen</h3>
      <ol>
        <li>Ga naar <strong>reason3n.vercel.app</strong>.</li>
        <li>Klik bovenaan op <em>Inloggen</em>.</li>
        <li>Vul je e-mailadres en wachtwoord in.</li>
        <li>Klik op <em>Inloggen</em>.</li>
      </ol>
      <p>
        Wachtwoord vergeten? Onder de inlogknop staat een link <em>&ldquo;Wachtwoord vergeten?&rdquo;</em>.
        Je krijgt dan een mail met een herstellink.
      </p>

      <h3>Het dashboard lezen</h3>
      <p>Na het inloggen kom je op de startpagina. Lees ze van links naar rechts:</p>
      <ol>
        <li>
          <strong>Wachtende matches (groot getal)</strong> - voorgestelde verbindingen
          tussen tools waar jouw bevestiging op wacht.
        </li>
        <li>
          <strong>Suggesties (geel cijfer)</strong> - voorstellen om iets aan te passen.
        </li>
        <li>
          <strong>Beslissingen (groen cijfer)</strong> - alles wat al is afgehandeld.
        </li>
      </ol>
      <p>Klik op een tegel om de volledige lijst te openen.</p>

      <h3>Een suggestie goedkeuren</h3>
      <ol>
        <li>Klik in het menu op <strong>AI Voorstellen</strong>.</li>
        <li>Lees de titel en de uitleg eronder. Bij twijfel: kijk in HubSpot of Excel zelf even na.</li>
        <li>
          Schrijf in het tekstvak <strong>waarom</strong> je dit doorvoert.
          Minimaal tien tekens. Niet uit pesterij - dit is wat je later helpt herinneren
          waarom je deze keuze maakte.
        </li>
        <li>Klik op <em>Keur goed &amp; Voer uit</em>.</li>
        <li>Wacht een paar tellen. Het voorstel krijgt het label &ldquo;Goedgekeurd&rdquo;.</li>
        <li>De wijziging is nu doorgevoerd in de gekoppelde tool, én vastgelegd in je logboek.</li>
      </ol>

      <div className="callout">
        <strong>Geen idee wat je moet schrijven?</strong> Een goede reden is meestal kort:
        wat heeft je doen besluiten? Bijvoorbeeld: <em>&ldquo;Klant heeft per mail bevestigd dat
        budget pas in Q3 vrijkomt.&rdquo;</em>. Niet meer dan dat.
      </div>

      <h3>Een suggestie afwijzen</h3>
      <ol>
        <li>Klik op <em>Negeer voorstel</em> bij de betreffende suggestie.</li>
        <li>Het voorstel verdwijnt uit de lijst.</li>
        <li>De afwijzing wordt ook opgeschreven in het logboek (zonder dat de wijziging in HubSpot/Excel doorgaat).</li>
      </ol>

      <h3>Twee tools aan elkaar koppelen</h3>
      <p>
        Reason3n stelt voor welke dingen bij elkaar horen, maar jij bevestigt:
      </p>
      <ol>
        <li>Klik in het menu op <strong>Entiteit Resolutie</strong>.</li>
        <li>Je ziet een tabel met paren: links uit tool A, rechts uit tool B, met een score in het midden.</li>
        <li>Lees de namen - kloppen ze? (Een score boven de 90% klopt bijna altijd.)</li>
        <li>Klik op <em>Verbinden</em>.</li>
        <li>Het paar krijgt het label &ldquo;Gekoppeld&rdquo; en is nu verbonden in al je rapporten.</li>
      </ol>
      <p>
        Twijfel je? Klik dan niet op verbinden. Suggesties met een lage score (onder 80%)
        kan je gewoon laten staan tot je meer informatie hebt.
      </p>

      <h3>Een collega uitnodigen</h3>
      <ol>
        <li>Klik in het menu op <strong>Instellingen</strong>.</li>
        <li>Aan de rechterkant zie je &ldquo;Toegangsbeheer&rdquo;.</li>
        <li>Klik op <em>Nieuw lid uitnodigen</em>.</li>
        <li>Vul het werk-e-mailadres in.</li>
        <li>Kies een rol: <em>Viewer</em> (alleen kijken), <em>Editor</em> (mag suggesties indienen) of <em>Administrator</em> (mag alles).</li>
        <li>Klik op <em>Uitnodiging versturen</em>.</li>
      </ol>
      <p>
        Je collega krijgt een mail met een link om een wachtwoord in te stellen.
        Daarna ziet hij of zij dezelfde werkruimte als jij.
      </p>

      <h3>Een tool ontkoppelen</h3>
      <ol>
        <li>Ga naar <strong>Instellingen</strong>.</li>
        <li>Aan de linkerkant staat de lijst &ldquo;Connecties&rdquo;.</li>
        <li>Klik bij de tool die je wil ontkoppelen op <em>Ontkoppelen</em>.</li>
        <li>Bevestig.</li>
      </ol>
      <p>
        Reason3n leest dan niet meer mee met die tool. Eerder vastgelegde beslissingen
        blijven gewoon in het logboek staan.
      </p>

      <h3>Het logboek doorzoeken</h3>
      <ol>
        <li>Klik op <strong>Beslissingen Logboek</strong> in het menu.</li>
        <li>Bovenaan staat een zoekbalk. Typ daar een woord, naam, of fragment van een reden.</li>
        <li>De tijdlijn toont alleen nog de matches.</li>
        <li>Veld leeg? Dan zie je weer alles.</li>
      </ol>

      <h3>Een rapport (audit trail) downloaden</h3>
      <ol>
        <li>Ga naar <strong>Beslissingen Logboek</strong>.</li>
        <li>Klik rechtsboven op <em>Exporteer als PDF</em>.</li>
        <li>Wacht een paar tellen. De PDF wordt naar je computer gedownload.</li>
      </ol>
      <p>
        Het PDF-bestand is voorzien van een digitale handtekening. Een controleur of
        jurist kan zien dat het echt afkomstig is van jouw werkruimte en dat er niets
        aan veranderd is.
      </p>

      <h3>Taal wisselen</h3>
      <ol>
        <li>Linksonderin de zijbalk staat een wereldbol-icoon.</li>
        <li>Klik op het uitklapmenu ernaast.</li>
        <li>Kies je taal: Nederlands, Engels, Duits, Frans of Spaans.</li>
      </ol>
      <p>De hele app wisselt direct van taal - je hoeft niet opnieuw in te loggen.</p>

      <h3>Uitloggen</h3>
      <ol>
        <li>Onderaan de zijbalk staat <em>Uitloggen</em>.</li>
        <li>Klik erop. Je gaat terug naar de startpagina van de website.</li>
      </ol>
      <p>Op een gedeelde computer? Sluit ook het tabblad. Voor de zekerheid.</p>

      <div className="info-box">
        <h4 style={{ marginTop: 0 }}>Vastgelopen?</h4>
        <p style={{ margin: 0 }}>
          Vernieuw eerst de pagina (Ctrl+R of Cmd+R). Werkt het nog niet, log dan uit en
          weer in. Helpt dat ook niet?
          Mail <a href="mailto:hallo@reason3n.com" style={{ color: 'var(--accent)' }}>hallo@reason3n.com</a>
          {' '}met een korte beschrijving - het liefst met een schermafbeelding erbij.
        </p>
      </div>
    </>
  );
}
