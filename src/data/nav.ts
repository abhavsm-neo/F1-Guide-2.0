import type { NavGroup, SearchResult } from '../types';
import { DRIVERS_2025 } from './drivers';
import { GLOSSARY } from './glossary';
import { RACE_CALENDAR_2026 } from './circuits';
import { F1_RULES } from './rules';
import { TEAMS_2026 } from './teams';

// Auto-extracted from original App.jsx

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Learn the Basics",
    sections: [
      { id: "how",          icon: "🏁", label: "How It Works",     desc: "Race weekends, qualifying, tyres & strategy" },
      { id: "points",       icon: "📊", label: "Points System",    desc: "How points are scored and championships decided" },
      { id: "rules",        icon: "📋", label: "Rules Explained",  desc: "Plain-English breakdowns of F1's confusing rules" },
      { id: "glossary",     icon: "📖", label: "Glossary",         desc: "Every F1 term defined — undercut, VSC, DRS & more" },
      { id: "tyrestrategy", icon: "🏎", label: "Tyre Strategy",    desc: "Interactive pit stop strategies from iconic races" },
      { id: "quiz",         icon: "🧠", label: "F1 Quiz",          desc: "Test your knowledge with 15 questions" },
      { id: "teamquiz",     icon: "🎯", label: "Which Team Are You?", desc: "8 personality questions to find your F1 team" },
    ]
  },
  {
    label: "2026 Season",
    sections: [
      { id: "preview",      icon: "🔭", label: "Season Preview",   desc: "Power rankings, race picks & rookie spotlights" },
      { id: "drivers",      icon: "🏎️", label: "Drivers",          desc: "All 22 drivers with ratings, stats & profiles" },
      { id: "teams",        icon: "🔧", label: "Teams",             desc: "All 11 constructors across 2025 & 2026" },
      { id: "history",      icon: "📅", label: "Driver Changes",    desc: "Every major move 2018–2026 and the reason why" },
      { id: "compare",      icon: "⚡", label: "Car Compare",       desc: "2025 vs 2026 regulations side by side" },
      { id: "drivercompare",icon: "🆚", label: "Driver Compare",    desc: "Pick two drivers — radar chart & stat breakdown" },
      { id: "predictor",    icon: "🔮", label: "Race Predictor",    desc: "Predict the top 10 & share your grid as an image" },
    ]
  },
  {
    label: "Race & Stats",
    sections: [
      { id: "circuits",     icon: "🗺️", label: "Circuit Guide",    desc: "All 22 circuits with maps, session times & calendar" },
      { id: "results",      icon: "🏆", label: "Live Results",      desc: "Race results, driver & constructor standings" },
      { id: "standings",    icon: "📊", label: "Live Standings",     desc: "Current 2026 driver & constructor championship standings" },
      { id: "championship", icon: "📈", label: "Championship Tracker", desc: "Round-by-round WDC battle for 2021–2024" },
      { id: "h2h",          icon: "⚔️", label: "Teammate H2H",      desc: "2024 qualifying & race head-to-head records" },
      { id: "records",      icon: "🎖️", label: "All-Time Records",  desc: "Most wins, poles, titles & fastest laps in history" },
      { id: "news",         icon: "📰", label: "F1 News",           desc: "Latest headlines from Motorsport.com" },
    ]
  },
];

export const SEARCH_INDEX: SearchResult[] = [
  // Drivers — full name, team, bio keywords
  ...DRIVERS_2025.map(d => ({
    type: "Driver", title: d.name, sub: `${d.team} · ${d.championships ? d.championships + "× Champion · " : ""}${d.wins} wins`,
    section: "drivers", icon: "🏎️", color: d.teamColor, extra: `#${d.number}`
  })),
  // Glossary — full definition searchable
  ...GLOSSARY.map(g => ({
    type: "Term", title: g.term, sub: g.def.slice(0, 80) + "…",
    section: "glossary", icon: "📖", color: g.catColor || "#e10600",
    keywords: g.def.toLowerCase()
  })),
  // Circuits — name, circuit, description, tags all searchable
  ...RACE_CALENDAR_2026.map(r => ({
    type: "Circuit", title: r.name, sub: `${r.circuit} · Round ${r.round} · ${r.length}`,
    section: "circuits", icon: "🗺️", color: "#00dc78", extra: r.flag,
    keywords: (r.desc + " " + r.tags.join(" ")).toLowerCase()
  })),
  // Rules — title and plain text searchable
  ...F1_RULES.map(rule => ({
    type: "Rule", title: rule.title, sub: rule.plain.slice(0, 80) + "…",
    section: "rules", icon: rule.icon, color: "#FFD700",
    keywords: (rule.plain + " " + rule.example).toLowerCase()
  })),
  // Teams
  ...TEAMS_2026.map(t => ({
    type: "Team", title: t.name, sub: `${t.engine} · ${t.drivers.join(" & ")}`,
    section: "teams", icon: "🔧", color: t.color,
    keywords: (t.desc + " " + t.engineNote).toLowerCase()
  })),
  // Sections
  { type: "Section", title: "How F1 Works", sub: "Race weekends, qualifying, tyres & strategy", section: "how", icon: "🏁", color: "#e10600" },
  { type: "Section", title: "Points System", sub: "How points are scored & championships decided", section: "points", icon: "📊", color: "#e10600" },
  { type: "Section", title: "Driver Compare", sub: "Radar chart — pick any two drivers head-to-head", section: "drivercompare", icon: "🆚", color: "#FF8000" },
  { type: "Section", title: "Championship Tracker", sub: "Round-by-round WDC battle 2021–2024", section: "championship", icon: "📈", color: "#3671C6" },
  { type: "Section", title: "Tyre Strategy", sub: "Pit stop strategies from iconic races visualised", section: "tyrestrategy", icon: "🏎", color: "#FFD700" },
  { type: "Section", title: "Which Team Are You?", sub: "8 personality questions to find your F1 team", section: "teamquiz", icon: "🎯", color: "#229971" },
  { type: "Section", title: "Teammate H2H", sub: "2024 qualifying & race head-to-head records", section: "h2h", icon: "⚔️", color: "#9966FF" },
  { type: "Section", title: "Race Predictor", sub: "Build & share your predicted top 10 grid", section: "predictor", icon: "🔮", color: "#e10600" },
  { type: "Section", title: "F1 Quiz", sub: "15 questions to test your knowledge", section: "quiz", icon: "🧠", color: "#27F4D2" },
  { type: "Section", title: "Live Results", sub: "Race results, driver & constructor standings", section: "results", icon: "🏆", color: "#FFD700" },
  { type: "Section", title: "Live Standings", sub: "Current 2026 driver & constructor championship standings", section: "standings", icon: "📊", color: "#e10600" },
  { type: "Section", title: "All-Time Records", sub: "Most wins, poles, titles & fastest laps in history", section: "records", icon: "🎖️", color: "#cd7f32" },
  { type: "Section", title: "2026 Season Preview", sub: "Power rankings, race previews & rookie spotlights", section: "preview", icon: "🔭", color: "#e10600" },
  { type: "Section", title: "F1 News", sub: "Latest headlines from Motorsport.com", section: "news", icon: "📰", color: "#00dc78" },
  { type: "Section", title: "Driver Changes", sub: "Every major move 2018–2026 explained", section: "history", icon: "📅", color: "#606080" },
  { type: "Section", title: "Car Compare 2025 vs 2026", sub: "Technical regulation changes side by side", section: "compare", icon: "⚡", color: "#e10600" },
];

export const MOBILE_QUICK_TABS = [
  { id: "home",      icon: "🏠", label: "Home" },
  { id: "drivers",   icon: "🏎️", label: "Drivers" },
  { id: "circuits",  icon: "🗺️", label: "Circuits" },
  { id: "preview",   icon: "🔭", label: "Preview" },
  { id: "__more__",  icon: "☰",  label: "More" },
];

export const TEAM_COLORS: Record<string, string> = {
  mercedes: "#27F4D2", ferrari: "#E8002D", "red bull racing": "#3671C6",
  mclaren: "#FF8000", "aston martin": "#229971", alpine: "#0093CC",
  williams: "#64C4FF", haas: "#B6BABD", "rb": "#6692FF",
  "racing bulls": "#6692FF", kick: "#52E252", sauber: "#52E252",
  "cadillac": "#CC0000", "audi": "#BB0A21",
};

