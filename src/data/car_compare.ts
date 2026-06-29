import type { CarCompareRow } from '../types';

// Auto-extracted from original App.jsx

export const CAR_COMPARE: CarCompareRow[] = [
  { aspect: "Power Unit", icon: "⚡", col2025: "1.6L V6 Turbo Hybrid\n~1,000 bhp total\n~80% ICE / ~20% electric", col2026: "1.6L V6 Turbo Hybrid\n~1,200 bhp total\n~50% ICE / ~50% electric", winner: 2026, note: "Massive increase in electrical power — completely changes engine architecture." },
  { aspect: "ERS Output", icon: "🔋", col2025: "MGU-K: 120 kW\nMGU-H: yes\n~160 bhp electric boost", col2026: "MGU-K: 350 kW\nMGU-H: removed\n~470 bhp electric boost", winner: 2026, note: "The MGU-H (complex, expensive) is removed. MGU-K power nearly triples." },
  { aspect: "Aerodynamics", icon: "💨", col2025: "Fixed wings\nDRS opens rear wing\nGround effect floor", col2026: "Active aero — moveable front & rear wings\nNo DRS\nGround effect retained", winner: 2026, note: "DRS is gone. Cars automatically adjust their aerodynamics for straight-line speed." },
  { aspect: "Weight", icon: "⚖️", col2025: "~798 kg minimum\nHeavier due to complex MGU-H", col2026: "~720 kg target\n~80 kg lighter than 2025", winner: 2026, note: "Removing MGU-H and simplifying components brings weight down significantly." },
  { aspect: "Fuel Type", icon: "⛽", col2025: "E10 fuel (10% bio)\n~110 kg per race", col2026: "E20 fuel (20% bio) minimum\nLess fuel needed due to electrification", winner: 2026, note: "More sustainable fuel — part of F1's path to carbon neutrality by 2030." },
  { aspect: "Overtaking", icon: "🏁", col2025: "DRS-dependent on straights\nDirty air still an issue", col2026: "Active aero replaces DRS\nDesigned for closer racing without artificial aids", winner: 2026, note: "Goal is to make overtaking feel more natural and less dependent on DRS highway passes." },
  { aspect: "Cost", icon: "💰", col2025: "PU development frozen\nStabilised costs", col2026: "Brand new PU from scratch\nHuge development costs for new entrants like Audi, Ford/Red Bull", winner: 2025, note: "2026 is extremely expensive for engine manufacturers — a major investment cycle." },
  { aspect: "Tyre Size", icon: "🔴", col2025: "18-inch Pirelli\n(introduced 2022)", col2026: "18-inch Pirelli retained\nSimilar compound range expected", winner: null, note: "No change to tyre specification — continuity across the regulation shift." },
  { aspect: "New Manufacturers", icon: "🏭", col2025: "Mercedes, Ferrari, Renault, Honda, Audi (prep)", col2026: "Mercedes, Ferrari, Audi (works), Ford RBPT, Mercedes (Alpine)\nRenault exit", winner: 2026, note: "Audi enters as a full works constructor. Ford returns to F1. Renault exits as PU supplier." },
  { aspect: "Max Speed", icon: "🚀", col2025: "~360 km/h top speed\nMonza, Baku, Las Vegas", col2026: "Expected ~355–365 km/h\nMore electric torque, less drag with active aero", winner: null, note: "Top speeds likely similar — extra electric power balanced by different aero philosophy." },
];

