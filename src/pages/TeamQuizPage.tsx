import { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';

interface TeamQuizOption {
  text: string;
  scores: Record<string, number>;
}

interface TeamQuizQuestion {
  q: string;
  options: TeamQuizOption[];
}

interface TeamQuizResult {
  name: string;
  emoji: string;
  color: string;
  desc: string;
}

const TEAM_QUIZ_QUESTIONS: TeamQuizQuestion[] = [
  {
    q: "It's Saturday night before a big event. You're:",
    options: [
      { text: "Asleep by 10pm. Preparation is everything.", scores: { redbull: 2, mercedes: 3, ferrari: 0, mclaren: 1 } },
      { text: "Out at a rooftop bar. Life's too short.", scores: { ferrari: 3, alpine: 2, haas: 1, williams: 1 } },
      { text: "Watching rival footage and taking notes.", scores: { mercedes: 2, mclaren: 3, rb: 2, aston: 1 } },
      { text: "Still working. Sleep is for the off-season.", scores: { redbull: 3, ferrari: 1, audi: 2, cadillac: 1 } },
    ],
  },
  {
    q: "When things go wrong, your instinct is to:",
    options: [
      { text: "Stay calm. Panic costs you more time than the problem.", scores: { mercedes: 3, mclaren: 2, aston: 2, williams: 1 } },
      { text: "Find someone to blame immediately.", scores: { ferrari: 3, redbull: 1, haas: 1, alpine: 1 } },
      { text: "Double down — you'll outwork the problem.", scores: { redbull: 3, rb: 2, cadillac: 2, audi: 1 } },
      { text: "Go back to first principles and innovate.", scores: { mclaren: 3, mercedes: 2, audi: 3, williams: 2 } },
    ],
  },
  {
    q: "Your leadership style is:",
    options: [
      { text: "Brilliant but demanding — excellence or nothing.", scores: { redbull: 3, ferrari: 2, mercedes: 1, mclaren: 1 } },
      { text: "Collaborative. Everyone's voice matters.", scores: { williams: 3, mclaren: 2, aston: 2, rb: 1 } },
      { text: "Charismatic. You lead through personality.", scores: { ferrari: 3, alpine: 2, cadillac: 2, haas: 1 } },
      { text: "Data-driven. Feelings are a distraction.", scores: { mercedes: 3, redbull: 2, rb: 2, audi: 2 } },
    ],
  },
  {
    q: "In competition, you most want to:",
    options: [
      { text: "Win every single thing. Second is the first loser.", scores: { redbull: 3, ferrari: 2, mercedes: 2, mclaren: 1 } },
      { text: "Surprise everyone with an unexpected result.", scores: { williams: 3, haas: 3, rb: 2, cadillac: 2 } },
      { text: "Build something sustainable for the long term.", scores: { mercedes: 3, mclaren: 3, aston: 2, audi: 2 } },
      { text: "Put on a show — the spectacle matters.", scores: { ferrari: 3, alpine: 2, cadillac: 1, williams: 1 } },
    ],
  },
  {
    q: "Your relationship with tradition is:",
    options: [
      { text: "Tradition is everything. History defines you.", scores: { ferrari: 3, williams: 2, mercedes: 1, mclaren: 1 } },
      { text: "Respect it, but you're building your own legacy.", scores: { redbull: 2, mclaren: 3, aston: 2, rb: 2 } },
      { text: "Burn it down. New eras need new thinking.", scores: { audi: 3, cadillac: 3, alpine: 2, haas: 1 } },
      { text: "What tradition? You're only focused on next weekend.", scores: { haas: 3, rb: 2, redbull: 1, cadillac: 1 } },
    ],
  },
  {
    q: "How do you handle the media?",
    options: [
      { text: "Every word is measured and strategic.", scores: { mercedes: 3, mclaren: 2, audi: 2, aston: 1 } },
      { text: "Passionately. You wear your heart on your sleeve.", scores: { ferrari: 3, alpine: 2, haas: 1, williams: 1 } },
      { text: "Directly. You say exactly what you think.", scores: { redbull: 3, rb: 2, haas: 2, cadillac: 2 } },
      { text: "You're building a brand, not just answering questions.", scores: { cadillac: 3, williams: 2, alpine: 2, aston: 2 } },
    ],
  },
  {
    q: "Your preferred car is:",
    options: [
      { text: "A German precision machine. Engineered to perfection.", scores: { mercedes: 3, audi: 3, aston: 1, rb: 1 } },
      { text: "A beautiful Italian masterpiece — even if unreliable.", scores: { ferrari: 3, alpine: 1, mclaren: 1, haas: 1 } },
      { text: "An understated British supercar. No fuss, just fast.", scores: { mclaren: 3, williams: 3, aston: 2, redbull: 1 } },
      { text: "An American muscle car. Loud, proud, here to prove something.", scores: { cadillac: 3, haas: 2, redbull: 1, rb: 1 } },
    ],
  },
  {
    q: "On your day off, you're:",
    options: [
      { text: "At the simulator. You don't really take days off.", scores: { redbull: 3, mercedes: 2, ferrari: 1, rb: 2 } },
      { text: "Hiking, cycling, or doing something active outdoors.", scores: { mclaren: 2, williams: 2, alpine: 3, aston: 2 } },
      { text: "At a glamorous event — seen and noticed.", scores: { ferrari: 3, cadillac: 2, alpine: 1, haas: 1 } },
      { text: "Quietly at home. Fame isn't really your thing.", scores: { audi: 3, rb: 2, williams: 2, haas: 2 } },
    ],
  },
];

const TEAM_QUIZ_RESULTS: Record<string, TeamQuizResult> = {
  redbull: { name: "Oracle Red Bull Racing", emoji: "🔵", color: "#3671C6", desc: "You're a winner. Period. You expect excellence from yourself and everyone around you, you work obsessively hard, and second place makes you physically uncomfortable. You've probably already thought about tomorrow's schedule. Verstappen would approve." },
  mercedes: { name: "Mercedes-AMG Petronas", emoji: "🩵", color: "#27F4D2", desc: "Strategic, disciplined, and always thinking three moves ahead. You built something dominant through engineering genius and systematic thinking. You handle pressure like a professional and never let emotions override logic. Hamilton's kind of person." },
  ferrari: { name: "Scuderia Ferrari", emoji: "🔴", color: "#E8002D", desc: "Passionate, dramatic, and deeply tied to history. You feel everything intensely, you want to put on a show, and you'd rather lose brilliantly than win boringly. The Tifosi would love you — even if you occasionally forget to put the tyres on." },
  mclaren: { name: "McLaren F1 Team", emoji: "🧡", color: "#FF8000", desc: "Methodical, innovative, and quietly building something special. You learn from every mistake, you surround yourself with great people, and your patience eventually pays off. The comeback story. Norris and Piastri's team all the way." },
  astonmartin: { name: "Aston Martin Aramco", emoji: "💚", color: "#229971", desc: "Ambitious and refined. You have huge dreams, the resources to back them up, and a flair for doing things in style. You're playing the long game — and you've got Fernando Alonso on side, which means you're definitely not giving up." },
  alpine: { name: "Alpine F1 Team", emoji: "💙", color: "#0093CC", desc: "Creative, passionate, and a little chaotic — but lovably so. You approach problems differently, you're not afraid to change direction, and you believe deeply in the underdog story. Also: you definitely have strong opinions about cheese." },
  williams: { name: "Williams Racing", emoji: "🩵", color: "#64C4FF", desc: "A genuine soul with a great story to tell. You've been through tough times but you never lost your identity, and you're building back with real purpose. You don't need to shout about it — your results will do the talking." },
  haas: { name: "MoneyGram Haas F1 Team", emoji: "⚪", color: "#B6BABD", desc: "Pragmatic, direct, and quietly competitive. You don't have the biggest budget or the fanciest factory, but you maximise what you've got. You speak your mind, you don't do politics, and you occasionally produce a massive upset result." },
  rb: { name: "Racing Bulls", emoji: "💙", color: "#6692FF", desc: "You're the next generation energy. Young, hungry, and not intimidated by anyone. You love developing talent, you move fast, and you don't mind being overlooked — because you're about to prove everyone wrong." },
  audi: { name: "Audi F1 Team", emoji: "🔴", color: "#BB0A21", desc: "You're here to build something historic from the ground up. You've got the resources, the engineering mindset, and the patience for a long project. The first year might be bumpy, but you're thinking decade-long. German engineering, F1 scale." },
  cadillac: { name: "Cadillac F1 Team", emoji: "🇺🇸", color: "#CC0000", desc: "The American dream. You're bold, you back yourself against the establishment, and you're not afraid to be the newcomer in a room full of history. Everyone said it couldn't be done. You're proving them wrong, one lap at a time." },
};

export default function TeamQuizPage() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string | null>(null);

  function answer(scoreMap: Record<string, number>) {
    const newScores = { ...scores };
    Object.entries(scoreMap).forEach(([team, pts]) => {
      newScores[team] = (newScores[team] || 0) + pts;
    });
    setScores(newScores);
    if (step + 1 >= TEAM_QUIZ_QUESTIONS.length) {
      const winner = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
      setResult(winner);
    } else {
      setStep((s) => s + 1);
    }
  }

  function reset() {
    setStep(0);
    setScores({});
    setResult(null);
  }

  const q = TEAM_QUIZ_QUESTIONS[step];
  const quizResult = result ? TEAM_QUIZ_RESULTS[result] : null;

  return (
    <div className="section-enter">
      <div className="section-header">
        <SectionHeader
          title="Which"
          accent="Team Are You?"
          group="Fun"
          icon="🎯"
          intro="8 personality questions to find out which F1 team matches your style."
        />
        <BookmarkButton sectionId="team-quiz" />
      </div>

      {quizResult ? (
        <div>
          <div
            className="team-quiz-result"
            style={{ borderColor: `${quizResult.color}44` }}
          >
            <div style={{ fontSize: 48, marginBottom: 8 }}>🏎️</div>
            <div
              style={{
                fontSize: 10,
                color: 'var(--text3)',
                fontFamily: 'Orbitron, sans-serif',
                letterSpacing: 3,
                marginBottom: 8,
                textTransform: 'uppercase',
              }}
            >
              You are...
            </div>
            <div
              className="team-result-name"
              style={{
                color: quizResult.color,
                textShadow: `0 0 20px ${quizResult.color}60`,
              }}
            >
              {quizResult.emoji} {quizResult.name}
            </div>
            <p
              style={{
                fontSize: 13,
                color: 'var(--text2)',
                lineHeight: 1.8,
                maxWidth: 480,
                margin: '12px auto 20px',
              }}
            >
              {quizResult.desc}
            </p>
            <button
              className="expand-btn"
              onClick={reset}
              style={{
                padding: '10px 24px',
                fontSize: 11,
                letterSpacing: 2,
                fontFamily: 'Orbitron, sans-serif',
              }}
            >
              🔄 Retake Quiz
            </button>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 600 }}>
          <div style={{ marginBottom: 16 }}>
            <div className="quiz-progress">
              <div
                className="quiz-progress-fill"
                style={{
                  width: `${(step / TEAM_QUIZ_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 10,
                color: 'var(--text4)',
                fontFamily: 'Orbitron, sans-serif',
                letterSpacing: 1,
                marginTop: 6,
              }}
            >
              <span>
                Question {step + 1} / {TEAM_QUIZ_QUESTIONS.length}
              </span>
              <span>
                {Math.round((step / TEAM_QUIZ_QUESTIONS.length) * 100)}% Complete
              </span>
            </div>
          </div>
          <div className="card" style={{ marginBottom: 20 }}>
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--text)',
                lineHeight: 1.5,
              }}
            >
              {q.q}
            </p>
          </div>
          {q.options.map((opt, i) => (
            <button
              key={i}
              className="quiz-option"
              onClick={() => answer(opt.scores)}
              aria-label={`Option ${String.fromCharCode(65 + i)}: ${opt.text}`}
            >
              <span
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: 10,
                  color: '#e10600',
                  minWidth: 20,
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {opt.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
