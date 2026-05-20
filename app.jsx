/* global React, ReactDOM */
const { useState, useEffect, useRef, useMemo } = React;

/* ============================================================
   QUATTRO EXPERTISE — 20 JAAR — Wrapped-style story experience
   ============================================================ */

const COLORS = {
  turqDark: '#3b8185',
  turqMed: '#78adb5',
  turqLight: '#b9d8d9',
  red: '#d41e35',
  redDark: '#a90f21',
  navy: '#032c4f',
  white: '#ffffff',
  signalGreen: '#3ebe53',
  signalBlue: '#177cf2',
  signalYellow: '#e7c812',
  signalOrange: '#de811e'
};

// Real numbers from Projecten-2026-05-13.xlsx + Gebruikers-2026-05-18.xlsx
// Projecten: alleen status "in behandeling" + "afgerond" (offertes/afgebroken uitgesloten)
const STATS = {
  totalProjects: 15439,
  totalClients: 2940,
  uniqueLocations: 1819,
  bewonersKopie: 16954,
  onlineAfspraken: 9408,
  totalOmzet: 28984681,
  // Headcount snapshot — derived from Gebruikers export (valid_from / valid_to per persoon)
  headcountToday: 60,
  headcountFounding: 16, // 16 huidige collega's werkten al vóór 2020 bij Quattro
  // Cumulatief actieve medewerkers op 31-12 van elk jaar (2026 = vandaag)
  headcountByYear: {
    2019: 16, 2020: 19, 2021: 24, 2022: 28, 2023: 34,
    2024: 42, 2025: 52, 2026: 60
  },
  // Mix from the website's "Quattro in cijfers" section
  fotos: 20880583,
  vooropnames: 438468,
  sensors: 449,
  claimsVoorkomen: 9720,
  claimkostenBespaard: 24300000,
  topProvinces: [
  ['Noord-Brabant', 4431],
  ['Zuid-Holland', 3838],
  ['Gelderland', 1195],
  ['Zeeland', 1176],
  ['Noord-Holland', 949],
  ['Utrecht', 914],
  ['Limburg', 793]],

  // Top opdrachtgevers — telt alleen projecten met status "in behandeling" + "afgerond"
  topClientsList: [
  { rank: '#1', name: 'Gemeente Rotterdam', n: 281 },
  { rank: '#2', name: 'Adex Projecten B.V.', n: 240 },
  { rank: '#3', name: 'Van Vulpen B.V.', n: 172 }],

  // Extra trouwe opdrachtgevers (rang 4 t/m 15) — voor de langere lijst
  moreClientsList: [
  { rank: '4', name: 'Aannemingsbedrijf Schouls B.V.', n: 158 },
  { rank: '5', name: 'Maas-Jacobs Bouwbedrijf B.V.', n: 146 },
  { rank: '6', name: 'A. van Liempd Sloopbedrijf B.V.', n: 133 },
  { rank: '7', name: 'Gemeente Vlissingen', n: 132 },
  { rank: '8', name: 'Gemeente Tilburg', n: 127 },
  { rank: '9', name: 'Spexs inspectie & expertise', n: 125 },
  { rank: '10', name: 'Heezen Sloopwerken B.V.', n: 107 },
  { rank: '11', name: 'GKB Realisatie B.V.', n: 89 },
  { rank: '12', name: 'Maton de Rooy B.V.', n: 88 },
  { rank: '13', name: 'Ekal Funderingsexpertise', n: 84 },
  { rank: '14', name: 'Gemeente Terneuzen', n: 83 },
  { rank: '15', name: 'Waterschap Scheldestromen', n: 83 }],

  // Projecten per startjaar — alleen status in behandeling + afgerond
  byYear: {
    2006: 144, 2007: 209, 2008: 324, 2009: 350, 2010: 373,
    2011: 461, 2012: 431, 2013: 475, 2014: 496, 2015: 604,
    2016: 661, 2017: 732, 2018: 830, 2019: 776, 2020: 861,
    2021: 1216, 2022: 1174, 2023: 1235, 2024: 1538, 2025: 1808
  }
};

/* ----- helpers ----- */

const fmtNL = (n) => n.toLocaleString('nl-NL');

function useCountUp(target, duration = 1400, run = true) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) {setV(0);return;}
    let start = null;
    let raf;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      // easeOutCubic
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, run]);
  return v;
}

/* ====== Logo — official Quattro Q-mark (PNG) ====== */
function QLogo({ size = 36 }) {
  return (
    <img
      src="images/q-logo.png"
      alt="Quattro Expertise"
      width={size}
      height={size}
      style={{ display: 'block', objectFit: 'contain' }} />);


}

/* =============== SLIDES =============== */

function SlideIntro({ active }) {
  return (
    <div className="slide" style={{ background: `linear-gradient(160deg, ${COLORS.navy} 0%, #07406e 100%)`, color: 'white' }}>
      <div className="intro-logo-row">
        <img src="images/q-logo.png" alt="Quattro" className="intro-logo-q" />
        <span className="intro-logo-word">QUATTRO <span style={{ fontWeight: 800 }}>EXPERTISE</span></span>
      </div>
      <div className="intro-stack">
        <div className={`intro-label ${active ? 'show' : ''}`}>2006 / 2026</div>
        <div className={`intro-big ${active ? 'show' : ''}`}>
          <div className="intro-big-row">20</div>
          <div className="intro-big-sub">jaar<br /><span className="hashtag">#schadeloosbouwen</span></div>
        </div>
        <div className={`intro-foot ${active ? 'show' : ''}`}>
          Een terugblik op alles wat we samen<br />met jullie hebben opgenomen, gemonitord en uitgekeerd.
        </div>
      </div>
      <div className="intro-corner-img" aria-hidden>
        <img src="images/key-visual.png" alt="" />
      </div>
    </div>);

}

function SlideOrigin({ active }) {
  return (
    <div className="slide" style={{ background: COLORS.white, color: COLORS.navy }}>
      <div className="origin-year">
        <span className="num-2">2</span>
        <span className="num-0">0</span>
        <span className="num-0b">0</span>
        <span className="num-6">6</span>
      </div>
      <div className="origin-copy">
        <div className="kicker" style={{ color: COLORS.red }}>Het begon zo</div>
        <h2>Vier jonge<br />mannen.<br />Eén idee.</h2>
        <p>
          Memorecordertje, fotocamera, een secretaresse die alles uittypte. De vier
          zagen: dit kan digitaler, sneller, slimmer. En zo richtten ze als eersten
          in Nederland de digitale bouwkundige vooropname in.
        </p>
        <p className="quote">
          “Quattro Expertise is een feit.”
        </p>
      </div>
      <div className="origin-illo">
        <img src="images/team-bewoners.png" alt="Vier oprichters" />
      </div>
    </div>);

}

function SlideBigNumber({ active }) {
  const n = useCountUp(STATS.totalProjects, 2200, active);
  return (
    <div className="slide" style={{ background: COLORS.turqDark, color: 'white' }}>
      <div className="corner-illo br" aria-hidden><img src="images/icon-avalon.png" alt="" /></div>
      <div className="bn-kicker">Sindsdien…</div>
      <div className="bn-number">{fmtNL(n)}</div>
      <div className="bn-label">projecten uitgevoerd</div>
      <div className="bn-sub" style={{ maxWidth: 240, position: 'relative', zIndex: 2 }}>
        Van een rij eengezinswoningen tot snelwegen, sluizen en stationsgebieden.
        Elk project: een belofte aan de omgeving.
      </div>
      <div className="bn-footer-bar" />
    </div>);

}

function SlideLocations({ active }) {
  const n = useCountUp(STATS.uniqueLocations, 1800, active);
  return (
    <div className="slide" style={{ background: COLORS.turqLight, color: COLORS.navy }}>
      <div className="loc-illo">
        <img src="images/diensten.png" alt="" />
      </div>
      <div className="loc-stack">
        <div className="kicker" style={{ color: COLORS.red }}>Van noord tot zuid</div>
        <div className="loc-number">{fmtNL(n)}</div>
        <h3>unieke locaties</h3>
        <p>
          Bijna elke straat in Nederland heeft een Quattro-camera gezien.
          En vanaf 2023 ook in België.
        </p>
      </div>
    </div>);

}

function SlideBrabant({ active }) {
  // Stacked bars of provinces
  const max = STATS.topProvinces[0][1];
  return (
    <div className="slide" style={{ background: COLORS.navy, color: 'white' }}>
      <div className="prov-map" aria-hidden>
        <img src="images/map-nl-be.png" alt="" />
      </div>
      <div className="kicker" style={{ color: COLORS.turqLight }}>Jouw provincie bovenaan?</div>
      <h2 className="prov-title">Brabant gaat<br />met de eer<br />strijken.</h2>
      <div className="prov-list">
        {STATS.topProvinces.map(([name, val], i) =>
        <div className="prov-row" key={name}>
            <div className="prov-name">{i + 1}. {name}</div>
            <div className="prov-bar-wrap">
              <div
              className="prov-bar"
              style={{
                width: active ? `${val / max * 100}%` : '0%',
                background: i === 0 ? COLORS.red : COLORS.turqMed,
                transitionDelay: `${0.15 + i * 0.08}s`
              }} />
            
            </div>
            <div className="prov-val">{fmtNL(val)}</div>
          </div>
        )}
      </div>
      <div className="prov-foot">4.431 projecten in Noord-Brabant. Meer dan welke andere provincie ook.</div>
    </div>);

}

function SlideClients({ active }) {
  const n = useCountUp(STATS.totalClients, 2000, active);
  const top3 = [
  { rank: '#1', name: 'Gemeente Rotterdam', n: 281, color: COLORS.red },
  { rank: '#2', name: 'Adex Projecten B.V.', n: 240, color: COLORS.turqDark },
  { rank: '#3', name: 'Van Vulpen B.V.', n: 172, color: COLORS.navy }];

  return (
    <div className="slide slide-clients" style={{ background: COLORS.white, color: COLORS.navy }}>
      <div className="corner-illo" style={{ top: 74, right: 14, width: 84, height: 84, opacity: 0.9 }} aria-hidden><img src="images/icon-directelijnen.png" alt="" /></div>
      <div className="kicker" style={{ color: COLORS.red }}>Opdrachtgevers</div>
      <div className="clients-number">{fmtNL(n)}</div>
      <h3 className="clients-h3" style={{ marginTop: 0 }}>partijen vertrouwden ons hun project toe.</h3>

      <div className="clients-cards">
        {top3.map((c, i) =>
        <div className="client-card" key={c.name} style={{ borderColor: c.color, transitionDelay: `${0.15 + i * 0.08}s` }}>
            <div className="client-rank" style={{ color: c.color }}>{c.rank}</div>
            <div className="client-name">{c.name}</div>
            <div className="client-count">{c.n} projecten</div>
          </div>
        )}
      </div>

      <div className="clients-more-label">En ook deze opdrachtgevers bleven terugkomen</div>
      <div className="clients-more-list">
        {STATS.moreClientsList.map((c, i) =>
        <div
          className="client-row"
          key={c.name}
          style={{ transitionDelay: `${0.45 + i * 0.04}s` }}>
          
            <span className="client-row-rank">{c.rank}</span>
            <span className="client-row-name">{c.name}</span>
            <span className="client-row-count">{c.n}</span>
          </div>
        )}
      </div>

      <div className="clients-foot">Aannemers, gemeenten, provincies, Rijkswaterstaat, omgevingsmanagers. Allemaal.</div>
    </div>);

}

function SlideBewoners({ active }) {
  const n = useCountUp(STATS.bewonersKopie, 2400, active);
  return (
    <div className="slide" style={{ background: COLORS.turqMed, color: 'white' }}>
      <div className="kicker" style={{ color: 'white', opacity: 0.85 }}>En voor de buren</div>
      <h2 className="bew-title">{fmtNL(n)}<br />bewonerskopieën</h2>
      <p className="bew-sub">
        Want een bouwkundige vooropname is niet alleen voor de opdrachtgever.
        Bewoners verdienen ook rust en inzicht.
      </p>
      <div className="bew-illo">
        <img src="images/bewoners.png" alt="" />
      </div>
      <div className="bew-tag">#schadeloosbouwen</div>
    </div>);

}

function SlideGrowth({ active }) {
  // Line chart per jaar
  const years = Object.keys(STATS.byYear).map(Number).sort();
  const vals = years.map((y) => STATS.byYear[y]);
  const maxV = Math.max(...vals);
  // viewBox is generous so year labels above + value labels below the line stay inside
  const W = 320,H = 230,padX = 16,padTop = 24,padBottom = 30;
  const stepX = (W - padX * 2) / (years.length - 1);

  const points = vals.map((v, i) => {
    const x = padX + i * stepX;
    const y = H - padBottom - v / maxV * (H - padTop - padBottom);
    return [x, y];
  });
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const areaD = pathD + ` L${points[points.length - 1][0]},${H - padBottom} L${points[0][0]},${H - padBottom} Z`;

  const labelYears = [2006, 2012, 2018, 2025];

  return (
    <div className="slide" style={{ background: COLORS.white, color: COLORS.navy }}>
      <div className="kicker" style={{ color: COLORS.red }}>Van 144 naar 1.800+ per jaar</div>
      <h3 className="grow-title">We zijn een<br />tikkeltje opgeschaald.</h3>

      <div className="grow-chart-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="grow-chart" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.turqDark} stopOpacity="0.55" />
              <stop offset="100%" stopColor={COLORS.turqDark} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* baseline */}
          <line x1={padX} x2={W - padX} y1={H - padBottom} y2={H - padBottom}
          stroke={COLORS.navy} strokeOpacity="0.15" strokeWidth="1" />
          <path d={areaD} fill="url(#areaFill)" className={active ? 'grow-area show' : 'grow-area'} />
          <path d={pathD} fill="none" stroke={COLORS.navy} strokeWidth="2.5" strokeLinejoin="round"
          className={active ? 'grow-line show' : 'grow-line'} />
          {points.map((p, i) => {
            const y = years[i];
            if (!labelYears.includes(y)) return null;
            return (
              <g key={y}>
                <circle cx={p[0]} cy={p[1]} r="4.5" fill={COLORS.red} stroke="white" strokeWidth="1.5" />
                <text x={p[0]} y={p[1] - 11} fontSize="11" textAnchor="middle" fill={COLORS.navy} fontWeight="800">
                  {fmtNL(STATS.byYear[y])}
                </text>
                <text x={p[0]} y={H - padBottom + 16} fontSize="11" textAnchor="middle" fill={COLORS.turqDark} fontWeight="700">
                  {y}
                </text>
              </g>);

          })}
        </svg>
      </div>

      <div className="grow-pair">
        <div className="grow-stat">
          <div className="grow-stat-num">12,5×</div>
          <div className="grow-stat-lbl">zoveel projecten<br />per jaar als in 2006</div>
        </div>
        <div className="grow-stat">
          <div className="grow-stat-num" style={{ color: COLORS.red }}>1.808</div>
          <div className="grow-stat-lbl">projecten in 2025<br />(record)</div>
        </div>
      </div>
    </div>);

}

function SlideTeam({ active }) {
  // Real data uit Gebruikers-export — cumulatief actieve medewerkers per jaareinde.
  // 16 huidige collega's waren al vóór 2020 in dienst; vanaf 2020 zijn de echte
  // valid_from-data nauwkeurig vastgelegd.
  const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const labels = ["≤'19", "'20", "'21", "'22", "'23", "'24", "'25", 'nu'];
  const counts = [16, 19, 24, 28, 34, 42, 52, 60];
  const maxV = Math.max(...counts);

  return (
    <div className="slide" style={{ background: COLORS.navy, color: 'white' }}>
      <div className="kicker" style={{ color: COLORS.turqLight }}>Het team</div>
      <h3 className="team-title">Van <span style={{ color: COLORS.red }}>16</span> naar <span style={{ color: COLORS.red }}>60</span> collega&apos;s.</h3>
      <div className="team-sub">16 trouwe gezichten van vóór 2020. Daarna ging het hard.</div>

      <div className="team-chart">
        {counts.map((c, i) => {
          const pct = c / maxV * 100;
          const isCur = i === counts.length - 1;
          return (
            <div className="team-bar-col" key={years[i]}>
              <div className="team-bar-val">{c}</div>
              <div
                className={`team-bar ${isCur ? 'cur' : ''}`}
                style={{
                  height: active ? `${pct}%` : '0%',
                  transitionDelay: `${0.15 + i * 0.08}s`
                }} />
              
            </div>);

        })}
      </div>
      <div className="team-x-row">
        {labels.map((l, i) =>
        <div className={`team-x-cell ${i === labels.length - 1 ? 'now' : ''}`} key={i}>
            {l}
          </div>
        )}
      </div>

      <div className="team-foot">
        Tussen 2020 en vandaag verdrievoudigden we. <strong>+44 collega&apos;s</strong> in zes jaar. Opname-experts, monitoring-specialisten, adviseurs en planners.
      </div>
    </div>);

}

function SlideTeamPhoto({ active }) {
  return (
    <div className="slide photo-slide" style={{ background: `linear-gradient(165deg, ${COLORS.navy} 0%, #07406e 45%, ${COLORS.turqDark} 100%)` }}>
      <div className="photo-bg">
        <img src="images/team-photo.png" alt="Het Quattro team" />
      </div>
      <div className="photo-tl">
        <div className="photo-kicker">Anno 2026</div>
      </div>
      <div className="photo-bl">
        <div className="photo-headline">Dit is <strong>Quattro</strong><br />vandaag.</div>
        <div className="photo-row">
          <div className="photo-stat">
            <div className="n">60</div>
            <div className="l">collega&apos;s</div>
          </div>
          <div className="photo-stat">
            <div className="n">2</div>
            <div className="l">kantoren<br />(Oosterhout &amp; Zwolle)</div>
          </div>
          <div className="photo-stat">
            <div className="n">1</div>
            <div className="l">missie:<br />#schadeloosbouwen</div>
          </div>
        </div>
      </div>
    </div>);

}

function SlideCijfers({ active }) {
  return (
    <div className="slide" style={{ background: COLORS.white, color: COLORS.navy }}>
      <div className="corner-illo br-sm" style={{ opacity: 0.95, bottom: 18, right: 14 }} aria-hidden><img src="images/icon-bigdata.png" alt="" /></div>
      <div className="cijfers-kicker">Quattro in cijfers</div>
      <h2 className="cijfers-title">20 jaar<br />op één pagina.</h2>

      <div className="cijfers-grid">
        <div className="cijfers-cell">
          <div className="cijfers-num accent">20,9 mln</div>
          <div className="cijfers-lbl">foto&apos;s gemaakt</div>
        </div>
        <div className="cijfers-cell">
          <div className="cijfers-num">{fmtNL(STATS.vooropnames)}</div>
          <div className="cijfers-lbl">vooropnames<br />uitgevoerd</div>
        </div>
        <div className="cijfers-cell">
          <div className="cijfers-num">{STATS.sensors}</div>
          <div className="cijfers-lbl">sensors nu live</div>
        </div>
        <div className="cijfers-cell">
          <div className="cijfers-num accent">{fmtNL(STATS.claimsVoorkomen)}</div>
          <div className="cijfers-lbl">claims voorkomen<br />per jaar</div>
        </div>
        <div className="cijfers-cell">
          <div className="cijfers-num">€24,3 mln</div>
          <div className="cijfers-lbl">claimkosten<br />bespaard per jaar</div>
        </div>
        <div className="cijfers-cell">
          <div className="cijfers-num accent">{STATS.headcountToday}</div>
          <div className="cijfers-lbl">medewerkers</div>
        </div>
      </div>

      <div className="cijfers-foot">
        Bron: ons eigen systeem, mei&nbsp;2026. Exclusief 1.2M+ documenten in de bewonerportalen.
      </div>
    </div>);

}

function SlideMonitoring({ active }) {
  return (
    <div className="slide" style={{ background: COLORS.turqLight, color: COLORS.navy }}>
      <div className="kicker" style={{ color: COLORS.red }}>2017. Alweer negen jaar geleden</div>
      <h2 className="mon-title">We begonnen<br />met monitoren<br />in real time.</h2>
      <p className="mon-sub">
        Trillingen, scheurvorming, zettingen. Continu inzicht in wat het bouwen
        écht met de omgeving doet.
      </p>
      <div className="mon-illo">
        <img src="images/monitoring.png" alt="" />
      </div>
      <div className="mon-quote">
        “Als het niet beweegt, dan gaat het ook niet stuk.”
        <div style={{ fontSize: 11, fontWeight: 500, opacity: 0.7, marginTop: 8, letterSpacing: 'normal' }}>onze stelregel sinds dag één</div>
      </div>
    </div>);

}

function SlideTopProject({ active }) {
  return (
    <div className="slide" style={{ background: COLORS.red, color: 'white' }}>
      <div className="corner-illo tr-sm" style={{ opacity: 0.95, top: 78, right: 14 }} aria-hidden><img src="images/icon-kwaliteit.png" alt="" /></div>
      <div className="kicker" style={{ color: 'white', opacity: 0.85 }}>En dan dit nog</div>
      <div className="tp-grid">
        <div className="tp-cell">
          <div className="tp-cell-num">9.408</div>
          <div className="tp-cell-lbl">online afspraken<br />met bewoners</div>
        </div>
        <div className="tp-cell">
          <div className="tp-cell-num">1.819</div>
          <div className="tp-cell-lbl">straten, dorpen<br />en steden</div>
        </div>
        <div className="tp-cell">
          <div className="tp-cell-num">60</div>
          <div className="tp-cell-lbl">collega's vandaag<br />(was: 4 in 2006)</div>
        </div>
        <div className="tp-cell">
          <div className="tp-cell-num">0</div>
          <div className="tp-cell-lbl">onterechte<br />schadeclaims*</div>
        </div>
      </div>
      <div className="tp-foot">*bij projecten waar wij de vooropname deden, uiteraard.</div>
    </div>);

}

function SlideOutro({ active, onShare, onReplay }) {
  return (
    <div className="slide" style={{ background: `linear-gradient(160deg, ${COLORS.navy} 0%, ${COLORS.turqDark} 100%)`, color: 'white' }}>
      <div className="outro-illo">
        <img src="images/icon-hart.png" alt="" />
      </div>
      <div className="outro-stack">
        <div className="outro-big">Bedankt.</div>
        <p className="outro-p">
          20 jaar geleden begonnen we met vier man, een zakcomputer en een fotocamera. Vandaag zijn we met 60, hebben 15.439 projecten op de teller en zijn we onderdeel van het Engius netwerk. De missie staat nog steeds: 

          <span className="hashtag">#schadeloosbouwen</span>.
        </p>
        <p className="outro-p" style={{ fontWeight: 700, color: COLORS.turqLight }}>
          Op naar de volgende 20.
        </p>
        <div className="outro-tag">#schadeloosbouwen · #doehetgoed</div>

        <div className="outro-buttons">
          <button className="btn-primary" onClick={onShare}>Deel op LinkedIn</button>
          <button className="btn-ghost" onClick={onReplay}>Opnieuw afspelen</button>
        </div>
      </div>
    </div>);

}

/* =============== HOST / STORY PLAYER =============== */

const SLIDES = [
{ id: 'intro', duration: 4500, render: (p) => <SlideIntro {...p} /> },
{ id: 'origin', duration: 6500, render: (p) => <SlideOrigin {...p} /> },
{ id: 'projects', duration: 5500, render: (p) => <SlideBigNumber {...p} /> },
{ id: 'locations', duration: 5500, render: (p) => <SlideLocations {...p} /> },
{ id: 'brabant', duration: 7000, render: (p) => <SlideBrabant {...p} /> },
{ id: 'clients', duration: 9000, render: (p) => <SlideClients {...p} /> },
{ id: 'bewoners', duration: 6000, render: (p) => <SlideBewoners {...p} /> },
{ id: 'growth', duration: 7000, render: (p) => <SlideGrowth {...p} /> },
{ id: 'team', duration: 7000, render: (p) => <SlideTeam {...p} /> },
{ id: 'teamphoto', duration: 6500, render: (p) => <SlideTeamPhoto {...p} /> },
{ id: 'monitoring', duration: 6000, render: (p) => <SlideMonitoring {...p} /> },
{ id: 'cijfers', duration: 7500, render: (p) => <SlideCijfers {...p} /> },
{ id: 'totals', duration: 6500, render: (p) => <SlideTopProject {...p} /> },
{ id: 'outro', duration: 99999, render: (p) => <SlideOutro {...p} /> }];


function Player() {
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1 within current slide
  const [paused, setPaused] = useState(false);
  const startRef = useRef(performance.now());
  const elapsedAtPauseRef = useRef(0);

  // advance loop
  useEffect(() => {
    let raf;
    startRef.current = performance.now() - elapsedAtPauseRef.current;
    const tick = (t) => {
      if (paused) {raf = requestAnimationFrame(tick);return;}
      const dt = t - startRef.current;
      const dur = SLIDES[idx].duration;
      const p = Math.min(1, dt / dur);
      setProgress(p);
      if (p >= 1) {
        if (idx < SLIDES.length - 1) {
          elapsedAtPauseRef.current = 0;
          setIdx(idx + 1);
        }
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [idx, paused]);

  // reset elapsed on slide change
  useEffect(() => {elapsedAtPauseRef.current = 0;setProgress(0);}, [idx]);

  const go = (delta) => {
    elapsedAtPauseRef.current = 0;
    setProgress(0);
    setIdx((i) => Math.max(0, Math.min(SLIDES.length - 1, i + delta)));
  };

  // keyboard nav
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight') go(1);else
      if (e.key === 'ArrowLeft') go(-1);else
      if (e.key === ' ') {e.preventDefault();setPaused((p) => !p);}
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // tap zones
  const onTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.3) go(-1);else
    if (x > rect.width * 0.7) go(1);else
    setPaused((p) => !p);
  };

  // long press to pause
  const pressTimer = useRef(null);
  const onPressStart = () => {
    pressTimer.current = setTimeout(() => setPaused(true), 250);
  };
  const onPressEnd = () => {
    if (pressTimer.current) {clearTimeout(pressTimer.current);pressTimer.current = null;}
    if (paused) setPaused(false);
  };

  const handleShare = () => {
    const url = window.location.href;
    const text = '20 jaar Quattro Expertise. Een terugblik op #schadeloosbouwen.';
    const linkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedIn, '_blank', 'noopener');
    if (navigator.share) {
      navigator.share({ title: '20 jaar Quattro Expertise', text, url }).catch(() => {});
    }
  };

  const handleReplay = () => {
    elapsedAtPauseRef.current = 0;
    setProgress(0);
    setIdx(0);
    setPaused(false);
  };

  return (
    <div className="frame">
      <div className="phone" data-screen-label={`${String(idx + 1).padStart(2, '0')} ${SLIDES[idx].id}`}>
        {/* notch */}
        <div className="notch" />

        {/* progress bars */}
        <div className="progress-row">
          {SLIDES.map((_, i) =>
          <div className="progress-cell" key={i}>
              <div
              className="progress-fill"
              style={{
                width: i < idx ? '100%' : i === idx ? `${progress * 100}%` : '0%'
              }} />
            
            </div>
          )}
        </div>

        {/* top bar */}
        <div className="top-bar">
          <div className="top-left">
            <span className="top-logo-chip"><img src="images/q-logo.png" alt="Quattro" /></span>
            <span className="top-label">Quattro Expertise · 20 jaar</span>
          </div>
          <button className="top-x" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Hervat' : 'Pauze'}>
            {paused ?
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 2 L12 7 L3 12 Z" fill="white" /></svg> :
            <svg width="14" height="14" viewBox="0 0 14 14"><rect x="3" y="2" width="3" height="10" fill="white" /><rect x="8" y="2" width="3" height="10" fill="white" /></svg>}
          </button>
        </div>

        {/* slide stack */}
        <div className="slide-stage"
        onClick={onTap}
        onMouseDown={onPressStart}
        onMouseUp={onPressEnd}
        onMouseLeave={onPressEnd}
        onTouchStart={onPressStart}
        onTouchEnd={onPressEnd}>
          {SLIDES.map((s, i) =>
          <div
            key={s.id}
            className={`slide-wrap ${i === idx ? 'active' : ''}`}
            style={{ pointerEvents: i === idx ? 'auto' : 'none' }}>
            
              {s.render({ active: i === idx, onShare: handleShare, onReplay: handleReplay })}
            </div>
          )}
        </div>
      </div>

      {/* outside hints */}
      <div className="hint">
        <div className="hint-row">
          20 jaar <span className="hashtag" style={{ color: '#d41e35' }}>#schadeloosbouwen</span> &middot; 2006 — 2026
        </div>
      </div>
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<Player />);