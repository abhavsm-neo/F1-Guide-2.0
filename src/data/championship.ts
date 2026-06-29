import type { ChampionshipSeason } from '../types';

// Auto-extracted from original App.jsx

export const CHAMPIONSHIP_SEASONS: Record<number, ChampionshipSeason> = {
  2021: {
    title: "The Greatest Season Ever?",
    drama: "Decided on final lap, final race",
    note: "Verstappen & Hamilton were tied going into Abu Dhabi. A controversial late safety car restart handed Verstappen the title on the last lap.",
    drivers: [
      { name: "Verstappen", short: "VER", color: "#3671C6", team: "Red Bull" },
      { name: "Hamilton", short: "HAM", color: "#27F4D2", team: "Mercedes" },
      { name: "Bottas", short: "BOT", color: "#00A6B4", team: "Mercedes" },
      { name: "Pérez", short: "PER", color: "#2060C0", team: "Red Bull" },
    ],
    rounds: [
      { label: "R1", points: [18, 25, 15, 0] },
      { label: "R5", points: [105, 94, 67, 40] },
      { label: "R10", points: [156, 177, 108, 90] },
      { label: "R15", points: [226, 221, 133, 120] },
      { label: "R18", points: [293, 287, 155, 149] },
      { label: "R21", points: [369, 369, 192, 183] },
      { label: "Final", points: [395, 387, 226, 190] },
    ],
  },
  2022: {
    title: "Ground Effect Revolution",
    drama: "Leclerc led, then Red Bull took over",
    note: "Ferrari started brilliantly but reliability failures gifted Verstappen the title. He won 15 of 22 races and broke the single-season wins record.",
    drivers: [
      { name: "Verstappen", short: "VER", color: "#3671C6", team: "Red Bull" },
      { name: "Leclerc", short: "LEC", color: "#E8002D", team: "Ferrari" },
      { name: "Pérez", short: "PER", color: "#2060C0", team: "Red Bull" },
      { name: "Russell", short: "RUS", color: "#27F4D2", team: "Mercedes" },
    ],
    rounds: [
      { label: "R1", points: [0, 26, 0, 4] },
      { label: "R5", points: [59, 104, 54, 28] },
      { label: "R10", points: [175, 138, 129, 84] },
      { label: "R14", points: [258, 178, 173, 111] },
      { label: "R18", points: [341, 235, 222, 158] },
      { label: "Final", points: [454, 308, 305, 275] },
    ],
  },
  2023: {
    title: "Verstappen Steamroller",
    drama: "Record 19 wins in a single season",
    note: "Red Bull won 21 of 22 races. Verstappen was in a class of his own — he even took pole and won at tracks Red Bull historically struggled at.",
    drivers: [
      { name: "Verstappen", short: "VER", color: "#3671C6", team: "Red Bull" },
      { name: "Pérez", short: "PER", color: "#2060C0", team: "Red Bull" },
      { name: "Alonso", short: "ALO", color: "#229971", team: "Aston Martin" },
      { name: "Hamilton", short: "HAM", color: "#27F4D2", team: "Mercedes" },
    ],
    rounds: [
      { label: "R1", points: [25, 16, 15, 18] },
      { label: "R5", points: [119, 84, 75, 44] },
      { label: "R10", points: [229, 150, 131, 111] },
      { label: "R15", points: [331, 189, 174, 158] },
      { label: "R20", points: [514, 240, 206, 194] },
      { label: "Final", points: [575, 285, 234, 234] },
    ],
  },
  2024: {
    title: "McLaren vs Red Bull",
    drama: "Norris pushed Verstappen to the limit",
    note: "Verstappen took his 4th title despite McLaren running the fastest car in the second half of the season. Norris cut a 119-point deficit to just 47 at one stage.",
    drivers: [
      { name: "Verstappen", short: "VER", color: "#3671C6", team: "Red Bull" },
      { name: "Norris", short: "NOR", color: "#FF8000", team: "McLaren" },
      { name: "Leclerc", short: "LEC", color: "#E8002D", team: "Ferrari" },
      { name: "Piastri", short: "PIA", color: "#FF6600", team: "McLaren" },
    ],
    rounds: [
      { label: "R1", points: [25, 2, 15, 8] },
      { label: "R5", points: [136, 62, 56, 39] },
      { label: "R10", points: [194, 131, 113, 81] },
      { label: "R15", points: [303, 241, 217, 179] },
      { label: "R20", points: [362, 331, 272, 222] },
      { label: "Final", points: [437, 374, 356, 292] },
    ],
  },
};

