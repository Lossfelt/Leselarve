import { useEffect, useMemo, useState, type ReactNode } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import countries110mUrl from "world-atlas/countries-110m.json?url";
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
import { feature } from "topojson-client";
import type { Book } from "../types.ts";

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
} as const;

// Colors for dice ratings 1..6 — chosen to be distinct so the
// distribution shape per member is easy to read.
const DICE_COLORS = [
  "#c46a5e",
  "#d49f5a",
  "#b8b045",
  "#6b9b54",
  "#7a5a9b",
  "#5a8aa8"
] as const;

const tooltipStyle = {
  background: "#faf5e8",
  border: "1px solid #e6dcc6",
  borderRadius: 8,
  padding: "8px 12px",
  fontSize: 13,
  color: PALETTE.text,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
} as const;

// Map book-data country names to TopoJSON country names where they differ
const COUNTRY_NAME_FIX: Record<string, string> = {
  US: "United States of America"
};

const GEO_URL = countries110mUrl;
const MAP_WIDTH = 800;
const MAP_HEIGHT = 380;

type MapFeature = {
  rsmKey: string;
  properties: {
    name?: string;
  };
  path: string | null;
};

type NamedValue = { name: string; verdi: number };

function avgPagesPerMember(books: Book[]): NamedValue[] {
  const acc = new Map<string, { sider: number; antall: number }>();
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

function booksByDecade(books: Book[]): NamedValue[] {
  const acc = new Map<number, number>();
  for (const b of books) {
    const decade = Math.floor(b.published / 10) * 10;
    acc.set(decade, (acc.get(decade) ?? 0) + 1);
  }
  const decades = [...acc.keys()].sort((a, b) => a - b);
  const min = decades[0];
  const max = decades[decades.length - 1];
  const out: NamedValue[] = [];
  for (let d = min; d <= max; d += 10) {
    out.push({ name: `${d}-tallet`, verdi: acc.get(d) ?? 0 });
  }
  return out;
}

type DiceRow = {
  name: string;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
};

function diceDistributionPerMember(books: Book[]): DiceRow[] {
  const acc = new Map<string, DiceRow>();
  for (const book of books) {
    for (const t of book.terningkastene) {
      if (t.terningkast < 1 || t.terningkast > 6) continue;
      const row = acc.get(t.medlem) ?? {
        name: t.medlem,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0
      };
      row[t.terningkast as 1 | 2 | 3 | 4 | 5 | 6] += 1;
      acc.set(t.medlem, row);
    }
  }
  return [...acc.values()].sort((a, b) => a.name.localeCompare(b.name));
}

type RatingRow = {
  name: string;
  snitt: number;
  min: number;
  max: number;
  range: [number, number];
};

function ratingsPerBook(books: Book[]): RatingRow[] {
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

function booksByCountry(books: Book[]): NamedValue[] {
  const acc = new Map<string, number>();
  for (const b of books) {
    const c = b.authorNationality || "Ukjent";
    acc.set(c, (acc.get(c) ?? 0) + 1);
  }
  return [...acc.entries()]
    .map(([name, verdi]) => ({ name, verdi }))
    .sort((a, b) => b.verdi - a.verdi);
}

type ChartCardProps = {
  title: string;
  description?: string;
  wide?: boolean;
  children: ReactNode;
};

function ChartCard({ title, description, children, wide }: ChartCardProps) {
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

function BooksMap({ countries }: { countries: NamedValue[] }) {
  const [geographies, setGeographies] = useState<MapFeature[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadGeographies() {
      try {
        const response = await fetch(GEO_URL);
        if (!response.ok) throw new Error(`Kunne ikke hente kartdata: ${response.status}`);

        const topology = (await response.json()) as {
          objects?: { countries?: unknown };
        };
        const countriesObject = topology.objects?.countries;
        if (!countriesObject) throw new Error("Fant ikke landdata i TopoJSON-filen");

        const collection = feature(topology as never, countriesObject as never) as unknown as {
          features?: Array<{
            id?: string | number;
            properties?: { name?: string };
          }>;
        };
        if (!collection.features) throw new Error("Kartdata kom ikke tilbake som en feature-samling");

        const projection = geoEqualEarth();
        projection.fitSize([MAP_WIDTH, MAP_HEIGHT], collection as never);
        const pathGenerator = geoPath(projection);

        const nextGeographies = collection.features.map((geo, index) => ({
          rsmKey: String(geo.id ?? index),
          properties: {
            name: geo.properties?.name
          },
          path: pathGenerator(geo as never)
        }));

        if (!cancelled) {
          setGeographies(nextGeographies);
          setLoadError(false);
        }
      } catch {
        if (!cancelled) {
          setLoadError(true);
        }
      }
    }

    void loadGeographies();

    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const { name, verdi } of countries) {
      const key = COUNTRY_NAME_FIX[name] ?? name;
      out[key] = verdi;
    }
    return out;
  }, [countries]);

  const maxCount = Math.max(1, ...countries.map((c) => c.verdi));

  const colorFor = (count: number): string => {
    if (!count) return "#f0e8d4";
    const t = count / maxCount;
    const r = Math.round(232 - (232 - 107) * t);
    const g = Math.round(228 - (228 - 122) * t);
    const b = Math.round(180 - (180 - 58) * t);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="geo-wrap">
      {loadError ? (
        <div className="stats-loading">Kunne ikke laste kartet.</div>
      ) : geographies.length === 0 ? (
        <div className="stats-loading">Laster kart...</div>
      ) : (
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          aria-label="Verdenskart over forfatternes nasjonaliteter"
        >
          {geographies.map((geo) => {
            const name = geo.properties.name ?? "Ukjent";
            const count = counts[name] ?? 0;
            return (
              <path
                key={geo.rsmKey}
                className="geo-country"
                d={geo.path ?? ""}
                fill={colorFor(count)}
                stroke="#c9b48a"
                strokeWidth={0.4}
              >
                <title>
                  {count > 0 ? `${name}: ${count} bok${count === 1 ? "" : "er"}` : name}
                </title>
              </path>
            );
          })}
        </svg>
      )}
    </div>
  );
}

type Props = {
  books: Book[];
};

export default function Statistics({ books }: Props) {
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
            <XAxis
              dataKey="name"
              tick={{ fill: PALETTE.muted, fontSize: 12 }}
              axisLine={{ stroke: PALETTE.grid }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: PALETTE.muted, fontSize: 12 }}
              axisLine={{ stroke: PALETTE.grid }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: "rgba(107,122,58,0.08)" }}
            />
            <Bar
              dataKey="verdi"
              name="Sider"
              fill={PALETTE.olive}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Bøker per tiår" description="Når ble bøkene utgitt?">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={decades} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
            <CartesianGrid stroke={PALETTE.grid} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: PALETTE.muted, fontSize: 11 }}
              axisLine={{ stroke: PALETTE.grid }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: PALETTE.muted, fontSize: 12 }}
              axisLine={{ stroke: PALETTE.grid }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: "rgba(107,122,58,0.08)" }}
            />
            <Bar
              dataKey="verdi"
              name="Bøker"
              fill={PALETTE.brown}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Terningkast-fordeling per medlem"
        description="Seks søyler per medlem viser hvor ofte de gir hvert kast 1–6"
        wide
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={dice}
            margin={{ top: 10, right: 24, bottom: 10, left: 0 }}
            barCategoryGap="18%"
          >
            <CartesianGrid stroke={PALETTE.grid} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: PALETTE.muted, fontSize: 12 }}
              axisLine={{ stroke: PALETTE.grid }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: PALETTE.muted, fontSize: 12 }}
              axisLine={{ stroke: PALETTE.grid }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: "rgba(107,122,58,0.06)" }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: PALETTE.muted }} />
            {[1, 2, 3, 4, 5, 6].map((d) => (
              <Bar
                key={d}
                dataKey={d}
                name={`${d}er`}
                fill={DICE_COLORS[d - 1]}
                radius={[3, 3, 0, 0]}
              />
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
        <ResponsiveContainer
          width="100%"
          height={Math.max(220, countries.length * 24 + 40)}
        >
          <BarChart
            data={countries}
            layout="vertical"
            margin={{ top: 10, right: 16, bottom: 10, left: 0 }}
          >
            <CartesianGrid stroke={PALETTE.grid} horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: PALETTE.muted, fontSize: 12 }}
              axisLine={{ stroke: PALETTE.grid }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fill: PALETTE.muted, fontSize: 12 }}
              axisLine={{ stroke: PALETTE.grid }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: "rgba(107,122,58,0.08)" }}
            />
            <Bar
              dataKey="verdi"
              name="Bøker"
              fill={PALETTE.terracotta}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Terningkast per bok"
        description="Snitt + spennvidde mellom høyeste og laveste kast"
        wide
      >
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart
            data={ratings}
            margin={{ top: 10, right: 16, bottom: 70, left: 0 }}
          >
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
            <YAxis
              domain={[0.5, 6.5]}
              ticks={[1, 2, 3, 4, 5, 6]}
              tick={{ fill: PALETTE.muted, fontSize: 12 }}
              axisLine={{ stroke: PALETTE.grid }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ stroke: PALETTE.olive, strokeDasharray: 3 }}
            />
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
