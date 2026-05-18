import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Line,
  Area,
  ComposedChart
} from "recharts";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const PALETTE = {
  olive: "#6b7a3a",
  oliveLight: "#8a9b54",
  brown: "#8a5a35",
  gold: "#c9a35a",
  blue: "#5d7a8a",
  terracotta: "#a85a40",
  text: "#2c2419",
  muted: "#6b6256",
  grid: "#e6dcc6"
};

// Colors for dice ratings 1..6 — chosen to be distinct so the
// distribution shape per member is easy to read.
const DICE_COLORS = [
  "#c46a5e", // 1 — warm red
  "#d49f5a", // 2 — gold/orange
  "#b8b045", // 3 — yellow-olive
  "#6b9b54", // 4 — green
  "#7a5a9b", // 5 — purple
  "#5a8aa8"  // 6 — blue
];

const tooltipStyle = {
  background: "#faf5e8",
  border: "1px solid #e6dcc6",
  borderRadius: 8,
  padding: "8px 12px",
  fontSize: 13,
  color: PALETTE.text,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
};

// Map book-data country names to TopoJSON country names where they differ
const COUNTRY_NAME_FIX = {
  US: "United States of America"
};

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function avgPagesPerMember(books) {
  const acc = new Map();
  for (const b of books) {
    const m = acc.get(b.chosenBy) ?? { sider: 0, antall: 0 };
    m.sider += b.pages;
    m.antall += 1;
    acc.set(b.chosenBy, m);
  }
  return [...acc.entries()]
    .map(([name, { sider, antall }]) => ({
      name,
      verdi: Math.round(sider / antall)
    }))
    .sort((a, b) => b.verdi - a.verdi);
}

function booksByDecade(books) {
  const acc = new Map();
  for (const b of books) {
    const decade = Math.floor(b.published / 10) * 10;
    acc.set(decade, (acc.get(decade) ?? 0) + 1);
  }
  const decades = [...acc.keys()].sort((a, b) => a - b);
  const min = decades[0];
  const max = decades[decades.length - 1];
  const out = [];
  for (let d = min; d <= max; d += 10) {
    out.push({ name: `${d}-tallet`, verdi: acc.get(d) ?? 0 });
  }
  return out;
}

// Returns rows shaped for a grouped bar chart:
// one row per member with keys "1".."6" holding counts.
function diceDistributionPerMember(books) {
  const acc = new Map();
  for (const book of books) {
    for (const t of book.terningkastene) {
      if (t.terningkast < 1 || t.terningkast > 6) continue;
      const row = acc.get(t.medlem) ?? { name: t.medlem, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      row[t.terningkast] += 1;
      acc.set(t.medlem, row);
    }
  }
  return [...acc.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function ratingsPerBook(books) {
  return books.map((b) => {
    const cast = b.terningkastene.map((t) => t.terningkast);
    const snitt = cast.reduce((s, t) => s + t, 0) / cast.length;
    return {
      name: b.title,
      snitt: Math.round(snitt * 10) / 10,
      min: Math.min(...cast),
      max: Math.max(...cast),
      range: [Math.min(...cast), Math.max(...cast)]
    };
  });
}

function booksByCountry(books) {
  const acc = new Map();
  for (const b of books) {
    const c = b.authorNationality || "Ukjent";
    acc.set(c, (acc.get(c) ?? 0) + 1);
  }
  return [...acc.entries()]
    .map(([name, verdi]) => ({ name, verdi }))
    .sort((a, b) => b.verdi - a.verdi);
}

function ChartCard({ title, description, children, wide }) {
  return (
    <section className={`stat-card${wide ? " stat-card--wide" : ""}`}>
      <header className="stat-card-header">
        <h2 className="stat-card-title">{title}</h2>
        {description && <p className="stat-card-desc">{description}</p>}
      </header>
      <div className="stat-card-body">{children}</div>
    </section>
  );
}

function BooksMap({ countries }) {
  // Build a lookup keyed by TopoJSON-style country name
  const counts = useMemo(() => {
    const out = {};
    for (const { name, verdi } of countries) {
      const key = COUNTRY_NAME_FIX[name] ?? name;
      out[key] = verdi;
    }
    return out;
  }, [countries]);

  const maxCount = Math.max(1, ...countries.map((c) => c.verdi));

  const colorFor = (count) => {
    if (!count) return "#f0e8d4";
    const t = count / maxCount;
    // Interpolate from light olive to dark olive based on count
    const r = Math.round(232 - (232 - 107) * t);
    const g = Math.round(228 - (228 - 122) * t);
    const b = Math.round(180 - (180 - 58) * t);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="geo-wrap">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 165 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties.name;
              const count = counts[name] ?? 0;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorFor(count)}
                  stroke="#c9b48a"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: PALETTE.terracotta },
                    pressed: { outline: "none" }
                  }}
                >
                  <title>
                    {count > 0 ? `${name}: ${count} bok${count === 1 ? "" : "er"}` : name}
                  </title>
                </Geography>
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}

export default function Statistics({ books }) {
  const pages = useMemo(() => avgPagesPerMember(books), [books]);
  const decades = useMemo(() => booksByDecade(books), [books]);
  const dice = useMemo(() => diceDistributionPerMember(books), [books]);
  const ratings = useMemo(() => ratingsPerBook(books), [books]);
  const countries = useMemo(() => booksByCountry(books), [books]);

  return (
    <div className="stats-grid">
      <ChartCard
        title="Gjennomsnittlig sider per medlem"
        description={`Antall bøker totalt: ${books.length}`}
      >
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={pages} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke={PALETTE.grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: PALETTE.muted, fontSize: 12 }} axisLine={{ stroke: PALETTE.grid }} tickLine={false} />
            <YAxis tick={{ fill: PALETTE.muted, fontSize: 12 }} axisLine={{ stroke: PALETTE.grid }} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(107,122,58,0.08)" }} />
            <Bar dataKey="verdi" name="Sider" fill={PALETTE.olive} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Bøker per tiår" description="Når ble bøkene utgitt?">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={decades} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke={PALETTE.grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: PALETTE.muted, fontSize: 11 }} axisLine={{ stroke: PALETTE.grid }} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: PALETTE.muted, fontSize: 12 }} axisLine={{ stroke: PALETTE.grid }} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(107,122,58,0.08)" }} />
            <Bar dataKey="verdi" name="Bøker" fill={PALETTE.brown} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Terningkast-fordeling per medlem"
        description="Seks søyler per medlem viser hvor ofte de gir hvert kast 1–6"
        wide
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={dice} margin={{ top: 10, right: 24, bottom: 10, left: 0 }} barCategoryGap="18%">
            <CartesianGrid stroke={PALETTE.grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: PALETTE.muted, fontSize: 12 }} axisLine={{ stroke: PALETTE.grid }} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: PALETTE.muted, fontSize: 12 }} axisLine={{ stroke: PALETTE.grid }} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(107,122,58,0.06)" }} />
            <Legend wrapperStyle={{ fontSize: 12, color: PALETTE.muted }} />
            {[1, 2, 3, 4, 5, 6].map((d) => (
              <Bar key={d} dataKey={d} name={`${d}er`} fill={DICE_COLORS[d - 1]} radius={[3, 3, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Bøker per land — kart"
        description="Hold musepekeren over et land for å se antall"
      >
        <BooksMap countries={countries} />
      </ChartCard>

      <ChartCard
        title="Bøker per land — rangering"
        description="Forfatterens nasjonalitet"
      >
        <ResponsiveContainer width="100%" height={Math.max(220, countries.length * 24 + 40)}>
          <BarChart data={countries} layout="vertical" margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke={PALETTE.grid} horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fill: PALETTE.muted, fontSize: 12 }} axisLine={{ stroke: PALETTE.grid }} tickLine={false} />
            <YAxis type="category" dataKey="name" width={120} tick={{ fill: PALETTE.muted, fontSize: 12 }} axisLine={{ stroke: PALETTE.grid }} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(107,122,58,0.08)" }} />
            <Bar dataKey="verdi" name="Bøker" fill={PALETTE.terracotta} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Terningkast per bok"
        description="Snitt + spennvidde mellom høyeste og laveste kast"
        wide
      >
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={ratings} margin={{ top: 10, right: 16, bottom: 70, left: 0 }}>
            <CartesianGrid stroke={PALETTE.grid} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: PALETTE.muted, fontSize: 11 }}
              axisLine={{ stroke: PALETTE.grid }}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              interval={0}
              height={60}
            />
            <YAxis domain={[0.5, 6.5]} ticks={[1, 2, 3, 4, 5, 6]} tick={{ fill: PALETTE.muted, fontSize: 12 }} axisLine={{ stroke: PALETTE.grid }} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: PALETTE.olive, strokeDasharray: 3 }} />
            <Area
              type="monotone"
              dataKey="range"
              stroke="none"
              fill={PALETTE.olive}
              fillOpacity={0.18}
              name="Spennvidde"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="snitt"
              stroke={PALETTE.olive}
              strokeWidth={2}
              dot={{ r: 3, fill: PALETTE.olive }}
              name="Snitt"
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
