import type { TyreStrategy } from '../types';

// Auto-extracted from original App.jsx

export const TYRE_STRATEGIES: TyreStrategy[] = [
  {
    race: "2023 Bahrain GP", laps: 57,
    desc: "Classic two-stopper on a circuit that's hard on tyres. Medium-Hard-Hard was the dominant strategy.",
    compounds: { S: { color: "#e10600", label: "SOFT" }, M: { color: "#FFD700", label: "MEDIUM" }, H: { color: "#f0f0f0", label: "HARD" }, I: { color: "#4CAF50", label: "INTER" } },
    strategies: [
      { driver: "Verstappen (P1)", stints: [{ c:"M", laps:14 }, { c:"H", laps:22 }, { c:"H", laps:21 }] },
      { driver: "Pérez (P2)", stints: [{ c:"M", laps:16 }, { c:"H", laps:19 }, { c:"H", laps:22 }] },
      { driver: "Alonso (P3)", stints: [{ c:"M", laps:13 }, { c:"H", laps:24 }, { c:"H", laps:20 }] },
      { driver: "Sainz (P4)", stints: [{ c:"M", laps:13 }, { c:"H", laps:20 }, { c:"H", laps:24 }] },
    ],
  },
  {
    race: "2021 Abu Dhabi GP", laps: 58,
    desc: "The race that decided the championship on the final lap. Verstappen switched to Softs late — Hamilton stayed out. The late safety car changed everything.",
    compounds: { S: { color: "#e10600", label: "SOFT" }, M: { color: "#FFD700", label: "MEDIUM" }, H: { color: "#f0f0f0", label: "HARD" } },
    strategies: [
      { driver: "Verstappen (P1)", stints: [{ c:"M", laps:14 }, { c:"H", laps:26 }, { c:"S", laps:18 }] },
      { driver: "Hamilton (P2)", stints: [{ c:"M", laps:14 }, { c:"H", laps:44 }] },
      { driver: "Leclerc (P3)", stints: [{ c:"H", laps:25 }, { c:"M", laps:33 }] },
      { driver: "Sainz (P5)", stints: [{ c:"M", laps:14 }, { c:"H", laps:27 }, { c:"S", laps:17 }] },
    ],
  },
  {
    race: "2022 Monaco GP", laps: 78,
    desc: "Monaco almost always produces a one-stop race — overtaking is nearly impossible so track position is everything. Tyre choice at the start defines your race.",
    compounds: { S: { color: "#e10600", label: "SOFT" }, M: { color: "#FFD700", label: "MEDIUM" }, H: { color: "#f0f0f0", label: "HARD" }, I: { color: "#4CAF50", label: "INTER" }, W: { color: "#3399ff", label: "WET" } },
    strategies: [
      { driver: "Pérez (P1)", stints: [{ c:"I", laps:8 }, { c:"M", laps:40 }, { c:"H", laps:30 }] },
      { driver: "Alonso (P2)", stints: [{ c:"I", laps:8 }, { c:"M", laps:42 }, { c:"H", laps:28 }] },
      { driver: "Leclerc (DNS)", stints: [{ c:"I", laps:1 }] },
      { driver: "Sainz (P3)", stints: [{ c:"I", laps:8 }, { c:"M", laps:39 }, { c:"H", laps:31 }] },
    ],
  },
  {
    race: "2024 British GP", laps: 52,
    desc: "Silverstone's weather unpredictability made this a strategic masterclass. Teams juggled between inters and slicks as the track dried.",
    compounds: { S: { color: "#e10600", label: "SOFT" }, M: { color: "#FFD700", label: "MEDIUM" }, H: { color: "#f0f0f0", label: "HARD" }, I: { color: "#4CAF50", label: "INTER" } },
    strategies: [
      { driver: "Hamilton (P1)", stints: [{ c:"I", laps:5 }, { c:"M", laps:15 }, { c:"H", laps:12 }, { c:"S", laps:20 }] },
      { driver: "Verstappen (P5)", stints: [{ c:"I", laps:6 }, { c:"H", laps:18 }, { c:"M", laps:28 }] },
      { driver: "Norris (P2)", stints: [{ c:"I", laps:5 }, { c:"M", laps:17 }, { c:"S", laps:30 }] },
      { driver: "Piastri (P3)", stints: [{ c:"I", laps:5 }, { c:"M", laps:16 }, { c:"H", laps:31 }] },
    ],
  },
];

