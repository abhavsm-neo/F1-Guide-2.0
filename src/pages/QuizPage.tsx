import { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { QUIZ_QUESTIONS } from '../data/quiz';

interface AnswerRecord {
  correct: boolean;
  selected: number;
}

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const q = QUIZ_QUESTIONS[current];

  function pick(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === q.answer;
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, { correct, selected: idx }]);
  }

  function next() {
    if (current + 1 >= QUIZ_QUESTIONS.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  }

  const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
  const grade =
    pct >= 90
      ? '🏆 F1 Expert'
      : pct >= 70
      ? '🥈 Solid Fan'
      : pct >= 50
      ? '🥉 Getting There'
      : '📚 Keep Learning';

  if (finished) {
    return (
      <div>
        <div className="section-header">
          <SectionHeader
            title="F1"
            accent="Quiz"
            group="Learn the Basics"
            icon="🧠"
          />
          <BookmarkButton sectionId="quiz" />
        </div>

        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontFamily: 'Orbitron',
              fontSize: 40,
              marginBottom: 12,
            }}
            aria-hidden="true"
          >
            {grade.split(' ')[0]}
          </div>
          <div
            style={{
              fontFamily: 'Orbitron',
              fontSize: 18,
              fontWeight: 900,
              color: '#e10600',
              marginBottom: 8,
            }}
          >
            {grade.split(' ').slice(1).join(' ')}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: 4,
            }}
          >
            {score} / {QUIZ_QUESTIONS.length}
          </div>
          <div
            style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 24 }}
          >
            {pct}% correct
          </div>
          <button
            onClick={restart}
            className="nav-btn active"
            style={{
              padding: '10px 28px',
              fontFamily: 'Orbitron',
              fontSize: 11,
              letterSpacing: 2,
            }}
          >
            TRY AGAIN
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(min(100%,280px),1fr))',
            gap: 10,
          }}
        >
          {QUIZ_QUESTIONS.map((question, i) => (
            <div
              key={i}
              style={{
                background: 'var(--card-bg)',
                border: `1px solid ${
                  answers[i]?.correct
                    ? 'rgba(0,220,120,0.3)'
                    : 'rgba(225,6,0,0.3)'
                }`,
                borderRadius: 4,
                padding: 12,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: answers[i]?.correct ? '#00dc78' : '#e10600',
                  fontFamily: 'Orbitron',
                  letterSpacing: 1,
                  marginBottom: 6,
                }}
              >
                {answers[i]?.correct ? '✓ CORRECT' : '✗ WRONG'}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--text)',
                  marginBottom: 6,
                }}
              >
                {question.q}
              </div>
              {!answers[i]?.correct && (
                <div style={{ fontSize: 11, color: '#00dc78' }}>
                  ✓ {question.options[question.answer]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <SectionHeader
          title="F1"
          accent="Quiz"
          group="Learn the Basics"
          icon="🧠"
        />
        <BookmarkButton sectionId="quiz" />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 12, color: 'var(--text3)' }}>
          Question {current + 1} of {QUIZ_QUESTIONS.length}
        </span>
        <span
          style={{
            fontFamily: 'Orbitron',
            fontSize: 11,
            color: '#e10600',
          }}
        >
          {score} pts
        </span>
      </div>

      <div className="quiz-progress" aria-label="Quiz progress">
        <div
          className="quiz-progress-fill"
          style={{
            width: `${(current / QUIZ_QUESTIONS.length) * 100}%`,
          }}
          aria-hidden="true"
        />
      </div>

      <div className="card" style={{ marginBottom: 20, padding: '24px 20px' }}>
        <div
          style={{
            fontFamily: 'Orbitron',
            fontSize: 9,
            color: '#e10600',
            letterSpacing: 2,
            marginBottom: 12,
          }}
        >
          QUESTION {current + 1}
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--text)',
            lineHeight: 1.5,
            marginBottom: 24,
          }}
        >
          {q.q}
        </div>

        {q.options.map((opt, i) => (
          <button
            key={i}
            disabled={selected !== null}
            onClick={() => pick(i)}
            className={`quiz-option${
              selected !== null
                ? i === q.answer
                  ? ' correct'
                  : i === selected
                  ? ' wrong'
                  : ''
                : ''
            }`}
            aria-label={opt}
          >
            <span
              style={{
                fontFamily: 'Orbitron',
                fontSize: 10,
                minWidth: 20,
                color: 'inherit',
              }}
              aria-hidden="true"
            >
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}

        {selected !== null && (
          <div
            style={{
              marginTop: 16,
              padding: '12px 14px',
              background: 'rgba(225,6,0,0.04)',
              border: '1px solid rgba(225,6,0,0.15)',
              borderRadius: 4,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: '#e10600',
                fontFamily: 'Orbitron',
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              EXPLANATION
            </div>
            <p
              style={{
                fontSize: 12,
                color: 'var(--text2)',
                lineHeight: 1.7,
              }}
            >
              {q.exp}
            </p>
            <button
              onClick={next}
              className="nav-btn active"
              style={{
                marginTop: 12,
                padding: '8px 20px',
                fontFamily: 'Orbitron',
                fontSize: 10,
                letterSpacing: 2,
              }}
            >
              {current + 1 >= QUIZ_QUESTIONS.length
                ? 'SEE RESULTS'
                : 'NEXT →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
