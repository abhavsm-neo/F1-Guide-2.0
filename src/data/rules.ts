import type { F1Rule } from '../types';

// Auto-extracted from original App.jsx

export const F1_RULES: F1Rule[] = [
  {
    icon: "🏎️", title: "The 107% Rule",
    plain: "In Q1, every driver must set a lap time within 107% of the fastest time. If they don't, they're not allowed to start the race — unless the stewards make an exception (e.g. a mechanical problem prevented a proper lap).",
    example: "Example: If the fastest Q1 lap is 1:30.000, every driver must go faster than 1:36.300. Anyone slower doesn't start Sunday."
  },
  {
    icon: "🔄", title: "The Two-Compound Rule",
    plain: "Every driver must use at least two different tyre compounds during a dry race (e.g. Soft + Medium). If the race starts behind the Safety Car, or there is a red flag, this rule may be waived depending on circumstances.",
    example: "Example: If you start on Mediums, you must pit at some point and switch to either Softs or Hards — you cannot run Mediums all race."
  },
  {
    icon: "🚫", title: "Track Limits",
    plain: "Drivers must keep at least two wheels inside the white lines that define the track. Going all four wheels outside — even if it's faster — results in that lap time being deleted. In races, repeat violations earn time penalties.",
    example: "Example: Verstappen had his fastest lap deleted at Silverstone 2024 for running wide at Turn 9 with all four wheels outside the white lines."
  },
  {
    icon: "⚖️", title: "Parc Fermé Rules",
    plain: "After Q1 begins, teams can only make limited changes to the car until the race ends. No setup changes allowed — only fixing genuine damage or safety issues. This means the car you qualify in is the car you race in.",
    example: "Example: If it's dry in qualifying but wet race day, teams cannot change their suspension setup. They must race with a dry-weather setup in the wet."
  },
  {
    icon: "🔋", title: "Power Unit Allocation",
    plain: "Each driver gets a limited number of power unit components per season. In 2026, drivers get 4 internal combustion engines, 4 MGU-Ks and other components. Exceeding the allocation triggers automatic grid penalties (5 or 10 places back, or a pit lane start).",
    example: "Example: Verstappen used his 5th ICE at Monza 2023, earning an automatic 10-place grid penalty."
  },
  {
    icon: "🏁", title: "Sprint Weekends",
    plain: "Around 6 races per year use a Sprint format. There is no FP2 or FP3 — instead, Sprint Qualifying sets the grid for a mini race (roughly 1/3 of grand prix distance). Sprint results award half-points (8 down to 1) separately from the main race.",
    example: "Example: At the Bahrain Sprint, Verstappen winning earns 8 points. He then qualifies normally on Saturday evening for Sunday's full grand prix."
  },
  {
    icon: "🔵", title: "Blue Flag Rules",
    plain: "When a driver is about to be lapped by a car more than one lap ahead, marshals wave blue flags. The slower driver must let the faster car past within three flag signals. Ignoring blue flags earns a 5-second time penalty.",
    example: "Example: If the race leader is about to lap Bottas, blue flags appear. Bottas must move aside at the next corner or DRS zone."
  },
  {
    icon: "⏱️", title: "Time Penalties",
    plain: "Stewards issue time penalties (5s, 10s) for infringements like unsafe releases, ignoring blue flags, or causing collisions. The time is added to your final race time. A drive-through or stop-go penalty must be served physically in the pits.",
    example: "Example: Hamilton gets a 5-second penalty for forcing a rival off track. If he finishes 3 seconds ahead of the car behind, that car is promoted above him."
  },
  {
    icon: "🌧️", title: "Wet Weather Rules",
    plain: "In wet conditions, only Intermediates or Full Wet tyres can be used (slick tyres are too dangerous). The race director decides when conditions are safe to run slicks again. A Safety Car start may be used if it's too wet to race at full speed.",
    example: "Example: At Spa 2021, the race was started behind the Safety Car due to heavy rain, completed only 2 laps, and counted as a half-points race."
  },
  {
    icon: "🏆", title: "The Concorde Agreement",
    plain: "The commercial contract between F1, the FIA and all teams that governs how prize money is split, how teams vote on rule changes, and the overall structure of the sport. Teams must sign it to compete. Its details are kept confidential.",
    example: "Example: When Andretti tried to enter F1 in 2024, existing teams had influence over the process partly because of commercial rights protections in the Concorde Agreement."
  },
];

