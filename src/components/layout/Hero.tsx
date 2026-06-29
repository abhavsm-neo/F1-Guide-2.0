import { RaceCountdown } from './RaceCountdown';

export function Hero() {
  return (
    <header className="hero">
      <h1 className="hero-title">
        FORMULA <span>1</span>
      </h1>
      <p className="hero-sub">The Complete Beginner's Guide · 2018 – 2026</p>
      <RaceCountdown />
    </header>
  );
}
