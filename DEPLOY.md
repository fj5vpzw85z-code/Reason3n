# Reason3n-demo deployen op reason3n.dif3r3nt.nl (self-hosted, weg van Vercel)

De demo is **volledig frontend-only**: alle routes zijn statisch, het dashboard
draait op mock-data en de login heeft een demo-fallback. Er is dus **geen
backend, database of Node-runtime** nodig. We bouwen een statische export
(`apps/web/out`) en serveren die met **Caddy** (automatische HTTPS).

Zodra je een echte backend (`apps/api`) toevoegt: zet `apps/web/next.config.js`
om van `output: 'export'` naar `output: 'standalone'` en voeg de API-service toe.

## Voorwaarden

- Een Linux-VPS in de EU (i.v.m. AVG), met Docker + `docker compose`.
- Firewall: poort **80** en **443** open.
- Toegang tot de DNS van `dif3r3nt.nl`.

## Stappen

### 1. DNS
Voeg bij de DNS-provider van dif3r3nt.nl toe:

```
A     reason3n     <publiek IP van je server>
AAAA  reason3n     <IPv6 van je server>        # optioneel
```

De apex `dif3r3nt.nl` (marketing-site) blijft ongemoeid. Controleer:

```bash
dig +short reason3n.dif3r3nt.nl
```

### 2. Code + build op de server
Zet de repo op de server (git clone of rsync) en bouw de export:

```bash
npm ci
npm run build --workspace=@reason3n/web    # produceert apps/web/out
```

(Alternatief: lokaal bouwen en alleen `apps/web/out/` naar de server rsync-en.)

### 3. Serveren met Caddy

```bash
docker compose -f infrastructure/deploy/docker-compose.prod.yml up -d
```

Caddy vraagt bij het eerste bezoek automatisch een Let's Encrypt-certificaat aan
voor `reason3n.dif3r3nt.nl`. Het `caddy_data`-volume bewaart dat certificaat.

### 4. Testen
Open `https://reason3n.dif3r3nt.nl`:

- Knop **"Probeer de demo"** -> direct het dashboard in (geen login).
- Of login met **admin@reason3n.com** / **password123**.
- Of maak een account aan via /signup (wordt lokaal in de browser bewaard).

## Updaten

```bash
git pull                                     # of rsync de nieuwe code
npm run build --workspace=@reason3n/web      # herbouwt apps/web/out
docker compose -f infrastructure/deploy/docker-compose.prod.yml restart
```

## Weg van Vercel (opruimen)

Zodra het nieuwe domein live is:

- Verwijder de domeinkoppeling van het `reason3n`-project in het Vercel-dashboard.
- Optioneel: verwijder de map `.vercel/` en `vercel.json` uit de repo.

## Zonder Docker (alternatief)

Systeem-Caddy in plaats van een container:

```bash
sudo cp apps/web/out -r /srv/reason3n
sudo caddy run --config infrastructure/deploy/Caddyfile
# (pas 'root' in de Caddyfile aan naar /srv/reason3n; dat is al de default)
```
