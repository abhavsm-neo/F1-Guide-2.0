import type { ChampionshipRecord, PointsRow, RecordCategory } from '../types';

// Auto-extracted from original App.jsx

export const CHAMPIONSHIP_HISTORY: ChampionshipRecord[] = [
  { year: 2018, driver: "Lewis Hamilton 🇬🇧", team2: "Mercedes" },
  { year: 2019, driver: "Lewis Hamilton 🇬🇧", team2: "Mercedes" },
  { year: 2020, driver: "Lewis Hamilton 🇬🇧", team2: "Mercedes" },
  { year: 2021, driver: "Max Verstappen 🇳🇱", team2: "Mercedes" },
  { year: 2022, driver: "Max Verstappen 🇳🇱", team2: "Red Bull Racing" },
  { year: 2023, driver: "Max Verstappen 🇳🇱", team2: "Red Bull Racing" },
  { year: 2024, driver: "Max Verstappen 🇳🇱", team2: "McLaren" },
];

export const ALL_TIME_RECORDS: RecordCategory[] = [
  {
    icon: "🏆", title: "Most Race Wins",
    rows: [
      { rank: 1, name: "Lewis Hamilton 🇬🇧", value: "103", note: "2007–present" },
      { rank: 2, name: "Michael Schumacher 🇩🇪", value: "91", note: "1991–2012" },
      { rank: 3, name: "Max Verstappen 🇳🇱", value: "62+", note: "2015–present" },
      { rank: 4, name: "Sebastian Vettel 🇩🇪", value: "53", note: "2007–2022" },
      { rank: 5, name: "Alain Prost 🇫🇷", value: "51", note: "1980–1993" },
    ]
  },
  {
    icon: "⭐", title: "Most Championships",
    rows: [
      { rank: 1, name: "Lewis Hamilton 🇬🇧", value: "7", note: "2008, 2014–2015, 2017–2020" },
      { rank: 1, name: "Michael Schumacher 🇩🇪", value: "7", note: "1994–1995, 2000–2004" },
      { rank: 3, name: "Max Verstappen 🇳🇱", value: "4", note: "2021–2024" },
      { rank: 3, name: "Alain Prost 🇫🇷", value: "4", note: "1985–1986, 1989, 1993" },
      { rank: 3, name: "Ayrton Senna 🇧🇷", value: "3", note: "1988, 1990–1991" },
    ]
  },
  {
    icon: "🎯", title: "Most Pole Positions",
    rows: [
      { rank: 1, name: "Lewis Hamilton 🇬🇧", value: "104", note: "2007–present" },
      { rank: 2, name: "Michael Schumacher 🇩🇪", value: "68", note: "1991–2012" },
      { rank: 3, name: "Ayrton Senna 🇧🇷", value: "65", note: "1984–1994" },
      { rank: 4, name: "Sebastian Vettel 🇩🇪", value: "57", note: "2007–2022" },
      { rank: 5, name: "Max Verstappen 🇳🇱", value: "42+", note: "2015–present" },
    ]
  },
  {
    icon: "⚡", title: "Most Fastest Laps",
    rows: [
      { rank: 1, name: "Michael Schumacher 🇩🇪", value: "77", note: "1991–2012" },
      { rank: 2, name: "Lewis Hamilton 🇬🇧", value: "67", note: "2007–present" },
      { rank: 3, name: "Kimi Räikkönen 🇫🇮", value: "46", note: "2001–2021" },
      { rank: 4, name: "Alain Prost 🇫🇷", value: "41", note: "1980–1993" },
      { rank: 5, name: "Max Verstappen 🇳🇱", value: "33+", note: "2015–present" },
    ]
  },
  {
    icon: "🏁", title: "Most Race Starts",
    rows: [
      { rank: 1, name: "Fernando Alonso 🇪🇸", value: "400+", note: "2001–present" },
      { rank: 2, name: "Lewis Hamilton 🇬🇧", value: "350+", note: "2007–present" },
      { rank: 3, name: "Kimi Räikkönen 🇫🇮", value: "349", note: "2001–2021" },
      { rank: 4, name: "Rubens Barrichello 🇧🇷", value: "326", note: "1993–2011" },
      { rank: 5, name: "Michael Schumacher 🇩🇪", value: "308", note: "1991–2012" },
    ]
  },
  {
    icon: "🏅", title: "Most Podiums",
    rows: [
      { rank: 1, name: "Lewis Hamilton 🇬🇧", value: "201", note: "2007–present" },
      { rank: 2, name: "Michael Schumacher 🇩🇪", value: "155", note: "1991–2012" },
      { rank: 3, name: "Sebastian Vettel 🇩🇪", value: "122", note: "2007–2022" },
      { rank: 4, name: "Max Verstappen 🇳🇱", value: "112+", note: "2015–present" },
      { rank: 5, name: "Alain Prost 🇫🇷", value: "106", note: "1980–1993" },
    ]
  },
];

export const POINTS_DATA: PointsRow[] = [
  { pos: 1, points: 25 }, { pos: 2, points: 18 }, { pos: 3, points: 15 },
  { pos: 4, points: 12 }, { pos: 5, points: 10 }, { pos: 6, points: 8 },
  { pos: 7, points: 6 },  { pos: 8, points: 4 },  { pos: 9, points: 2 },
  { pos: 10, points: 1 },
];

